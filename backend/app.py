from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import logging
import json
import uuid
from dotenv import load_dotenv

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

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Default model for mock responses
DEFAULT_MODEL = "mock-model"

# Simple mock implementation for the critique agent
class MockCritiqueAgent:
    def __init__(self, **kwargs):
        self.sessions = {}
        logging.info("Initialized MockCritiqueAgent for Render deployment")
    
    def create_session(self):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {"history": []}
        return session_id
        
    def critique_document(self, patient_info, order_info, draft_letter, session_id=None, **kwargs):
        if session_id is None:
            session_id = self.create_session()
            
        return {
            "approval_likelihood": 0.85,
            "is_approved": True,
            "reasons": [
                "Clear documentation of medical necessity",
                "Appropriate clinical justification",
                "Meets insurance criteria"
            ],
            "feedback": "The authorization letter is well-written and provides sufficient clinical justification."
        }

# Initialize the mock critique agent
critique_agent = MockCritiqueAgent()

logging.info("Starting Flask app with mock responses for Render deployment")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running."""
    logging.info("Health check endpoint called")
    return jsonify({
        "status": "healthy", 
        "message": "API is running with mock responses for Render deployment"
    })

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Endpoint to chat with a model (mock implementation for Render)."""
    data = request.json
    
    try:
        prompt = data.get('prompt', '')
        system_prompt = data.get('system_prompt', '')
        
        # Return mock response
        return jsonify({
            "message": {
                "role": "assistant",
                "content": "This is a mock response from the API. The real AI functionality requires Ollama, which is not available in this deployment environment."
            },
            "model": DEFAULT_MODEL
        })
    except Exception as e:
        logging.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/revise-draft', methods=['POST'])
def revise_draft():
    """Endpoint to check and revise a draft (mock implementation for Render)."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    draft = data.get('draft', '')
    instructions = data.get('instructions', 'Improve this draft')
    
    if not draft:
        return jsonify({"error": "No draft provided"}), 400
    
    try:
        # Return mock improved draft
        improved_draft = draft + "\n\n[This is a mock improved version of your draft. The real AI functionality requires Ollama, which is not available in this deployment environment.]"
        
        return jsonify({
            "revised": improved_draft,
            "original": draft
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-clinical-note', methods=['POST'])
def analyze_clinical_note():
    """Endpoint to analyze a clinical note (mock implementation for Render)."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    clinical_note = data.get('clinical_note', '')
    
    if not clinical_note:
        return jsonify({"error": "No clinical note provided"}), 400
    
    try:
        # Return mock criteria
        mock_criteria = [
            {
                "id": "crit1",
                "rule": "Document medical necessity",
                "description": "Clinical note should include clear documentation of medical necessity for the requested procedure",
                "confidence": 90,
                "status": "missing",
                "evidence": None
            },
            {
                "id": "crit2",
                "rule": "Previous treatments",
                "description": "Document previous treatments that have been tried and failed",
                "confidence": 85,
                "status": "partial",
                "evidence": "Some treatments mentioned but details are incomplete"
            },
            {
                "id": "crit3",
                "rule": "Specialist consultation",
                "description": "Include documentation of specialist consultation",
                "confidence": 75,
                "status": "missing",
                "evidence": None
            }
        ]
        
        return jsonify({
            "criteria": mock_criteria,
            "processing_time": 0.5,
            "note": "This is a mock response for Render deployment. The real AI functionality requires Ollama."
        })
    except Exception as e:
        logging.error(f"Error in mock analyze_clinical_note: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/models', methods=['GET'])
def list_models():
    """Endpoint to list available models (mock implementation for Render)."""
    try:
        return jsonify({
            "models": [DEFAULT_MODEL],
            "note": "Using mock data for Render deployment"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/critique-document', methods=['POST'])
def critique_document():
    """Endpoint to critique a healthcare prior authorization document (mock implementation for Render)."""
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    patient_info = data.get('patient_info', {})
    order_info = data.get('order_info', {})
    draft_letter = data.get('draft_letter', '')
    session_id = data.get('session_id', None)
    
    if not draft_letter:
        return jsonify({"error": "No draft letter provided"}), 400
    
    try:
        # Use the mock critique agent
        result = critique_agent.critique_document(
            patient_info=patient_info,
            order_info=order_info,
            draft_letter=draft_letter,
            session_id=session_id
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/create-critique-session', methods=['POST'])
def create_critique_session():
    """Create a new critique agent session."""
    try:
        session_id = critique_agent.create_session()
        return jsonify({"session_id": session_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))  # Cloud Run expects the app to listen on the port defined by PORT env variable
    app.run(host='0.0.0.0', port=port, debug=False)  # Set debug to False for production
