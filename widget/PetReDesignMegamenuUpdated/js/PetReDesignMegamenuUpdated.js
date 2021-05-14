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
  ['jquery', 'knockout', 'spinner', 'pubsub','ccRestClient' , "ccConstants",  'storageApi', 'ccResourceLoader!global/jquery.multilevelpushmenu'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, spinner, pubsub, r , ccConstants , storageApi) {

    "use strict";

	
    var currentWidget = null;
   
	
	
    return {
	
		onLoad: function(widget) {
		  //Megamenu hide on Click Fix
		    currentWidget = widget;
		    setTimeout(function(){
		        $('.dropdown-toggle').parent().find('.dropdown-toggle').children().removeClass('greyColor');  
		    }, 500);
		    
		    $(".Level1 > span").removeClass('greyColor');
            $('body').on('click', '.subCatagoryLevel1 a, .brand-images a, .cc-desktop-dropdown .dropdown-toggle',  function(){
                $(".subCatagory").css("display", "none");
            });
		    $('body').on('mouseenter', '.cc-desktop-dropdown .dropdown-toggle', function(){
		        $(".subCatagory").css("display", "none");
                $(this).next().css("display", "block");
            });
            $('body').on('focus', '.cc-desktop-dropdown .dropdown-toggle', function(){
              $(".subCatagory").css("display", "none");
                  $(this).next().css("display", "block");
              });
            $('body').on('mouseleave', '.cc-desktop-dropdown .dropdown-toggle',  function(){
                $(this).next().css("display", "none");
            });
            $('body').on('mouseenter', '.subCatagory',  function(){
                $(this).css("display", "block");
            });
		  $('body').on('mouseleave', '.subCatagory',  function(){
                $(this).css("display", "none");
            });

            $('body').on( 'touchstart','.mobileProfilelogoutLinks', function(){
		        $("#CC-loginHeader-logout").trigger('click');
		    });
		      $('body').on('click','.mobileProfilelogoutLinks',  function(){
		        $("#CC-loginHeader-logout").trigger('click');
		    });
		    
		   $('body').on( 'touchstart', '.menu-close',function(){
		        $('.menu-close').trigger('click'); 
		    });
		    
		    $('body').on( 'mouseover','.dropdown-toggle', function(){
		           $('.dropdown-toggle').parent().find('.dropdown-toggle').children().addClass('greyColor');
		           $(this).parent().find('.dropdown-toggle').children().removeClass('greyColor');
		      
		    });
		      $('body').on( 'mouseleave','.dropdown-toggle', function(){
		        $('.dropdown-toggle').parent().find('.dropdown-toggle').children().removeClass('greyColor');
		    });
		  //Ends
	
		
		},
		
					
		    
		beforeAppear: function(page) {
		    var widget=this;
		    $("body").delegate("#mobile-navbar-link", "click", function(){
		       // widget.renderMobileMenuNew();
  
            });
             //if(page.pageId != 'home'){
                       widget.createSpinner();
                    $.Topic("Spinner.memory").publish('success');
                  // }
                   //Fix for double click hamburger menu
                setTimeout(function(){
    		        $('#page').addClass("site-outer");
    		          $('#mp-menu').pushMenu({
                        type: 'overlap',
                        levelSpacing: 0,
                        backClass: 'mp-back',
                        trigger: '.mobile-navbar-link',
                        pusher: '#page',
                        scrollTop: false
                    });
    		   },500)
 
		},
		destroySpinner: function() {
        //  //console.log("destroyed");
          $('#loadingModal').hide();
          spinner.destroy();
      },

     
          createSpinner: function() {
              var indicatorOptions = {
                  parent: '#loadingModal',
                  posTop: '0',
                  posLeft: '50%'
              };
              var loadingText = " ";
              $('#loadingModal').removeClass('hide');
              $('#loadingModal').show();
              indicatorOptions.loadingText = loadingText;
              spinner.create(indicatorOptions);
          },
		
		
    	showHelpCenterDetails:function(){
		     $('#help-center').toggle();
	  	}, 
	  	
		showMyaccountDetails:function(){
		    $('#myaccount-details').toggle();
		   
		},
		
 	    showLoggedInDetails:function(){
 	         $('#loggedin-details').toggle();
 	    },
		
		renderMobileMenuNew: function() {
		    $('#page').addClass("site-outer");
		   setTimeout(function(){
		          $('#mp-menu').pushMenu({
                    type: 'overlap',
                    levelSpacing: 0,
                    backClass: 'mp-back',
                    trigger: '.mobile-navbar-link',
                    pusher: '#page',
                    scrollTop: false
                });
		   },500)
    		 
		},
		

	
    };
  }
);