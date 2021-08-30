const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');

//création shema de validation de mot de passe
const passwordSchema = new passwordValidator(); 

const User = require('../models/User');

//ajout des propiétés 
passwordSchema
.is().min(8) //longueur min 8
.is().max(30) // longueur max 30
.has().uppercase() // presence de majuscule
.has().lowercase() // presence de minuscule
.has().digits(2) // 2 chiffres min
.has().not().spaces() // Pas d'espaces

exports.signUp = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email: req.body.email,
            password: hash
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error})); 
    } else {
      throw 'Votre mot de passe doit avoir 8 caractère minimum et contenir au moins 1 majuscule, 1 minuscule et 2 chiffres'
    }
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };