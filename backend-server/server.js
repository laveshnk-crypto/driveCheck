const OpenAI = require("openai");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config(); 

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    organization: process.env.OPENAI_ORG_ID,
});

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("Hello from Node.js backend!");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const base64Image = fs.readFileSync(file.path, "base64");

        const prompt = `You are a DriveTest Analyzer bot. Analyze the image and list issues only in this format:
"Issues found:
1.
2.
..."

If the image is not a valid drive test result, respond with: "Wrong image type".`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        });

        const result = response.choices[0].message.content;
        console.log("Analysis from OpenAI:", result);

        return res.status(200).json({
            message: "Image uploaded and processed successfully",
            analysis: result,
        });
    } catch (error) {
        console.error("Error processing image:", error?.response?.data || error.message || error);
        return res.status(500).json({ error: "Failed to process image" });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

