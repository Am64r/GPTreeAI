require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = 9000;

// Use CORS middleware before defining routes to ensure it applies to all of them
app.use(cors());

// Support JSON payloads
app.use(express.json());

// Initialize OpenAI API client with your API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

console.log(openai);

// Routes

// Define the POST endpoint
app.post('/generate-text', async (req, res) => {
    const userInput = req.body.text;

    try {
        // Make a call to the OpenAI API using the chat completion method
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Keep the model if using the chat completion endpoint
            messages: [
                { role: "user", content: userInput },
                { role: "user", content: "identify the topic sentence, if you cant find one then make one"},
                { role: "user", content: "give two ideas on how to develop the plot"},
                { role: "user", content: "identify if there any plot holes"},
            ], // Format for chat completion
            // You can add other parameters as needed, similar to the completions endpoint
        });

        // Extract the text from the response
        //const generatedText = gptResponse.data.choices[0].message.content.trim();
        console.log(JSON.stringify(gptResponse));

        const generatedText = gptResponse.choices[0].message.content.trim();

        // Send back the generated text as the response
        res.json({ generatedText });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ message: "Error generating text" });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
