// import Pusher from 'pusher';

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_CLUSTER,
//   useTLS: true,
// });

// export default async function handler(req, res) {
//   try {
//     if (req.method !== 'POST') {
//       console.log('Invalid method:', req.method);
//       return res.status(405).json({ message: 'Method not allowed' });
//     }

//     // Use the built-in Vercel parsing method to manually parse JSON
//     let body;
//     try {
//       body = JSON.parse(req.body);
//     } catch (error) {
//       console.error('Error parsing JSON:', error, 'Received body:', req.body);
//       return res.status(400).json({ message: 'Invalid JSON format' });
//     }

//     const { message } = body;

//     if (!message) {
//       console.log('No message provided in request body:', body);
//       return res.status(400).json({ message: 'Bad request, no message provided' });
//     }

//     try {
//       await pusher.trigger('my-channel', 'my-event', { message: message });
//       res.status(200).json({ message: 'Event triggered successfully' });
//     } catch (error) {
//       console.error('Error triggering Pusher event:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }

//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// This variable will temporarily store the data
let latestMessage = '';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Handle incoming data from Make.com or Postman
      let body;
      try {
        // Vercel functions use req.body directly if sent as JSON
        body = req.body;
        
        // Check if body is already an object; otherwise parse it
        if (typeof body === 'string') {
          body = JSON.parse(body);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error, 'Received body:', req.body);
        return res.status(400).json({ message: 'Invalid JSON format' });
      }

      const { message } = body;

      if (!message) {
        console.log('No message provided in request body:', body);
        return res.status(400).json({ message: 'Bad request, no message provided' });
      }

      // Store the latest message (if using memory storage)
      latestMessage = message;

      return res.status(200).json({ message: 'Data received successfully' });

    } else if (req.method === 'GET') {
      // Serve the stored data to React app
      if (!latestMessage) {
        return res.status(404).json({ message: 'No data available' });
      }

      return res.status(200).json({ message: latestMessage });
    } else {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
