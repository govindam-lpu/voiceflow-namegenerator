import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const VfNameGenerator = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');

  // Generate a unique conversation ID once per session
  useEffect(() => {
    setConversationId(uuidv4());
  }, []);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const token = `Bearer ${process.env.REACT_APP_VOICEFLOW_TOKEN}`;
    const headers = {
      "Authorization": token,
      "Content-Type": "application/json",
      "versionID": process.env.REACT_APP_VOICEFLOW_VERSION_ID
    };

    const requestPayload = {
      "action": {
        "type": "text",
        "payload": question
      },
      "config": {
        "tts": false,
        "stripSSML": true,
        "stopAll": true,
        "excludeTypes": ["block", "debug", "flow"]
      }
    };

    try {
      // First API call to initialize the conversation
      await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact`,
        { "action": { "type": "launch" }, "config": { "tts": false, "stripSSML": true, "stopAll": true } },
        { headers: headers }
      );

      // Second API call to get the actual response
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact`,
        requestPayload,
        { headers: headers }
      );

      // Log the entire response to inspect its structure
      console.log('Full Response:', response.data);

      // Parse the response to find the text message
      const responseData = response.data;
      let reply = "Sorry, I didn't understand that.";

      for (let i = 0; i < responseData.length; i++) {
        if (responseData[i].type === "text") {
          reply = responseData[i].payload.message;
          break;
        }
      }

      setResponse(reply);
    } catch (error) {
      console.error('Error interacting with Voiceflow:', error);
      setResponse("There was an error processing your request.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>VF Name Generator</h2>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Enter your question here"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default VfNameGenerator;
