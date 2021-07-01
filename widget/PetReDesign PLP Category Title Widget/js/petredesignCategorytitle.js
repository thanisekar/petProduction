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
         kogetBrandPageId:ko.observable(true),
		onLoad: function(widget) {
		},

		beforeAppear: function(page) {         
			  var widget=this;
			if(page.contextId.indexOf('brand-') == 0){
		        widget.kogetBrandPageId(false);
		    }
		    else{
		         widget.kogetBrandPageId(true);
		    }
	    
		},
		
	
	
		
    };
  }
);
