'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var cors = require('./cors');

const Favorites = require('../models/favorite');

var favoriteRouter = express.Router();
    favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.statusCode = 200 })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({userId: req.user._id})
            .populate('userId')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => {
                return next(err);
            })
            .catch((err) => { next(err); });
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({userId: req.user._id})
            .then((favorites) => {
                if(favorites != null){
                    console.log(req.body);
                    req.body.forEach(dishId => {
                        console.log(favorites.dishes.indexOf(dishId._id));
                        if (favorites.dishes.indexOf(dishId._id) == -1 ) {
                            console.log('Inserting new dish');
                            favorites.dishes.push(dishId._id);
                        }
                    });
                    favorites.save()
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    }, (err) => { next(err); })
                    .catch((err) => { next(err); });
                }
                else{
                    console.log("savcing new favorite");
                    Favorites.create({userId : req.user._id})
                    .then((favorite) => {
                        req.body.forEach(dishId => {
                            favorite.dishes.push(dishId);                                                        
                        });
                        favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(favorite);
                        }, (err)=>{ next(err); })
                    }, (err)=>{ next(err); })
                    .catch((err) => { next(err); });
                }
            })
    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next)=>{
        var err = new Error('PUT operation not allowed for favourties');
        err.status = 403;
        return next(err);
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({userId: req.user._id})
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err); })
        .catch((err) => { next(err); });
    });

    favoriteRouter.route('/:dishId')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        var err = new Error('GET operation not supported');
        err.status = 403;
        return next(err);
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({userId : req.user._id})
        .then((favorite) =>{
            if(favorite != null){
                console.log('inserting in existing');
                if(favorite.dishes.indexOf(req.params.dishId) == -1){
                    favorite.dishes.push(req.params.dishId);
                }
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => { next(err) })
                    .catch((err) => { next(err) })
            }
            else{
                console.log('creating new');
                Favorites.create({userId : req.user._id})
                .then((favorite) => {
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => { next(err); })
                    .catch((err) => { next(err) });
                }, (err) => { next(err); })
                .catch((err) => { next(err) })
            }
        }, (err) => { next(err); })
        .catch((err) => { next(err); })
    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
        var err = new Error('Put operation not supported');
        err.status = 403;
        return next(err);
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({userId:req.user._id})
        .then((favorite) => {
            if (favorite != null && favorite.dishes.indexOf(req.params.dishId) != -1) {
                favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => { next(err) })
                .catch((err) => { next(err) });
            }else{
                var err =  new Error('selected dish not found in favorites.');
                err.status = 403;
                return next(err);
            }
        }, (err) => { next(err) })
        .catch((err) => { next(err) })
    })

module.exports = favoriteRouter;