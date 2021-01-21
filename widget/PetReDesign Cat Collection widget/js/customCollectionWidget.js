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
	var getCatData='';
    return {
		koDealsModelData: ko.observableArray(),
		koDealsIsFlagData: ko.observableArray([]),
		koDealsModelTitle: ko.observable(false),
		customCurrencySymbol: ko.observable(),
		koCollectionData:ko.observableArray([]),
	
		updateData: function (getData) {
			ko.mapping.fromJS(getData,{}, this.koDealsModelData);
		    getCarouselWidget.getStockPrice(getData);
		
		},
		updateImageData: function (getData) {
			ko.mapping.fromJS(getData,{}, this.koDealsModelData);
		},
		
		onLoad: function(widget) {
		  //  console.log("cat collection.............")
			getCarouselWidget = widget;
		    
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
				if(refreshData || !storageApi.getInstance().getItem("catCarouselData")) {
					var dataUrl = ""	;
				   var url = window.location.hostname;
		   
		            var o = r.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
					u = {};
					u[r.CATEGORY] = getCarouselWidget.collectionId(), u.includeChildren = !0,u.limit=20;
                    u['fields'] = 'items.arrivalDate,items.onSale,items.promotext,items.primaryFullImageURL,items.route,items.displayName,items.listPrice,items.salePrice,items.startDateStr,items.id';
					i.request(o, u, function(e) {
					   var data1 = e.items;
    							for(var j=0;j<data1.length;j++){
                    		       var imagePath = data1[j].primaryFullImageURL.split('=');
                                   data1[j].primaryFullImageURL=imagePath[1];
            		            }
            		            	getCarouselWidget.updateData(data1);
					});

				} else {
					var getCatData = JSON.parse(storageApi.getInstance().getItem("catCarouselData"))
					getCarouselWidget.updateFeatureData(getCatData);
				}
            }
			
			 if(getCarouselWidget.enabled()) {
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
				  			   
			 }

		
		},

		beforeAppear: function(page) {
		        getPageId = page.pageId;
	    	},
		
		getStockPrice: function(getData) {
                var getProductIds = []
                $.each(getData, function( key2, value2 ) {
                  getProductIds.push(value2.id)
                })
           
                i.authenticatedRequest("/ccstoreui/v1/prices/products?ids="+getProductIds.toString(), {}, function(data) {
                   // //console.log('-----Pricing Call-------', data );
                     $.each(data, function( key3, value3 ) {
                        jQuery.each(value3, function(key4, value4) {
                          /*  if (value4.priceRange) {
                                  getData[key3].listPrice = getCarouselWidget.site().currency.symbol+value4.priceMin +" - "+ getCarouselWidget.site().currency.symbol+value4.priceMax;
                            } else {
                                if (value3.sale) {
                                    getData[key3].listPrice = getCarouselWidget.site().currency.symbol+value4.sale;
                                } else {
                                    getData[key3].listPrice = getCarouselWidget.site().currency.symbol+value4.list;
                                }
                            }*/
                            if (value4.priceRange) {
                                  getData[key3].minMaxPrice = getCarouselWidget.site().currency.symbol+value4.priceMin +" - "+ getCarouselWidget.site().currency.symbol+value4.priceMax;
                                   getData[key3].isminMaxprice=true;
                                   getData[key3].IslistPrice =false;
                            } 
                            else if(value4.sale!==null || value3.sale!==undefined ) {
                                      getData[key3].getSalePrice = getCarouselWidget.site().currency.symbol+value4.sale;
                                      getData[key3].isGetSalePrice=true;
                                      getData[key3].IslistPrice =false;
                                } 
                            else {
    
                                 getData[key3].listPrice = getCarouselWidget.site().currency.symbol+value4.list;
                                 getData[key3].isGetSalePrice=false;
                                 getData[key3].isminMaxprice=false;
                                 getData[key3].IslistPrice =true;
                            }
                        });
                        
                       
                        
                    })
                    storageApi.getInstance().setItem("catCarouselData", JSON.stringify(getData));
                     getCarouselWidget.updateFeatureData(getData);
                }, function(data) {}, "GET");
            },
       
        updateFeatureData: function(getData) {
               var salePrice;
                var isSalePrice=false;
                getCarouselWidget.koDealsModelData(getData);
                getCarouselWidget.koDealsIsFlagData([])
              
                var minutes = 1000 * 60;
                var hours = minutes * 60;
                var days = hours * 24;

                
              
                for(var i=0;i<getCarouselWidget.koDealsModelData().length;i++){
                    if (getData[i].hasOwnProperty('startDateStr')) {
                    var arrivalDate = getCarouselWidget.koDealsModelData()[i].startDateStr;
                    if(arrivalDate != null){  
                   
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    var newFlag = false;
                    
                    if(dd<10) {
                        dd='0'+dd
                    } 
                    
                    if(mm<10) {
                        mm='0'+mm
                    } 
                    
                   
                    today = yyyy+'-'+mm+'-'+dd;
                   
                    var todaysDate = new Date(today);
                    var CurrentDate = new Date(arrivalDate);
                    var diffDays = parseInt((todaysDate - CurrentDate) / (1000 * 60 * 60 * 24));
                 
                    if((diffDays > 0) && (diffDays <= 60)){
                        var newFlag = true;
                       
                    }
                    else{
                        var newFlag = false;
                       
                    }
                    }
                    else if(arrivalDate == null){
                            newFlag = false;
                        }
                    }
			        else {
                        newFlag = false;
                    }
                   // //console.log('sale price',getCarouselWidget.koDealsModelData()[i].salePrice);
                    salePrice = getCarouselWidget.koDealsModelData()[i].salePrice;
                    if(salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined'){
                        isSalePrice = true;
                       // //console.log('sale price called',isSalePrice)
                    }
                    else{
                        isSalePrice = false;
                        //console.log('no sale price',isSalePrice)
                    }
                    getCarouselWidget.koDealsModelData()[i].creationNewFlag = ko.toJS(ko.observable(newFlag));
                  
                    var newFlagProduct ={
                         'id':getCarouselWidget.koDealsModelData()[i].id ,
                         'isNewFlag':newFlag,
                         'isSaleFlag':isSalePrice
                     } 
                   
                     getCarouselWidget.koDealsIsFlagData.push(newFlagProduct);
                     
                }
                getCatData='';
                getCatData=getCarouselWidget.koDealsModelData();
                $.Topic("HOME_CAT_BV").publish(getCatData);
            }
    };
  }
);
