const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/twilio/inbound', async (req, res) => {
  try {
    console.log('Incoming call from:', req.body.From);

    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/twilio/register-call',
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent_id: process.env.AGENT_ID,
          from_number: req.body.From,
          to_number: req.body.To
        })
      }
    );

    const data = await response.json();
    console.log('ElevenLabs response:', data);

    res.type('text/xml');
    res.send(data.twiml);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error connecting to agent');
  }
});

app.get('/', (req, res) => {
  res.send('Green City AI Receptionist Server Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
