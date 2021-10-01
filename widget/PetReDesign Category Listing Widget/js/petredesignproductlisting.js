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
         $('body').delegate('.show_hide', 'click', function() {
		             var txt = $(".main-category-desc-txt p:not(:first)").is(':visible') ? 'Read More' : 'Read Less';
                        $(".show_hide").text(txt);
                        $('.main-category-desc-txt p:not(:first)').slideToggle(300);
                });
    },
     
    beforeAppear: function (page) {
        var widget = this;
    
        childLevel = getWidget.category().childCategories;
        
        getWidget.categoryData();
        setTimeout(function(){
            if($('.main-category-desc-txt p').length > 1){
		    $(".main-category-desc-txt p:not(:first)").css("display","none");
		    $('.show_hide').show();
    		}else{
    		    $(".main-category-desc-txt p:not(:first)").css("display","none");
    		    $('.show_hide').hide();
    		}
        },500)
        
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
