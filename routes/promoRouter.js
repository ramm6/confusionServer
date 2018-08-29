const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('We will send all promos to you.!');
})
.post((req, res, next) => {
    res.end('We will send the promo : ' + req.body.name +
        ' with details:' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promos..!');
});


promoRouter.route('/:promoId/')
    .get((req, res, next) => {
        res.end('We will details of promo : ' + req.params.promoId + ' to you.!');
    })
    .post((req, res, next) => {
        res.statusCode = 403; //forbidden
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put((req, res, next) => {
        res.write('Updating the promo : ' + req.params.promoId);
        res.end('Will update the promo : ' + req.body.name + ' with details : ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the promo : ' + req.params.promoId);
    });

module.exports = promoRouter;