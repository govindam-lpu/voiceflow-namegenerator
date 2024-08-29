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
import { URLSearchParams } from 'url';

// Temporary in-memory storage
let latestMessage = '';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://thenameexperts.com/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      let body;
      try {
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
          // Parse x-www-form-urlencoded data
          body = Object.fromEntries(new URLSearchParams(req.body));
        } else {
          // Fallback to JSON parsing
          body = req.body;
          if (typeof body === 'string') {
            body = JSON.parse(body);
          }
        }
      } catch (error) {
        console.error('Error parsing request:', error, 'Received body:', req.body);
        return res.status(400).json({ message: 'Invalid request format' });
      }

      const { message } = body;

      if (!message) {
        console.log('No message provided in request body:', body);
        return res.status(400).json({ message: 'Bad request, no message provided' });
      }

      // Store the latest message in memory
      latestMessage = message;

      return res.status(200).json({ message: 'Data received successfully' });

    } else if (req.method === 'GET') {
      // Serve the latest message and then clear it
      if (!latestMessage) {
        console.log('No data available for GET request');
        return res.status(404).json({ message: 'No data available' });
      }

      console.log('Serving data for GET request:', latestMessage);
      const responseMessage = latestMessage;
      latestMessage = ''; // Clear the memory after serving the data

      return res.status(200).json({ message: responseMessage });
    } else {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
