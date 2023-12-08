import express from 'express';
import cors from 'cors';
import { config } from 'dotenv'
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

const envir = new config()
//console.log(envir.parsed.VITE_API_KEY);
const API_KEY = envir.parsed.VITE_API_KEY;
const URL = 'https://api.openai.com/v1/chat/completions';

app.listen(PORT, () => console.log("Your Server is running on PORT 8000"));

app.post('/completions', async (req, res) => {

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 500,
        }),
    }
    try {
        const response = await fetch(URL, options)
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.error(error);
    }
})