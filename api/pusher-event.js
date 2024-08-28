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
import fs from 'fs';
import path from 'path';

// Path to the JSON file
const filePath = path.resolve('.', 'latestMessage.json');

// Helper function to read the latest message from the file
const readLatestMessage = () => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data).message;
    }
  } catch (error) {
    console.error('Error reading the latest message:', error);
  }
  return '';
};

// Helper function to write the latest message to the file
const writeLatestMessage = (message) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify({ message }), 'utf8');
  } catch (error) {
    console.error('Error writing the latest message:', error);
  }
};

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      let body;
      try {
        body = req.body;
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

      // Write the latest message to the file
      writeLatestMessage(message);

      return res.status(200).json({ message: 'Data received successfully' });

    } else if (req.method === 'GET') {
      // Read the latest message from the file
      const latestMessage = readLatestMessage();

      if (!latestMessage) {
        console.log('No data available for GET request');
        return res.status(404).json({ message: 'No data available' });
      }

      console.log('Serving data for GET request:', latestMessage);
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
