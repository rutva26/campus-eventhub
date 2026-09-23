const express = require("express");
const app = express();

console.log("APP LOADED SUCCESSFULLY");

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Events
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

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Get all events
app.get("/events", (req, res) => {
    res.json(events);
});

// Register for an event
app.post("/register", (req, res) => {

    const { eventId, name, email } = req.body;

    // Check required information
    if (!eventId || !name || !email) {
        return res.status(400).json({
            message: "Please enter your name and email."
        });
    }

    // Find event
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({
            message: "Event not found."
        });
    }

    // Check seats
    if (event.seats <= 0) {
        return res.status(400).json({
            message: "Sorry! No seats are available."
        });
    }

    // Reduce seat count
    event.seats--;

    // Show registration in terminal
    console.log("================================");
    console.log("NEW REGISTRATION");
    console.log("Event:", event.title);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Seats remaining:", event.seats);
    console.log("================================");

    // Send success response
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

module.exports = app;