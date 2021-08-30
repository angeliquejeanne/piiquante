const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

//Un seul utilisateur par adresse mail 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);   
