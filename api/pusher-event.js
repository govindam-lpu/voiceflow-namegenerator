import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Manually parse the JSON body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(400).json({ message: 'Invalid JSON format' });
    }

    const { message } = body;

    if (!message) {
      console.log('No message provided in request body:', body);
      return res.status(400).json({ message: 'Bad request, no message provided' });
    }

    try {
      await pusher.trigger('my-channel', 'my-event', { message: message });
      res.status(200).json({ message: 'Event triggered successfully' });
    } catch (error) {
      console.error('Error triggering Pusher event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
