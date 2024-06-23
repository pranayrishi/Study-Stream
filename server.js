const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const OPENAI_API_KEY = 'sk-proj-s42CZ0ozYQXBDCs7meT2T3BlbkFJF34uw775UdfyTQuqXshM';

app.post('/generate-schedule', async (req, res) => {
    const assignments = req.body.assignments;

    const prompt = `Create an efficient study schedule with breaks for the following assignments: ${JSON.stringify(assignments)}.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 1500,
            n: 1,
            stop: null,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const schedule = response.data.choices[0].text.trim();
        res.json({ schedule });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating schedule');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

