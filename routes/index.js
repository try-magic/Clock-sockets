var express = require('express'),
	router = express.Router(),
	alarms = require('../data/alarms'),
	fs = require('fs'),
    url = require('url');
	
router.get('/', function(req, res) {
	var tm = new Date().toTimeString().substring(0,8);
	res.render('index', { time: tm, alarms: alarms });
});

router.get('/data', function(req, res) {
	res.send(alarms);
});

module.exports = router;