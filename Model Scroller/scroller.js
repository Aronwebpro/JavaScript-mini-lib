'use strict';

var Scroller = function () {

	function iScroller(scroller) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		this.scroller = document.getElementById(scroller);

		//Check Scroller Exist
		if (this.scroller == null) {
			return;
		}

		/* Scroller Parameters and options */

		//Viewport
		options.viewport ? this.viewport = this.scroller.querySelector(options.viewport) : this.viewport = this.scroller.querySelector('.item_space');
		//Moving space
		options.moving_space ? this.moving_space = this.scroller.querySelector(options.moving_space) : this.moving_space = this.scroller.querySelector('.moving_space');
		//Scroll Items
		options.items ? this.items = [].slice.call(this.scroller.querySelectorAll(options.items)) : this.items = [].slice.call(this.scroller.querySelectorAll('.item_cont'));
		//Next Btn
		options.nextBtn ? this.nextBtn = this.scroller.querySelector(options.nextBtn) : this.nextBtn = this.scroller.querySelector('.next');
		//Prev Btn
		options.nextBtn ? this.prevBtn = this.scroller.querySelector(options.prevBtn) : this.prevBtn = this.scroller.querySelector('.prev');
		
		/************************************
		You can set how many models to show as default (now default is 4)	
		***********************************/
		options.count ? this.defaultCount = options.count : this.defaultCount = 4;
		this.items.length < this.defaultCount ? this.defaultCount = this.items.length : 0;
		this.count = this.defaultCount;

		//Initiate script
		this.init();
	};

	iScroller.prototype = {
		init: function init() {
			var _this = this;

			/* Set properties */
			this.items.length < this.count ? this.count = this.items.length : 0;
			this.stop = 0;
			//set left property to 0; 
			this.moving_space.style.left = 0 + 'px';

			//Add event listener for Navigation btn
			this.nextBtn.addEventListener('click', function () {
				return _this.next();
			});
			this.prevBtn.addEventListener('click', function () {
				return _this.prev();
			});

			//Apply Width properties for Scroller
			this.setWidth();
		},
		setWidth: function setWidth() {
			var _this2 = this;

			//onload Set default constant to help in Resize function 
			var lockedWidth = this.scroller.querySelector('.item_cont').clientWidth;
			var lockedCount = this.count;
			switch (true) {
				case this.viewport.clientWidth < 420:
					this.count = 1;
					break;
				case this.viewport.clientWidth < 500:
					this.count = 2;
					break;
				case this.viewport.clientWidth < 700:
					this.count = 3;
					break;
				case this.viewport.clientWidth < 1050:
					this.count = 4;
					break;
				case this.viewport.clientWidth > 1050:
					this.count = lockedCount;
					break;
			}

			//onload Set Inventory Tile width	
			this.items.forEach(function (item) {
				return item.style.width = 100 / _this2.items.length + '%';
			});

			//onload Add event listener on ViewPort resizing. 	
			window.addEventListener('resize', function () {
				return _this2.resize(_this2.items, lockedWidth, lockedCount);
			});

			//onload Set moving_space Width
			this.moving_space.style.width = this.items.length / this.count * 100 + '%';

			//change btn animation
			this.btnAnimation();
		},
		resize: function resize(item, lockedWidth, lockedCount) {
			var _this3 = this;

			//Set Inventory Number to display depending on ViewPort	
			switch (true) {
				case this.viewport.clientWidth < 420:
					this.count = 1;
					break;
				case this.viewport.clientWidth < 500:
					this.count = 2;
					break;
				case this.viewport.clientWidth < 700:
					this.count = 3;
					break;
				case this.viewport.clientWidth < 1050:
					this.count = 4;
					break;
				case this.viewport.clientWidth > 1050:
					this.count = lockedCount;
					break;
			}

			//Get Left property and moving_space width
			this.left = parseInt(this.moving_space.style.left, 10);
			var spaceWidth = this.items.length * 100 / this.count;
			var itemLength = parseInt(this.items[0].style.width);
			//Recalculate Left property for moving_space
			if (-this.left + 100 > spaceWidth || this.count > 4 && -(this.left * 2) > spaceWidth || -this.left > spaceWidth - this.count * itemLength) {
				this.moving_space.style.transition = 'none';
				this.moving_space.style.left = -(spaceWidth - 100) + '%';
				setTimeout(function () {
					return _this3.moving_space.style.transition = 'left 0.7s';
				}, 100);
			}

			if (this.left % 100 != 0) {
				this.moving_space.style.transition = 'none';
				this.moving_space.style.left = this.left - this.left % 100 + '%';
				setTimeout(function () {
					return _this3.moving_space.style.transition = 'left 0.7s';
				}, 100);
			}

			//Reset moving_space Width
			this.moving_space.style.width = this.items.length / this.count * 100 + '%';

			//change btn animation
			this.btnAnimation();
		},
		next: function next() {
			//set left and stop properties
			var left = parseInt(this.moving_space.style.left, 10);
			this.stop = -((this.items.length - this.count) / this.count) * 100;
			this.left = left;

			//Stop if Reach End	
			if (-left >= -this.stop) {
				this.nextBtn.classList.add('passive');
				return;
			}
			//Scrolling Step
			var step = 100;
			if (-this.stop - -this.left < -this.left && this.count !== 1 || this.left === 0 && -this.stop < 100) {
				step = -(this.stop - this.left);
			}
			//Scrolling
			this.moving_space.style.left = left - step + '%';

			//Reset Left Property after scroll
			this.left = parseInt(this.moving_space.style.left, 10);

			//change btn animation
			this.btnAnimation();
		},
		prev: function prev() {
			//get Left Property of moving_space
			var left = parseInt(this.moving_space.style.left, 10);
			this.left = left;

			//Stop if Reach End	& change nav btn style		
			if (-left <= 0) {
				this.prevBtn.classList.add('passive');
				return;
			}
			//Scrolling Step
			var step = 100;
			if (-this.left >= 100) {
				step = 100;
			} else {
				step = -this.left;
			}
			//Scrolling
			this.moving_space.style.left = left + step + '%';

			//Reset Left Property after scroll
			this.left = parseInt(this.moving_space.style.left, 10);

			//change btn animation
			this.btnAnimation();
		},
		btnAnimation: function btnAnimation() {
			var left = parseInt(this.moving_space.style.left, 10);
			var stop = -((this.items.length - this.count) / this.count) * 100;
			if (Math.floor(-left) == Math.floor(-stop)) {
				this.nextBtn.classList.add('passive');
			}
			if (-left == 0) {
				this.prevBtn.classList.add('passive');
				this.nextBtn.classList.remove('passive');
			}
			if (-left > 0) {
				this.prevBtn.classList.remove('passive');
			}
			if (Math.floor(-left) < Math.floor(-stop)) {
				this.nextBtn.classList.remove('passive');
			}
			if (this.items.length <= this.count) {
				this.prevBtn.classList.add('btn-hidden');
				this.nextBtn.classList.add('btn-hidden');
			} else {
				this.prevBtn.classList.remove('btn-hidden');
				this.nextBtn.classList.remove('btn-hidden');
			}
		}
	};

	return iScroller;
}();

