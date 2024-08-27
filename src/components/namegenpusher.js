import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const NameGenPusher = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('b3e4cdb43addf0483109', {
      cluster: 'ap2'
    });

    // Subscribe to the channel and event
    const channel = pusher.subscribe('name-channel');
    channel.bind('name-generated', function (data) {
      setName(data.name); // Set the incoming name data to state
    });

    // Clean up on component unmount
    return () => {
      channel.unbind('name-generated');
      pusher.unsubscribe('name-channel');
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Name Generator</h2>
      <p>Generated Name: {name}</p>
    </div>
  );
};

export default NameGenPusher;
