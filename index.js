const express = require("express");
const multer = require("multer");
const fs = require("fs");
const summarizeText = require("./summarize.js");
const pdfParse = require("pdf-parse");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/summarize", (req, res) => {
    const text = req.body.text_to_summarize;

    if (!text) {
        return res.status(400).json({ error: "No text provided for summarization" });
    }

    summarizeText(text)
        .then((response) => res.json({ summary: response }))
        .catch((error) => {
            console.log(error.message);
            res.status(500).json({ error: "Summarization failed" });
        });
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    try {
        let extractedText = "";

        if (fileType === "application/pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
        } else if (fileType === "text/plain") {
            extractedText = fs.readFileSync(filePath, "utf8");
        } else {
            return res.status(400).json({ error: "Unsupported file type. Upload a PDF or TXT file." });
        }

        summarizeText(extractedText)
            .then((summary) => res.json({ summary }))
            .catch((error) => {
                console.log(error.message);
                res.status(500).json({ error: "Summarization failed" });
            });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error processing file" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
