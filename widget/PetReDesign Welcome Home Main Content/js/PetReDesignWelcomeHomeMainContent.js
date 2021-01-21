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
	var value="";
    return {
        embededUrl: ko.observableArray([]),

		onLoad: function(widget) {
		    if(widget.VideoID()!==null){
                 if(widget.VideoID().indexOf(',')!=-1){
                  value = widget.VideoID().split(',');
                  for(var i=0; i < value.length; i++){
                      widget.embededUrl.push(value[i]);
                  }
                 } 
                 else{
                      value = widget.VideoID();
                      widget.embededUrl.push(value);
                 }
            }
		},

		beforeAppear: function(page) {         

	    
		}
		
	
	
		
    };
  }
);
