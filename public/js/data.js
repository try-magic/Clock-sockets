var alarmList,
	alarmInd,
	currentAlarm,
	mainInterval;

function init() {
	document.querySelector('.clock').innerHTML = new Date().toTimeString().substring(0,8);
	currentAlarm = alarmList.filter(function(el, ind, arr) {
		if (el.time === new Date().toTimeString().substring(0,5) && el.status === true) {
			alarmInd = ind;
		}
	   return (el.time === new Date().toTimeString().substring(0,5) && el.status === true);
	});
	if(!currentAlarm.length) return;
	console.log(alarmInd);
	clearInterval(mainInterval);
	$('#audio')[0].play();
	$('.overlay, .modal').fadeIn(300);
}
function loadData() {
	$.ajax({
		url: '/data',
		type: 'get',
		complete: function(res, status) {
			if(status === 'success') {
				alarmList = res.responseJSON;
			} else {
				console.log(status);
			}
		}
	});
}

loadData();