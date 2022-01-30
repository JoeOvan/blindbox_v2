/**
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
import classieClass from './classie';
import rectangleEmitter from "./rectangleEmitter";

// import Vue from 'vue'
// import VueConfetti from 'vue-confetti'

// Vue.use(VueConfetti)



const blindbox =  {

	// 'use strict';
	
	// start: function() {
	// 	this.$confetti.start();
	// },
	
	// stop: function() {
	// 	this.$confetti.stop();
	// },
	
	merrywrap: function () {
		return document.getElementById('merrywrap');
	},
	box: function () {
		return merrywrap.querySelector('.giftbox');
	},
	// step: function () {
	// 	return 1;
	// },
	step: 1,
	stepTimes: [1000, 1000, 2000, 2000],

	init : function () {
		// var merrywrap = document.getElementById('merrywrap'),
		// 	box = merrywrap.querySelector('.giftbox'),
		// 	step = 1,
		// 	stepTimes = [1000, 1000, 2000, 2000];
			
		blindbox.box().addEventListener('click', this.runAnimation);
	},

	runAnimation : function () {
		if (blindbox.step === 1) {
			blindbox.box().removeEventListener('click', blindbox.runAnimation);
		}
		blindbox.incStep(blindbox.step);
		if (blindbox.step === 4) {
			// blindbox.letitsnow();
			// VueConfetti.$confetti.start;
			return;
		}
		if (blindbox.step === 3) {
			// set different delays for each item
			blindbox.setGridDelays();
		}
		setTimeout(function() {
			blindbox.runAnimation();
		}, blindbox.stepTimes[blindbox.step - 1]);
		++blindbox.step;
	},

	incStep : function (step) {
		classieClass.classCustom().remove(merrywrap, 'step-' + Number(step - 1));
		classieClass.classCustom().add(merrywrap, 'step-' + step);
	},

	setGridDelays : function () {
		[].slice.call(blindbox.merrywrap().querySelectorAll('.row')).forEach(function(row, i) {
			var itemsrow = [].slice.call(row.querySelectorAll('span')),
				itemsrowCount = itemsrow.length,
				factor = (itemsrowCount - 1) * 0.01,
				delays = [itemsrowCount - 1];

			for (var k = 0; k < itemsrowCount; ++k)
				delays[k] = k * 0.01 + ((itemsrowCount - 1 - i) * factor);

			blindbox.shuffle(itemsrow);

			itemsrow.forEach(function(item, j) {
				var delay = delays[j];
				item.style.webkitTransition = '-webkit-transform 0.4s ease-out ' + delay +
					's, opacity 0.4s ' + delay + 's';
				item.style.transition = 'transform 0.4s ease-out ' + delay + 's, opacity 0.4s ' +
					delay + 's';
			});
		})
	},

	letitsnow : function () {
		// https://github.com/daveWid/canvas-snow
		var canvas = document.getElementById("snowfall");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// Now the emitter
		var emitter = Object.create(rectangleEmitter);
		emitter.setCanvas(canvas);
		emitter.setBlastZone(0, -10, canvas.width, 1);
		emitter.particle = snow;
		emitter.runAhead(0);
		emitter.start(60);
	},

	// http://stackoverflow.com/a/2450976
	shuffle: function (array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	// init();

};

export default blindbox;
