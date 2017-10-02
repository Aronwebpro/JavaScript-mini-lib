'use strict';

var Modal = (function() {
  return {
    triggers: '.modal-button',
    removers: '.modal-close-button',
    setup: function setup() {
      var _this = this;

      [].slice.call(document.querySelectorAll(this.triggers)).forEach(function(trigger) {
        return trigger.addEventListener('click', _this.show);
      });
      [].slice.call(document.querySelectorAll(this.removers)).forEach(function(remover) {
        return remover.addEventListener('click', _this.hide);
      });
    },
    show: function show() {
      var modal = document.getElementById(this.getAttribute('data-target'));
      if (modal === null) {
        return;
      }
      modal.classList.add('modal-open');
      setTimeout(function() {
        modal.children[0].classList.add('modal-open-effect');
      }, 1);
    },
    hide: function hide() {
      var modal = document.querySelector('.modal-open');
      modal.classList.remove('modal-open');
      modal.children[0].classList.remove('modal-open-effect');
    }
  };
})();

Modal.setup();
