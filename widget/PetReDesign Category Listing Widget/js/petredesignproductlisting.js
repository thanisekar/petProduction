define(['knockout','jquery',
  'ccConstants', 'pubsub' , 'storageApi','ccRestClient'], 

function(ko, $, CCConstants, pubsub , storageApi,ccRestClient) {  
  
  "use strict";
  var categoryItemsArray =[]; 
  var childLevel ="";
  var categoryName ="";
  var categoryroute ="";
  var getWidget = "";
  var categoryImagePath="";
  return {
    categoryDataModal: ko.observableArray([]),
    WIDGET_ID: 'categoryListing',
    onLoad: function(widget) {
         getWidget = widget;
    },
     
    beforeAppear: function (page) {
        var widget = this;
    
        childLevel = getWidget.category().childCategories;
        
        getWidget.categoryData();
        
     },
     categoryData : function(){
		     categoryItemsArray= [];
		     $.each(childLevel, function(k,v){
		          categoryName = v.displayName.slice(4);
		          categoryroute = v.route;
		          categoryImagePath = v.categoryImages[0].url;
		          
		      categoryItemsArray.push(new getWidget.categoryList(categoryName,categoryroute,categoryImagePath));
		      getWidget.categoryDataModal(categoryItemsArray);
		      
		  });
		         
		      },
		
 	categoryList : function(categoryName,categoryroute,categoryImagePath){
              this.categoryName = categoryName;
              this.categoryroute = categoryroute;
              this.categoryImagePath = categoryImagePath;
          },  
     
    
   
    
    
    
  };
});