var scroller;
scroller = new Scroller('scroller');

/************************************
Adjust Widget box size and Font Size
This is not a part of Scroller class
***********************************/

//calculate Font size for box Title
function fontSize(scroller) {
	var boxWidth = document.querySelector('.item_cont').offsetWidth;
	switch (true) {
		case boxWidth < 137:
			scroller.style.fontSize = '11px';
			break;
		case boxWidth < 158:
			scroller.style.fontSize = '12px';
			break;
		case boxWidth < 170:
			scroller.style.fontSize = '14px';
			break;
		case boxWidth < 206:
			scroller.style.fontSize = '15px';
			break;
		case boxWidth < 250:
			scroller.style.fontSize = '16px';
			break;
		case boxWidth < 300:
			scroller.style.fontSize = '17px';
			break;
	}
}
//On page load adjust Widget Height	
window.onload = function () {
	fontSize(document.getElementById('scroller'));
	var widgetBox = document.querySelector('.item_space');
	var boxHeight = document.querySelector('.item_cont').offsetHeight;
	widgetBox.style.height = boxHeight + 'px';
};

//On viewport change adjust Widget Height
window.addEventListener('resize', function () {
	var widgetBox = document.querySelector('.item_space');
	var boxHeight = document.querySelector('.item_cont').offsetHeight;
	widgetBox.style.height = boxHeight + 'px';
	fontSize(document.getElementById('scroller'));
});