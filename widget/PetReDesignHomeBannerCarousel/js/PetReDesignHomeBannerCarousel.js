/**
 * @fileoverview idex Mega Menu Widget.
 *
 * @author Taistechwouapy
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'spinner', 'pubsub','ccRestClient' , "ccConstants",  'storageApi'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, spinner, pubsub, r , ccConstants , storageApi) {

    "use strict";

	
	
    return {
	
		onLoad: function(widget) {
		  
		    

		
		},
		
					
		    
		beforeAppear: function(page) {
		    var widget=this;
		   $(document).ready(function() {
                   $(".homeBanner-carousel").swiperight(function() {
                      $(this).carousel('prev');
                    });
                   $(".homeBanner-carousel").swipeleft(function() {
                     $(this).carousel('next');
                   });
                });
            
		},
		homeCarousel: function(){
		     if($( "#home-banner-carousel .item" ).find( 'img' ).length == 1){
                     $(".carousel-control").hide();
		    }else{
		       
		        	$('.homeBanner-carousel').carousel({
                      interval: 5000
                    })
                    $(".carousel-control").show();
		    }    
		}
		
		

	
    };
  }
);