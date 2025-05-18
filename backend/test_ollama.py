import ollama
import sys

def test_ollama_connection():
    """Test if Ollama is accessible and running."""
    try:
        print("Testing Ollama connection...")
        # Simple ping to check if Ollama server is running
        response = ollama.chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': 'Hello, are you working? Please respond with a very short message.',
            },
        ])
        
        print("\n✅ Ollama is running and responding!")
        print(f"\nResponse from Ollama:\n{response['message']['content']}\n")
        print(f"Model used: {response.get('model', 'unknown')}")
        return True
    except Exception as e:
        print(f"\n❌ Error connecting to Ollama: {str(e)}")
        print("\nPossible issues:")
        print("1. Ollama may not be installed or running")
        print("2. The model 'llama3.2' may not be pulled yet")
        print("3. There might be a network or permission issue")
        print("\nTroubleshooting steps:")
        print("1. Install Ollama: https://ollama.com/download")
        print("2. Start Ollama service")
        print("3. Pull the model: ollama pull llama3.2")
        return False

if __name__ == "__main__":
    success = test_ollama_connection()
    sys.exit(0 if success else 1)
