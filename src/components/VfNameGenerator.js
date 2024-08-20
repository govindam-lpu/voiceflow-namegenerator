import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./VfNameGenerator.css";

const VfNameGenerator = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    setConversationId(uuidv4());
  }, []);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);

    const token = `Bearer ${process.env.REACT_APP_VOICEFLOW_TOKEN}`;
    const headers = {
      Authorization: token,
      "Content-Type": "application/json",
      versionID: process.env.REACT_APP_VOICEFLOW_VERSION_ID,
    };

    const requestPayload = {
      action: {
        type: "text",
        payload: question,
      },
      config: {
        tts: false,
        stripSSML: true,
        stopAll: true,
        excludeTypes: ["block", "debug", "flow"],
      },
    };

    try {
      await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact`,
        {
          action: { type: "launch" },
          config: { tts: false, stripSSML: true, stopAll: true },
        },
        { headers: headers }
      );

      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact`,
        requestPayload,
        { headers: headers }
      );

      console.log("Full Response:", response.data);

      const responseData = response.data;
      let formattedResponse = "";

      for (let i = 0; i < responseData.length; i++) {
        if (responseData[i].type === "text") {
          let message = responseData[i].payload.message;

          const sections = message
            .split("#")
            .filter((section) => section.trim() !== "");

          formattedResponse = sections
            .map((section) => {
              const [heading, ...names] = section
                .split("$")
                .filter((name) => name.trim() !== "");

              const headingHtml = `<h3><br />${heading.trim()}</h3>`;

              const namesHtml = names
                .map((name) => {
                  const trimmedName = name.trim();
                  const encodedName = trimmedName.replace(/\s+/g, "+");
                  const domainLink = `https://www.godaddy.com/en-in/domainsearch/find?domainToCheck=${encodedName}`;
                  return `<br /><a href="${domainLink}" target="_blank">${trimmedName}</a>&nbsp;&nbsp;&nbsp;`;
                })
                .join("");

              return headingHtml + namesHtml;
            })
            .join("<br /><br />");
        }
      }

      setResponse(formattedResponse);
    } catch (error) {
      console.error("Error interacting with Voiceflow:", error);
      setResponse("There was an error processing your request.");
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="vf-container">
      <h2>Business Name Generator</h2>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Please describe your business"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
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
