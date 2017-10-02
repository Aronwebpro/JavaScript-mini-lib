const Modal = (function() {
  return {
    triggers: '.modal-button',
    removers: '.modal-close-button',
    setup() {
      [].slice
        .call(document.querySelectorAll(this.triggers))
        .forEach(trigger => trigger.addEventListener('click', this.show));
      [].slice
        .call(document.querySelectorAll(this.removers))
        .forEach(remover => remover.addEventListener('click', this.hide));
    },
    show() {
      var modal = document.getElementById(this.getAttribute('data-target'));
      if (modal === null) {
        return;
      }
      modal.classList.add('modal-open');
      setTimeout(function() {
        modal.children[0].classList.add('modal-open-effect');
      }, 1);
    },
    hide() {
      var modal = document.querySelector('.modal-open');
      modal.classList.remove('modal-open');
      modal.children[0].classList.remove('modal-open-effect');
    }
  };
})();

Modal.setup();
