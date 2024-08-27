import Pusher from 'pusher';

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: '1855883',
  key: 'b3e4cdb43addf0483109',
  secret: '9718af475ee62f9e2668',
  cluster: 'ap2',
  useTLS: true
});

export default function handler(req, res) {
    try {
      if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
      }
  
      const { message } = req.body;
  
      if (!message) {
        console.log('No message provided in request body:', req.body);
        return res.status(400).json({ message: 'Bad request, no message provided' });
      }
  
      pusher.trigger('my-channel', 'my-event', { message: message })
        .then(() => {
          res.status(200).json({ message: 'Event triggered successfully' });
        })
        .catch((error) => {
          console.error('Error triggering Pusher event:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        });
  
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }