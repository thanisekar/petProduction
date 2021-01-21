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
	var categoryItemsArray =[]; 
	var childLevel ="";
	var categoryName ="";
    var categoryroute ="";
    return {
        categoryDataModal: ko.observableArray([]),
        
		onLoad: function(widget) {
		   getWidget = widget;
		  
		},
		
		
		
		

		beforeAppear: function(page) {         
		   childLevel = getWidget.category().childCategories;
		   getWidget.categoryData();
	    
		},
		
	  categoryData : function(){
		     categoryItemsArray=[];
		     $.each(childLevel, function(k,v){
		      //console.log(".......vvvvvvv.......",v.displayName.slice(4))
		          categoryName = v.displayName.slice(4);
		          categoryroute = v.route;
		          
		      categoryItemsArray.push(new getWidget.categoryList(categoryName,categoryroute));
		      getWidget.categoryDataModal(categoryItemsArray);
		      
		  });
		          //console.log("....//////........///////..",getWidget.categoryDataModal())
          
		      },
		
		
		
		categoryList : function(categoryName,categoryroute){
              this.categoryName = categoryName;
              this.categoryroute = categoryroute;
          },  
	
		
    };
  }
);
