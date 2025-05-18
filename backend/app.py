from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import logging
from dotenv import load_dotenv

# Import ollama conditionally to handle environments where it's not available
try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False
    logging.warning("Ollama package not available, using mock responses")

from critique_agent import CritiqueAgent, check_ollama_available

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Default model to use if not specified
DEFAULT_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

# Check if Ollama is available
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_AVAILABLE = OLLAMA_AVAILABLE and check_ollama_available(OLLAMA_HOST)

# Initialize the critique agent
critique_agent = CritiqueAgent(model_name=DEFAULT_MODEL, ollama_host=OLLAMA_HOST)

logging.info(f"Starting Flask app with default model: {DEFAULT_MODEL}")
logging.info(f"Ollama available: {OLLAMA_AVAILABLE}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running."""
    logging.info("Health check endpoint called")
    try:
        # Try a simple call to Ollama to verify it's actually running
        ollama.list()
        logging.info("Ollama is running properly")
        return jsonify({"status": "healthy", "message": "API is running with Ollama available"})
    except Exception as e:
        logging.warning(f"Ollama not available: {str(e)}")
        # Return healthy status even without Ollama for deployment purposes
        return jsonify({"status": "healthy", "message": "API is running (Ollama not available)"})


@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Endpoint to chat with an Ollama model."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    model = data.get('model', DEFAULT_MODEL)
    messages = data.get('messages', [])
    stream = data.get('stream', False)
    
    if not messages:
        return jsonify({"error": "No messages provided"}), 400
    
    try:
        if stream:
            # For streaming, we need to handle this differently in a real app
            # This is simplified for demonstration
            response = ollama.chat(model=model, messages=messages, stream=True)
            result = ""
            for chunk in response:
                result += chunk['message']['content']
            return jsonify({"content": result})
        else:
            response = ollama.chat(model=model, messages=messages)
            return jsonify({"content": response['message']['content']})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/revise-draft', methods=['POST'])
def revise_draft():
    """Endpoint to check and revise a draft using Ollama."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    model = data.get('model', DEFAULT_MODEL)
    draft = data.get('draft', '')
    instructions = data.get('instructions', 'Check and revise this draft for clarity, coherence, and correctness.')
    
    if not draft:
        return jsonify({"error": "No draft provided"}), 400
    
    try:
        # Construct the message for the LLM
        messages = [
            {
                'role': 'system',
                'content': 'You are a helpful assistant that checks and revises written drafts.'
            },
            {
                'role': 'user',
                'content': f"{instructions}\n\nDRAFT:\n{draft}"
            }
        ]
        
        response = ollama.chat(model=model, messages=messages)
        return jsonify({
            "revised": response['message']['content'],
            "original": draft
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-clinical-note', methods=['POST'])
def analyze_clinical_note():
    """Endpoint to analyze a clinical note and identify missing criteria for health insurance claims."""
    logging.info("Analyze clinical note endpoint called")
    start_time = time.time()
    
    data = request.json
    
    if not data:
        logging.error("No data provided in request")
        return jsonify({"error": "No data provided"}), 400
    
    model = data.get('model', DEFAULT_MODEL)
    clinical_note = data.get('clinical_note', '')
    
    logging.info(f"Using model: {model}")
    logging.info(f"Clinical note length: {len(clinical_note)} characters")
    
    if not clinical_note:
        logging.error("No clinical note provided")
        return jsonify({"error": "No clinical note provided"}), 400
    
    try:
        # Construct the message for the LLM
        logging.info("Constructing prompt for LLM")
        system_prompt = """
        You are an expert health insurance claims adjudicator. Your task is to analyze clinical notes 
        and identify missing criteria that would be required for insurance approval. 
        
        For each missing criterion, provide:
        1. A clear description of what's missing
        2. The importance/confidence level (as a percentage)
        3. A status ("missing", "partial", or "met")
        4. A brief explanation of why this criterion is important
        
        Format your response as a JSON array with the following structure for each item:
        [
          {
            "id": "unique_id",
            "rule": "Brief description of the criterion",
            "description": "Detailed explanation of what's missing",
            "confidence": 85,
            "status": "missing",
            "evidence": null
          },
          ...
        ]
        
        Only include the JSON array in your response, nothing else.
        """
        
        messages = [
            {
                'role': 'system',
                'content': system_prompt
            },
            {
                'role': 'user',
                'content': f"Analyze this clinical note and identify missing criteria for health insurance approval:\n\n{clinical_note}"
            }
        ]
        
        logging.info("Sending request to Ollama")
        response = ollama.chat(model=model, messages=messages)
        logging.info(f"Received response from Ollama after {time.time() - start_time:.2f} seconds")
        
        # Extract the JSON array from the response
        # The response might contain markdown code blocks or other text
        content = response['message']['content']
        logging.info(f"Response content length: {len(content)} characters")
        
        # Try to extract JSON from the response
        import re
        import json
        
        logging.info("Attempting to parse JSON from response")
        # Look for JSON array in the response
        json_match = re.search(r'\[\s*{.*}\s*\]', content, re.DOTALL)
        if json_match:
            logging.info("Found JSON array in response using regex")
            suggestions_json = json_match.group(0)
            suggestions = json.loads(suggestions_json)
            logging.info(f"Successfully parsed JSON with {len(suggestions)} suggestions")
        else:
            # If no JSON array is found, try to parse the entire response as JSON
            logging.info("No JSON array found with regex, trying to parse entire response")
            try:
                suggestions = json.loads(content)
                logging.info(f"Successfully parsed entire response as JSON with {len(suggestions)} suggestions")
            except json.JSONDecodeError as e:
                # If that fails, return an error
                logging.error(f"Failed to parse response as JSON: {str(e)}")
                logging.error(f"Raw response: {content[:500]}...")
                return jsonify({
                    "error": "Failed to parse LLM response as JSON",
                    "raw_response": content
                }), 500
        
        # Log each suggestion
        for i, suggestion in enumerate(suggestions):
            logging.info(f"Suggestion {i+1}: {suggestion['rule']} (Status: {suggestion['status']}, Confidence: {suggestion['confidence']}%)")
        
        total_time = time.time() - start_time
        logging.info(f"Analysis completed in {total_time:.2f} seconds with {len(suggestions)} suggestions")
        
        return jsonify({
            "suggestions": suggestions,
            "clinical_note": clinical_note,
            "processing_time": total_time
        })
    
    except Exception as e:
        logging.error(f"Error in analyze_clinical_note: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/models', methods=['GET'])
def list_models():
    """Endpoint to list available Ollama models."""
    try:
        if OLLAMA_AVAILABLE:
            # This would require a different API call in the actual Ollama API
            # For now, we'll return a simplified response
            return jsonify({"models": [DEFAULT_MODEL]})
        else:
            # Return mock data when Ollama is not available
            return jsonify({
                "models": [DEFAULT_MODEL],
                "note": "Using mock data, Ollama not available in this environment"
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/critique-document', methods=['POST'])
def critique_document():
    """Endpoint to critique a healthcare prior authorization document."""
    data = request.json
    
    if not data:
        logging.error("No data provided to critique-document endpoint")
        return jsonify({"error": "No data provided"}), 400
    
    patient_info = data.get('patient_info', {})
    order_info = data.get('order_info', {})
    draft_letter = data.get('draft_letter', '')
    session_id = data.get('session_id')
    temperature = data.get('temperature', 0.7)
    
    if not draft_letter:
        logging.error("No draft letter provided to critique-document endpoint")
        return jsonify({"error": "No draft letter provided"}), 400
    
    logging.info(f"Critiquing document for patient {patient_info.get('name', 'Unknown')}")
    logging.info(f"Procedure: {order_info.get('description', 'Unknown')}")
    
    try:
        # Check if Ollama is available
        if not check_ollama_available():
            logging.error("Ollama service is unavailable")
            return jsonify({
                "error": "Ollama service is unavailable",
                "fallback_result": {
                    "approval_likelihood": 0.5,
                    "is_approved": False,
                    "reasons": ["Ollama service unavailable - using fallback response"],
                    "feedback": "Unable to analyze document due to service unavailability."
                }
            }), 503
        
        # Call the critique agent
        start_time = time.time()
        result = critique_agent.critique_document(
            patient_info=patient_info,
            order_info=order_info,
            draft_letter=draft_letter,
            session_id=session_id,
            temperature=temperature
        )
        elapsed_time = time.time() - start_time
        
        logging.info(f"Document critique completed in {elapsed_time:.2f} seconds")
        logging.info(f"Approval likelihood: {result['approval_likelihood']*100:.0f}%")
        logging.info(f"Is approved: {result['is_approved']}")
        
        return jsonify({
            "approval_likelihood": result["approval_likelihood"],
            "is_approved": result["is_approved"],
            "reasons": result["reasons"],
            "feedback": result["feedback"],
            "processing_time": elapsed_time
        })
    except ValueError as e:
        logging.error(f"Value error in critique-document: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logging.error(f"Error in critique-document: {str(e)}")
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

@app.route('/api/create-critique-session', methods=['POST'])
def create_critique_session():
    """Create a new critique agent session."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    session_name = data.get('session_name', 'New Critique Session')
    
    try:
        session_id = critique_agent.create_session(session_name)
        logging.info(f"Created new critique session: {session_name} (ID: {session_id})")
        return jsonify({
            "session_id": session_id,
            "session_name": session_name
        })
    except Exception as e:
        logging.error(f"Failed to create critique session: {str(e)}")
        return jsonify({"error": f"Failed to create session: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))  # Cloud Run expects the app to listen on the port defined by PORT env variable
    app.run(host='0.0.0.0', port=port, debug=False)  # Set debug to False for production
