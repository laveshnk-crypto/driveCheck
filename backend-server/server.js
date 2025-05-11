const OpenAI = require("openai");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { log } = require("console");
const { json } = require("stream/consumers");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
    });

    // Multer storage: folder = uploads/<id>
    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const id = req.body?.id || "default";
        const dir = `uploads/${id}`;

        if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    });

    const upload = multer({ storage });

    app.get("/", (req, res) => {
    res.send("Hello from Node.js backend!");
    });

    // Use .any() so we can access both fields and file
    app.post("/upload", upload.any(), async (req, res) => {
    try {
        const id = req.body?.id || "default";
        const file = req.files?.find(f => f.fieldname === "file");

        if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
        }

        const base64Image = fs.readFileSync(file.path, "base64");
        const context = req.body?.context || "";
        
        // construct the prompt that will send the image to OpenAI
        const prompt = `You are a DriveTest Analyzer bot. Analyze the uploaded drive test image and return a JSON object in this format, where only the issues are in this format:

        {
        "status": "success" | "invalid",
        "issues": {
            "IssueTitle": "...",
            "IssueTitle2": "...",
            ...
        },
        "notes": "Any additional notes here"
        }

        If the image is not a valid drive test result, respond with:

        {
        "status": "invalid",
        "message": "Wrong image type"
        }

        Optional context: ${context}`;

        
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

        // image analysis result
        const result = response.choices[0].message.content;
        let jsonParsedResult

        try {
            jsonParsedResult = JSON.parse(result);
        } catch(error) {
            console.error("Error parsing JSON:", error);
            return res.status(500).json({ error: "Failed to parse JSON response" });
        }

        const resultLogPath = `${file.destination}/log.txt`
        const timestamp = new Date().toISOString();
        const logEntry = `\n[${timestamp}]\n${result}\n--------------------\n`;

        fs.appendFileSync(resultLogPath, logEntry);

        console.log(`Analysis from OpenAI for user ${id}:`, result);

        return res.status(200).json({
        message: "Image uploaded and processed successfully",
        analysis: jsonParsedResult,
        savedTo: file.path,
        logPath: resultLogPath,
        });
    } catch (error) {
        console.error("Error processing image:", error?.response?.data || error.message || error);
        return res.status(500).json({ error: "Failed to process image" });
    }
    });

    app.listen(3001, () => {
    console.log("Server is running on port 3001");
    });
