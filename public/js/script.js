$(document).ready(function() {
	
	mainInterval = setInterval(function () {
		init();
	}, 200);
	
	$('#turnOff').click(function() {
				
		socket.emit('turnoff', alarmInd);
		
	});

	$('.btn-menu').click(function() {
	
		$('.alarm-form').slideToggle(300, function() {
			if($(this).is(':visible')) $('#alarms').height($('#alarms').height() - $(this).outerHeight());
			else $('#alarms').height($('#alarms').height() + $(this).outerHeight());
		});
		
	});
	
	$('#addForm').on('submit', function(e) {
		e.preventDefault();
		
		var form = e.target;
		var _temp = new RegExp(/\d\d\:\d\d$/);
		
		if(!_temp.test(form.time.value)){
			document.forms.addForm.reset();
			alert('Please, input time in a right way! Use such template: hh:mm!');
			return;
		}
		else {
			var _h = parseInt(form.time.value.slice(0,2));
			var _m = parseInt(form.time.value.slice(3,5));
			var _f = true
			if(_h > 23) {
				_h = 23;
				form.time.value = _h + ':' + _m;
			}
			if(_m > 59)  {
				_m = 59;
				form.time.value = _h + ':' + _m;
			}
		}
		
		function exist(element, index, array) {
			return (element.time == form.time.value);
		}
		
		if (!alarmList.some(exist)) {
			var condition = (form.time.value == new Date().toTimeString().substring(0,5));		
			socket.emit('add', { time: form.time.value,	status: !condition });
		}
		else {
			alert('This alarm already exists!');
		}
		
    });

	$('#alarms').on('click', '.btn-switch', function() {
	
		var curInd = $(this).parent().index();
		socket.emit('switch', curInd);
		
	});
	
	$('#alarms').on('click', '.btn-time', function() {
		
		if(confirm('Do You realy want to delete this alarm?')) {
			var curInd = $(this).parent().index();
			socket.emit('del', curInd);
		}
		
	});
	  
});