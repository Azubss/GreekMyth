const express = require('express');
const app = express();
const Handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');

// Set up SCSS middleware
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/css'),
    outputStyle: 'compressed',
    prefix: '/css'
  })
);

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



// Routes
// Routes are important AF basically it's how your site lines together in the example here you can see the page 'home'
// is being rendered, you can pass properties like title etc into this.
// so you could hypothetically create every single page from within here or each colour scheme bro.
app.get('/', (req, res) => {
  res.render('home', { title: 'Greek God App' });
});

// Start the server - this will be used for the port so you can go to localhost:3000 or change it to whatever suits you
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
