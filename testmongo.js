const { MongoClient } = require("mongodb");

// 🚨 CRUCIAL: Replace <db_password> with your actual password below! 🚨
const uri = "mongodb+srv://bibekpathak_db_user:cmps4150@bibekcmps4150.tsd4ij7.mongodb.net/?appName=bibekcmps4150";

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});

// Default route:
app.get('/', function(req, res) {
  res.send('Starting... ');
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});

// --- ROUTE 1: Single Parameter (Hardcoded 'partID') ---
// To test this: Add /api/mongo/12345 to your URL
app.get('/api/mongo/:item', function(req, res) {
  const client = new MongoClient(uri);
  console.log("Looking for: { partID: '" + req.params.item + "' }");

  async function run() {
    try {
      const database = client.db('ckmdb');
      const parts = database.collection('cmps415');

      const query = { partID: req.params.item };
      const part = await parts.findOne(query);
      
      console.log(part);
      res.send('Found this: ' + JSON.stringify(part)); 
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

// --- ROUTE 2: Two Parameters (Dynamic Key and Value) ---
// To test this: Add /api/search/partID/12345 to your URL
app.get('/api/search/:key/:value', function(req, res) {
  const client = new MongoClient(uri);
  console.log("Looking for dynamic pair: { " + req.params.key + ": '" + req.params.value + "' }");

  async function run() {
    try {
      const database = client.db('ckmdb');
      const parts = database.collection('cmps415');

      // Dynamically constructs the query from the URL variables
      const query = { [req.params.key]: req.params.value };
      const part = await parts.findOne(query);
      
      console.log(part);
      res.send('Found this dynamic result: ' + JSON.stringify(part)); 
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});