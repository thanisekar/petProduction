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

    return {
        koCategoryPromo :ko.observable(''),
		onLoad: function(widget) {
		},
	

		beforeAppear: function(page) { 

		},
	  handlePromoBanner: function(){
                var  widget = this;
		      //console.log(widget.category() , 'categoryIn promo banner');
		    if(widget.category().categoryImages.length>0){
		        for(var i=0;i<widget.category().categoryImages.length;i++){
		          //  //console.log(widget.category().categoryImages[i] , "widget.category().categoryImages")
		          if(widget.category().categoryImages[i].url != null){
		            if(widget.category().categoryImages[i].url.indexOf('promo')!='-1'){
		                widget.koCategoryPromo(widget.category().categoryImages[i].url);
		              //  //console.log( widget.category().categoryImages[i].url, 'widget.category().categoryImages()[i].url');
		            }else{
		                widget.koCategoryPromo('');
		            }
		          }
		            
		        }
		    }
		
		
		},
	
		
    };
  }
);
