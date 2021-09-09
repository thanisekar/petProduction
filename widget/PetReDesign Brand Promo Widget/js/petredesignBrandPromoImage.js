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
	function (ko, r,ccConstants ) {
  
	  "use strict";
	  var getWidget = "";
	  var brandID=''
	  return {
		  kobrandID: ko.observable(''),
		  koCollectionData:ko.observableArray([]),
		   koBrandPromoForDesktop :ko.observable(''),
		   koBrandPromoForMobile:ko.observable(''),
		   koisPromoImage:ko.observable(false),
			koBrandRedirect :ko.observable(''),
		   onLoad: function(widget) {
			
			   
			
		  },
	  
  
		  beforeAppear: function(page) {      
			
			var widget=this;
			widget.koBrandPromoForDesktop('');
			widget.koBrandPromoForMobile('');
			if(page.contextId.indexOf('brand-') == 0){
				widget.koisPromoImage(true);
				if(page.contextId == 'brand-vittlesvault'){
					widget.koBrandRedirect('/vittlesvault');
				}else if(page.contextId == 'brand-gamma2'){
					widget.koBrandRedirect('/gamma2');
				}else if(page.contextId == 'brand-Chuckit'){
					widget.koBrandRedirect('/nationalfetchday');
				}else{
					widget.koBrandRedirect('');
				}
			}
			 
			  else{
				  widget.koisPromoImage(false);
			  }
			  
			  
			  
			  
			  if(widget.koisPromoImage()){
				  //console.log('promo' , widget.koisPromoImage())
				  if(widget.category().categoryImages.length>0){
				 /*     console.log(categoryImages ,'---categoryImages---');*/
					  for(var i=0;i<widget.category().categoryImages.length;i++){
						  if(widget.category().categoryImages[i].url.indexOf('desktop')!='-1'){
							  widget.koBrandPromoForDesktop(widget.category().categoryImages[i].url);
						  }
						  else if($(window.width<767)){
							   if(widget.category().categoryImages[i].url.indexOf('mobile')!='-1'){
								  widget.koBrandPromoForMobile(widget.category().categoryImages[i].url);
							  }
						  }
						  
					  }
				  }
			  }
			  else{
				  widget.koisPromoImage(false);
			  }
			
		  },
	   
	   
		  
	  };
	}
  );
  