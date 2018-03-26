var Swipe = function () {
	return {
		xDown: null,
		
		//You need to provide slider, images,next/prev buttons of slider classes 
		setup: function setup(slider,img,prevBnt,nextBtn) {
			if(slider === undefined || img === undefined || prevBnt === undefined || nextBtn === undefined) {
				return;
			}
			var _this = this;

			var slider = document.querySelectorAll(slider);
			slider.forEach(function (e) {
				var imgs = e.querySelectorAll(img);
				var prev = e.querySelector(prevBtn);
				var next = e.querySelector(nextBtn);
				imgs.forEach(function (el) {
					el.addEventListener('touchstart', _this.SwipeStart, false);
					el.addEventListener('touchmove', _this.SwipeMove(next, prev), false);
				});
			});
		},
		SwipeStart: function SwipeStart(event) {
			this.xDown = event.touches[0].clientX;
		},
		SwipeMove: function SwipeMove(nextClick, preClick) {
			return function (event) {
				if (!this.xDown) {
					return;
				}
				var xUp = event.touches[0].clientX;
				var xDiff = this.xDown - xUp;

				if (xDiff > 0) {
					nextClick.click();
				} else {
					preClick.click();
				}

				this.xDown = null;
			};
		}
	};
}();

//To init
Swipe.setup();