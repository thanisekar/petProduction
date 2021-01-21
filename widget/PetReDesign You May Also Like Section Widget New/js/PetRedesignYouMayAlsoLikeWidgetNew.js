/**
 * @fileoverview petmate Carousel Widget
 * 
 * @author oracle
 */
define(
    ['jquery', 'knockout', 'ccConstants', 'ccRestClient', 'js/jQuery.owl.carousel', 'js/knockout.owlCarousel'],
    function($, ko, r, i) {
        'use strict';
        var getCarouselWidget = "";
        var getPageId = "";
        var getData = "";
        var len = "";
        return {
            koRelatedItems: ko.observableArray(),
            koRelatedProdtIsFlagData: ko.observableArray([]),
            isSalePriceExist:ko.observable(false),
            // On Load
            onLoad: function(widget) {
                getCarouselWidget = widget;
                $.Topic('relatedProducts').subscribe(function() {
                    getCarouselWidget.koRelatedItems([]);
                    getData = getCarouselWidget.product().relatedProducts;
                    // to split up the image path URL 
                    if (getData != null || getData != undefined) {
                        for (var j = 0; j < getData.length; j++) {
                            var imagePath = getData[j].primaryFullImageURL.split('=');
                            getData[j].primaryFullImageURL = ko.observable(imagePath[1]);
                        }
                    }
                    getCarouselWidget.updateData(getData);
                      
                });


            },

            //Before appear of the page
            beforeAppear: function(page) {
                getPageId = page.pageId;

                $.Topic("relatedProducts").publish();

            },

            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koRelatedItems);

                getCarouselWidget.getStockPrice();
            },
            getStockPrice: function() {
				 var getProductIds = []
                $.each(getCarouselWidget.koRelatedItems(), function( key2, value2 ) {
                  getProductIds.push(value2.id())
                })
				
				i.authenticatedRequest("/ccstoreui/v1/prices/products?ids="+getProductIds.toString(), {}, function(data) {
					 $.each(data, function(index) {
						 var mainIndex = index;
						$.each(data[index], function(key, priceoutput) {
							if (priceoutput.priceRange) {
								  getCarouselWidget.koRelatedItems()[mainIndex].listPrice(getCarouselWidget.site().currency.symbol + priceoutput.priceMin + " - " + getCarouselWidget.site().currency.symbol + priceoutput.priceMax);
							} else {
								if (priceoutput.sale) {
									getCarouselWidget.koRelatedItems()[mainIndex].salePrice(getCarouselWidget.site().currency.symbol + priceoutput.sale);
								} else {
									getCarouselWidget.koRelatedItems()[mainIndex].listPrice(getCarouselWidget.site().currency.symbol + priceoutput.list);
								}
							}
						});

					});
                     
                     getCarouselWidget.updateFeatureData();
                }, function(data) {}, "GET");
				
				

               
            },
			
			updateFeatureData: function() {
               var salePrice;
                var isSalePrice=false;
                getCarouselWidget.koRelatedProdtIsFlagData([])
              
                var minutes = 1000 * 60;
                var hours = minutes * 60;
                var days = hours * 24;
                
              
                for (var i = 0; i < getCarouselWidget.koRelatedItems().length; i++) {
                        if (getCarouselWidget.koRelatedItems()[i].hasOwnProperty('startDateStr')) {
                            var arrivalDate = getCarouselWidget.koRelatedItems()[i].startDateStr();
                            if (arrivalDate != null) {
                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                                var newFlag = false;

                                if (dd < 10) {
                                    dd = '0' + dd
                                }

                                if (mm < 10) {
                                    mm = '0' + mm
                                }
                                today = yyyy + '-' + mm + '-' + dd;
                                var todaysDate = new Date(today);
                                var CurrentDate = new Date(arrivalDate);
                                var diffDays = parseInt((todaysDate - CurrentDate) / (1000 * 60 * 60 * 24));
                                if ((diffDays > 0) && (diffDays <= 30)) {
                                    var newFlag = true;
                                } else {
                                    var newFlag = false;
                                }
                            } else if (arrivalDate == null) {
                                newFlag = false;
                            }
                        } else {
                            newFlag = false;
                        }
                     
                        salePrice = ko.toJS(getCarouselWidget.koRelatedItems()[i].salePrice);
                        if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                            isSalePrice = true;
                           
                        } else {
                            isSalePrice = false;
                           
                        }
                        getCarouselWidget.koRelatedItems()[i].creationNewFlag = ko.toJS(ko.observable(newFlag));
                        var newFlagProduct = {
                            'id': getCarouselWidget.koRelatedItems()[i].id,
                            'isNewFlag': newFlag,
                            'isSaleFlag': isSalePrice
                        }
                        getCarouselWidget.koRelatedProdtIsFlagData.push(newFlagProduct);
                    }
              
            }


        }

    });