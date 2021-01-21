define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi',],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, i, ccConstants, storageApi) {

        "use strict";
        var productIds = '';
        var getWidget = "";
        var dataLayer = [];
        var bvData = '';
        var getData = "";
        var len = "";
        // properties defined in the return are the actual module
        return {
            // BEGIN Copied from the collection widget
            itemsPerRowInLargeDesktopView: ko.observable(6),
            itemsPerRowInDesktopView: ko.observable(6),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(2),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),

            koDealsModelData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),
            koRelatedItems: ko.observableArray(),
            koRelatedProdtIsFlagData: ko.observableArray([]),
            isSalePriceExist:ko.observable(false),

            // END Copied from the collection widget

            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koDealsModelData);
                getWidget.getStockPrice(getData);


            },
            updateDataRelated: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koRelatedItems);

                getWidget.getStockPrice();
            },
            
            onLoad: function(widget) {
                getWidget = widget;

              
                $.Topic('relatedProducts').subscribe(function() {
                    getWidget.koRelatedItems([]);
                    getData = getWidget.product().relatedProducts;
                    // to split up the image path URL 
                    if (getData != null || getData != undefined) {
                        var imagePath= "";
                        for (var j = 0; j < getData.length; j++) {
                             imagePath = getData[j].primaryFullImageURL.split("=");
                            getData[j].primaryFullImageURL = ko.observable(imagePath[1]);
                            
                        }
                    }
                    getWidget.updateDataRelated(getData);
                      
                });


            
                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();

                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
                    var groups = [];
                    if (widget.koRelatedItems() != null) {
                        for (var i = 0; i < widget.koRelatedItems().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                ////console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koRelatedItems()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koRelatedItems()[i]);
                            }
                        }
                    }
                    return groups;

                }, widget);

                widget.updateSpanClass = function() {
                    var classString = "";
                    var phoneViewItems = 0,
                        tabletViewItems = 0,
                        desktopViewItems = 0,
                        largeDesktopViewItems = 0;
                    ////console.log(this.itemsPerRow(),'----Test---');
                    if (this.itemsPerRow() == this.itemsPerRowInPhoneView()) {
                        phoneViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInTabletView()) {
                        tabletViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInDesktopView()) {
                        desktopViewItems = 12 / this.itemsPerRow();
                        ////console.log(desktopViewItems,'---desktopViewItems---')
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInLargeDesktopView()) {
                        largeDesktopViewItems = 12 / this.itemsPerRow();
                    }
                    if (phoneViewItems > 0) {
                        classString += "col-xs-" + phoneViewItems;
                    }
                    if ((tabletViewItems > 0) && (tabletViewItems != phoneViewItems)) {
                        classString += " col-sm-" + tabletViewItems;
                    }
                    if ((desktopViewItems > 0) && (desktopViewItems != tabletViewItems)) {
                        classString += " col-md-" + desktopViewItems;
                    }
                    if ((largeDesktopViewItems > 0) && (largeDesktopViewItems != desktopViewItems)) {
                        classString += " col-lg-" + largeDesktopViewItems;
                    }

                    widget.spanClass(classString);
                };
                /**
                 * Checks the size of the current viewport and sets the viewport and itemsPerRow
                 * mode accordingly
                 */
                widget.checkResponsiveFeatures = function(viewportWidth) {
                    if (viewportWidth > ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.LARGE_DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.LARGE_DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInLargeDesktopView());
                        }
                    } else if (viewportWidth > ccConstants.VIEWPORT_TABLET_UPPER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInDesktopView());
                        }
                    } else if (viewportWidth >= ccConstants.VIEWPORT_TABLET_LOWER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.TABLET_VIEW) {
                            widget.viewportMode(ccConstants.TABLET_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInTabletView());
                        }
                    } else if (widget.viewportMode() != ccConstants.PHONE_VIEW) {
                        widget.viewportMode(ccConstants.PHONE_VIEW);
                        widget.itemsPerRow(widget.itemsPerRowInPhoneView());
                    }
                    widget.updateSpanClass();
                };

                widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                $(window).resize(
                    function() {
                        widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                        widget.viewportWidth($(window)[0].innerWidth || $(window).width());
                    });

                $("body").delegate(".pdpProdCarousel", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow()
                });
            },

            beforeAppear: function(page) {
                $.Topic("relatedProducts").publish();
                
            },
            

            getStockPrice: function() {
				 var getProductIds = []
				 if(getWidget.koRelatedItems() != '' && getWidget.koRelatedItems() != undefined && getWidget.koRelatedItems() != null){
                $.each(getWidget.koRelatedItems(), function( key2, value2 ) {
                  getProductIds.push(value2.id())
                })
				 }
				i.authenticatedRequest("/ccstoreui/v1/prices/products?ids="+getProductIds.toString(), {}, function(data) {
				     if(data != '' && data != undefined && data != null){
					 $.each(data, function(index) {
						 var mainIndex = index;
						$.each(data[index], function(key, priceoutput) {
							if (priceoutput.priceRange) {
								  getWidget.koRelatedItems()[mainIndex].listPrice(getWidget.site().currency.symbol + priceoutput.priceMin + " - " + getWidget.site().currency.symbol + priceoutput.priceMax);
							} else {
								if (priceoutput.sale) {
									getWidget.koRelatedItems()[mainIndex].salePrice(getWidget.site().currency.symbol + priceoutput.sale);
								} else {
									getWidget.koRelatedItems()[mainIndex].listPrice(getWidget.site().currency.symbol + priceoutput.list);
								}
							}
						});

					});
				}
                     getWidget.updateFeatureData();
                     
                }, function(data) {}, "GET");
				
				

               
            },
			
			updateFeatureData: function() {
               var salePrice;
                var isSalePrice=false;
                getWidget.koRelatedProdtIsFlagData([])
              
                var minutes = 1000 * 60;
                var hours = minutes * 60;
                var days = hours * 24;
                
              if(getWidget.koRelatedItems() != '' && getWidget.koRelatedItems() != undefined && getWidget.koRelatedItems() != null){
                for (var i = 0; i < getWidget.koRelatedItems().length; i++) {
                        if (getWidget.koRelatedItems()[i].hasOwnProperty('startDateStr')) {
                            var arrivalDate = getWidget.koRelatedItems()[i].startDateStr();
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
                     
                        salePrice = ko.toJS(getWidget.koRelatedItems()[i].salePrice);
                        if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                            isSalePrice = true;
                           
                        } else {
                            isSalePrice = false;
                           
                        }
                        getWidget.koRelatedItems()[i].creationNewFlag = ko.toJS(ko.observable(newFlag));
                        var newFlagProduct = {
                            'id': getWidget.koRelatedItems()[i].id,
                            'isNewFlag': newFlag,
                            'isSaleFlag': isSalePrice
                        }
                        getWidget.koRelatedProdtIsFlagData.push(newFlagProduct);
                    }
                    getWidget.getCarouselArrow();
              }
            },

            
            getCarouselArrow: function() {
                if ($('.carousel-pdp .item').length > 0) {
                    $('#cc-carousel-controls-pdp a').removeClass('disabled');
                    
                    if ($(".carousel-pdp .item:first").hasClass("active")) {
                      
                        $('#cc-carousel-left-control-pdp .corousel-left').addClass('disabled');
                    } else if ($(".carousel-pdp .item:last").hasClass("active")) {
                     
                        $('#cc-carousel-right-control-pdp .corousel-right').addClass('disabled');
                    } else {
                        
                        $('#cc-carousel-controls-pdp a').removeClass('disabled');
                    } 
                }
            }
        };
    }
);