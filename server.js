const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    dest: "uploads/"
});

// Test
app.get("/", (req, res) => {
    res.json({
        message: "AI Teacher Backend is Running 🤖"
    });
});

// Topic API
// ==========================================
// LESSON API
// ==========================================

app.post("/api/lesson", (req, res) => {

    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({
            message: "Topic is required"
        });
    }

    const lesson = [
        {
            title: "Introduction",
            content: `Welcome! Today we are going to learn ${topic}.

This lesson will explain ${topic} step by step in a simple and easy way.

Let's start learning!`
        },

        {
            title: `What is ${topic}?`,
            content: `${topic} is an important topic to understand.

In this lesson, you will learn the basic concepts, important features and simple examples of ${topic}.`
        },

        {
            title: `Basic Concepts of ${topic}`,
            content: `The main concepts of ${topic} include:

• Basic definition
• Important concepts
• Common terminology
• How it works
• Practical usage`
        },

        {
            title: `${topic} Example`,
            content: `Let's understand ${topic} with a simple example.

Example:

Learning ${topic} step by step helps beginners understand the concept easily.

Try to understand each part of the example before moving to the next step.`
        },

        {
            title: `Advantages of ${topic}`,
            content: `${topic} can be useful in many real-world situations.

Important points:

• Easy to understand
• Useful for problem solving
• Helps build programming knowledge
• Can be applied in practical projects`
        },

        {
            title: `Summary`,
            content: `Great job! 🎉

You have completed the basic lesson on ${topic}.

Remember these important points:

• Understand the definition
• Learn the basic concepts
• Practice examples
• Apply the knowledge in projects

Keep learning with LearnBuddy! 🤖`
        }
    ];

    res.json({
        success: true,
        topic: topic,
        lessons: lesson
    });
});

// File Upload API
app.post("/api/upload", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.json({
        success: true,
        message: "Study material uploaded successfully 📚",
        filename: req.file.originalname
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 AI Teacher Backend running on port ${PORT}`);
});
