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
  const { message } = req.body;

  // Trigger an event on the 'my-channel' channel
  pusher.trigger('my-channel', 'my-event', {
    message: message
  });

  res.status(200).send('Event triggered');
}