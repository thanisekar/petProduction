define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi', 'pubsub'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, ccRestClient, ccConstants, storageApi, pubsub) {

        "use strict";
        var newRoute = "";
        var productIds = '';
        var getWidget = "";
        var dataLayer = [];
        var bvData = '';
        // properties defined in the return are the actual module
        return {
            // BEGIN Copied from the collection widget
            itemsPerRowInLargeDesktopView: ko.observable(6),
            itemsPerRowInDesktopView: ko.observable(6),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(1),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),

            koDealsModelData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),
            variantOptionsArray: ko.observableArray([]),

            // END Copied from the collection widget

            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koDealsModelData);
                getWidget.getStockPrice(getData);
               

            },
            getProductDetails: function(getProductId) {
               
                var widget = this;
                 widget.getCarouselArrow();
                ccRestClient.authenticatedRequest("/ccstoreui/v1/products/?productIds=" + getProductId.toString() + "&fields=route,childSKUs,displayName,primarySmallImageURL,description,id,startDateStr,isGetSalePrice,listPrice,onSale,promotext,x_freeShippingRibbon,salePrice", {}, function (e) {
                    widget.updateData(e);
                    console.log("e-->",e);
                }, function(data) {}, "GET");
                
            },
            getStockPrice: function(getData) {
                if (getWidget.productId() !== null) {
                    if (getWidget.productId().indexOf(',') != -1) {
                        var prodId = getWidget.productId().split(',');
                        getWidget.koProductId(prodId);

                    } else {
                        var prodId = getWidget.productId();
                        getWidget.koProductId(prodId);
                    }
                }
                
                ccRestClient.authenticatedRequest("/ccstoreui/v1/prices/products?ids=" + getWidget.koProductId().toString(), {}, function(data) {
                    $.each(data, function(key3, value3) {
                        $.each(value3, function(key4, value4) {
                            if (value4.priceRange) {
                                getData[key3].minMaxPrice = getWidget.site().currency.symbol + value4.priceMin + " - " + getWidget.site().currency.symbol + value4.priceMax;
                                getData[key3].isminMaxprice = true;
                                getData[key3].IslistPrice = false;
                            } else if (value4.sale !== null || value3.sale !== undefined) {
                                getData[key3].getSalePrice = getWidget.site().currency.symbol + value4.sale;
                                getData[key3].isGetSalePrice = true;
                                getData[key3].IslistPrice = false;
                            } else {

                                getData[key3].listPrice = getWidget.site().currency.symbol + value4.list;
                                getData[key3].isGetSalePrice = false;
                                getData[key3].isminMaxprice = false;
                                getData[key3].IslistPrice = true;
                            }
                        });



                    })
                    storageApi.getInstance().setItem("catCarouselData", JSON.stringify(getData));
                    getWidget.updateFeatureData(getData);
                }, function(data) {}, "GET");
            },

            updateFeatureData: function(getData) {

                var salePrice;
                var isSalePrice = false;
                var productIDs = [];
                getWidget.koDealsModelData(getData);
                getWidget.koDealsIsFlagData([])

                var minutes = 1000 * 60;
                var hours = minutes * 60;
                var days = hours * 24;



                for (var i = 0; i < getWidget.koDealsModelData().length; i++) {
                    
                    productIDs.push(getWidget.koDealsModelData()[i].id);
                    if(getWidget.koDealsModelData().length === productIDs.length ){
                        $.Topic("HOME_BV.memory").publish(productIDs);
                    }
                    
                    if (getData[i].hasOwnProperty('startDateStr')) {
                        var arrivalDate = getWidget.koDealsModelData()[i].startDateStr;
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
                    // //console.log('sale price',getWidget.koDealsModelData()[i].salePrice);
                    salePrice = getWidget.koDealsModelData()[i].salePrice;
                    if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                        isSalePrice = true;
                        // //console.log('sale price called',isSalePrice)
                    } else {
                        isSalePrice = false;
                        //console.log('no sale price',isSalePrice)
                    }
                    getWidget.koDealsModelData()[i].creationNewFlag = ko.toJS(ko.observable(newFlag));

                    var newFlagProduct = {
                        'id': getWidget.koDealsModelData()[i].id,
                        'isNewFlag': newFlag,
                        'isSaleFlag': isSalePrice
                    }
                    getWidget.koDealsIsFlagData.push(newFlagProduct);
                }
                /*bvData='';
                bvData=getWidget.koDealsModelData();
              
              $.Topic("HOME_BV").publish(bvData);*/
            },

            /*GetBVCollections: function() {
                $.Topic("HOME_BV.memory").publish(productIds);
            },*/

            onLoad: function(widget) {

                getWidget = widget;
                
                

                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();

                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
                    var groups = [];
                    if (widget.koDealsModelData) {
                        for (var i = 0; i < widget.koDealsModelData().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                ////console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koDealsModelData()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koDealsModelData()[i]);
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
                $("body").delegate(".collectionProdCarousel-p", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow()
                });
                $("body").delegate(".collectionfatCatCarousel", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrowFatCat()
                });
            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function(page) {
                getWidget.getProductIds();
            },
            
           handleAddToCartRecommendation: function(data, event) {
                console.log(data,'Home data');

               var getRepProductId = data.id;
                //var replaceQty = $("#CC-prodDetails-quantity" + getRepProductId).val();
                var replaceQty = 1;
                /*if (parseInt(replaceQty) < 1) {
                    return;
                }*/

                var a = ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
                var l = {};
                var p = getRepProductId;
                var output = [];
                ccRestClient.request(a, l, function(output) {
                    var skuItem = {};
                    /*for (var index in output.childSKUs) {
                        console.log(getRepProductId,'getRepProductId');
                        console.log(output.childSKUs[index].repositoryId,'output.childSKUs[index].repositoryId');
                        if (getRepProductId == output.childSKUs[index].repositoryId) {
                            skuItem = output.childSKUs[index];
                            console.log(skuItem,'skuItem');
                        }
                    }*/
                    skuItem = output.childSKUs[0];
                    var t1 = [];
                    var result = {};
                    for (var variant in output.productVariantOptions) {
                        t1.push({
                            optionValue: skuItem[output.productVariantOptions[variant].optionId],
                            optionId: output.productVariantOptions[variant].optionId,
                        });
                    }

                    result = {
                        selectedOptions: t1
                    };


                    var s = $.extend(!0, {}, output, result);
                    //var rquantity =1;
                    s.childSKUs = [skuItem], s.orderQuantity = parseInt(replaceQty, 10);
                    $.Topic(pubsub.topicNames.CART_ADD).publishWith(s, [{
                        message: "success"
                    }]);


                }, function(output) {

                }, p);
                if ($(window).width() >= 1025) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $('#mobilAddCart').modal('hide')
                } else if ($(window).width() < 1025) {
                    $('#mobilAddCart').modal('show')
                }
                $(window).on('resize', function() {
                    var win = $(this); //this = window
                    if (win.width() >= 1025) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $('#mobilAddCart').modal('hide')
                    }

                });
               
            
            },
            
            truncate:function(string){
                 console.log(string(),'string');
                 var getString;
        			   getString=string();
        			   if(getString){
        			        if (string().length > 155 )
                           {
                             getString= string().substring(0,155)+'...'; 
                               return getString;
                           }
                           else{
                                return getString;
                           }
        			   }
                       
             
                 },
            
            newMonthDisplay: function(data) {
                if(data.startDateStr() !==null && data.startDateStr() !== "") {
                    var startDateArr = data.startDateStr().split("-");
                       var shortMon =["Jan","Feb", "Mar", "Apr","May" ,"Jun" ,"Jul" ,"Aug", "Sep" ,"Oct", "Nov","Dec"];
                     
                     var startDateFormat = shortMon[(parseInt(startDateArr[1])-1)]+" "+startDateArr[2]+", "+startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }
                
            },
            getCarouselArrow: function () {
                if ($('.home-carousel-p .item').length > 0) {
                    $('#cc-carousel-controls-p a').removeClass('disabled');
                     $('.home-carousel-p a').removeClass('disabled');
                    if ($(".home-carousel-p .item:first").hasClass("active")) {
                        $('#cc-carousel-left-control-p .corousel-left').addClass('disabled');
                        $('#cc-carousel-left-control-m .corousel-left').addClass('disabled');
                    } else if ($(".home-carousel-p .item:last").hasClass("active")) {
                        $('#cc-carousel-right-control-p .corousel-right').addClass('disabled');
                        $('#cc-carousel-right-control-m .corousel-right').addClass('disabled');
                    } else {
                        $('#cc-carousel-controls-p a').removeClass('disabled');
                         $('.home-carousel-p a').removeClass('disabled');
                    }
                }
            },
            getCarouselArrowFatCat: function () {
                if ($('.fatCat-carousel .item').length > 0) {
                    $('#cc-carousel-controls a').removeClass('disabled');
                    if ($(".fatCat-carousel .item:first").hasClass("active")) {
                        $('#cc-carousel-left-control .corousel-left').addClass('disabled');
                    } else if ($(".fatCat-carousel .item:last").hasClass("active")) {
                        console.log('No');
                        $('#cc-carousel-right-control .corousel-right').addClass('disabled');
                    } else {
                        $('#cc-carousel-controls a').removeClass('disabled');
                    }
                }
            },
            getProductIds: function() {
                if (getWidget.productId() !== null) {
                    if (getWidget.productId().indexOf(',') != -1) {
                        productIds = getWidget.productId().split(',');
                        getWidget.getProductDetails(productIds);

                    } else {
                        productIds = getWidget.productId();
                        getWidget.getProductDetails(productIds);
                    }
                }
            },
        };
    }
);
