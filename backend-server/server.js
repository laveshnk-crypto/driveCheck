const fs = require('fs');
// const OpenAI = require('openai');
// const openai = new OpenAI();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

app.get('/',(req, res) => {
    res.send('Hello from Node.js backend!');
})

app.post('/upload', (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: "No image provided" });
        }

        const base64Image = fs.readFileSync(image, "base64");
        return res.status(200).json({ message: "Image in base64 is:" +  base64Image });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Failed to process image" });
        return;
    }
})

app.listen(3001, () => {    
    console.log('Server is running on port 3001');
})

    // const [analysis, setAnalysis] = useState<string | null>(null); 

    // const sendToOpenAI = async () => {
    //     if (!image) return;
    
    //     try {
    //         const base64Image = fs.readFileSync(image, "base64");
    
    //         const prompt = `You are a DriveTest Analyzer bot. Analyze the image and list issues only in this format:
    // "Issues found:
    // 1.
    // 2.
    // ..."
    
    // If the image is not a valid drive test result, respond with: "Wrong image type".`;
    
    //         const response = await openai.chat.completions.create({
    //             model: "gpt-4-vision-preview", // Required for image analysis
    //             messages: [
    //                 {
    //                     role: "user",
    //                     content: [
    //                         { type: "text", text: prompt },
    //                         {
    //                             type: "image_url",
    //                             image_url: {
    //                                 url: `data:image/jpeg;base64,${base64Image}`,
    //                             },
    //                         },
    //                     ],
    //                 },
    //             ],
    //             max_tokens: 500,
    //         });
    
    //         console.log(response.choices[0].message.content);
    //     } catch (error) {
    //         console.error("Error sending image to OpenAI:", error);
    //     }
    // };