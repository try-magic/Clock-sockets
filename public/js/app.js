
/** 
 * Global variables.
 * @alarmsData {Array} - list of existed alarms,
 * @alarmInd {Number} - alarm index,
 * @alarmInd {Array} - array with one element, that contains current alarm,
 * @mainInterval {Function} - main interval, that run function init(), every 200ms.
*/
var alarmsData,
	alarmInd,
	currentAlarm,
	mainInterval;

/** 
 * Init socket.io.
*/
var socket = io();
	
/** 
 * Get all DOM, which is  used in app!
 * $btnMenu - button that shows form for adding new alarm.
 * $addAlarmForm - form, where sets new alarm time.
 * $alarmsList - ul that contains all alarms.
 * $audio - HTML 5 tag that contains audio track for alarm.
 * $btnTurnOff - button that turn off current alarm.
 * $overlay - overlay for popup.
 * $popup - popup container.
 * $clock - container for clock.
*/
var $btnMenu = $(document.querySelector('.btn-menu')),
	$addAlarmForm = $(document.querySelector('#addAlarmForm')),
	$alarmsList = $(document.querySelector('#alarms')),
	$audio = document.querySelector('audio'),
	$btnTurnOff = $(document.querySelector('#turnOff')),
	$overlay = $(document.querySelector('.overlay')),
	$popup = $(document.querySelector('.modal'));
	$clock = $(document.querySelector('.clock'));

/** 
 * Function, that init clock and watching for alarms.
*/
function init() {

	$clock.html( new Date().toTimeString().substring(0,8) );
	currentAlarm = alarmsData.filter( function(el, ind, arr) {
		if ( el.time === new Date().toTimeString().substring(0,5) && el.status === true ) {
			alarmInd = ind;
		}
	   return ( el.time === new Date().toTimeString().substring(0,5) && el.status === true );
	});
	if(!currentAlarm.length) return;
	clearInterval(mainInterval);
	$audio.play();
	$overlay.fadeIn(300);
	$popup.fadeIn(300);
	
}

/**
 * Socket that recive inial data from server and then start app.
 * @param {Array} - Keep array of existed alarms.
*/
socket.on('connection', function(arr){

	alarmsData = arr;
	mainInterval = setInterval(function () {
		init();
	}, 200);
	
});


/**
 * Socket for adding new alarm.
 * @param {Object} Object keep data from server,
 * obj.alarms {Array} - Array of existed alarms,
 * obj.dom {DOM.elements} - DOM from alarms.ejs template.
*/
socket.on('add', function(obj){

	alarmsData = obj.alarms;
	document.forms.addAlarmForm.reset();
	$alarmsList.html(obj.dom);
	
});

/**
 * Socket for turning off current alarm.
 * @param {Object} Object keep data from server,
 * obj.alarms {Array} - Array of existed alarms,
 * obj.index {Number}- index of current alarm.
*/
socket.on('turnoff', function(obj){

	alarmsData = obj.alarms;
	$('.btn-switch').eq(obj.index).toggleClass('on');
	$audio.pause();
	$audio.currentTime = 0;
	
	mainInterval = setInterval(function() {
		init();
	},200);
	
	$popup.fadeOut(300);
	$overlay.fadeOut(300);

});

/**
 * Socket for switching current alarm.
 * @param {Object} Object keep data from server,
 * obj.alarms {Array} - Array of existed alarms,
 * obj.index {Number}- index of current alarm.
*/
socket.on('switch', function(obj){

	alarmsData = obj.alarms;
	$('.btn-switch').eq(obj.index).toggleClass('on');
	
});

/**
 * Socket for deleting current alarm.
 * @param {Object} Object keep data from server,
 * obj.alarms {Array} - Array of existed alarms,
 * obj.index {Number}- index of current alarm.
*/
socket.on('delete', function(obj){

	alarmsData = obj.alarms;
	$('.btn-delete').parent().eq(obj.index).remove();
	
});

