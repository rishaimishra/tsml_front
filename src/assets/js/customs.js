$( document ).ready(function() {

    $( function() {
	    $( ".datepicker" ).datepicker();
	});


	$(window).scroll(function() {
	    if ($(this).scrollTop() >= 50) {        
	        $('#return-to-top').fadeIn(200);    
	    } else {
	        $('#return-to-top').fadeOut(200);   
	    }
	});
	$('#return-to-top').click(function() {      
	    $('body,html').animate({
	        scrollTop : 0                       
	    }, 500);
	});
	$(window).scroll(function() { 
	    var scroll = $(window).scrollTop();
	    if (scroll >= 300) {
	        $(".foot_arw").addClass("fixed");
	    } else {

	        $(".foot_arw").removeClass("fixed");
	    }
	});


	$(".increment-quantity1,.decrement-quantity1").on("click", function(ev) {
      var currentQty = $('input[name="quantity1"]').val();
      var qtyDirection = $(this).data("direction");
      var newQty = 0;
      if(qtyDirection == "1") {
         newQty = parseInt(currentQty) + 1;
      } else if(qtyDirection == "-1") {
         newQty = parseInt(currentQty) - 1;
      }
      // make decrement disabled at 1
      if(newQty == 1) {
         $(".decrement-quantity1").attr("disabled", "disabled");
      }
      // remove disabled attribute on subtract
      if(newQty > 1) {
         $(".decrement-quantity1").removeAttr("disabled");
      }
      if(newQty > 0) {
         newQty = newQty.toString();
         $('input[name="quantity1"]').val(newQty);
      } else {
         $('input[name="quantity1"]').val("1");
      }
   });
	$(".increment-quantity2,.decrement-quantity2").on("click", function(ev) {
      var currentQty = $('input[name="quantity2"]').val();
      var qtyDirection = $(this).data("direction");
      var newQty = 0;
      if(qtyDirection == "1") {
         newQty = parseInt(currentQty) + 1;
      } else if(qtyDirection == "-1") {
         newQty = parseInt(currentQty) - 1;
      }
      // make decrement disabled at 1
      if(newQty == 1) {
         $(".decrement-quantity2").attr("disabled", "disabled");
      }
      // remove disabled attribute on subtract
      if(newQty > 1) {
         $(".decrement-quantity2").removeAttr("disabled");
      }
      if(newQty > 0) {
         newQty = newQty.toString();
         $('input[name="quantity2"]').val(newQty);
      } else {
         $('input[name="quantity2"]').val("1");
      }
   });
	$(".increment-quantity3,.decrement-quantity3").on("click", function(ev) {
      var currentQty = $('input[name="quantity3"]').val();
      var qtyDirection = $(this).data("direction");
      var newQty = 0;
      if(qtyDirection == "1") {
         newQty = parseInt(currentQty) + 1;
      } else if(qtyDirection == "-1") {
         newQty = parseInt(currentQty) - 1;
      }
      // make decrement disabled at 1
      if(newQty == 1) {
         $(".decrement-quantity3").attr("disabled", "disabled");
      }
      // remove disabled attribute on subtract
      if(newQty > 1) {
         $(".decrement-quantity3").removeAttr("disabled");
      }
      if(newQty > 0) {
         newQty = newQty.toString();
         $('input[name="quantity3"]').val(newQty);
      } else {
         $('input[name="quantity3"]').val("1");
      }
   });


	$(window).scroll(function() {
	    if ($(document).scrollTop() > 0) {
	      $(".header_botom").addClass("fixed_header");
	    } else {
	      $(".header_botom").removeClass("fixed_header");
	    }
	});


   $(".click_filter").click(function() {
       $(".search_result_left").slideToggle("slow");
   });

   $(".price-info0").click(function() {
       $(".price-info_result0").slideToggle("slow");
   });

   $(".price-info1").click(function() {
       $(".price-info_result1").slideToggle("slow");
   });

   $(".price-info2").click(function() {
       $(".price-info_result2").slideToggle("slow");
   });


   $(".sharch_tog").click(function() {
    $(".search-section").slideToggle();
   });

   $(document).on('click', function () {
     var $target = $(event.target);
       if (window.matchMedia('(max-width: 1920px)').matches) {
     if (!$target.closest('.search-section').length
       && !$target.closest('.sharch_tog').length
       && $('.search-section').is(":visible")) {
       $('.search-section').slideUp();
     }
   }
   });

   $.fn.extend({
      treed: function (o) {
      
      var openedClass = 'fa-minus-circle';
      var closedClass = 'fa-plus-circle';
      
      if (typeof o != 'undefined'){
      if (typeof o.openedClass != 'undefined'){
      openedClass = o.openedClass;
      }
      if (typeof o.closedClass != 'undefined'){
      closedClass = o.closedClass;
      }
      };
      
      //initialize each of the top levels
      var tree = $(this);
      tree.addClass("tree");
      tree.find('li').has("ul").each(function () {
         var branch = $(this); //li with children ul
         branch.prepend("<i class='indicator fa " + closedClass + "'></i>");
         branch.addClass('branch');
         branch.on('click', function (e) {
             if (this == e.target) {
                 var icon = $(this).children('i:first');
                 icon.toggleClass(openedClass + " " + closedClass);
                 $(this).children().children().toggle();
             }
         })
         branch.children().children().toggle();
      });
      //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function(){
      $(this).on('click', function () {
         $(this).closest('li').click();
      });
      });
      //fire event to open branch if the li contains an anchor instead of text
      tree.find('.branch>a').each(function () {
         $(this).on('click', function (e) {
             $(this).closest('li').click();
             e.preventDefault();
         });
      });
      //fire event to open branch if the li contains a button instead of text
      tree.find('.branch>button').each(function () {
         $(this).on('click', function (e) {
             $(this).closest('li').click();
             e.preventDefault();
         });
      });
      }
      });
      
      //Initialization of treeviews
      
      $('#tree1').treed();
      
});