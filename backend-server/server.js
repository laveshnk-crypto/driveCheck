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

const logoOptions = [
    "carLogo",
    "carWithInformationLogo",
    "laneRoadLogo",
    "leftArrowLogo",
    "rightArrowLogo",
    "riskWithMagnifyLogo",
    "signalLogo",
    "starLogo"
];

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
        const prompt = `
        You are a DriveTest Analyzer and advisor bot. Analyze the uploaded drive test image and return a JSON object in this format:

        {
        "issues": {
            "Issue title": "Short explanation or advice. No colons",
            "Issue title": "...",
            ...
        },
        "notes": "Any general observations, if relevant."
        }

        ✅ ONLY include issues that are *explicitly marked* on the test sheet.  
        🚫 DO NOT include unmarked or blank areas.  
        ✅ Provide clear, beginner-friendly advice for each issue.  
        ✅ Return no more than 4 issues, even if more are present.  
        🚫 Do NOT speculate or fill in gaps if the data is missing.

        Use simple phrasing a driving student would understand.
        `;

        
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

        // logo call



        const resultLogPath = `${file.destination}/log.txt`
        const timestamp = new Date().toISOString();
        const logEntry = `\n[${timestamp}]\n${result}\n--------------------\n`;

        fs.appendFileSync(resultLogPath, logEntry);
        fs.appendFileSync(resultLogPath,"You are a conversational drivetest bot! Respond with a friendly tone and not more than 100 words ")

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

    app.post("/chat", async (req, res) => {
        try {

            const message = req.body?.message;
            const id = req.body?.id || "default";

            console.log("Full body:", req.body);
            console.log("Message ", message)
            console.log("id ", id)

            // append to log
            const logPath = `uploads/${id}/log.txt`;
            const timestamp = new Date().toISOString();
            const logEntry = `\n[${timestamp}]\nUser: ${message}\n--------------------\n`;
            fs.appendFileSync(logPath, logEntry);
            

            // retrieve log contents (TODO make this more efficient, use memory techniques for LLMs context to save tokens)
            const logContents = fs.readFileSync(logPath, "utf-8");

            const response = await openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                {
                    role: "user",
                    content: `${logContents}\nUser: ${message}`
                }
                ],
                max_tokens: 80,
            });

            const result = response.choices[0].message.content;

            console.log("AI response:", result);

            // append to log
            const logEntryResponse = `\n[${timestamp}]\nAI: ${result}\n--------------------\n`;
            fs.appendFileSync(logPath, logEntryResponse);

            console.log(`Chat response for user ${id}:`, result);

            return res.status(200).json({
                message: "Chat processed successfully",
                response: result,
            })
        } catch (error) {
            console.error("Error processing chat: ", error?.response?.data || error.message || error);
            return res.status(500).json({ error: "Failed to process chat" });
        }
    })

    app.listen(3001, () => {
    console.log("Server is running on port 3001");
    });
