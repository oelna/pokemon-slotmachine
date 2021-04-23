'use strict';

var limit = 8;
var running = false;
var runtime = 1500;

var budget = localStorage.getItem('slot_budget') || 5000;
budget = parseInt(budget);
var price = 10;

var sounds = {
	'start': new Audio('sounds/smb_kick.wav'),
	'stop': new Audio('sounds/smb_bump.wav'),
	'win': new Audio('sounds/smb_stage_clear.wav')
}

var checkForJackpot = function() {

	if(running === false) {

		var slot1Src = document.querySelector('#slot1 img').getAttribute('src');
		var slot1 = parseInt(slot1Src.replace('images/', '').replace('.png', ''));

		var slot2Src = document.querySelector('#slot2 img').getAttribute('src');
		var slot2 = parseInt(slot2Src.replace('images/', '').replace('.png', ''));

		var slot3Src = document.querySelector('#slot3 img').getAttribute('src');
		var slot3 = parseInt(slot3Src.replace('images/', '').replace('.png', ''));

		console.log('result', slot1, slot2, slot3);

		if(slot1 === slot2 && slot1 === slot3) {
			if(slot1 === 1) {
				win(2);

				budget += 50000;
				updateBudget(budget);

			} else {
				win(1);
				budget += 5000;
				updateBudget(budget);
			}

		} else {
			// lose
			sounds.stop.play();
		}
	}
}

var shuffle = function(which) {
	var slot = Math.floor(Math.random() * Math.floor(limit))+1;

	document.querySelector('#slot'+which).innerHTML = '<img src="images/'+slot+'.png" alt="" />';
}

var updateBudget = function(value) {
	localStorage.setItem('slot_budget', value);
	document.querySelector('#budget').innerHTML = value;
}

var win = function(level) {

	var message = 'Gewonnen!';
	if(level > 1) {
		message = 'Gewonnen! (bigly)';
	}

	sounds.win.play();

	document.querySelector('#message').innerHTML = message;
	document.querySelector('#message').classList.remove('hidden');
}

var run = function() {

	// hide previous messages
	document.querySelector('#message').classList.add('hidden');


	running = true;
	document.querySelector('#button').classList.add('disabled');

	var interval1 = setInterval(function() {
		shuffle(1);
	}, 50);

	var interval2 = setInterval(function() {
		shuffle(2);
	}, 50);

	var interval3 = setInterval(function() {
		shuffle(3);
	}, 50);

	var timeout1 = setTimeout(function() {
		clearInterval(interval1);
	}, runtime);

	var timeout2 = setTimeout(function() {
		clearInterval(interval2);
	}, runtime+500);

	var timeout3 = setTimeout(function() {
		clearInterval(interval3);
		running = false;

		checkForJackpot();
		document.querySelector('#button').classList.remove('disabled');

	}, runtime+1000);
}

var displayMoney = function(amount) {

	var budget = document.querySelector('#budget-minus');
	budget.innerHTML = '-'+amount;

	var offset = document.querySelector('#budget');
	console.log(offset.offsetTop);
	console.log(offset.offsetLeft);

	// position 1
	budget.style.width = offset.offsetWidth+'px';
	budget.style.left = offset.offsetLeft+'px';
	budget.style.top = (offset.offsetTop+50)+'px';
	budget.style.opacity = '0';
	budget.style.transition = 'all 1.0s ease';

	// position 2
	budget.style.left = offset.offsetLeft+'px';
	budget.style.top =(offset.offsetTop+70)+'px';
	budget.style.opacity = '1';

	// back to position 1 after X seconds
	setTimeout(function() {
		budget.style.left = offset.offsetLeft+'px';
		budget.style.top = (offset.offsetTop+50)+'px';
		budget.style.opacity = '0';
		budget.style.transition = 'none';
	}, 1500);
}

window.addEventListener('DOMContentLoaded', function() {

	updateBudget(budget);
	shuffle(1);
	shuffle(2);
	shuffle(3);

	document.querySelector('#button').addEventListener('click', function(e) {
		e.preventDefault();

		if((budget-price) > 0 && running === false) {
			budget = budget - price;
			updateBudget(budget);

			sounds.start.play();
			displayMoney(price);

			run();
		} else {
			var messageEle = document.querySelector('#message');
			messageEle.classList.remove('hidden');

			if(running === true) {
				messageEle.innerHTML = 'still running, please wait.';
			} else {
				messageEle.innerHTML = 'low on funds. (<a href="#">PayPal</a>)';
			}

			var messageTimeout = setTimeout(function() {
				messageEle.classList.add('hidden');
			}, 2500);
		}


	});


}, false);
