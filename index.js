var express = require('express.io'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	ejs = require('ejs'),
	path = require('path'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	alarms = require('./data/alarms'),
	fs = require('fs'),
    url = require('url');

var routes = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


io.on('connection', function(socket){

	socket.on('add', function(obj){

		alarms.push({
			time: obj.time,
			status: obj.status
		});
		
		alarms.sort(function (a, b) {
		
			if (a.time > b.time)
			  return 1;
			if (a.time < b.time)
			  return -1;
			return 0;
			
		});
		
		var alarmsPath = __dirname + '/data/alarms.json';
		
		fs.writeFile(alarmsPath, JSON.stringify(alarms), function(err) {
			if (err) { throw err };
		});
		
		var tmpl = fs.readFileSync(__dirname + '/views/alarms.ejs', "utf-8");

		var output = ejs.render(tmpl, {alarms:alarms});
		
		io.emit('add', {alarms:alarms, dom:output});
		
	});
  
	socket.on('turnoff', function(index){
	
		if(alarms[index].status) alarms[index].status = false;
		else alarms[index].status = true;
		
		var alarmsPath = __dirname + '/data/alarms.json';
		
		fs.writeFile(alarmsPath, JSON.stringify(alarms), function(err) {
			if (err) { throw err };
		});
		
		io.emit('turnoff', {alarms:alarms, index:index});
		
	});
	
	socket.on('switch', function(index){
	
		if(alarms[index].status) alarms[index].status = false;
		else alarms[index].status = true;
		
		var alarmsPath = __dirname + '/data/alarms.json';
		
		fs.writeFile(alarmsPath, JSON.stringify(alarms), function(err) {
			if (err) { throw err };
		});
		
		io.emit('switch', {alarms:alarms, index:index});
		
	});
	
	socket.on('delete', function(index){
	
		alarms.splice(index, 1);
		
		var alarmsPath = __dirname + '/data/alarms.json';
		
		fs.writeFile(alarmsPath, JSON.stringify(alarms), function(err) {
			if (err) { throw err };
		});
		
		io.emit('delete', {alarms:alarms, index:index});
		
	});
});

http.listen(3000, function(){

	console.log('listening on: 3000');

});