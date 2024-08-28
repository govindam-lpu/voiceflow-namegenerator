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
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch data from the Vercel function
    const fetchName = async () => {
      try {
        const response = await fetch('https://voiceflow-namegenerator.vercel.app/api/pusher-event');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setName(data.message);
      } catch (error) {
        console.error('Error fetching name:', error);
        setError('Failed to fetch data');
      }
    };

    // Initial fetch
    fetchName();

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchName();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Generated Name</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{name ? `Name: ${name}` : 'No name generated yet'}</p>
    </div>
  );
};

export default NameGenPusher;
