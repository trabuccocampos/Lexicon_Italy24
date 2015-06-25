$(window).load(function() {
  var $html = $('html'),
    isTouch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch ? true:false,
    touchClass = isTouch ? 'touch':'notouch',
    linkEvent = isTouch ? 'touchend':'click',
    // $body = $('body'),
    // $wrapper = $('#wrapper'),
    $window = $(window);
  var is_small_device = $(window).width() < 767;
  $html.addClass(touchClass);
  
  $('a.lexicon').popover({
    trigger: isTouch ? 'click':'click',
    html: true,
    content: function(){
      return '<p>' + $(this).data('content') + '</p><p class="text-right"><a href="' + $(this).attr('href') + '">Go to the complete definition</a></p>';
    }
  });
  $("a[data-toggle=popover]").click(function(e) {
    e.preventDefault()
  });
  
  
  // Table restyle
  //////////////////////////////////////////////
  if ($('.contenuto table').length) {
    $('.contenuto table').addClass('table').attr('border', 0).wrap('<div class="table-wrap large"></div>').wrap('<div class="table-content"></div>');
    $('.table-wrap').each(function(){
      if ($(this).find('table').width() > $(this).width()){
        $(this).addClass('large');
      }
    });
  }
  
  
  // Apri filtri
  //////////////////////////////////////////////
  if ($('.btn-menu.active.con-filtri').length) {
    $('.btn-menu.active.con-filtri').on('click', function(e){
      if ($('nav.filtri:visible').length) {
        return true;
      } else {
        $('.is_stuck nav.filtri').addClass('open');
        e.preventDefault();
        return false;
      }
    });
  }


  // Sticky
  //////////////////////////////////////////////
  if (($('.sticky').length) && (!is_small_device)) {
    if (typeof sezione !== 'undefined') {
      if(sezione === 'preferiti'){
        $('.sticky').stick_in_parent({
          offset_top: 80,
          parent: 'body'
        });
      } else {
        $('.sticky').stick_in_parent({
          offset_top: 80
        });
      }
    } else {
      $('.sticky').stick_in_parent({
        offset_top: 80
      });
    }
  }
  if ($('.sticky_header').length) {
    $('.sticky_header').stick_in_parent({parent: 'body'});
  }
  
  if ($('#sticky_header_phone').length) {
    $('#sticky_header_phone').stick_in_parent({parent: $('#pg_wrapper')});
  }
  
  
  // Read more
  //////////////////////////////////////////////
  if ($('.content_more').length) {
    $('.content_more').readmore({
      maxHeight: 65,
      moreLink: '<a href="#">Leggi tutto</a>',
      lessLink: '<a href="#">Chiudi</a>'
    });
  }
  
  
  // Responsive navigation
  //////////////////////////////////////////////
  if ($('.sticky_header').length) {
    var $mobileMenu = $('.sticky_header').clone(true).removeClass('sticky_header').attr('id', 'mobile_menu').appendTo('#pg_wrapper');
    
    var $activeItem = $('.sticky_header').find('.btn-menu.active');
    $mobileMenu.addClass('active_'+$activeItem.attr('data-label'));
    $mobileMenu.find('#search').appendTo($('#sticky_header_phone .container'));//.css({'display': 'none'});

    $('.nav_show').on(linkEvent, function(e){
      e.preventDefault();
      $html.toggleClass('menu_open');
      
      var $btn = $('#mobile_menu .con-filtri.active'),
          $nav = $('#mobile_menu .filtri'),
          //$btnParent = $btn.parents('li'),
          btnHeight = $btn.height() + 20;

      $nav.css('top', ($btn.parents('li').position().top + btnHeight));
      $btn.css('padding-bottom',$nav.height() + 10);
      

      //triggerHandler('resize') per far aggiornare il boundbox del body a stick_in_parent
      $window.scrollTop(0).triggerHandler('resize');
      return false;
    });
    
    //click sul content
    /* {{{ Va in conflitto con colorbox
    $('#content').on(linkEvent, function(e){
      e.stopPropagation();
      $html.removeClass('menu_open');
      return true;
    });
    */
  }
  
  if(isTouch){
    //ios workaround
    $('input.ricerca-keyword').on(linkEvent, function(e) {
      e.stopPropagation();
      $window.scrollTop(0);
      $(this).focus();
    });
  }
  
  // Tool ricerca
  //////////////////////////////////////////////
  var $searchBar = $('.sticky_header #search');
  if ($searchBar.length){
    
    function resizeInput(){
      var tool_ricerca;
      if ($('#sticky_header_phone:visible').length) {
        tool_ricerca = $('#sticky_header_phone #tool-ricerca');
      } else {
        tool_ricerca = $('.sticky_header #tool-ricerca');
      }
      var tot = tool_ricerca.width();
      if (tool_ricerca.find('li.li-tag').length) {
        tot = tot - tool_ricerca.find('li.li-tag').width();
      }
      if (tool_ricerca.find('li.li-quando').length) {
        tot = tot - tool_ricerca.find('li.li-quando').width();
      }
      if (tool_ricerca.find('li.li-submit').length) {
        tot = tot - tool_ricerca.find('li.li-submit').width();
      }
      tool_ricerca.find('.ricerca-keyword').width(tot - 20);
    }
    // resizeInput();
    $(window).on('resize', function() {
      resizeInput();
    });
    
    var $searchInput = $searchBar.find('input[type="search"]'),
      $openSearch = $('#open-search');
    
    var o_s_right = 20 + 4 + 7; //padding container
    $('#nav-tools li:gt(0)').each(function(){
      o_s_right += $(this).outerWidth(true);
    });
    $searchBar.css('right', o_s_right);
    
    var o_s_left = $('#site-menu li:eq(0)').outerWidth() + 20;
    $searchBar.css('left', o_s_left);
    
    $searchBar.data('scrollOffsetOnShow', 0);
    $openSearch.on('click', function(e){
      $searchBar.data('scrollOffsetOnShow', $(document).scrollTop());
      $searchBar.addClass('open');
      resizeInput();
      setTimeout(function(){
        $searchInput.trigger('focus');
      }, 300);
      e.preventDefault();
      return false;
    });
    
    $searchInput.on('blur', function(){
      if (!$searchBar.hasClass('force-open')) {
        $searchBar.removeClass('open');
      }
    });
  }
  $(window).scroll(function () {
    if (!$searchBar.hasClass('force-open')) {
      var docViewTop = $(document).scrollTop();
      if ($searchBar.hasClass('open') && Math.abs(docViewTop-$searchBar.data('scrollOffsetOnShow')) > 50) {
        $searchBar.removeClass('open');
      }
    }
  });
  if ($searchBar.hasClass('force-open')) {
    setTimeout(function(){
      resizeInput();
    }, 300);
  }
  
  if ($('.autocomplete').length){
    var tags = [];
    var map = {};
    var data = tag_list;
    $.each(data, function (i, tag) {
        map[tag.name] = tag;
        tags.push(tag.name);
    });
    $('.autocomplete').typeahead({
      source: function (query, process) {
        process(tags);
      },
      updater: function (item) {
        var selectedTag = map[item].slug;
        window.location.href = '/tag/'+selectedTag+'/';
      }
    });
  }
  
//    if ($('a.tag-close').length) {
//     $('a.tag-close').click(function(e){
//       $(this).parents('li.li-tag').remove();
//       resizeInput();
//       $('input.filtro-keyword').addClass('autocomplete');
//       e.preventDefault();
//       return false;
//     });
//   }

  $('#sticky_header_phone menu a.search').on(linkEvent, function(e){
    // $(this).toggleClass('active');
    $('#sticky_header_phone:visible #search').toggleClass('open');
    resizeInput();
    e.preventDefault();
    return false;
  });
  
  $('#sticky_header_phone menu a.my24-log').on(linkEvent, function(e){
    $(this).toggleClass('active');
    $('#sticky_header_phone menu a.edizioni-log').removeClass('active');
    $('#editionDropDown .dropdDownBox').removeClass('open');
    $('#headerLogin .headerLogin-box').toggleClass('open');
    e.preventDefault();
    return false;
  });
  $('#sticky_header_phone menu a.edizioni-log').on(linkEvent, function(e){
    $(this).toggleClass('active');
    $('#sticky_header_phone menu a.my24-log').removeClass('active');
    $('#headerLogin .headerLogin-box').removeClass('open');
    $('#editionDropDown .dropdDownBox').toggleClass('open');
    e.preventDefault();
    return false;
  });
  
  
  /* ie placeholder support */
  $('input, textarea').placeholder();
  
  /* carousel fotonotizie */  
  if ($(".scroll-foto .carousel").length){
    var $scroller = $(".scroll-foto .carousel ul");
    $scroller.carouFredSel({
      auto: false,
      circular: true,
      infinite: true,
      responsive: true,
      height: 'auto',
      swipe: { onTouch: true },
      items: 1,
      scroll: 1,
      pagination: function() { return $(this).parents('.carousel').find('.pagination'); },
    });
    $(window).on('resize', function(){
      $scroller.trigger('configuration', { items: 1 });
    });
  }
  
});


(function(){
  $('#ordinamento .trigger').on('click', function () {
    $('#ordinamento .filtro-ricerca').slideDown(150, function(){
      $('body').on('click', _closeFiltroRicerca);
    });

    function _closeFiltroRicerca(){
      if ($('#ordinamento .filtro-ricerca').is(':visible')) {
        $('#ordinamento .filtro-ricerca').slideUp(150);
        $('body').off('click', _closeFiltroRicerca);
      }
    }
  });
})();

(function(){
  $('.add-result .trigger').on('click', function () {
    $('.add-result .intervallo-tempo').css({
      // 'width': $('.add-result .trigger').width() + 16,
      // 'margin-left': -($('.add-result .trigger').width() / 2 + 8)
    });
    $('.add-result .intervallo-tempo').slideDown(150, function(){
      $('body').on('click', _closeFiltroRicerca);
    });

    function _closeFiltroRicerca(){
      if ($('.add-result .intervallo-tempo').is(':visible')) {
        $('.add-result .intervallo-tempo').slideUp(150);
        $('body').off('click', _closeFiltroRicerca);
      }
    }
  });
})();


//{{{ DATEPICKER
(function(){

  $('#dal-icon, #al-icon').on("click", function (e) {
    $(e.currentTarget).prev().focus();
  });
  var margin;
  $("#dal, #al").datepicker({
    altFormat:"dd-mm-yy",
    beforeShow: function (input, inst) {
      if ($(window).width() < 767) {
        margin = $(input).attr('id') === 'dal' ? '-100px' : '40px';
        inst.dpDiv.css({ marginLeft: '-138px', marginTop: margin });
      } else {
        margin = $(input).attr('id') === 'dal' ? '290' : '75';
        inst.dpDiv.css({ marginLeft: '-' + margin + 'px' });
      }
    }
  });

})();


