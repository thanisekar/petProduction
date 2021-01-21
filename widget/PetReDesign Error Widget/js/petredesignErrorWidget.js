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
        getBrandDetails:ko.observable(),
        isBrandExist:ko.observable(false),
		onLoad: function(widget) {
		},

		beforeAppear: function(page) {  
		  //  console.log(page ,'---- page---');
		 //   console.log(page.pageId , '---page---');
		    var widget=this;
		    var getPage =window.location.pathname;
		    if(getPage.includes('brand')) 
		     {
		         widget.getBrandDetails(widget.category());
		         widget.isBrandExist(true);
		         }
		    else{
		          widget.isBrandExist(false);
		    }
			       // console.log(widget.category() , 'widget.category()');
			       
			       // console.log(widget.getBrandDetails() , '---getBrandDetails----');
	         },
	        	
		
		
		
    };
  }
);
