﻿const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
    dishRouter.use(bodyParser.json());

    dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
                console.log('Dish created', dish);
            }, (err) => { next(err); })
            .catch((err) => { next(err); });
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported for /dishes');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => { next(err); })
            .catch((err) => { next(err); });
    });


    dishRouter.route('/:dishId')
        .get((req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        })
        .post(authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403; //forbidden
            res.end('POST operation not supported on /dishes/' + req.params.dishId);
        })
        .put(authenticate.verifyUser, (req, res, next) => {
            Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        })
        .delete(authenticate.verifyUser, (req, res, next) => {
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        });



    dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found.');
                    err.status = 404;
                    return next(err);
                }
                
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }, (err) => { next(err); })
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found.');
                    err.status = 404;
                    return next(err);
                }                
                
            }, (err) => { next(err); })
            .catch((err) => { next(err); });
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported for /dishes/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var dishIdx = (dish.comments.length - 1) ; dishIdx >= 0; dishIdx--) {
                        dish.comments.id(dish.comments[dishIdx]._id).remove();                        
                    }
                    dish.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found.');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => { next(err); })
            .catch((err) => { next(err); });
    });


dishRouter.route('/:dishId/comments/:commentId')
        .get((req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null && dish.comments.id(req.params.commentId) != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish.comments.id(req.params.commentId));
                    } else if (dish == null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found.');
                        err.status = 404;
                        return next(err);
                    } else {
                        err = new Error('Comment ' + req.params.commentId + ' not found.');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        })
        .post(authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403; //forbidden
            res.end('POST operation not supported on /dishes/' + req.params.dishId);
        })
        .put(authenticate.verifyUser, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null && dish.comments.id(req.params.commentId) != null) {
                        if (req.body.rating) {
                            dish.comments.id(req.params.commentId).rating = req.body.rating;    
                        }
                        if (req.body.comment) {
                            dish.comments.id(req.params.commentId).comment = req.body.comment;
                        }
                        dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => { next(err); });

                    } else if (dish != null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found.');
                        err.status = 404;
                        return next(err);
                    } else {
                        err = new Error('Comment ' + req.params.commentId + ' not found.');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        })
        .delete((req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null && dish.comments.id(req.params.commentId) != null) {
                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                            .then((dish) => {
                                res.status = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => { next(err);})
                    } else if (dish == null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        res.status= 404;
                        res.setHeader('Content-Type', 'application/json');
                        next(err);
                    } else {
                        err = new Error('Comment ' + req.params.commentId + ' not found.');
                        res.status = 404;
                        res.setHeader('Content-Type', 'application/json');
                        next(err);
                    }
                }, (err) => { next(err); })
                .catch((err) => { next(err); });
        });

module.exports = dishRouter;