const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('We will send all leaders to you.!');
})
.post((req, res, next) => {
    res.end('We will send the leader: ' + req.body.name +
        ' with details:' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders..!');
});


leaderRouter.route('/:leaderId/')
    .get((req, res, next) => {
        res.end('We will details of leader : ' + req.params.leaderId + ' to you.!');
    })
    .post((req, res, next) => {
        res.statusCode = 403; //forbidden
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write('Updating the leader : ' + req.params.leaderId);
        res.end('Will update the leader : ' + req.body.name + ' with details : ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the leader : ' + req.params.leaderId);
    });

module.exports = leaderRouter;