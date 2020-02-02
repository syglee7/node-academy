var express = require('express');
var router = express.Router();
var { sequelize, Sequelize, Test } = require('../models');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(Test);
  res.render('index', { title: 'Express' });
});

module.exports = router;
