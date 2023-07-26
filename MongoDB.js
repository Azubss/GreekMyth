const express = require('express');
const mongodb = require('mongodb');

const app = express();
const uri = "mongodb+srv://Azubs:Paulike123@greekmythos.fcf4qzn.mongodb.net/";  // replace with your MongoDB connection string

let db;

mongodb.MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if (err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }
  console.log('Connected...');
  db = client.db("GreekMythos"); // specify the database you are going to use
  app.listen(3000, () => console.log('Server is running on port 3000'));
});

app.get('/god/:name', (req, res) => {
  db.collection('god').findOne({ name: req.params.name }, (err, god) => {
    if (err) throw err;

    // You can send the data as JSON to the client
    res.json(god);
  });
});