//{{{ GESTIONE MODALS
(function(){
  
  var modalBG = $('#bg-modal'),
      modal_id = null;

  function  _toggleModal (e) {
    
    var clicked = $(e.currentTarget),
        isBG    = typeof clicked.data('modal') === 'undefined' ? true : false;

    if (isBG === false) {
      e.data.modal_id = '#' + clicked.data('modal');
      if (typeof(__searchrangedate) === 'function'){
        __searchrangedate();
      }
    }
    
    if ($(window).width() < 767) {
      $(window).scrollTop(0);
    }

    modalBG.fadeToggle(200);
    $(e.data.modal_id).fadeToggle(350);
  }

  $(document).on('click', '#bg-modal, *[data-modal]', { modal_id : modal_id}, _toggleModal);
 
  //{{{ BENVENUTO (gestito con i cookies)
  $('#popup-blocco h2 span').click();
  
})();


//{{{ MULTIMEDIA
(function(){

  var _multimedia = {

    DOM : {
      wrapper     : $('#content article#foglia .contenuto'),
      videoCnt    : null,
      galleryCnt  : null,
      carousel    : $('#carousel'),
      carWrapper  : null,
      cboxCloned  : $('#cbox-cloned'),
      cbox        : $(".js-cbox-gallery"),
      list        : $("*[data-mediatype]")
    },
  
    //{{{ CAROUFREDSEL
    carousel : function (action) {

      if (action === 'destroy') {
        _multimedia.DOM.carousel.remove();
        _multimedia.DOM.carousel.trigger('destroy');
        _multimedia.DOM.galleryCnt.hide(0);
      }

      _multimedia.DOM.carousel.carouFredSel({
        items           : 1,
        prev            : '#carousel-prev',
        next            : '#carousel-next',
        pagination      : false,
        auto            : false,
        width           : '100%',
        height          : 'auto',
        responsive      : true,
        onWindowResize  : 'throttle',
        swipe: {
          onMouse: true,
          onTouch: true
        },
        onCreate: function () {

          $(window).on('resize', resizeElements);
          $(window).load(resizeElements);

          function resizeElements () {
            _multimedia.DOM.carousel.parent().add(_multimedia.DOM.carousel).height(_multimedia.DOM.carousel.children().first().height());
          }

          // Lancio custom di colorbox
          if (_multimedia.DOM.cboxCloned.length) {

            _multimedia.DOM.cboxCloned.find('li a').on('click', function (e) {
              var pos = $(e.currentTarget).data('cboxpos');
              _multimedia.DOM.cboxCloned.find('li').eq(pos).find('a').click();
            });
          }
          
          _multimedia.DOM.carWrapper = $('.caroufredsel_wrapper');
        }
      });
    },

    //{{{ COLORBOX
    cbox : function (action) {

      if (action === 'destroy') {
        $.colorbox.remove();
        $('#zoom-img').off('click');
      }

      var legend = {
        prev    : '<span class="icon-chevron-left"></span>',
        next    : '<span class="icon-chevron-right"></span>',
        close   : '<span class="icon-remove"></span>',
        current : ''
        //current:'{current} di {total}'
      };

      _multimedia.DOM.cbox.colorbox({
        fixed: true,
        next: legend.next,
        previous: legend.prev,
        close: legend.close,
        current: legend.current,
        maxWidth:"90%",
        maxHeight:"80%",
        opacity: 0.93,
        onOpen: _checkSmallScreens,
        onComplete:  _setAbstractAndSwipe
      });

      /*
      $(".js-cbox-video").colorbox({
        fixed: true,
        inline: true,
        close: legend.close,
        innerWidth:"640",
        innerHeight:"360",
        maxWidth:"100%",
        maxHeight:"100%",
        opacity: .93,
        onOpen: _checkSmallScreens
      });
      */

      /*
      $(".js-cbox-trigger").on('click', function (e) {
        var rel = '*[rel="' + $(e.currentTarget).data('cbox') + '"]';
        $(rel).first().click();
      });
      */

      $('#zoom-img').on('click', function () {
        var pos = _multimedia.DOM.carousel.find('li:first-child a').data('cboxpos');
        _multimedia.DOM.cboxCloned.find('li:nth-child(' + pos + ') a').click();
      });
  
      function _checkSmallScreens () {

        if ($(window).width() < 768) {
          $.colorbox.remove();
          return false;
        }

        if ($('#cboxCustomTitle').length === 0) {
          $('#cboxContent').prepend('<h1 id="cboxCustomTitle">' + $('#carousel').data('title') + '</h1>');
        }
      }

      function  _setAbstractAndSwipe () {

        var cnt = $('#cboxContent'),
            el  = $('#cboxLoadedContent'),
            h   = el.height(),
            w   = el.width();

        if (h > w) {
          cnt.addClass('vertical');
        } else {
          cnt.removeClass('vertical');
        }

        var isTouch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch ? true : false;

        if (isTouch === true) {
          $("#cboxLoadedContent").swipe({
            swipe:function(event, direction) {
              if (direction === 'left') {
                $.colorbox.next();
              } else if (direction === 'right') {
                $.colorbox.prev();
              }
            },
            threshold: 0
          });
        }
      }
    },

    //{{{ SWITCHER
    switcher : function () {

      _multimedia.DOM.videoCnt    = _multimedia.DOM.wrapper.find('.videoPlayer');
      _multimedia.DOM.galleryCnt  = _multimedia.DOM.wrapper.find('.gallery');

      var lis = $('.allegati.multimedia ol li'),
          a   = lis.find('a');

      a.on('click', _changeMultimedia);
      
      function _changeMultimedia (e) {

        var clicked = $(e.currentTarget),
            li = clicked.parent('li'),
            type = li.data('mediatype');
        
        lis.removeClass('current');
        li.addClass('current');

        if (type === 'video') {
          var id = li.data('videoid');
          _multimedia.changeVideo(id);
        } else if (type === 'gallery') {
          var url = li.data('jsonurl');
          _multimedia.changeGallery(url);
        } else if (type === 'embed') {
          var embed = li.data('embed');
          _multimedia.changeEmbed(embed);
        }
      }
    },
    
    changeEmbed : function (embed) {
      
      embed = decodeURI(embed);
      
      if (_multimedia.DOM.galleryCnt.length > 0) {
        _multimedia.carousel('destroy');
        _multimedia.cbox('destroy');
      }

      _multimedia.DOM.videoCnt.remove();

      var output =  '<div class="videoPlayer">' + embed + '</div>';

      _multimedia.DOM.wrapper.prepend(output);
      _multimedia.DOM.videoCnt = _multimedia.DOM.wrapper.find('.videoPlayer');

      _multimedia.DOM.videoCnt.show(0);
    },
    
    changeVideo : function (id) {

      if (_multimedia.DOM.galleryCnt.length > 0) {
        _multimedia.carousel('destroy');
        _multimedia.cbox('destroy');
      }

      _multimedia.DOM.videoCnt.remove();

      var output = '<div class="videoPlayer">' +
                      '<object class="BrightcoveExperience">' +
                        '<param name="bgcolor" value="#F7EBDF">' +
                        '<param name="width" value="640">' +
                        '<param name="height" value="360">' +
                        '<param name="publisherID" value="18140046001">' +
                        '<param name="playerID" value="3479756244001">' +
                        //'<param name="adServerURL" value="http://adv.ilsole24ore.it/RealMedia/ads/adstream_sx.ads/www.ilsole24ore.it/06/sole5/mediacenter/9586099844@VideoBox,PreRoll,PostRoll!PreRoll">' +
                        '<param name="@videoPlayer" value="' + id + '">' +
                        '<param name="isVid" value="true">' +
                        '<param name="isUI" value="true">' +
                        '<param name="autosize" value="off">' +
                        '<param name="autoStart" value="true">' +
                      '</object>' +
                    '</div>';

      _multimedia.DOM.wrapper.prepend(output);
      _multimedia.DOM.videoCnt = _multimedia.DOM.wrapper.find('.videoPlayer');
      brightcove.createExperiences();

      _multimedia.DOM.videoCnt.show(0);
    },

    changeGallery : function (url) {
    
      _multimedia.DOM.videoCnt.remove();
      _multimedia.carousel('destroy');
      _multimedia.cbox('destroy');
      _multimedia.DOM.galleryCnt.show(0);

      $.getJSON(url, buildGallery);
      
      function buildGallery (data) {

        var output  = '<ol id="carousel" data-title="' + data.title + '">';
        var output2 = '<ol id="cbox-cloned">';

        $.each(data.images, function(i, d) {

          output += '<li>' +
                      '<a href="javascript:;" data-cboxpos="' + (d.index + 1) + '">'+
                      '<figure>' +
                        '<span class="wrapper-img">' +
                          '<img alt="' + d.caption + '" src="' + d.big + '">' +
                        '</span>' +
                      '<figcaption>' + d.caption + '<span class="pagination">' + (d.index + 1) + '/' + data.images.length + '</span></figcaption>' +
                      '</figure>' +
                    '</a>' +
                  '</li>';

          output2 += '<li>' +
                        '<a class="js-cbox-gallery" href="' + d.src + '" rel="cbox-gallery" title="<div class=\'cbox-dida\'>' + d.caption + '<span class=\'cbox-pagination\'>' + (d.index + 1) + '/' + data.images.length + '</span></div>"></a>' +
                      '</li>';
        });

        output += '</ol>';
        output2 += '</ol>';

        _multimedia.DOM.carousel.remove();
        if (_multimedia.DOM.carWrapper !== null) { _multimedia.DOM.carWrapper.remove(); }
        _multimedia.DOM.cboxCloned.remove();
        
        _multimedia.DOM.galleryCnt.append(output + output2);
        
        _multimedia.DOM.carousel    = $('#carousel');
        _multimedia.DOM.carWrapper  = $('.caroufredsel_wrapper');
        _multimedia.DOM.cboxCloned  = $('#cbox-cloned');
        _multimedia.DOM.cbox        = $(".js-cbox-gallery");
        
        _multimedia.carousel();
        _multimedia.cbox();
      }
    },
    
    init : function () {

      if (_multimedia.DOM.carousel.length > 0) { _multimedia.carousel(); }

      if (_multimedia.DOM.cbox.length > 0) { _multimedia.cbox(); }

      if (_multimedia.DOM.list.length > 0) { _multimedia.switcher(); }
    }
  };

  _multimedia.init();

})();


//{{{ BREAKING NEWS SCOLL
(function () {

  if (location.hash) {
    var art = $(location.hash);

    if (art.length) {
      var delta = $('.sticky_header').outerHeight() + 80,
          offsetY = art.offset().top - delta;
          //isScrolling = true;

      var _stopAnimation = function (e) {
        if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
          $("html,body").stop(true, true);
        }
      };

      $('body,html').on('scroll mousedown wheel DOMMouseScroll mousewheel keyup', _stopAnimation);

      $('html, body').animate({
        scrollTop: offsetY,
      }, 1200, function () {
        $('body,html').off('scroll mousedown wheel DOMMouseScroll mousewheel keyup', _stopAnimation);
        art.addClass('art-hashed');
      });
    }
  }
})();
