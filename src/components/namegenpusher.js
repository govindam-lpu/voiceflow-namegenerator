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

const NameGenPusher = () => {
  const [htmlContent, setHtmlContent] = useState(''); // State to hold HTML content
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch HTML content from the Vercel function
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch('https://voiceflow-namegenerator.vercel.app/api/pusher-event'); // Update with your actual server URL
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.text(); // Fetching response as text to handle HTML
        setHtmlContent(data); // Set the fetched HTML content to state
      } catch (error) {
        console.error('Error fetching HTML content:', error);
        setError('Failed to fetch data');
      }
    };

    // Initial fetch
    fetchHtmlContent();

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchHtmlContent();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Generated Name</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Render the dynamic HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default NameGenPusher;

