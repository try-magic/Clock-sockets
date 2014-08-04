
var socket = io();

socket.on('add', function(obj){

	alarmList = obj.alarms;
	document.forms.addForm.reset();
	$('#alarms').html(obj.dom);
	
});

socket.on('turnoff', function(obj){

	alarmList = obj.alarms;
	$('.btn-switch').eq(obj.index).toggleClass('on', 'off');
	$('#audio')[0].pause();
	$('#audio')[0].curentTime = 0;
	
	mainInterval = setInterval(function() {
		init();
	},200);
	$('.overlay, .modal').fadeOut(300);

});

socket.on('switch', function(obj){

	alarmList = obj.alarms;
	$('.btn-switch').eq(obj.index).toggleClass('on', 'off');
	
});

socket.on('del', function(obj){

	alarmList = obj.alarms;
	$('.btn-time').parent().eq(obj.index).remove();
	
});