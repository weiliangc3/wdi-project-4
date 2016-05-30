var express = require('express');
var router  = express.Router();

var usersController = require('../controllers/usersController');
var matchesController = require('../controllers/matchesController');
var tournamentsController = require('../controllers/tournamentsController');
var authenticationsController = require('../controllers/authenticationsController');

router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);


router.route('/users')
.get(usersController.usersIndex);

router.route('/users/:id')
.get(usersController.usersShow)
.patch(usersController.usersUpdate)
.delete(usersController.usersDelete);

router.route('/matches')
.get(matchesController.matchesIndex);

router.route('/matches/:id')
.get(matchesController.matchesShow)
.patch(matchesController.matchesUpdate)
.delete(matchesController.matchesDelete);

router.route('/tournaments')
.get(tournamentsController.tournamentsIndex);

router.route('/tournaments/:id')
.get(tournamentsController.tournamentsShow)
.patch(tournamentsController.tournamentsUpdate)
.delete(tournamentsController.tournamentsDelete);


module.exports = router;
