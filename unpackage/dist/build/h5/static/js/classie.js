/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

const classieClass = {

	// 'use strict';

	// class helper functions from bonzo https://github.com/ded/bonzo

	classReg: function(className) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	},


	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	allClass: function() {
		var hasClass, addClass, removeClass;
		
		if ('classList' in document.documentElement) {
			hasClass = function(elem, c) {
				return elem.classList.contains(c);
			};
			addClass = function(elem, c) {
				elem.classList.add(c);
			};
			removeClass = function(elem, c) {
				elem.classList.remove(c);
			};
		} else {
			hasClass = function(elem, c) {
				return classReg(c).test(elem.className);
			};
			addClass = function(elem, c) {
				if (!hasClass(elem, c)) {
					elem.className = elem.className + ' ' + c;
				}
			};
			removeClass = function(elem, c) {
				elem.className = elem.className.replace(classReg(c), ' ');
			};
		}
		
		return {
			hasClass,
			addClass,
			removeClass
		};
	},

	toggleClass: function(elem, c) {
		
		var fn = hasClass(elem, c) ? removeClass : addClass;
		fn(elem, c);
	},
	
	classCustom: function() {
		var allclassVal = classieClass.allClass();
		var classie = {
			// full names
			hasClass: allclassVal.hasClass,
			addClass: allclassVal.addClass,
			removeClass: allclassVal.removeClass,
			toggleClass: classieClass.toggleClass,
			// short names
			has: allclassVal.hasClass,
			add: allclassVal.addClass,
			remove: allclassVal.removeClass,
			toggle: classieClass.toggleClass
		};
		
		// transport
		if (typeof define === 'function' && define.amd) {
			// AMD
			define(classie);
		} else {
			// browser global
			window.classie = classie;
		}
		
		return classie;
	}

};

export default classieClass;
