
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from the public folder
app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// EVENTS
// ==========================================

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


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// ==========================================
// GET EVENTS
// ==========================================

app.get("/events", (req, res) => {

    res.json(events);

});


// ==========================================
// GET GIT COMMIT ID
// ==========================================

app.get("/commit", (req, res) => {

    const commitId =
        process.env.RENDER_GIT_COMMIT ||
        process.env.RENDER_GIT_COMMIT_SHA ||
        "Local Development";

    res.json({
        commitId: commitId
    });

});


// ==========================================
// REGISTER FOR EVENT
// ==========================================

app.post("/register", (req, res) => {

    const {
        eventId,
        name,
        email,
        phone,
        college,
        year
    } = req.body;


    // Check required fields
    if (!eventId || !name || !email) {

        return res.status(400).json({
            message: "Please fill all required fields."
        });

    }


    // Find event
    const event = events.find(
        item => item.id === eventId
    );


    if (!event) {

        return res.status(404).json({
            message: "Event not found."
        });

    }


    // Check seats
    if (event.seats <= 0) {

        return res.status(400).json({
            message: "Sorry, no seats are available."
        });

    }


    // Reduce seat count
    event.seats--;


    // Generate registration ID
    const registrationId =
        "EVT-2026-" +
        String(Math.floor(Math.random() * 900) + 100);


    // Send registration response
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
