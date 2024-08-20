import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './VfNameGenerator.css'; // Import the CSS file

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

      // for (let i = 0; i < responseData.length; i++) {
      //   if (responseData[i].type === "text") {
      //     // Replace $ with <br /> for line breaks
      //     reply = responseData[i].payload.message.replace(/\$/g, '<br />');
      //     break;
      //   }
      // }

      for (let i = 0; i < responseData.length; i++) {
        if (responseData[i].type === "text") {
            // Replace $ with <br /> for line breaks and # with <br /><br /> for headings
            reply = responseData[i].payload.message
                .replace(/\#/g, '<h3><br />')  // Adds extra space before each heading
                .replace(/\:/g, '</h3>')
                .replace(/\$/g, '<br />');       // Adds line break before each business name
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
    <div className="vf-container">
      <h2>Business Name Generator</h2>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Please describe your business"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {response && (
        <div
          className="response-box"
          dangerouslySetInnerHTML={{ __html: `${response}` }}
        />
      )}
    </div>
  );
};

export default VfNameGenerator;
