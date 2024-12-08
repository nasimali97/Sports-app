// Use express module
var express = require('express');
var app = express();

// Use body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For handling JSON data

// Use MongoDB
var { MongoClient, ObjectId } = require('mongodb');

// Use dotenv to load environment variables
require('dotenv').config();

// MongoDB credentials from .env
const user = process.env.MONGO_USERID;
const pw = process.env.MONGO_PW;
const dbName = "sportsApp"; // Replace with your database name
const collectionName = "competitions"; // Replace with your collection name

// MongoDB connection URL
const url = `mongodb+srv://${user}:${pw}@cluster0.7w5cy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Function to connect to MongoDB
async function connectToDb() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName).collection(collectionName);
}

// Create routes

// Get all competitions
app.get("/api/competitions", async (req, res) => {
  try {
    const collection = await connectToDb();
    const competitions = await collection.find().toArray(); // Retrieve all competitions
    res.json(competitions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching competitions");
  }
});

// Get a specific competition by ID
app.get("/api/competitions/:id", async (req, res) => {
  try {
    const collection = await connectToDb();
    const competition = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (competition) {
      res.json(competition);
    } else {
      res.status(404).send("Competition not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching competition");
  }
});

// Add a new competition
app.post("/api/competitions", async (req, res) => {
  try {
    const collection = await connectToDb();
    const newCompetition = req.body;

    const result = await collection.insertOne(newCompetition); // Insert into MongoDB
    res.send(`Competition added with ID: ${result.insertedId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding competition");
  }
});

// Modify an existing competition
app.put("/api/competitions/:id", async (req, res) => {
  try {
    const collection = await connectToDb();
    const competitionId = req.params.id;
    const updatedData = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(competitionId) },
      { $set: updatedData }
    );

    if (result.matchedCount > 0) {
      res.send("Competition updated");
    } else {
      res.status(404).send("Competition not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating competition");
  }
});

// Remove a competition
app.delete("/api/competitions/:id", async (req, res) => {
  try {
    const collection = await connectToDb();
    const competitionId = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(competitionId) });

    if (result.deletedCount > 0) {
      res.send("Competition removed");
    } else {
      res.status(404).send("Competition not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error removing competition");
  }
});

// Error path (for undefined routes)
app.get("*", function(req, res) {
  res.send("Error! No such path.");
});

// Start the web server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("App is listening on port %d", PORT);
});
