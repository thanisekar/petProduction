/**
 * @fileoverview Petmate Widget.
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
	var getWidget="";
    return {
		
	    bannerImage : ko.observable(),
	    bannerText1 : ko.observable(),
		onLoad: function(widget) {
		    var tempVar = "";
			getWidget = widget;
			tempVar = getWidget.bannerImage();
			getWidget.bannerImage(tempVar);
			//console.log(banImage,'---Test 123---');
			//console.log(ko.toJS(widget),"---ABC---");
			
			
			var label;
			label = getWidget.bannerText1();
			getWidget.bannerText1(label);
			
		},

		beforeAppear: function(page) {
		 
		},
		
		
		
	
		
		
    };
  }
);
