//{{{ GESTIONE MODALS
(function(){
  
  var modalBG = $('#bg-modal'),
      modal_id = null;

  function  _toggleModal (e) {
    
    var clicked = $(e.currentTarget),
        isBG    = typeof clicked.data('modal') === 'undefined' ? true : false;

    if (isBG === false) {
      e.data.modal_id = '#' + clicked.data('modal');
    }
    
//     if ($(window).width() < 767) {
//       $(window).scrollTop(0);
//     }

    $(e.data.modal_id).find('.thumbnail img').attr('src', clicked.attr('href'));
    
    modalBG.fadeToggle(200);
    $(e.data.modal_id).fadeToggle(350);
    
    e.preventDefault();
  }

  $(document).on('click', '#bg-modal, *[data-modal]', { modal_id : modal_id}, _toggleModal);
  
})();

