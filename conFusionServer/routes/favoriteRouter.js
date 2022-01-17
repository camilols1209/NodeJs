const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const favoriteRouter = express.Router();

const cors = require('./cors');
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    
    Favorites.findOne({'user':req.user._id})
    .populate('dishes')
    .populate('user')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({'user':req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({
                user:req.user._id,
                dishes:req.body
            })
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }else{
           
            var data=JSON.parse(JSON.stringify(favorites)).dishes;
            var array=req.body
            console.log(array);
            array.forEach(function(dish) {
                if(data.indexOf(dish._id)<0){
                    favorites.dishes.push(dish);
                   } 
              });
           
            favorites.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
       
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
}).delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next)=>{
    Favorites.remove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 

});
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    res.statusCode = 403;
    res.end('GETnoperation not supported on /favorites');
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({'user':req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({
                user:req.user._id,
                dishes:[req.params.dishId]
            })
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }else{
           
            var data=JSON.parse(JSON.stringify(favorites)).dishes;
            var array=[req.params.dishId];
            console.log(array);
            array.forEach(function(dish) {
                if(data.indexOf(dish)<0){
                    favorites.dishes.push(dish);
                   } 
              });
           
            favorites.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
       
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next)=>{
    Favorites.findOne({"user": req.user._id})
    .then((resp) => {
        var data=JSON.parse(JSON.stringify(resp)).dishes;
        if(data.indexOf(req.params.dishId)>=0){
            data.splice(data.indexOf(req.params.dishId),1)
        }
        resp.set({"dishes":data});
        resp.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 

});


module.exports = favoriteRouter;