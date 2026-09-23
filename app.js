const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: folder name is exactly "public"
app.use(express.static(path.join(__dirname, "public")));

const events = [
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
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get events
app.get("/events", (req, res) => {
    res.json(events);
});

// Register
app.post("/register", (req, res) => {

    const {
        eventId,
        name,
        email,
        phone,
        college,
        year
    } = req.body;

    if (!eventId || !name || !email) {
        return res.status(400).json({
            message: "Please fill all required fields."
        });
    }

    const event = events.find(item => item.id === eventId);

    if (!event) {
        return res.status(404).json({
            message: "Event not found."
        });
    }

    if (event.seats <= 0) {
        return res.status(400).json({
            message: "Sorry, no seats are available."
        });
    }

    event.seats--;

    const registrationId =
        "EVT-2026-" +
        String(Math.floor(Math.random() * 900) + 100);

    res.json({
        success: true,
        event: event.title,
        name: name,
        email: email,
        phone: phone,
        college: college,
        year: year,
        registrationId: registrationId,
        seatsLeft: event.seats
    });
});

module.exports = app;
