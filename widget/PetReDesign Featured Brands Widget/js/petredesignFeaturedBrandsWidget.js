/**
 * @fileoverview Petmate Carousel Widget.
 *
 * @author oracle
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'ccConstants', 'ccRestClient'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, r, i) {

    "use strict";
    var getWidget = "";
    var getSubChildCategories;
    var getBrandsId='';
    var brandRefinementResults='';
    return {
		kofeaturedBrandCollection: ko.observableArray([]),
		getChildCategoriesId: ko.observableArray([]),
		koGuidedNavigationStateAndNValue:ko.observableArray([]),
		getBrandsUrl:ko.observable(),
		
		updateData: function (getData) {
		    
	    	ko.mapping.fromJS(getData,{}, this.kofeaturedBrandCollection);
		
		},
		onLoad: function(widget) {
		    	getWidget=widget;
		    	//console.log(ko.toJS(widget), 'Widget,widget ,widget');
		    	//console.log(widget.brandsId(), 'brandsId ------ brandsId-----');
		    	if(widget.brandsId()!=null || widget.brandsId()!=undefined){
		    	   if( widget.brandsId().indexOf(',')!=-1){
		    	         getBrandsId=widget.brandsId().split(',');
		    	         widget.getBrandsDetails(getBrandsId);
		    	   }
		    	   else{
		    	         getBrandsId=widget.brandsId();
		    	        widget.getBrandsDetails(getBrandsId);
		    	   }
		    	   
		    	}
              
		},
       getBrandsDetails:function(){
             var l_c = {};
                        l_c["depth"] = "max";
                        var id = getWidget.brandsId().toString();
                         i.authenticatedRequest("/ccstoreui/v1/collections?categoryIds="+getWidget.brandsId().toString(), {}, function(data) {
                        		 getWidget.updateData(data);
                        		 //console.log("getWidget.koHeaderBrandCollectionNew ........", data );
                        		
                        	}, function(data) {}, "GET");
           
       },


		beforeAppear: function(page) {
		   // //console.log(page , 'pages');
		         
	    	},
		
	
		
    
    };
  }
);
