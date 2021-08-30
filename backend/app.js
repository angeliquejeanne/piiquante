const express = require('express'); 
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const authRoutes = require('./routes/auth'); 

const app = express();

const path = require('path');

const helmet = require('helmet');

// require('dotenv').config();

//Connextion à MongoDB
mongoose.connect('mongodb+srv://anggiie:AnggiiE123456@cluster0.ck5fn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Middleware Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
  });

//Configuration des en-têtes HTTP securisée 
app.use(helmet());  

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route image
app.use('/images', express.static(path.join(__dirname, 'images')));

//route utilisateurs
app.use('/api/auth', authRoutes);

//route sauces
app.use('/api/sauces', saucesRoutes);

//permet l'exportation
module.exports = app;