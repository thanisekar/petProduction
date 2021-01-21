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
  function (ko , ccRestClient ,ccConstants ) {

    "use strict";
	 var getWidget = "";
	 var brandRefinementResults='';
    return {
        koCategoryData:ko.observable(),
        koGuidedNavigationStateAndNValue:ko.observableArray([]),
        kofinalCategories:ko.observableArray([]),
		onLoad: function(widget) {
		 
		},

		beforeAppear: function(page) {         
			
	    
		},
       
    };
  }
);
