const express = require("express");
const path = require("path"); 
const app = express();

console.log("APP LOADED SUCCESSFULLY");

// Middleware - reads files directly from your root folder
app.use(express.static(__dirname));
app.use(express.json());

// Events Data
let events = [
    {
        id: "ai-workshop",
        title: "AI Workshop",
        description: "Learn Machine Learning and Generative AI",
        seats: 20
    },
    {
        id: "cloud-computing",
        title: "Cloud Computing",
        description: "Learn AWS, Azure and DevOps",
        seats: 15
    },
    {
        id: "hackathon-2026",
        title: "Hackathon 2026",
        description: "24-Hour Coding Competition",
        seats: 30
    }
];

// Home page handler - FIXED syntax error and references the root index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"), (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Could not load homepage.");
        }
    });
});

// Get all events
app.get("/events", (req, res) => {
    res.json(events);
});

// Register for an event
app.post("/register", (req, res) => {
    const { eventId, name, email } = req.body;

    if (!eventId || !name || !email) {
        return res.status(400).json({
            message: "Please enter your name and email."
        });
    }

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({
            message: "Event not found."
        });
    }

    if (event.seats <= 0) {
        return res.status(400).json({
            message: "Sorry! No seats are available."
        });
    }

    event.seats--;

    console.log("================================");
    console.log("NEW REGISTRATION");
    console.log("Event:", event.title);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Seats remaining:", event.seats);
    console.log("================================");

    res.json({
        success: true,
        message: `Registration successful for ${event.title}!`
    });
});

// Server error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: "Something went wrong on the server."
    });
});

// Port configuration required for Render cloud runtime
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
