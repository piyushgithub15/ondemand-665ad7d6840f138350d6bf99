
const axios = require('axios');

// Replace these values with your actual API key and external user ID
const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';

// Create Chat Session
async function createChatSession() {
  try {
    const response = await axios.post(
      'https://api.on-demand.io/chat/v1/sessions',
      {
        pluginIds: [],
        externalUserId: EXTERNAL_USER_ID,
      },
      {
        headers: {
          apikey: API_KEY,
        },
      }
    );

    if (response.status === 201) {
      console.log('Chat session created successfully:', response.data);
      return response.data.id; // Extract session ID
    } else {
      throw new Error('Unexpected status code: ' + response.status);
    }
  } catch (error) {
    console.error('Error creating chat session:', error.message);
    throw error;
  }
}

// Submit Query
async function submitQuery(sessionId, query, responseMode = 'sync') {
  try {
    const response = await axios.post(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
      {
        endpointId: 'predefined-openai-gpt4o',
        query: query,
        pluginIds: [
          'plugin-1713962163',
          'plugin-1716837491',
          'plugin-1715895836',
          'plugin-1713924030',
          'plugin-1716429542',
          'plugin-1713967141',
          'plugin-1713961903',
          'plugin-1713958830',
          'plugin-1713954536',
        ],
        responseMode: responseMode,
        reasoningMode: 'medium',
      },
      {
        headers: {
          apikey: API_KEY,
        },
      }
    );

    if (response.status === 200) {
      console.log('Query response:', response.data);
      return response.data;
    } else {
      throw new Error('Unexpected status code: ' + response.status);
    }
  } catch (error) {
    console.error('Error submitting query:', error.message);
    throw error;
  }
}

// Submit Query with Server-Sent Events (SSE)
async function submitQuerySSE(sessionId, query) {
  try {
    const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
    const headers = {
      apikey: API_KEY,
      'Content-Type': 'application/json',
    };
    const body = {
      endpointId: 'predefined-openai-gpt4o',
      query: query,
      pluginIds: [
        'plugin-1713962163',
        'plugin-1716837491',
        'plugin-1715895836',
        'plugin-1713924030',
        'plugin-1716429542',
        'plugin-1713967141',
        'plugin-1713961903',
        'plugin-1713958830',
        'plugin-1713954536',
      ],
      responseMode: 'stream',
      reasoningMode: 'medium',
    };

    const response = await axios.post(url, body, {
      headers,
      responseType: 'stream',
    });

    response.data.on('data', (chunk) => {
      const data = chunk.toString();
      console.log('SSE Data:', data);
    });

    response.data.on('end', () => {
      console.log('SSE stream ended.');
    });

    response.data.on('error', (error) => {
      console.error('SSE stream error:', error.message);
    });
  } catch (error) {
    console.error('Error submitting query with SSE:', error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const sessionId = await createChatSession();
    const query = 'Put your query here';

    // Submit query with default sync response mode
    await submitQuery(sessionId, query);

    // Submit query with SSE response mode
    await submitQuerySSE(sessionId, query);
  } catch (error) {
    console.error('Error in example usage:', error.message);
  }
})();
