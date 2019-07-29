var bpm = 120;
var bps = bpm/60;
var speed = (1000/bps) / 4;
var loopRefresh = 1000/speed;
var count = -1;
var loopLength = 16;
var globalCount = 0;
var play = false;
var customLoop = [];

$('.keyframes').each(function(){
	for(var i = 0; i < loopLength; i++){
		$(this).append("<div data-key='key' data-changed='false'></div>");
	}
});

for(var i = 0; i < loopLength; i++){
	$('.step-visualizer').append("<div></div>");
}

function playAudio(n, volume){
	if(n){
		var audio = new Audio('sounds/'+n+'.wav');
		audio.volume = volume;
		audio.play();
	}
}

function loop(){
	if(play){
		setGlobalCountDiv();

		count++;
		globalCount++;

		if(globalCount > loopLength - 1){
			globalCount = 0;
		}

		for(var i = 0; i < customLoop.length; i++){
			playAudio(customLoop[i].loop[customLoop[i].count], customLoop[i].volume);
			if(customLoop[i].count < customLoop[i].loop.length-1){
				customLoop[i].count++;
			}else{
				customLoop[i].count = 0;
			}
		}
	}
}

setInterval(loop, speed);
setGlobalCountDiv();

function setGlobalCountDiv(){
	$('.step-visualizer div').css('background', '#000');
	$('.step-visualizer div').eq(globalCount).css('background', '#632e31');
}

function updateLoop(){
	$('.keyframes').each(function(i){
		var loopArr = [];
		var id = parseInt($(this).attr('data-sample'));

		$(this).children('div').each(function(){
			if($(this).hasClass('on')){
				loopArr.push(id);
			}else{
				loopArr.push(0);
			}
		});

		customLoop[i] = {
			count: globalCount,
			volume: 1,
			loop: loopArr
		}
	});
}

window.onkeydown = function(e){
	if(e.which == 32){
		play = !play;
	}
}

$('.keyframes div').on('click', function(){
	$(this).addClass('on');
	updateLoop();
});

$('.keyframes div').on('contextmenu', function(e){
	$(this).removeClass('on');
	updateLoop();
	e.preventDefault();
});

var isDragging = false;
var dragType = "add";

$('.loop-maker').mousedown(function(e){
	isDragging = true;
	if(e.which==1){
		dragType="add";
	}else if(e.which==3){
		dragType="remove";
	}
});

$('.loop-maker').mouseup(function(){
	isDragging = false;
	$('.keyframes div').attr('data-changed', 'false');
});

$(window).on('contextmenu', function(e){
	e.preventDefault();
});

$('.loop-maker').mousemove(function(e){
	if(isDragging){
		if($(e.target).attr('data-key')=="key" && $(e.target).attr('data-changed')=="false"){
			if(dragType=="add"){
				$(e.target).addClass('on').attr('data-changed', 'true');
			}else if(dragType=="remove"){
				$(e.target).removeClass('on').attr('data-changed', 'true');
			}
			
			updateLoop();
		}
	}
});