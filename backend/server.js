import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env file");
    process.exit(1);
}

function buildPayload(sentence) {
    return {
        contents: [{
            parts: [{
                text: `
You are an AI grammar and spelling correction assistant.

Task:
1. Analyze the following sentence.
2. Identify spelling mistakes and grammatical errors.
3. Explain clearly why they are wrong and how to correct them.
4. Finally, provide the corrected version of the sentence.

Sentence: "${sentence}"
                `
            }]
        }],
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
        },
    };
}

app.post('/check-grammar', async (req, res) => {
    try {
        const { sentence } = req.body;

        if (!sentence || typeof sentence !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid sentence' });
        }

        const payload = buildPayload(sentence);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY,
            },
            timeout: 30000,
        });

        let text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(502).json({ error: "No content returned from AI" });
        }
        let cleaned = text.replace(/\*\*/g, "");

        res.json({ analysis: cleaned });

    } catch (error) {
        console.error("🔥 Server error:", error.response?.data || error.message);
        res.status(500).json({
            error: "Internal server error",
            detail: error.response?.data || error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});
