// import React, { useEffect, useState } from 'react';
// import Pusher from 'pusher-js';

// const NameGenPusher = () => {
//   const [name, setName] = useState('');

//   useEffect(() => {
//     // Initialize Pusher
//     const pusher = new Pusher('b3e4cdb43addf0483109', {
//       cluster: 'ap2'
//     });

//     // Subscribe to the channel and event
//     const channel = pusher.subscribe('name-channel');
//     channel.bind('name-generated', function (data) {
//       setName(data.name); // Set the incoming name data to state
//     });

//     // Clean up on component unmount
//     return () => {
//       channel.unbind('name-generated');
//       pusher.unsubscribe('name-channel');
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Real-Time Name Generator</h2>
//       <p>Generated Name: {name}</p>
//     </div>
//   );
// };

// export default NameGenPusher;

import React, { useEffect, useState } from 'react';
import "./namegenpusher.css";

const NameGenPusher = () => {
  const [content, setContent] = useState(''); // State to hold content as HTML
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch content from the Vercel function
    const fetchContent = async () => {
      try {
        const response = await fetch('https://voiceflow-namegenerator.vercel.app/api/pusher-event'); // Update with your actual server URL
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json(); // Fetch response as JSON
        const markdownContent = data.message; // Extract message from JSON
        const htmlContent = convertMarkdownToHTML(markdownContent); // Convert markdown to HTML
        setContent(htmlContent); // Set the converted HTML content to state
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Describe your Business to the Chatbot');
      }
    };

    // Initial fetch
    fetchContent();

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchContent();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to convert markdown to HTML
  const convertMarkdownToHTML = (markdown) => {
    return markdown
      .replace(/### (.*?)\n/g, '<h3>$1</h3>') // Convert markdown headers
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // Convert markdown links
      .replace(/\n/g, '<br>'); // Convert newlines to <br>
  };

  return (
    <div className="vf-container">
      <h2>Generated Name</h2>
      {error && <p style={{ color: 'cyan' }}>{error}</p>}
      {/* Render the dynamic HTML content */}
      <div className="response-box" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default NameGenPusher;



