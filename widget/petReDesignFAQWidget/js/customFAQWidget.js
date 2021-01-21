/**
 * @fileoverview Petmate Carousel Widget.
 *
 * @author oracle
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko) {

    "use strict";
    var getWidget = "";
    var getSubChildCategories;
    var getBrandsData
    return {
onLoad: function(widget) {

},

beforeAppear: function(page) {
      $(".panel-headings").on("click", function(event) {
         event.preventDefault();
         var clickedId = $(this).attr("id");
         var hasInClass = $("#"+clickedId).find('.panel-collapse').hasClass('in');
         if($('.panel-headings').find('a').hasClass('activeLink')){
              $('.panel-headings').find('a').removeClass('activeLink');
         }
         if(!hasInClass){
              $("#"+clickedId).find('a').addClass('activeLink');
         } else{
             $('.panel-headings').find('a').removeClass('activeLink');
         }
         var plusHidden = $("#"+clickedId).find('.fa-plus-square-o').hasClass('hide');
         var minusHidden = $("#"+clickedId).find('.fa-minus-square-o').hasClass('hide');
         if(plusHidden){
             //collapse
             $('.fa-minus-square-o').addClass('hide');
             $('.fa-plus-square-o').removeClass('hide');
             $("#"+clickedId).find('.fa-plus-square-o').removeClass('hide');
              $("#"+clickedId).find('.fa-minus-square-o').addClass('hide');
         }
         if(minusHidden){
             $('.fa-plus-square-o').removeClass('hide');
              $('.fa-minus-square-o').addClass('hide');
            $("#"+clickedId).find('.fa-plus-square-o').addClass('hide');
             $("#"+clickedId).find('.fa-minus-square-o').removeClass('hide');
         }

            })
    },
 
    
    };
  }
);
