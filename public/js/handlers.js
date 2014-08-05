$(document).ready(function() {

	/**
	 * Correctly set time for browsers,
	 * which are not support input[type="time"].
	 * @param {DOM.element} form that contains input[type="time"].
	 * @return {string} valid time.
	*/
	function setValidTime(form) {
	
		var _temp = new RegExp(/\d\d\:\d\d$/);
		
		if(!_temp.test(form.time.value)){
			form.reset();
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
		
		return form.time.value;
		
	}
	
	/**
	 * Slide down form where user can set time for new alarm,
	 * toggleClass for alarm list.
	*/
	$btnMenu.click(function() {
	
		$addAlarmForm.slideToggle(300, function() {
			$alarmsList.toggleClass('short');
		});
		
	});
	
	/**
	 * Handler for btnTurnOff.
	 * @return send to server index of current alarm.
	*/
	$btnTurnOff.click(function() {
				
		socket.emit('turnoff', alarmInd);
		
	});
	
	/**
	 * Handler for form submit event.
	 * @return send to server object, that contains
	 * fields time and status for new alarm.
	*/
	$addAlarmForm.on('submit', function(e) {
		e.preventDefault();
		
		var form = e.target;
		
		form.time.value = setValidTime(form);
		
		function exist(element, index, array) {
			return (element.time == form.time.value);
		}
		
		if (!alarmsData.some(exist)) {
			var condition = (form.time.value == new Date().toTimeString().substring(0,5));
			socket.emit('add', { time: form.time.value,	status: !condition });
		}
		else {
			alert('This alarm already exists!');
		}
		
    });
	
	/**
	 * Live handler for buttons which switch on/off alarms that are already exist.
	 * @return send to server index of current alarm.
	*/
	$alarmsList.on('click', '.btn-switch', function() {
	
		var curInd = $(this).parent().index();
		socket.emit('switch', curInd);
		
	});
	
	
	/**
	 * Live handler for button which delete current alarm.
	 * @return send to server index of current alarm.
	*/
	$alarmsList.on('click', '.btn-delete', function() {
		
		if(confirm('Do You realy want to delete this alarm?')) {
			var curInd = $(this).parent().index();
			socket.emit('delete', curInd);
		}
		
	});
	
});