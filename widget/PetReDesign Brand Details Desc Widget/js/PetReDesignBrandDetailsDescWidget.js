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
  ['knockout','ccRestClient','ccConstants'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, ccRestClient,ccConstants ) {

    "use strict";
	var getWidget = "";
	var brandID=''
    return {
        kogetBrandPageId:ko.observable(''),
		onLoad: function(widget) {
		        getWidget=widget;
		    
		},
		beforeAppear: function(page) {
		    var widget =this;
		    
		    if(page.contextId.indexOf('brand-') == 0){
		        widget.kogetBrandPageId(page.contextId);
		    }
		    else{
		         widget.kogetBrandPageId('');
		    }
		    
		},
	
	
		
    };
  }
);
