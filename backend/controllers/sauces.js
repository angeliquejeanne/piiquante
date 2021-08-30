//importation des modeles de sauces
const Sauce = require('../models/Sauce');

const fs = require('fs');

//Créer une nouvelle sauce 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({message:'Sauce crée !'}))
        .catch(error => res.status(400).json({ error }));
}

//modifier sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({error}));
}

//supprimer sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOneAndDelete({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message:'Sauce supprimée !'}))
                    //.catch(error.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}))
}

//liste des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
}

//Une seul sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}))
}

//like or dislike 
exports.likeSauce = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    //like
    if(like === 1) {
        Sauce.updateOne({_id: sauceId},{
            $inc: {likes: +1},
            $push: {usersLiked: userId}
        })
        .then(() => res.status(200).json({message:'J\'aime cette sauce'}))
        .catch(error => res.status(400).json({error}))
    //dislike    
    } else if(like === -1) {
        Sauce.updateOne({_id: sauceId},{
            $inc: {dislikes: +1},
            $push: {userDisliked: userId}
        })
        .then(() => res.status(200).json({message:'Je n\'aime cette sauce'}))
        .catch(error => res.status(400).json({error}))
    //Cancel vote   
    } else if(like === 0) {
        Sauce.findOne({_id: sauceId}) 
            .then((sauce) => {
                //Cancel Like
                if(sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({_id: sauceId}, {
                        $inc: {likes: -1},
                        $push: {usersLiked: userId}
                    })
                    .then(() => res.status(200).json({message:'Like annulé !'}))
                    .catch(error => res.status(400).json({error}))
                }
                //Cancel Dislike
                if(sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({_id: sauceId}, {
                        $inc: {dislikes: -1},
                        $push: {usersDisliked: userId}
                    })
                    .then(() => res.status(200).json({message:'Dislike annulé !'}))
                    .catch(error => res.status(400).json({error}))
                }
            })
            .catch(error => res.status(400).json({error}))
    }
}


