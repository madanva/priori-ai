"""
Self-contained Critique Agent Module
This module provides a standalone implementation of the critique/screening agent 
for evaluating healthcare authorization documents.
"""

import os
import time
import requests
import json
import uuid
import re
from typing import Dict, Any, List, Optional, Tuple

class CritiqueAgent:
    """
    A critique agent for evaluating healthcare prior authorization documents
    using LLM models via Ollama.
    """
    
    def __init__(
        self, 
        ollama_host: str = "http://localhost:11434", 
        model_name: str = "llama3.2",
        timeout: int = 30,
        guidelines_retriever = None
    ):
        """
        Initialize the critique agent.
        
        Args:
            ollama_host: URL for the Ollama API
            model_name: Name of the model to use (e.g., "llama3.2")
            timeout: Timeout in seconds for API calls
            guidelines_retriever: Optional function to retrieve relevant guidelines
        """
        self.ollama_host = ollama_host
        self.model_name = model_name
        self.timeout = timeout
        self.sessions = {}
        
        # If no retriever provided, use the dummy one
        self.guidelines_retriever = guidelines_retriever or self._dummy_retriever
    
    def _dummy_retriever(
        self, 
        patient_info: Dict[str, Any], 
        order_info: Dict[str, Any], 
        procedure_description: str
    ) -> str:
        """
        Dummy guidelines retriever that returns generic guidelines.
        Replace with your own implementation for production use.
        
        Args:
            patient_info: Dictionary containing patient information
            order_info: Dictionary containing order information
            procedure_description: Description of the procedure
            
        Returns:
            String containing relevant guidelines
        """
        return f"""
        Guidelines for {procedure_description}:
        
        1. Medical necessity must be clearly documented
        2. Conservative treatments must be tried before advanced imaging
        3. Detailed symptom description including duration and severity is required
        4. Documentation of physical examination findings is essential
        5. Previous treatment failures must be specifically documented
        6. Relevant diagnostic test results should be included
        """
    
    def create_session(self, session_name: str = None) -> str:
        """
        Create a new session for the critique agent.
        
        Args:
            session_name: Optional name for the session
            
        Returns:
            Session ID
        """
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "name": session_name or f"critique-session-{session_id}",
            "history": []
        }
        return session_id
    
    def _extract_info_from_prompt(self, prompt: str) -> Tuple[Dict[str, Any], Dict[str, Any], str]:
        """
        Extract patient information, order information, and procedure description
        from the prompt.
        
        Args:
            prompt: The input prompt containing the information
            
        Returns:
            Tuple containing (patient_info, order_info, procedure_description)
        """
        patient_info = {}
        order_info = {}
        procedure_description = ""
        
        # Extract patient information
        patient_section = prompt.split("Patient Information:")[-1].split("Requested Procedure:")[0] \
            if "Patient Information:" in prompt else ""
        if patient_section:
            lines = patient_section.strip().split("\n")
            for line in lines:
                if ":" in line:
                    key, value = line.split(":", 1)
                    patient_info[key.strip().lower()] = value.strip()
        
        # Extract order information
        order_section = prompt.split("Requested Procedure:")[-1].split("Prior Authorization Letter:")[0] \
            if "Requested Procedure:" in prompt else ""
        if order_section:
            lines = order_section.strip().split("\n")
            for line in lines:
                if ":" in line:
                    key, value = line.split(":", 1)
                    order_info[key.strip().lower()] = value.strip()
                    if "description" in key.lower():
                        procedure_description = value.strip()
        
        return patient_info, order_info, procedure_description
    
    def _call_ollama_api(
        self, 
        messages: List[Dict[str, str]],
        temperature: float = 0.7, 
        max_tokens: int = 500
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Call the Ollama API.
        
        Args:
            messages: List of message dictionaries to send to the API
            temperature: Temperature parameter for generation
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            Tuple containing (response_data, error_message)
        """
        try:
            start_time = time.time()
            
            response = requests.post(
                f"{self.ollama_host}/api/chat",
                json={
                    "model": self.model_name,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                },
                timeout=self.timeout
            )
            
            elapsed = time.time() - start_time
            
            if response.status_code != 200:
                return None, f"Error from Ollama: {response.text}"
                
            return response.json(), None
            
        except requests.exceptions.Timeout:
            elapsed = time.time() - start_time
            error_msg = f"Ollama request timed out after {elapsed:.2f} seconds"
            return None, error_msg
            
        except Exception as e:
            return None, f"Error communicating with Ollama: {str(e)}"
    
    def critique_document(
        self, 
        patient_info: Dict[str, str],
        order_info: Dict[str, str],
        draft_letter: str,
        session_id: str = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Critique a healthcare prior authorization document.
        
        Args:
            patient_info: Dictionary of patient information
            order_info: Dictionary of order information
            draft_letter: The draft letter to critique
            session_id: Optional session ID to use (creates new one if None)
            temperature: Temperature parameter for generation
            
        Returns:
            Dictionary containing:
            - approval_likelihood: Float between 0 and 1
            - reasons: List of reasons for approval/denial
            - feedback: Full feedback text
            - is_approved: Boolean indicating if document is likely to be approved
        """
        if session_id is None:
            session_id = self.create_session()
        elif session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")
        
        # Create prompt with patient info and order info combined
        procedure_description = order_info.get("description", "")
        
        # Get relevant guidelines
        relevant_guidelines = self.guidelines_retriever(
            patient_info,
            order_info,
            procedure_description
        )
        
        # Create prompt
        prompt = f"""
Patient Information:
"""
        for key, value in patient_info.items():
            prompt += f"{key}: {value}\n"
        
        prompt += f"""
Requested Procedure:
"""
        for key, value in order_info.items():
            prompt += f"{key}: {value}\n"
        
        prompt += f"""
Prior Authorization Letter:
{draft_letter}

As an insurance company reviewer, please:
1. Evaluate if this prior authorization request meets criteria for approval
2. List specific reasons why this might be approved or denied
3. Provide detailed feedback on what needs to be improved
4. Estimate the likelihood of approval on a scale of 0-100%
"""
        
        # Add system prompt with relevant guidelines
        system_prompt = f"""You are an AI assistant that simulates an insurance company's prior authorization screening process.
Your task is to:
1. Evaluate prior authorization requests against clinical guidelines and insurance policies
2. Determine if the submitted documentation meets the criteria for approval
3. Provide specific feedback on why a request might be denied
4. Suggest specific improvements to the documentation to increase approval chances
5. Estimate the likelihood of approval based on the quality of the documentation

IMPORTANT GUIDELINES TO APPLY:
{relevant_guidelines}"""
        
        # Prepare messages for Ollama
        ollama_messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        # Call Ollama API
        response_data, error = self._call_ollama_api(
            ollama_messages,
            temperature=temperature
        )
        
        # Handle errors with a fallback response
        if error:
            print(f"Error during critique: {error}")
            return {
                "approval_likelihood": 0.65,
                "is_approved": False,
                "reasons": [
                    "Insufficient documentation of medical necessity",
                    "Limited details about previous treatments and their outcomes",
                    "Missing specific clinical findings that align with insurance criteria"
                ],
                "feedback": f"""
Evaluation of authorization request:

The provided authorization letter has a moderate chance of approval but could be improved.

Reasons affecting approval:
1. Insufficient documentation of medical necessity
2. Limited details about previous treatments and their outcomes
3. Missing specific clinical findings that align with insurance criteria

Additional recommendations:
- Clearly document duration and severity of symptoms
- Include detailed physical examination findings
- Reference specific insurance guidelines

Estimated approval likelihood: 65%

(Note: This is a fallback response due to an error: {error})
"""
            }
        
        # Process the response
        response_text = response_data["message"]["content"]
        
        # Store in session history
        self.sessions[session_id]["history"].append({
            "input": prompt,
            "output": response_text
        })
        
        # Parse the response to extract structured data
        return self._parse_critique_response(response_text)
    
    def _parse_critique_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse the critique response to extract structured data.
        
        Args:
            response_text: The raw response text from the LLM
            
        Returns:
            Dictionary containing:
            - approval_likelihood: Float between 0 and 1
            - reasons: List of reasons for approval/denial
            - feedback: Full feedback text
            - is_approved: Boolean indicating if document is likely to be approved
        """
        # Check for approval language
        approval_regex = r"approved|approval|pass|sufficient|adequate"
        denial_regex = r"denied|insufficient|reject|lack|missing|needs more"
        
        is_approved = bool(re.search(approval_regex, response_text, re.I)) and not \
                     bool(re.search(denial_regex, response_text, re.I))
        
        # Extract confidence percentage
        confidence_match = re.search(r"(\d+)%", response_text)
        confidence = 0.5  # Default
        if confidence_match:
            try:
                confidence = int(confidence_match.group(1)) / 100
            except ValueError:
                pass
        
        # Extract reasons
        reasons = self._extract_bullet_points(response_text)
        
        return {
            "approval_likelihood": confidence,
            "is_approved": is_approved,
            "reasons": reasons,
            "feedback": response_text
        }
    
    def _extract_bullet_points(self, text: str) -> List[str]:
        """
        Extract bullet points from text.
        
        Args:
            text: Text containing bullet points
            
        Returns:
            List of bullet points
        """
        points = []
        current_point = ""
        
        # Match bullet points or numbered items
        bullet_regex = r"^\s*[\-\*\•]\s+"
        numbered_regex = r"^\s*\d+[\.\)]\s+"
        
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
                
            if re.match(bullet_regex, line) or re.match(numbered_regex, line):
                # If we've been collecting a point, add it
                if current_point:
                    points.append(current_point)
                
                # Start a new point (remove the bullet)
                current_point = re.sub(bullet_regex, "", line)
                current_point = re.sub(numbered_regex, "", current_point)
            elif current_point:
                # Continue the current point
                current_point += " " + line
        
        # Add the last point if there is one
        if current_point:
            points.append(current_point)
            
        # If no bullet points were found, try extracting sentences
        if not points:
            sentences = re.findall(r'[^.!?]+[.!?]+', text)
            points = [s.strip() for s in sentences if len(s.strip()) > 10][:3]
        
        return points

# Utility function to check if Ollama is available
def check_ollama_available(host: str = "http://localhost:11434", timeout: int = 5) -> bool:
    """
    Check if Ollama is available at the given host.
    
    Args:
        host: Ollama host URL
        timeout: Request timeout in seconds
        
    Returns:
        True if Ollama is available, False otherwise
    """
    try:
        response = requests.get(f"{host}/api/tags", timeout=timeout)
        return response.status_code == 200
    except:
        return False

# Example usage
if __name__ == "__main__":
    # Example of how to use this module
    if check_ollama_available():
        critique_agent = CritiqueAgent()
        
        sample_patient = {
            "name": "John Smith",
            "dob": "01/15/1975",
            "mrn": "12345",
            "insurance": "BlueCross"
        }
        
        sample_order = {
            "description": "MRI Lumbar Spine",
            "cptCode": "72148",
            "icd10Code": "M54.5"
        }
        
        sample_letter = """
        [Medical Center Letterhead]
        
        RE: Prior Authorization for MRI Lumbar Spine
        Patient: John Smith
        DOB: 01/15/1975
        
        To Whom It May Concern:
        
        I am requesting prior authorization for an MRI of the lumbar spine (CPT 72148) for Mr. Smith who 
        has been experiencing severe lower back pain for 8 weeks with radiation down the left leg. 
        He has completed 6 weeks of physical therapy and NSAIDs with minimal improvement.
        
        Thank you for your consideration.
        
        Sincerely,
        Dr. Jones
        """
        
        result = critique_agent.critique_document(sample_patient, sample_order, sample_letter)
        
        print("Approval Likelihood:", f"{result['approval_likelihood']*100:.0f}%")
        print("Is Approved:", "Yes" if result["is_approved"] else "No")
        print("\nReasons:")
        for reason in result["reasons"]:
            print(f"- {reason}")
        
        print("\nFull Feedback:")
        print(result["feedback"])
    else:
        print("Ollama is not available. Please start the Ollama service.")
