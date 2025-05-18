// Types for Ollama API responses
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  content: string;
}

export interface RevisionResponse {
  revised: string;
  original: string;
}

export interface Suggestion {
  id: string;
  rule: string;
  description: string;
  confidence: number;
  status: 'missing' | 'partial' | 'met';
  evidence: string | null;
}

export interface AnalysisResponse {
  suggestions: Suggestion[];
  clinical_note: string;
}

export interface OllamaError {
  error: string;
}

import config from './config';

const API_BASE_URL = config.apiBaseUrl;

/**
 * Send a chat message to the Ollama API
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = 'llama3.2'
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send chat message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Revise a draft using the Ollama API
 */
export async function reviseDraft(
  draft: string,
  instructions: string = 'Check and revise this draft for clarity, coherence, and correctness.',
  model: string = 'llama3.2'
): Promise<RevisionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/revise-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        draft,
        instructions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to revise draft');
    }

    return await response.json();
  } catch (error) {
    console.error('Error revising draft:', error);
    throw error;
  }
}

/**
 * Analyze a clinical note to identify missing criteria for health insurance claims
 */
export async function analyzeClinicalNote(
  clinicalNote: string,
  model: string = 'llama3.2'
): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-clinical-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        clinical_note: clinicalNote,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze clinical note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing clinical note:', error);
    throw error;
  }
}

/**
 * Get available Ollama models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get available models');
    }

    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error getting available models:', error);
    throw error;
  }
}

/**
 * Check if the Ollama API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Error checking API health:', error);
    return false;
  }
}
