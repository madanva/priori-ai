# Priori AI Backend

This is the Flask backend for the Priori AI application. It provides API endpoints for analyzing clinical notes, critiquing documents, and more.

## Deployment Instructions

### Prerequisites
- Python 3.11+
- Ollama (for local development)

### Local Development
1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python app.py
   ```

### Production Deployment
This backend is configured for deployment to platforms like Render, Heroku, or Railway.

#### Environment Variables
- `PORT`: The port on which the server will run (default: 5001)
- `OLLAMA_MODEL`: The default Ollama model to use (default: llama3.2)

#### Deployment Notes
- The application uses gunicorn as the WSGI server in production
- Debug mode is disabled in production
- CORS is enabled for all routes

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/chat`: Chat with an Ollama model
- `POST /api/revise-draft`: Revise a text draft
- `POST /api/analyze-clinical-note`: Analyze a clinical note for insurance criteria
- `GET /api/models`: List available Ollama models
- `POST /api/critique`: Critique a healthcare prior authorization document
- `POST /api/critique-session`: Create a new critique agent session
