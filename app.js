const express = require('express');
const app = express();
const Handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const { FALSE } = require('sass');
require('dotenv').config();
const uri = "mongodb+srv://Azubs:Paulike123@GreekMythos.fcf4qzn.mongodb.net/GreekMythos?retryWrites=true&w=majority"; 
const Schema = mongoose.Schema;
const router = express.Router({caseSensitive: false});


const godSchema = new Schema({
  name: String,
  description: String,
  place_on_olympus: String,
  Upbringing: String,
  primaryColour: String,

})



// Set up SCSS middleware
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/css'),
    outputStyle: 'compressed',
    prefix: '/css'
  })
);

app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.set('Content-Type', 'application/javascript');
  }
  next();
});

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars
const hbs = Handlebars.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('mongodbconnected'))
.catch(err => console.log(err));
const God = mongoose.model('gods', godSchema);




app.get('/', (req, res) => {
  res.render('home', { title: 'Greek God App' });
});
app.get('/family', (req, res) => {
  res.render('family', { title: 'Greek God App' });
});
app.get('/family-tree', (req, res) => {
  res.render('familytree', { title: 'family Tree' });
});


app.get('/:name', async (req, res) => {
  try {
    const god = await God.findOne({ name: req.params.name });

    if (!god) {
      res.status(404).send('God not found');
      return;
    } else {
      res.render('god', { name: god.name, upbringing: god.Upbringing , olympus: god.place_on_olympus , description: god.description, bodyClass: god.primaryColour});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
    return;
  }
});

app.use(express.static('public'))















//Start the server - this will be used for the port so you can go to localhost:3000 or change it to whatever suits you
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
