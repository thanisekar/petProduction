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
        koDisplayCategoryURL:ko.observableArray([]),
		onLoad: function(widget) {
		     
		},

		beforeAppear: function(page) {         
			var widget=this;
	            //console.log(widget.category().fixedParentCategories , 'fixedparentcategoriesinMaincategory')
		   
		   
		    for(var i=0; i<widget.category().fixedParentCategories.length;i++){
		           //console.log(widget.category().fixedParentCategories[i].route , 'fixedparentcategories')
		          if(widget.category().fixedParentCategories[i].route.indexOf('cat')!='-1'){
		              widget.koDisplayCategoryURL([]);
		                widget.koDisplayCategoryURL.push({
		                         "route":'/cats/category/cats',
		                         "displayName":"Cats"  
		                      });
		          }
		           if(widget.category().fixedParentCategories[i].route.indexOf('bird')!='-1'){
		                widget.koDisplayCategoryURL([]);
		               widget.koDisplayCategoryURL.push({
		                         "route":'/birds-small-pets/category/birds',
		                         "displayName":"Birds & small pets"  
		                      });
		          }
		           if(widget.category().fixedParentCategories[i].route.indexOf('dog')!='-1'){
		                widget.koDisplayCategoryURL([]);
		                widget.koDisplayCategoryURL.push({
		                         "route":'/dogs/category/dogs',
		                         "displayName":"Dogs"  
		                      });
		          }
		           if(widget.category().fixedParentCategories[i].route.indexOf('petmate-brands')!='-1'){
		                widget.koDisplayCategoryURL([]);
		                widget.koDisplayCategoryURL.push({
		                         "route":'/brands/category/petmate-brands',
		                         "displayName":"Brands"  
		                      });
		          }
		    }
		    
		    
		},
		
	
	
		
    };
  }
);
