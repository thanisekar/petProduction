/**
 * @fileoverview Footer Widget.
 *
 * @author Taistech
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['knockout'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko) {

    "use strict";
	var getWidget = "";
    
    return {
        isBrandPage : ko.observable(false),
		onLoad: function(widget) {
		    getWidget = widget;
		    $('body').delegate('.show_hide', 'click', function() {
		             var txt = $(".plpCategoryDescription p:not(:first)").is(':visible') ? 'Read More' : 'Read Less';
                        $(".show_hide").text(txt);
                        $('.plpCategoryDescription p:not(:first)').slideToggle(300);
                });
		},

		beforeAppear: function(page) {         
		//	console.log("page",page);
		//	console.log("getWidget",getWidget)
		if($('.plpCategoryDescription p').length > 1){
		    $(".plpCategoryDescription p:not(:first)").css("display","none");
		    $('.show_hide').show();
		}else{
		    $(".plpCategoryDescription p:not(:first)").css("display","none");
		    $('.show_hide').hide();
		}
			if(page.contextId.indexOf("brand") != -1){
			    
			  //  console.log("brand page")
			    getWidget.isBrandPage(true);
			}
			else{
			  //  console.log("category page")
			    getWidget.isBrandPage(false);  
			}
	    
		},
		
	
	
		
    };
  }
);
