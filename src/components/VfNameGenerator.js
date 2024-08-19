import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // For generating unique conversation IDs

const VfNameGenerator = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const conversationId = uuidv4(); // Generate a unique conversation ID

    const token = "Bearer VF.DM.66c03a8bb1a982bcb5022b6f.2ObKBP2ViYX7XC7P";
    const headers = {
      "Authorization": token,
      "Content-Type": "application/json",
      "versionID": "66befd2af815a151f6122f49"
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
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact`,
        requestPayload,
        { headers: headers }
      );

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
