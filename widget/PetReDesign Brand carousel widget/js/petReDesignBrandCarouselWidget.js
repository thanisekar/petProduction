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
  ['jquery', 'knockout', 'ccConstants', 'ccRestClient', 'storageApi', 'js/jQuery.owl.carousel', 'js/knockout.owlCarousel'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, r, i, storageApi) {

    "use strict";
	var getCarouselWidget = "";
	var getPageId = "";
	var getWidget = "";
	var dataLayer = [];
	var getSubChildCategories;
    var getBrandsData
    var brandRefinementResults='';
    return {
		koDealsModelData: ko.observableArray(),
		koDealsIsFlagData: ko.observableArray([]),
		koDealsModelTitle: ko.observable(false),
		customCurrencySymbol: ko.observable(),
		koCollectionData:ko.observableArray([]),
	    koBrandCollectionData: ko.observableArray(),
		getChildCategoriesId: ko.observableArray([]),
		koGuidedNavigationStateAndNValue:ko.observableArray([]),
		getBrandsUrl:ko.observable(),
		updateData: function (getData) {
		      ko.mapping.fromJS(getData,{}, this.koBrandCollectionData);
  		},
		updateImageData: function (getData) {
			ko.mapping.fromJS(getData,{}, this.koDealsModelData);
		},
		
		onLoad: function(widget) {
			getWidget=widget;
			
			var lastDataCacheTimeStamp = storageApi.getInstance().getItem("lastDataCacheTimeStamp");
			if(!lastDataCacheTimeStamp) {
				lastDataCacheTimeStamp = 0;
			}
			
			function checkAndCacheData(refreshData) {
				if(refreshData) {
					var d = new Date();
					var n = d.getTime();
					storageApi.getInstance().setItem("lastDataCacheTimeStamp", n);
					
				}
				if(true || refreshData || !storageApi.getInstance().getItem("brandCarouselData")) {
					var l_c = {};
					l_c["depth"] = "25";
					l_c["fields"] = "childCategories,route,childCategories.id,childCategories.route,childCategories.displayName,childCategories.categoryImages";
					 var id = getWidget.collectionId();
					 
					 i.request(r.ENDPOINT_COLLECTIONS_GET_COLLECTION,{}, function(data) {
					   //  console.log(data , 'categoryImages-----')
						 storageApi.getInstance().setItem("brandCarouselData", JSON.stringify(data.childCategories));
					 	getWidget.updateData(data.childCategories);
				  
					 }, function(e1) {
					   
					}, id);

				} else {
					var getBrandData = JSON.parse(storageApi.getInstance().getItem("brandCarouselData"))
					getWidget.updateData(getBrandData);
				}
            }
			
			
			
                
             i.authenticatedRequest("/ccstoreui/v1/publish",{},
				function(data) {
					var clearCache = false;
					if((data.lastPublishedTimeStamp * 1) >  (lastDataCacheTimeStamp * 1)) {
						clearCache = true;
					}
					checkAndCacheData(clearCache);
				}, function(data) {
					checkAndCacheData(true);
				});   
              
		},

		beforeAppear: function(page) {
		        getPageId = page.pageId;
	    	},
	
    };
  }
);
