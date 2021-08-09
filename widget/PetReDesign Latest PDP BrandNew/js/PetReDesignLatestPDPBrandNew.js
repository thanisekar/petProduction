/**
 * @fileoverview Product Details Widget.
 * 
 */
define(

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'jquery', 'pubsub', 'ccConstants', 'koValidate', 'notifier', 'CCi18n', 'storeKoExtensions', 'swmRestClient', 'spinner', 'pageLayout/product', 'ccRestClient', 'pinitjs', 'ccResourceLoader!global/petmateJquery.slimscroll'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, $, pubsub, CCConstants, koValidate, notifier, CCi18n, storeKoExtensions, swmRestClient, spinner, product, ccRestClient, pinitjs) {


        "use strict";
        var productIds = '';
        var getWidget = "";
        var widgetModel;
        var getData = [];
        var getCurrentData = [];
        var getYouTubePath;
        var breadCrumb = "";
        var addProductId = "";
        //var dataLayer = [];

        var LOADED_EVENT = "LOADED";
        var LOADING_EVENT = "LOADING";

        var productLoadingOptions = {
            parent: '#cc-product-spinner',
            selector: '#cc-product-spinner-area'
        };

        var resourcesAreLoaded = false;
        var resourcesNotLoadedCount = 0;
        var resourcesMaxAttempts = 5;

        var mySpacesComparator = function(opt1, opt2) {
            if (opt1.spaceNameFull() > opt2.spaceNameFull()) {
                return 1;
            } else if (opt1.spaceNameFull() < opt2.spaceNameFull()) {
                return -1;
            } else {
                return 0;
            }
        };
        var joinedSpacesComparator = function(opt1, opt2) {
            if (opt1.spaceNameFull() > opt2.spaceNameFull()) {
                return 1;
            } else if (opt1.spaceNameFull() < opt2.spaceNameFull()) {
                return -1;
            } else {
                return 0;
            }
        };

        return {
            koproductItemNo: ko.observable(),
            koDeliveryDelay: ko.observable(false),
            koBrandRoute: ko.observable(),
            koFreeShippingBadge: ko.observable(),
            koOverSizeAlert: ko.observable(),
            koproductDimension: ko.observable(),
            kopetWeightRange: ko.observable(),
            koproductWeight: ko.observable(),
            koproductSkuId: ko.observable(),
            kocapacity: ko.observable(),
            koreplacementParts: ko.observableArray([]),
            koreplacementPartsProduct: ko.observableArray([]),
            koCurrencySymbol: ko.observable(),
            koArticleProductCategory: ko.observableArray([]),
            koImageDisplayCount: ko.observable(0),
            stockStatus: ko.observable(false),

            showStockStatus: ko.observable(false),
            variantOptionsArray: ko.observableArray([]),
            koLargeImg: ko.observableArray([]),
            itemQuantity: ko.observable(1),
            showWishList: ko.observable(false),
            MadeInUSA: ko.observable(false),
            onSale: ko.observable(false),
            koProductSpecTitle: ko.observable(false),
            //itemQuantity: ko.observable(),
            stockAvailable: ko.observable(1),
            selectedSku: ko.observable(),
            disableOptions: ko.observable(false),
            priceRange: ko.observable(false),
            filtered: ko.observable(false),
            WIDGET_ID: 'productDetails',
            isAddToCartClicked: ko.observable(false),
            containerImage: ko.observable(),
            imgGroups: ko.observableArray(),
            mainImgUrl: ko.observable(),
            activeImgIndex: ko.observable(0),
            viewportWidth: ko.observable(),
            skipTheContent: ko.observable(false),
            listPrice: ko.observable(),
            salePrice: ko.observable(),
            backLinkActive: ko.observable(true),
            variantName: ko.observable(),
            variantValue: ko.observable(),
            listingVariant: ko.observable(),
            shippingSurcharge: ko.observable(),
            koCheckStockStatus: ko.observable(),
            imgMetadata: [],
            isMobile: ko.observable(false),
            //Custom Variables
            brandLogo: ko.observable(),
            koVariantSelect: ko.observable(false),
            // social
            showSWM: ko.observable(true),
            isAddToSpaceClicked: ko.observable(false),
            disableAddToSpace: ko.observable(false),
            spaceOptionsArray: ko.observableArray([]),
            spaceOptionsGrpMySpacesArr: ko.observableArray([]),
            spaceOptionsGrpJoinedSpacesArr: ko.observableArray([]),
            mySpaces: ko.observableArray([]),
            siteFbAppId: ko.observable(''),
            koPrice: ko.observable(),
            //AddToWishListStatus
            wishListStatus: ko.observable(true),
            resetBtn: ko.observable(false),
            koProductBreadcrumb: ko.observable(),
            koImageContainer: ko.observableArray([]),
            isVideoAvailable:ko.observable(false),
  
            koSurchargePrice: ko.observable(null),
            koSurchargeData: ko.observable(),
            koSkuSurchargeFlag: ko.observable(false),
            koAvailableOnline: ko.observable(false),
            koPlasticKennels: ko.observable(false),
            resourcesLoaded: function(widget) {
                resourcesAreLoaded = true;
            },

            clickShadowSelect: function(newOptionValue) {
                this.productVariantOption.selectedOption(newOptionValue);

            },
            handleAddToWishList: function() {

                var variantOptions = this.variantOptionsArray();
                notifier.clearSuccess(this.WIDGET_ID);
                //get the selected options, if all the options are selected.
                var selectedOptions = this.getSelectedSkuOptions(variantOptions);
                var selectedOptionsObj = {
                    'selectedOptions': selectedOptions
                };

                var newProduct = $.extend(true, {}, this.product().product, selectedOptionsObj);

                if (this.variantOptionsArray().length > 0) {
                    //assign only the selected sku as child skus
                    newProduct.childSKUs = [this.selectedSku()];
                }
                widgetModel.user().myWishLists().push(newProduct);

            },
            onLoad: function(widget) {



                widgetModel = widget;
                
                 //Get Bronto Breadcrumb
                 $.Topic('bronotoBreadcrumb.memory').subscribe(function(data) {
                   /*console.log("breadcrumb data",data)
                    if(data.hasOwnProperty("displayName")){
                        
                      var displayName = data ? data.displayName : '';
                        var parentName = data.parent  ? data.parent.displayName : '' ;
                        
                        breadCrumb =  parentName + " < " + displayName;
                        console.log(breadCrumb,'breadCrumb---------------')
                    }

                    var cartItems = widget.cart().items();*/
                    breadCrumb = data;
                    
                });
                 $.Topic(pubsub.topicNames.CART_ADD_SUCCESS).subscribe(function(){
                 var localCart = widget.cart().items();
                    var newRoute = widget.product().route();
                    $.each(localCart, function(k,v){
                        if (v.productId === addProductId) {
                            v.product_route_ref(newRoute);
                        }
                        if(v.productId === addProductId && v.product_productURL() === null){
                           v.product_productURL(breadCrumb); 
                           addProductId = "";
                        }
                        
                    });
                         if(widget.user().loggedIn()) {
                            widget.cart().updateCurrentProfileOrder();
                        } else {
                            widget.cart().cartUpdated();
                        }
                    
                });
                //Ends
                /*var allcookies= localStorage.getItem('articleList');
                window.articleSearchBackToListLink = allcookies;*/
                widgetModel.koCurrencySymbol(widgetModel.site().currency.symbol);

                $.Topic(pubsub.topicNames.UPDATE_LISTING_FOCUS).subscribe(function(obj) {
                    widget.skipTheContent(true);
                });

                $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function(obj) {
                    var parameters = {};
                    if (obj.parameters) {
                        var param = obj.parameters.split("&");
                        for (var i = 0; i < param.length; i++) {
                            var tempParam = param[i].split("=");
                            parameters[tempParam[0]] = tempParam[1];
                        }
                    }
                    if (parameters.variantName && parameters.variantValue) {
                        widget.variantName(decodeURI(parameters.variantName));
                        widget.variantValue(decodeURI(parameters.variantValue));

                    } else {
                        widget.variantName("");
                        widget.variantValue("");
                    }
                });

                $.Topic(pubsub.topicNames.SOCIAL_SPACE_ADD_SUCCESS).subscribe(function(obj) {
                    if (obj.productUpdated) {
                        widget.disableAddToSpace(true);
                        setTimeout(function() {
                            widget.disableAddToSpace(false);
                        }, 3000);
                    } else {
                        widget.isAddToSpaceClicked(true);
                        widget.disableAddToSpace(true);
                        setTimeout(function() {
                            widget.isAddToSpaceClicked(false);
                        }, 3000);
                        setTimeout(function() {
                            widget.disableAddToSpace(false);
                        }, 3000);
                    }
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    widget.getSpaces(function() {});
                });

                $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    widget.getSpaces(function() {});
                });

                $.Topic(pubsub.topicNames.SOCIAL_REFRESH_SPACES).subscribe(function(obj) {
                    widget.getSpaces(function() {});
                });

                widget.itemQuantity.extend({
                    required: {
                        params: true,
                        message: CCi18n.t('ns.common:resources.quantityRequireMsg')
                    },
                    digit: {
                        params: true,
                        message: CCi18n.t('ns.common:resources.quantityNumericMsg')
                    },
                    min: {
                        params: 1,
                        message: CCi18n.t('ns.PetReDesignLatestPDPWidgetNew:resources.quantityGreaterThanMsg', {
                            quantity: 0
                        })
                    }
                });

                widget.stockAvailable.subscribe(function(newValue) {
                    var max = parseInt(newValue, 10);
                    widget.itemQuantity.rules.remove(function(item) {
                        return item.rule == "max";
                    });
                    if (max > 0) {
                        widget.itemQuantity.extend({
                            max: {
                                params: max,
                                message: CCi18n.t('ns.PetReDesignLatestPDPBrandNew:resources.quantityLessThanMsg', {
                                    quantity: max
                                })
                            }
                        });
                    }
                });

                // initialize swm rest client
                swmRestClient.init(widget.site().tenantId, widget.isPreview(), widget.locale());

                // get FB app ID
                widget.fetchFacebookAppId();

                /*if (widget.displaySWM) {
                  widget.showSWM(true);
                }*/

                /**
                 * Set up the popover and click handler 
                 * @param {Object} widget
                 * @param {Object} event
                 */
                widget.shippingSurchargeMouseOver = function(widget, event) {

                    var options = new Object();
                    options.trigger = 'manual';
                    options.html = true;

                    // the button is just a visual aid as clicking anywhere will close popover
                    options.title = widget.translate('shippingSurchargePopupTitle');

                    options.content = widget.translate('shippingSurchargePopupText');

                    $('.shippingSurchargePopover').popover(options);
                    $('.shippingSurchargePopover').popover('show');

                };
                
                widget.shippingSurchargeMouseOut = function(widget, event) {
                    $('.shippingSurchargePopover').popover('hide');
                };

                $(window).resize(function() {
                    // Optimizing the carousel performance, to not reload when only height changes
                    var width = $(window)[0].innerWidth || $(window).width();
                    if (widget.product().primaryFullImageURL) {
                        if (widget.viewportWidth() == width) {
                            // Don't reload as the width is same
                        } else {
                            // Reload the things
                            if (width > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                                if (widget.viewportWidth() <= CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                                    // Optionally reload the image place in case the view port was different
                                    widget.activeImgIndex(0);
                                    widget.mainImgUrl(widget.product().primaryFullImageURL);
                                    $('#prodDetails-imgCarousel').carousel(0);
                                    $('#carouselLink0').focus();
                                }
                            } else if (width >= CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) {
                                if ((widget.viewportWidth() < CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) || (widget.viewportWidth() > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH)) {
                                    // Optionally reload the image place in case the view port was different
                                    widget.activeImgIndex(0);
                                    widget.mainImgUrl(widget.product().primaryFullImageURL);
                                    $('#prodDetails-imgCarousel').carousel({
                                        interval: 1000000000
                                    });
                                    $('#prodDetails-imgCarousel').carousel(0);
                                    $('#carouselLink0').focus();
                                }
                            } else {
                                if (widget.viewportWidth() > CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) {
                                    // Optionally reload the carousel in case the view port was different
                                    $('#prodDetails-mobileCarousel').carousel({
                                        interval: 1000000000
                                    });
                                    $('#prodDetails-mobileCarousel').carousel(0);
                                }
                            }
                        }
                    }
                    widget.viewportWidth(width);
                    widget.checkResponsiveFeatures($(window).width());
                });

                widget.viewportWidth($(window).width());
                /*if (widget.product()) {
                     widget.imgGroups(widget.groupImages(widget.product().thumbImageURLs()));
                     widget.mainImgUrl(widget.product().primaryFullImageURL());
                }*/

                if (true || widget.skipTheContent()) {
                    var focusFirstItem = function() {
                        $('#region-12colproductDetailsRegion :focusable').first().focus();
                        widget.skipTheContent(false);
                    };

                    focusFirstItem();
                    setTimeout(focusFirstItem, 1); // Daft IE fix.        
                }



            },
            bvSchemaAppend: function(){
         
                $("#PDP-Sticky-Nav").parents(".row").attr({itemtype:"http://schema.org/Product",itemscope:""});
            },

            beforeAppear: function(page) {
                var widget = this;
                widget.koSurchargePrice(null)
                 widget.selectedSku(null);
                widget.getProductIdsPdp();
                 widget.getBrandRoute();
                var getChildSkusLengths = widget.product().childSKUs().length;
                if (getChildSkusLengths == 1) {
                     widget.selectedSku(ko.toJS(widget.product().childSKUs()[0]));

                }
               

                widget.MadeInUSA(false);
                widget.onSale(false);
                var madeInUsa = widget.product().product.madeInUsa;
                if (madeInUsa == true) {
                    widget.MadeInUSA(true);

                }
                var sale = widget.product().product.onSale;
                if (sale == true) {
                    widget.onSale(true);
                }
                if (widget.product()) {
                   
                    // to display a video in product section ends here 

                    widget.mainImgUrl(widget.product().primaryFullImageURL());
                }
                if (widget.product && widget.product()) {
                    $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                        if (page.pageId = 'product') {
                            if ($('#main-wapper-information').is(':visible')) {
                                var fixmeTop = $('#main-wapper-information').offset().top;
                                $(window).scroll(function() {
                                    var currentScroll = $(window).scrollTop();
                                    if (currentScroll >= fixmeTop) {
                                        $('#PDP-Sticky-Nav').css({
                                            display: 'block'
                                        });
                                    } else {
                                        $('#PDP-Sticky-Nav').css({
                                            display: 'none'
                                        });
                                    }
                                });
                            }

                        }

                    })



                    $('body').delegate('.cc-skuDropdownColor', 'click', function() {
                        $('.cc-skuDropdownColor').removeClass('SelectedSku');
                        $(this).addClass('SelectedSku');
                        widget.resetBtn(true);
                        var getSelectedColor = $('.cc-skuDropdownColor.SelectedSku').attr('data-key');
                        var getChildSkusLength = widgetModel.product().childSKUs().length;
                        if (getChildSkusLength > 0) {
                            for (var i = 0; i < getChildSkusLength; i++) {
                                if (getSelectedColor == widgetModel.product().childSKUs()[i].color()) {
                                    if(widgetModel.selectedSku() !== null){
                                    //console.log(widgetModel.selectedSku(),'widgetModel.selectedSku().repositoryId');
                                        widgetModel.updatedSku(widgetModel.selectedSku().repositoryId)
                                    }
                                    break;
                                }
                            }
                        }
                    })


                    $('body').delegate('.cc-skuDropdownSize', 'click', function() {
                        $('.cc-skuDropdownSize').removeClass('SelectedSku');
                        $(this).addClass('SelectedSku');
                        widget.resetBtn(true);
                        var getSelectedSize = $('.cc-skuDropdownSize.SelectedSku').attr('data-key');
                        var getChildSkuLength = widgetModel.product().childSKUs().length;
                        if (getChildSkuLength > 0) {
                            for (var i = 0; i < getChildSkuLength; i++) {
                                if (getSelectedSize == widgetModel.product().childSKUs()[i].size()) {
                                    if(widgetModel.selectedSku() !== null){
                                    //console.log(widgetModel.selectedSku(),'widgetModel.selectedSku().repositoryId');
                                        widgetModel.updatedSku(widgetModel.selectedSku().repositoryId)
                                    }
                                    //console.log(widgetModel.product().childSKUs()[i].repositoryId(),'cc-skuDropdownSize');
                                    break;
                                }
                            }
                        }


                    })

                    var salePrice;
                    var isSalePrice = false;
                    getData = ko.toJS(widgetModel.product().product);
                    getCurrentData = ko.toJS(widgetModel.product());
                    widget.koArticleProductCategory([]);
                    for (var i = 0; i < getCurrentData.parentCategories.length; i++) {
                        if (getCurrentData.parentCategories[i].id.indexOf('article') != -1) {
                            widget.koArticleProductCategory.push(getCurrentData.parentCategories[i]);
                        }
                    }



                    //Side Car Implementation
                    if (page.pageId == 'product') {
                        window.sidecar = {};
                        window.sidecar.product_info = {
                            'group_id': getCurrentData.product.id
                        };
                    }



                    //BV Product dynamic feed
                        $("script[id='bvProductDynamicFeed']").remove();
                            if ($("script[id='bvProductDynamicFeed']").length === 0) {
                                var displayName = getCurrentData.product.displayName.replace(/"/g, "'");
                               var bvProductDynamicFeed =  '<script async id="bvProductDynamicFeed" type="text/javascript">' +
                                                          'window.bvDCC = { ' +
                                                            'catalogData: {' +
                                                             'locale: "en_US",' +
                                                             'catalogProducts: [{' +
                                                                '"productId":"' + getCurrentData.product.id + '",' +
                                                                '"productName":"' + displayName + '",' +
                                                                '"productImageURL":"https://www.petmate.com' + getCurrentData.product.primaryFullImageURL + '",' +
                                                                '"productPageURL":"https://www.petmate.com' + getCurrentData.product.route + '",' +
                                                                '"upcs":["' + getCurrentData.product.childSKUs[0].upc + '"],' +
                                                                '"brandName":"' + getCurrentData.product.brand + '",' +
                                                              '}]' +
                                                            '}' +
                                                          '};' +
                                                          '</script>'
                                                          $("head").append(bvProductDynamicFeed);
                                    }                    
                                                          
                    //Klaviyo Viewed Product
                    $("script[id='klaviyoViewedProduct']").remove();
                    if ($("script[id='klaviyoViewedProduct']").length === 0) {
                        var displayName = getCurrentData.product.displayName.replace(/"/g, "'");
                        var klaviyoViewedProduct = '<script id="klaviyoViewedProduct" type="text/javascript">' +
                            'var _learnq = _learnq || [];' +
                            'var item = {' +
                            '"ProductName":"' + displayName + '",' +
                            '"ProductID":"' + getCurrentData.product.id + '",' +
                            '"SKU":"' + getCurrentData.childSKUs[0].repositoryId + '",' +
                            '"Categories":["' + getCurrentData.brandCategory + '"],' +
                            '"ImageURL":"https://www.petmate.com' + getCurrentData.product.primaryFullImageURL + '",' +
                            '"URL":"https://www.petmate.com' + getCurrentData.product.route + '",' +
                            '"Brand":"' + getCurrentData.brand + '",' +
                            '"Price":"' + getCurrentData.listPrice + '",' +
                            '"CompareAtPrice":"' + getCurrentData.listPrice + '",' +
                            '};' +
                            '_learnq.push(["track", "Viewed Product", item]);' +
                            '</script>'
                        $("head").append(klaviyoViewedProduct);
                    }

                    //Ends
                                window.bvCallback = function (BV) {
                                // Use a loop for multiple products
                                    for(var i=0, len=window.bvDCC.catalogData.catalogProducts.length; i < len; ++i){
                                      BV.pixel.trackEvent("CatalogUpdate", {
                                        type: 'Product',
                                        locale: window.bvDCC.catalogData.locale,
                                        catalogProducts: [ window.bvDCC.catalogData.catalogProducts[i] ]
                                      });
                                    }
                                  };
                                
                                //BV Product dynamic feed Ends
                    var minPrice = getCurrentData.minPrice;
                    var minPrice1 = [];
                    if (parseInt(minPrice) == minPrice) {
                        var finalminPrice = parseInt(minPrice + '00');
                        widgetModel.koPrice(finalminPrice);
                    } else if (parseFloat(minPrice) == minPrice) {
                        minPrice1 = parseFloat(minPrice).toString().split(".");
                        var finalminPrice = parseInt(minPrice1[0] + minPrice1[1]);
                        widgetModel.koPrice(finalminPrice);
                        if (parseInt(finalminPrice) == finalminPrice) {
                        }
                    }
                    var salePrice = widgetModel.product().product.salePrice;
                    var listPrice = widgetModel.product().product.listPrice;
                    if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                        var salePrice1 = [];

                        if (parseInt(salePrice) == salePrice) {
                            var finalSalePrice = parseInt(salePrice + '00');
                        } else if (parseFloat(salePrice) == salePrice) {
                            salePrice1 = parseFloat(salePrice).toString().split(".");
                            var finalSalePrice = parseInt(salePrice1[0] + salePrice1[1]);
                            if (parseInt(finalSalePrice) == finalSalePrice) {
                            }

                        }
                    }


                   // widgetModel.appendScript('https://apps.bazaarvoice.com/deployments/Petmate/main_site/test/en_US/bv.js');

                    /* vertical Mass script len */




                    if (getData.hasOwnProperty('startDateStr')) {
                        var arrivalDate = getData.startDateStr;

                        if (arrivalDate != null) {

                            var newCreatedDate = arrivalDate;
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1; //January is 0!
                            var yyyy = today.getFullYear();
                            var newFlag = false;
                            var salePrice;
                            var isSalePrice = false;

                            if (dd < 10) {
                                dd = '0' + dd
                            }

                            if (mm < 10) {
                                mm = '0' + mm
                            }

                            today = yyyy + '-' + mm + '-' + dd;
                            var todaysDate = new Date(today);
                            var CurrentDate = new Date(newCreatedDate);
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


                    salePrice = widgetModel.product().product.salePrice;
                    if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                        isSalePrice = true;
                    } else {
                        isSalePrice = false;

                    }
                    widgetModel.product().product.creationNewFlag = ko.observable(newFlag);
                    widgetModel.product().product.isSale = ko.observable(isSalePrice)

                    widget.checkResponsiveFeatures($(window).width());
                    this.backLinkActive(true);
                    if (!widget.isPreview() && !widget.historyStack.length) {
                        this.backLinkActive(false);
                    }

                    widget.imgGroupRendering();        
                    /* reset active img index to 0 */
                    widget.shippingSurcharge(null);
                    widget.activeImgIndex(0);
                    widget.firstTimeRender = true;
                    this.populateVariantOptions(widget);
                    /*if (widget.product()) {
                        widget.imgGroups(widget.groupImages(widget.product().thumbImageURLs()));
                    }*/
                    widget.loaded(true);
                    this.itemQuantity(1);

                    // the dropdown values should be pre-selected if there is only one sku
                    if (widget.product() && widget.product().childSKUs().length == 1) {
                        this.filtered(false);
                        this.filterOptionValues(null);
                    }

                    notifier.clearSuccess(this.WIDGET_ID);
                    var catalogId = null;
                    if (widget.user().catalog) {
                        catalogId = widget.user().catalog.repositoryId;
                    }
                    widget.listPrice(widget.product().listPrice());
                    widget.salePrice(widget.product().salePrice());

                    if (widget.product()) {

                        widget.product().stockStatus.subscribe(function(newValue) {
                            if (widget.product().stockStatus().stockStatus === CCConstants.IN_STOCK) {
                                if (widget.product().stockStatus().orderableQuantity) {
                                    widget.stockAvailable(widget.product().stockStatus().orderableQuantity);
                                } else {
                                    widget.stockAvailable(1);
                                }
                                widget.disableOptions(false);
                                widget.stockStatus(true);
                            } else {
                                widget.stockAvailable(0);
                                widget.disableOptions(true);
                                widget.stockStatus(false);
                            }
                            widget.showStockStatus(true);
                        });
                        var firstchildSKU = widget.product().childSKUs()[0];

                        if (firstchildSKU) {
                            var skuId = firstchildSKU.repositoryId();
                            widgetModel.koProductSpecTitle(false)
                            widgetModel.updatedSku(skuId);
                            widgetModel.getItemnumber(skuId);

                            if (this.variantOptionsArray().length > 0) {
                                skuId = '';
                            }

                            this.showStockStatus(false);
                            widget.product().getAvailability(widget.product().id(), skuId, catalogId);
                            widget.product().getPrices(widget.product().id(), skuId);
                        } else {
                            widget.stockStatus(false);
                            widget.disableOptions(true);
                            widget.showStockStatus(true);
                        }
                        this.priceRange(this.product().hasPriceRange);
                        //widget.mainImgUrl(widget.product().primaryFullImageURL());

                        $.Topic(pubsub.topicNames.PRODUCT_VIEWED).publish(widget.product());
                        $.Topic(pubsub.topicNames.PRODUCT_PRICE_CHANGED).subscribe(function() {
                            widget.listPrice(widget.product().listPrice());
                            widget.salePrice(widget.product().salePrice());
                            widget.shippingSurcharge(widget.product().shippingSurcharge());
                        });
                    }

                    // Load spaces
                    if (widget.user().loggedIn()) {
                        widget.getSpaces(function() {});
                    }

                    widgetModel.getItemnumber(firstchildSKU.repositoryId());
                }
                $.Topic("SIDECAR_RELOAD.memory").publish();
                
                
                widget.plasticKennel();
                
                //Fix for long description space
                
                /*$('.long-description p').each(function() {
                    var $p = $(this),
                        txt = $p.html();
                    if (txt=='&nbsp;') {
                        $p.attr('style', 'line-height: 0px !important');  
                    }
                });
*/
                // Attentive Product View
                var prodValue = widget.product();
                var attentiveDestroy = setInterval(function() {
                    if (window.attentive) {
                        window.attentive.analytics.productView({
                            items: [{
                                productId: prodValue.id(),
                                productVariantId: prodValue.childSKUs()[0].repositoryId(),
                                name: prodValue.displayName(),
                                productImage: 'https://www.petmate.com/' + prodValue.primaryFullImageURL(),
                                category: prodValue.parentCategory.displayName(),
                                price: {
                                    value: prodValue.childSKUs()[0].listPrice(),
                                    currency: 'USD',
                                }
                            }]
                        })
                        window.clearInterval(attentiveDestroy);
                        console.log('Set Interval leak');
                    }
                }, 100)
            },
            
            
            plasticKennel: function(){
                var widget = this;
                var getProduct = widget.product().parentCategories();
                widget.koPlasticKennels(false);
                if(widget.product().brand() === 'Petmate'){
                    for (var i = 0; i < getProduct.length; i++) {
                       
                        if((getProduct[i].id() === 'plastic-dog-kennels' || getProduct[i].id() === 'cat-kennels-carriers')){
                            
                             widget.koPlasticKennels(true);
                        }
                }
                    
                        
                        /*if (!variantOptions[i].selectedOption.isValid() && !variantOptions[i].disable()) {
                            allOptionsSelected = false;
                            break;
                        }*/
                    }
                


            },
            
            
             getProductIdsPdp: function() {
                 var getWidget = this;
                 
                if (getWidget.productId() !== null) {
                    if (getWidget.productId().indexOf(',') != -1) {
                        productIds = getWidget.productId().split(',');
                            var currentProduct = getWidget.product().id();
                            var final = productIds.indexOf(currentProduct);
                            if(final >= 0){
                                getWidget.koAvailableOnline(false);
                            }else{
                                getWidget.koAvailableOnline(true);
                            }
                            
                    } 
                }
            },


            appendScript: function(filepath) {
                if ($('head script[src="' + filepath + '"]').length > 0) {
                    return;
                }
                var ele = document.createElement('script');
                ele.setAttribute("type", "text/javascript");
                ele.setAttribute("src", filepath);
                ele.setAttribute('async', '');
                $('head').append(ele);

            },

            goBack: function() {
                $(window).scrollTop($(window).height());
                window.history.go(-1);
                return false;
            },

            // Handles loading a default 'no-image' as a fallback
            cancelZoom: function(element) {
                $(element).parent().removeClass('zoomContainer-CC');
            },

            //this method populates productVariantOption model to display the variant options of the product
            populateVariantOptions: function(widget) {
                var options = widget.productVariantOptions();
                if (options && options !== null && options.length > 0) {
                    var optionsArray = [],
                        productLevelOrder, productTypeLevelVariantOrder = {},
                        optionValues, productVariantOption, variants;
                    for (var typeIdx = 0, typeLen = widget.productTypes().length; typeIdx < typeLen; typeIdx++) {
                        if (widget.productTypes()[typeIdx].id == widget.product().type()) {
                            variants = widget.productTypes()[typeIdx].variants;
                            for (var variantIdx = 0, variantLen = variants.length; variantIdx < variantLen; variantIdx++) {
                                productTypeLevelVariantOrder[variants[variantIdx].id] = variants[variantIdx].values;
                            }
                        }
                    }
                    for (var i = 0; i < options.length; i++) {
                        if (widget.product().variantValuesOrder[options[i].optionId]) {
                            productLevelOrder = widget.product().variantValuesOrder[options[i].optionId]();
                        }
                        optionValues = this.mapOptionsToArray(options[i].optionValueMap, productLevelOrder ? productLevelOrder : productTypeLevelVariantOrder[options[i].optionId]);
                        productVariantOption = this.productVariantModel(options[i].optionName, options[i].mapKeyPropertyAttribute, optionValues, widget, options[i].optionId);
                        optionsArray.push(productVariantOption);

                    }
                    widget.variantOptionsArray(optionsArray);
                } else {
                    widget.imgMetadata = widget.product().product.productImagesMetadata;
                    widget.variantOptionsArray([]);
                }
            },

            /*this create view model for variant options this contains
            name of the option, possible list of option values for the option
            selected option to store the option selected by the user.
            ID to map the selected option*/
            productVariantModel: function(optionDisplayName, optionId, optionValues, widget, actualOptionId) {
                var productVariantOption = {};
                var productImages = {};
                productVariantOption.optionDisplayName = optionDisplayName;
                productVariantOption.parent = this;
                productVariantOption.optionId = optionId;
                productVariantOption.originalOptionValues = ko.observableArray(optionValues);
                productVariantOption.actualOptionId = actualOptionId;

                var showOptionCation = ko.observable(true);
                if (optionValues.length === 1) {
                    showOptionCation(this.checkOptionValueWithSkus(optionId, optionValues[0].value));
                }
                //If there is just one option value in all Skus we dont need any caption
                if (showOptionCation()) {
                    productVariantOption.optionCaption = widget.translate('optionCaption', {
                        optionName: optionDisplayName
                    }, true);
                }
                productVariantOption.selectedOptionValue = ko.observable();
                productVariantOption.countVisibleOptions = ko.computed(function() {
                    var count = 0;
                    for (var i = 0; i < productVariantOption.originalOptionValues().length; i++) {
                        if (optionValues[i].visible() == true) {
                            count = count + 1;
                        }
                    }
                    return count;
                }, productVariantOption);
                productVariantOption.disable = ko.computed(function() {
                    if (productVariantOption.countVisibleOptions() == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }, productVariantOption);
                productVariantOption.selectedOption = ko.computed({
                    write: function(option) {
                        /*custom code*/

                        var getColorValue = $('.cc-skuDropdownColor .SelectedSku').attr('data-key');
                        //var getColorValue= $('.cc-skuDropdownColor .SelectedSku').attr('data-key');
                        /*   var getchildSkus = widgetModel.product().childSKUs();
                           for(var j=0;j<widgetModel.product().childSKUs().length;j++){
                               if(option.key==widgetModel.product().childSKUs()[j].color()){
                                   widgetModel.updatedSku(widgetModel.product().childSKUs()[j].repositoryId())
                               }
                               else if(option.key==widgetModel.product().childSKUs()[j].size()){
                                     widgetModel.updatedSku(widgetModel.product().childSKUs()[j].repositoryId());
                               }
                               
                           }*/

                        this.parent.filtered(false);
                        productVariantOption.selectedOptionValue(option);
                        if (productVariantOption.actualOptionId === this.parent.listingVariant()) {
                            if (option && option.listingConfiguration) {
                                this.parent.imgMetadata = option.listingConfiguration.imgMetadata;
                                this.parent.assignImagesToProduct(option.listingConfiguration);
                            } else {
                                this.parent.imgMetadata = this.parent.product().product.productImagesMetadata;
                                this.parent.assignImagesToProduct(this.parent.product().product);
                            }
                        }
                        this.parent.filterOptionValues(productVariantOption.optionId);
                    },
                    read: function() {
                        return productVariantOption.selectedOptionValue();
                    },
                    owner: productVariantOption
                });
                productVariantOption.selectedOption.extend({
                    required: {
                        params: true,
                        message: widget.translate('optionRequiredMsg', {
                            optionName: optionDisplayName
                        }, true)
                    }
                });
                productVariantOption.optionValues = ko.computed({
                    write: function(value) {
                        productVariantOption.originalOptionValues(value);
                    },
                    read: function() {
                        return ko.utils.arrayFilter(
                            productVariantOption.originalOptionValues(),
                            function(item) {
                                return item.visible() == true;
                            }
                        );
                    },
                    owner: productVariantOption
                });


                //The below snippet finds the product display/listing variant (if available)        
                //looping through all the product types
                for (var productTypeIdx = 0; productTypeIdx < widget.productTypes().length; productTypeIdx++) {
                    //if the product type matched with the current product
                    if (widget.product().type() && widget.productTypes()[productTypeIdx].id == widget.product().type()) {
                        var variants = widget.productTypes()[productTypeIdx].variants;
                        //Below FOR loop is to iterate over the various variant types of that productType
                        for (var productTypeVariantIdx = 0; productTypeVariantIdx < variants.length; productTypeVariantIdx++) {
                            //if the productType has a listingVariant == true, hence this is the product display variant
                            if (variants[productTypeVariantIdx].listingVariant) {
                                widget.listingVariant(variants[productTypeVariantIdx].id);
                                break;
                            }
                        }
                        break;
                    }
                }
                productImages.thumbImageURLs = (widget.product().product.thumbImageURLs.length == 1 && widget.product().product.thumbImageURLs[0].indexOf("/img/no-image.jpg&") > 0) ? [] : (widget.product().product.thumbImageURLs);
                productImages.smallImageURLs = (widget.product().product.smallImageURLs.length == 1 && widget.product().product.smallImageURLs[0].indexOf("/img/no-image.jpg&") > 0) ? [] : (widget.product().product.smallImageURLs);
                productImages.mediumImageURLs = (widget.product().product.mediumImageURLs.length == 1 && widget.product().product.mediumImageURLs[0].indexOf("/img/no-image.jpg&") > 0) ? [] : (widget.product().product.mediumImageURLs);
                productImages.largeImageURLs = (widget.product().product.largeImageURLs.length == 1 && widget.product().product.largeImageURLs[0].indexOf("/img/no-image.jpg&") > 0) ? [] : (widget.product().product.largeImageURLs);
                productImages.fullImageURLs = (widget.product().product.fullImageURLs.length == 1 && widget.product().product.fullImageURLs[0].indexOf("/img/no-image.jpg&") > 0) ? [] : (widget.product().product.fullImageURLs);
                productImages.sourceImageURLs = (widget.product().product.sourceImageURLs.length == 1 && widget.product().product.sourceImageURLs[0].indexOf("/img/no-image.jpg") > 0) ? [] : (widget.product().product.sourceImageURLs);

                var prodImgMetadata = [];
                if (widget.product().thumbImageURLs && widget.product().thumbImageURLs().length > 0) {
                    for (var index = 0; index < widget.product().thumbImageURLs().length; index++) {
                        prodImgMetadata.push(widget.product().product.productImagesMetadata[index]);
                    }
                }

                ko.utils.arrayForEach(productVariantOption.originalOptionValues(), function(option) {
                    if (widget.listingVariant() === actualOptionId) {
                        for (var childSKUsIdx = 0; childSKUsIdx < widget.product().childSKUs().length; childSKUsIdx++) {
                            if (widget.product().childSKUs()[childSKUsIdx].productListingSku()) {
                                var listingConfiguration = widget.product().childSKUs()[childSKUsIdx];
                                if (listingConfiguration[actualOptionId]() == option.key) {
                                    var listingConfig = {};
                                    //widget upgrade code change
                                    listingConfig.thumbImageURLs = $.merge($.merge([], listingConfiguration.thumbImageURLs()), productImages.thumbImageURLs);
                                    listingConfig.smallImageURLs = $.merge($.merge([], listingConfiguration.smallImageURLs()), productImages.smallImageURLs);
                                    listingConfig.mediumImageURLs = $.merge($.merge([], listingConfiguration.mediumImageURLs()), productImages.mediumImageURLs);
                                    listingConfig.largeImageURLs = $.merge($.merge([], listingConfiguration.largeImageURLs()), productImages.largeImageURLs);
                                    listingConfig.fullImageURLs = $.merge($.merge([], listingConfiguration.fullImageURLs()), productImages.fullImageURLs);
                                    listingConfig.sourceImageURLs = $.merge($.merge([], listingConfiguration.sourceImageURLs()), productImages.sourceImageURLs);
                                    listingConfig.primaryFullImageURL = listingConfiguration.primaryFullImageURL() ? listingConfiguration.primaryFullImageURL() : widget.product().product.primaryFullImageURL;
                                    listingConfig.primaryLargeImageURL = listingConfiguration.primaryLargeImageURL() ? listingConfiguration.primaryLargeImageURL() : widget.product().product.primaryLargeImageURL;
                                    listingConfig.primaryMediumImageURL = listingConfiguration.primaryMediumImageURL() ? listingConfiguration.primaryMediumImageURL() : widget.product().product.primaryMediumImageURL;
                                    listingConfig.primarySmallImageURL = listingConfiguration.primarySmallImageURL() ? listingConfiguration.primarySmallImageURL() : widget.product().product.primarySmallImageURL;
                                    listingConfig.primaryThumbImageURL = listingConfiguration.primaryThumbImageURL() ? listingConfiguration.primaryThumbImageURL() : widget.product().product.primaryThumbImageURL;

                                    //storing the metadata for the images
                                    var childSKUImgMetadata = [];
                                    if (listingConfiguration.images && listingConfiguration.images().length > 0) {
                                        for (var index = 0; index < listingConfiguration.images().length; index++) {
                                            childSKUImgMetadata.push(widget.product().product.childSKUs[childSKUsIdx].images[index].metadata);
                                        }
                                    }
                                    listingConfig.imgMetadata = $.merge($.merge([], childSKUImgMetadata), prodImgMetadata);
                                    option.listingConfiguration = listingConfig;
                                }
                            }
                        }
                    }
                    if (widget.variantName() === actualOptionId && option.key === widget.variantValue()) {
                        productVariantOption.selectedOption(option);
                    }
                });

                return productVariantOption;
            },

            //this method is triggered to check if the option value is present in all the child Skus.
            checkOptionValueWithSkus: function(optionId, value) {
                var childSkus = this.product().childSKUs();
                var childSkusLength = childSkus.length;
                for (var i = 0; i < childSkusLength; i++) {
                    if (!childSkus[i].dynamicPropertyMapLong[optionId] || childSkus[i].dynamicPropertyMapLong[optionId]() === undefined) {
                        return true;
                    }
                }
                return false;
            },

            //this method is triggered whenever there is a change to the selected option.
            filterOptionValues: function(selectedOptionId) {
                if (this.filtered()) {
                    return;
                }
                var variantOptions = this.variantOptionsArray();
                for (var i = 0; i < variantOptions.length; i++) {
                    var currentOption = variantOptions[i];
                    var matchingSkus = this.getMatchingSKUs(variantOptions[i].optionId);
                    var optionValues = this.updateOptionValuesFromSku(matchingSkus, selectedOptionId, currentOption);
                    variantOptions[i].optionValues(optionValues);
                    this.filtered(true);
                }
                this.updateSingleSelection(selectedOptionId);
            },

            // get all the matching SKUs
            getMatchingSKUs: function(optionId) {
                var childSkus = this.product().childSKUs();
                var matchingSkus = [];
                var variantOptions = this.variantOptionsArray();
                var selectedOptionMap = {};
                for (var j = 0; j < variantOptions.length; j++) {
                    if (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption() != undefined) {
                        selectedOptionMap[variantOptions[j].optionId] = variantOptions[j].selectedOption().value;
                    }
                }
                for (var i = 0; i < childSkus.length; i++) {
                    var skuMatched = true;
                    for (var key in selectedOptionMap) {
                        if (selectedOptionMap.hasOwnProperty(key)) {
                            if (!childSkus[i].dynamicPropertyMapLong[key] ||
                                childSkus[i].dynamicPropertyMapLong[key]() != selectedOptionMap[key]) {
                                skuMatched = false;
                                break;
                            }
                        }
                    }
                    if (skuMatched) {
                        matchingSkus.push(childSkus[i]);
                    }
                }
                return matchingSkus;
            },

            //this method constructs option values for all the options other than selected option
            //from the matching skus.
            updateOptionValuesFromSku: function(skus, selectedOptionID, currentOption) {
                var optionId = currentOption.optionId;
                var options = [];
                var optionValues = currentOption.originalOptionValues();
                for (var k = 0; k < skus.length; k++) {
                    var optionValue = skus[k].dynamicPropertyMapLong[optionId];
                    if (optionValue != undefined) {
                        options.push(optionValue());
                    }
                }
                for (var j = 0; j < optionValues.length; j++) {

                    var value = optionValues[j].value;
                    var visible = false;
                    var index = options.indexOf(value);
                    if (index != -1) {
                        visible = true;
                    }
                    optionValues[j].visible(visible);
                }

                return optionValues;
            },

            //This method returns true if the option passed is the only one not selected
            //and all other options are either selected or disabled.
            validForSingleSelection: function(optionId) {
                var variantOptions = this.variantOptionsArray();
                for (var j = 0; j < variantOptions.length; j++) {
                    if (variantOptions[j].disable() || (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption() != undefined)) {
                        return true;
                    }
                    if (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption() == undefined && variantOptions[j].countVisibleOptions() == 1) {
                        return true;
                    }
                }
                return false;
            },

            //This method updates the selection value for the options wiht single option values.
            updateSingleSelection: function(selectedOptionID) {
                var variantOptions = this.variantOptionsArray();
                for (var i = 0; i < variantOptions.length; i++) {
                    var optionId = variantOptions[i].optionId;
                    if (variantOptions[i].countVisibleOptions() == 1 && variantOptions[i].selectedOption() == undefined && optionId != selectedOptionID) {
                        var isValidForSingleSelection = this.validForSingleSelection(optionId);
                        var optionValues = variantOptions[i].originalOptionValues();
                        for (var j = 0; j < optionValues.length; j++) {
                            if (optionValues[j].visible() == true) {
                                variantOptions[i].selectedOption(optionValues[j]);
                                break;
                            }
                        }
                    }
                }
            },

            //this method convert the map to array of key value object and sort them based on the enum value
            //to use it in the select binding of knockout
            mapOptionsToArray: function(variantOptions, order) {
                var optionArray = [];

                for (var idx = 0, len = order.length; idx < len; idx++) {
                    if (variantOptions.hasOwnProperty(order[idx])) {
                        optionArray.push({
                            key: order[idx],
                            value: variantOptions[order[idx]],
                            visible: ko.observable(true)
                        });
                    }
                }
                return optionArray;
            },

            //this method returns the selected sku in the product, Based on the options selected
            getSelectedSku: function(variantOptions) {

                var childSkus = this.product().product.childSKUs;
                var selectedSKUObj = {};
                for (var i = 0; i < childSkus.length; i++) {
                    selectedSKUObj = childSkus[i];
                    for (var j = 0; j < variantOptions.length; j++) {
                        if (!variantOptions[j].disable() && childSkus[i].dynamicPropertyMapLong[variantOptions[j].optionId] != variantOptions[j].selectedOption().value) {
                            selectedSKUObj = null;
                            break;
                        }
                    }
                    if (selectedSKUObj !== null) {
                        $.Topic(pubsub.topicNames.SKU_SELECTED).publish(this.product(), selectedSKUObj, variantOptions);

                        return selectedSKUObj;
                    }
                }
                return null;
            },
            getItemnumber: function(id) {
                var itemNumber;
                var itemNoArray = [];
                var childSkusArray = [];
                var item = [];
                itemNoArray = widgetModel.product().childSKUs();


                for (var t = 0; t < itemNoArray.length; t++) {
                    item = itemNoArray[t].repositoryId();
                    for (var u = 0; u < item.length; u++) {
                        if (item == id) {
                            itemNumber = itemNoArray[t].itemno();
                            widgetModel.koproductItemNo(itemNumber);
                            var final = productIds.indexOf(itemNumber);
                            if(final >= 0){
                                widgetModel.koAvailableOnline(false);
                            }else{
                                widgetModel.koAvailableOnline(true);
                            }
                        }
                    }

                }
            },
             getBrandRoute: function(id) {
                var itemBrand;
                var itemBrandArray = [];
                var childSkusArray = [];
                var item = [];
                itemBrandArray = widgetModel.product().parentCategories();
                if(widgetModel.product().brand() == 'Precision Pet Products'){
                    setTimeout(function(){ $('.itemBrandName').text('precision pet')},500)                  
                }
                if(itemBrandArray){
                    for (var t = 0; t < itemBrandArray.length; t++) {
                    itemBrand = itemBrandArray[t].route();
                    if(itemBrand.indexOf("brand-") != -1){
                         itemBrand = itemBrandArray[t].route();
                        widgetModel.koBrandRoute(itemBrand);
                        return
                    }
                    

                }
                }
                
            },
            updatedSku: function(id) {
                var dimension;
                var dimensionArray = [];
                var dimensionId = [];
                var finalDimensionValue = [];
                var productWeight;
                var productWeightArray = [];
                var finalProductWeight = [];
                var petWeight;
                var petWeightArray = [];
                var finalpetWeight = [];
                var capacity;
                var capacityArray = [];
                var finalCapacityValue;
                var replacementParts = '';
                var replacementPartsArray = [];
                var finalReplacementParts;
                var finalReplacementProductId = [];
                var itemNumber;
                var freeShipping;
                var overSize;
                var itemNoArray = [];
                var childSkusArray = [];
                var item = [];
                var petWeightRange;
                var deliveryDelay = ["00700", "21183","00500", "21950", "21554", "21700", "21184", "41036", "21798", "21796", "41158","41444","00400","21949","21553","37062","21795"];
                this.koproductSkuId(id);
                widgetModel.koreplacementParts([]);
                widgetModel.koreplacementPartsProduct([]);
                itemNoArray = widgetModel.product().childSKUs();

                for (var t = 0; t < itemNoArray.length; t++) {
                    item = itemNoArray[t].repositoryId();
                    for (var u = 0; u < item.length; u++) {
                        if (item == id) {
                            itemNumber = itemNoArray[t].itemno();
                            dimensionId = itemNoArray[t].dimension();
                            capacity = itemNoArray[t].capacity();
                            productWeight = itemNoArray[t].weightRange();
                            petWeightRange = itemNoArray[t].petWeight();
                            replacementParts = itemNoArray[t].replacementParts();
                            freeShipping = itemNoArray[t].isFreeShipping();
                            overSize = itemNoArray[t].overSizedSku();
                            widgetModel.koFreeShippingBadge(freeShipping);
                            widgetModel.koOverSizeAlert(overSize);
                            widgetModel.koproductItemNo(itemNumber);
                            widgetModel.koproductDimension(dimensionId);
                            widgetModel.kocapacity(capacity);
                            widgetModel.koproductWeight(petWeightRange);
                            widgetModel.kopetWeightRange(productWeight);
                            if (replacementParts != null) {
                                replacementPartsArray = replacementParts.split(',');
                                widgetModel.koreplacementParts(replacementPartsArray)
                            }
                            if (widgetModel.koproductDimension() != null || widgetModel.kocapacity() != null || widgetModel.kopetWeightRange() != null || widgetModel.koproductWeight() != null) {
                                widgetModel.koProductSpecTitle(true)
                                widgetModel.koVariantSelect(true);
                            }
                             if(deliveryDelay.includes(itemNumber)){
                                widgetModel.koDeliveryDelay(true);
                            }else{
                               widgetModel.koDeliveryDelay(false);
                            }



                        }
                    }

                }



                if (widgetModel.koreplacementParts().length > 0) {
                    widgetModel.getReplacementProduct();
                    $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                        if (widgetModel.koreplacementParts().length > 2) {
                            $('.replacementPartWrap').slimScroll({
                                height: '337px',
                                railVisible: true,
                                alwaysVisible: true
                            });
                        } else if (widgetModel.koreplacementParts().length <= 2) {
                            $('.slimScrollBar,.slimScrollRail').remove();
                        }
                    })
                } else {
                    widgetModel.koreplacementPartsProduct([]);
                }
                if(widgetModel.selectedSku()){
                    widgetModel.koSkuSurchargeFlag(widgetModel.selectedSku().x_surchargeable);
                }
                if(widgetModel.koSkuSurchargeFlag()){
                   //console.log("koSkuSurchargeFlagll");
                    
                    if(widgetModel.selectedSku() && widgetModel.selectedSku().x_surchargeProduct != null){
                         //console.log(widgetModel.selectedSku,'widget.selectedSku()');
                        
                        var surchargeSKU = widgetModel.selectedSku().x_surchargeProduct;
                    //console.log(widgetModel.selectedSku().x_surchargeProduct,'widget.selectedSku().x_surchargeProduct');
                    
                        ccRestClient.authenticatedRequest("/ccstoreui/v1/products?productIds="+surchargeSKU, {}, function(data) {
                            //console.log(data,'=============>data');
                             widgetModel.koSurchargeData(data[0]);
                            widgetModel.koSurchargePrice(data[0].shippingSurcharge);
                            //console.log(widgetModel.koSurchargePrice(),'setting');
                        }, function (data) {
                            //console.log('Error Search ----- ', data);
                        });
                   
                    }
                
                }else if(getCurrentData.shippingSurcharge){
                    widgetModel.koSurchargePrice(getCurrentData.shippingSurcharge);
                }else(
                    widgetModel.koSurchargePrice(null)
                    )

            },
            getReplacementProduct: function() {
                widgetModel.koreplacementPartsProduct([]);
                for (var i = 0; i < widgetModel.koreplacementParts().length; i++) {
                    var a = CCConstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
                    var l = {};
                    l['fields'] = 'primaryThumbImageURL,route,displayName,id,listPrice';
                    var p = widgetModel.koreplacementParts()[i];

                    ccRestClient.request(a, l, function(replaceProduct) {
                        var isProdAdd = false;
                        $.each(widgetModel.koreplacementPartsProduct(), function(key, value) {
                            if (value.id() == replaceProduct.id) {
                                isProdAdd = true; //Avoid duplication of Product.
                            }
                        })

                        if (!isProdAdd) {
                            replaceProduct.stockStatus = false;
                            widgetModel.koreplacementPartsProduct.push(ko.mapping.fromJS(replaceProduct));
                            widgetModel.getReplacementStockStatus(replaceProduct.id);


                        }

                    }, function(replaceProduct) {


                    }, $.trim(p));
                }


            },
            getReplacementStockStatus: function(replaceProductId) {

                var a = CCConstants.ENDPOINT_GET_PRODUCT_AVAILABILITY;
                var l = {};
                l['fields'] = 'stockStatus';
                var p = replaceProductId;


                ccRestClient.request(a, l, function(stockOutput) {
                    var getStockStatus = "";
                    if (stockOutput.stockStatus == "IN_STOCK") {
                        getStockStatus = true;
                    } else {
                        getStockStatus = false;
                    }

                    $.each(widgetModel.koreplacementPartsProduct(), function(key, value) {
                        if (value.id() == replaceProductId) {
                            value.stockStatus(getStockStatus);
                        }
                    })

                }, function(stockOutput) {

                }, p);
            },
            handleReplacementAddToCart: function(data, getRepProductId) {

                var replaceQty = $("#CC-prodDetails-quantity" + getRepProductId).val();
                if (parseInt(replaceQty) < 1) {
                    return;
                }

                var a = CCConstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
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

            },
            //refreshes the prices based on the variant options selected
            refreshSkuPrice: function(selectedSKUObj) {
                if (selectedSKUObj === null) {
                    if (this.product().hasPriceRange) {
                        this.priceRange(true);
                    } else {
                        this.listPrice(this.product().listPrice());
                        this.salePrice(this.product().salePrice());
                        this.priceRange(false);
                    }
                } else {
                    this.priceRange(false);
                    var skuPriceData = this.product().getSkuPrice(selectedSKUObj);
                    this.listPrice(skuPriceData.listPrice);
                    this.salePrice(skuPriceData.salePrice);
                }
            },

            //refreshes the stockstatus based on the variant options selected
            refreshSkuStockStatus: function(selectedSKUObj) {
                var key;
                if (selectedSKUObj === null) {
                    key = 'stockStatus';
                } else {
                    key = selectedSKUObj.repositoryId;
                }
                var stockStatusMap = this.product().stockStatus();
                for (var i in stockStatusMap) {

                    if (i == key) {
                        if (stockStatusMap[key] == 'IN_STOCK') {
                            this.stockStatus(true);
                            if (selectedSKUObj === null) {
                                this.stockAvailable(1);
                            } else {
                                this.stockAvailable(selectedSKUObj.quantity);
                            }
                        } else {
                            this.stockStatus(false);
                            this.stockAvailable(0);
                        }
                        return;
                    }
                }
            },

            refreshSkuData: function(selectedSKUObj) {
                this.refreshSkuPrice(selectedSKUObj);
                this.refreshSkuStockStatus(selectedSKUObj);
            },

            // this method  returns a map of all the options selected by the user for the product
            getSelectedSkuOptions: function(variantOptions) {

                var selectedOptions = [],
                    listingVariantImage;
                for (var i = 0; i < variantOptions.length; i++) {
                    if (!variantOptions[i].disable()) {
                        selectedOptions.push({
                            'optionName': variantOptions[i].optionDisplayName,
                            'optionValue': variantOptions[i].selectedOption().key,
                            'optionId': variantOptions[i].actualOptionId,
                            'optionValueId': variantOptions[i].selectedOption().value
                        });
                        widgetModel.wishListStatus(true);
                    } else {
                        widgetModel.wishListStatus(false);
                        // widgetModel.wishListValidation();
                        return false;
                    }
                }

                return selectedOptions;
            },
            /*wishListValidation : function() {
                  //error validation
                  var keyArr = [];
                  $('.cc-skuDropdown').each(function() {
                      var for_ = $(this).attr('data-for').toLowerCase();
                      var value = $(this).find('option:selected').text().trim().toLowerCase();
                      if( value === 'select ' + for_){
                          keyArr.push(for_);
                      }
                      
                  });
                  var errMsg = 'please select';
                  for(var i = 0; i < keyArr.length; i++){
                      switch(i){
                          case 0:
                              errMsg += (' ' + keyArr[i]);
                              break;
                          case 1:
                              errMsg += (' and ' + keyArr[i]);
                              break;
                      }
                  }
                  if(keyArr.length){
                      $('#err').text(errMsg).show();
                      return;
                  }
            }, */

            // this function  assign  sku specific image for style based item
            assignSkuIMage: function(newProduct, selectedSKU) {
                var variants, listingVariantId, listingVariantValues = {};
                for (var typeIdx = 0, typeLen = this.productTypes().length; typeIdx < typeLen; typeIdx++) {
                    if (this.productTypes()[typeIdx].id == newProduct.type) {
                        variants = this.productTypes()[typeIdx].variants;
                        for (var variantIdx = 0; variantIdx < variants.length; variantIdx++) {
                            if (variants[variantIdx].listingVariant) {
                                listingVariantId = variants[variantIdx].id;
                                listingVariantValues = variants[variantIdx].values;
                                break;
                            }
                        }
                    }
                }
                if (newProduct.childSKUs) {
                    for (var childSKUsIdx = 0; childSKUsIdx < newProduct.childSKUs.length; childSKUsIdx++) {
                        if (newProduct.childSKUs[childSKUsIdx][listingVariantId] === selectedSKU[listingVariantId] &&
                            !selectedSKU.primaryThumbImageURL) {
                            selectedSKU.primaryThumbImageURL = newProduct.childSKUs[childSKUsIdx].primaryThumbImageURL;
                            break;
                        }

                    }
                }
            },

            allOptionsSelected: function() {
                var allOptionsSelected = true;
                if (this.variantOptionsArray().length > 0) {
                    var variantOptions = this.variantOptionsArray();
                    for (var i = 0; i < variantOptions.length; i++) {
                        if (!variantOptions[i].selectedOption.isValid() && !variantOptions[i].disable()) {
                            allOptionsSelected = false;
                            this.selectedSku(null);
                            break;
                        }
                    }

                    if (allOptionsSelected) {
                        // get the selected sku based on the options selected by the user
                        var selectedSKUObj = this.getSelectedSku(variantOptions);
                        if (selectedSKUObj === null) {
                            return false;
                        }
                        this.selectedSku(selectedSKUObj);
                    }
                    this.refreshSkuData(this.selectedSku());
                }

                return allOptionsSelected;
            },

            quantityIsValid: function() {
                return this.itemQuantity() > 0 && this.itemQuantity() <= this.stockAvailable();
            },

            // this method validated if all the options of the product are selected
            validateAddToCart: function() {

                var AddToCartButtonFlag = this.allOptionsSelected() && this.stockStatus() && this.quantityIsValid() && (this.listPrice() != null);
                // Requirement for configurable items. Do not allow item to be added to cart.
                if ((this.variantOptionsArray().length > 0) && this.selectedSku()) {
                    AddToCartButtonFlag = AddToCartButtonFlag &&
                        !this.selectedSku().configurable;
                } else {
                    // Check if the product is configurable. Since the product has only
                    // one sku,
                    // it should have the SKU as configurable.
                    AddToCartButtonFlag = AddToCartButtonFlag &&
                        !this.product().isConfigurable();
                }
                if (!AddToCartButtonFlag) {
                    $('#cc-prodDetailsAddToCart').attr("aria-disabled", "true");
                }

                return AddToCartButtonFlag;

            },

            handleChangeQuantity: function(data, event) {
                var quantity = this.itemQuantity();

                if (quantity < 1) {
                    /* //console.log('<= 0');*/
                } else if (quantity > this.stockAvailable()) {
                    //console.log('> orderable quantity');
                }

                return true;
            },

            // Sends a message to the cart to add this product
            handleAddToCart: function(event) {
                 
                 var widget="";
                 widget = this;
                 
               

                    if ($(window).width() >= 1025) { 
                              $('.modal-backdrop').remove();
                              $('body').removeClass('modal-open');
                              $('#mobilAddCart').modal('hide')
                          }
                    else if($(window).width() < 1025){
                        $('#mobilAddCart').modal('show')
                    }
                    $(window).on('resize', function(){
                          var win = $(this); //this = window
                          if (win.width() >= 1025) { 
                              $('.modal-backdrop').remove();
                              $('body').removeClass('modal-open');
                              $('#mobilAddCart').modal('hide')
                          }

                    });
                    
                    //Ends
                    
                /*   $(".glyphicon-cart-btn").addClass("glyphicon-ok");*/

                var variantOptions = this.variantOptionsArray();
                notifier.clearSuccess(this.WIDGET_ID);
                //get the selected options, if all the options are selected.
                var selectedOptions = this.getSelectedSkuOptions(variantOptions);

                var selectedOptionsObj = {
                    'selectedOptions': selectedOptions
                };


                var SurchargeProduct = this.selectedSku().x_surchargeProduct;
                var newProduct = {};

                 if(SurchargeProduct != null && this.koSkuSurchargeFlag() == true){
                    //console.log("Surcharge Product");
                    //console.log(selectedOptionsObj,'selectedOptionsObj');
                    
                        
                        newProduct = $.extend(true, {}, this.koSurchargeData(),selectedOptionsObj);
                        
                        
                        newProduct.childSKUs = [this.koSurchargeData().childSKUs[0]];
                        newProduct.orderQuantity = parseInt(this.itemQuantity(), 10);
                        addProductId = newProduct.id;
                        
                        $.when($.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{
                                message: "success"
                            }])).then(function() {
                        });
                    
                }else{
                    //console.log("Normal Product");
                    var newProduct = $.extend(true, {}, this.product().product, selectedOptionsObj);
                        newProduct.orderQuantity = parseInt(this.itemQuantity(), 10);
                        addProductId = newProduct.id;
                        
                        if (this.selectedSku() && !this.selectedSku().primaryThumbImageURL) {
                            this.assignSkuIMage(newProduct, this.selectedSku());
                        }
                        if (this.variantOptionsArray().length > 0) {
                            //assign only the selected sku as child skus
                            newProduct.childSKUs = [this.selectedSku()];
                        }

                
                 
                /*$.Topic(pubsub.topicNames.CART_ADD).publishWith(
                  newProduct,[{message:"success"}]);*/
                $.when($.Topic(pubsub.topicNames.CART_ADD).publishWith(
                    newProduct, [{
                        message: "success"
                        }])).then(function() {});



                    // Attentive Add to cart
                        if(this.selectedSku()){
                            var prodData = this.product().product;
                            window.attentive.analytics.addToCart({ 
                                items: [{
                                    productId: prodData.id,
                                    productVariantId: this.selectedSku().repositoryId,
                                    name: prodData.displayName,
                                    productImage: 'https://www.petmate.com/' + prodData.primaryFullImageURL,
                                    category: prodData.parentCategory.displayName,
                                    price: {
                                        value: this.selectedSku().listPrice,
                                        currency: 'USD',
                                    }
                                }]
                            })
                        }                  
                    /*Ends*/
                    //Klaviyo Added to Cart
                    if (this.selectedSku()) {
                        var prodData = this.product().product;
                        var selectedSku = this.selectedSku();
                        $("script[id='klaviyoAddedCart']").remove();
                        if ($("script[id='klaviyoAddedCart']").length === 0) {
                            setTimeout(function() {
                                var getWidget = widget;
                                var klaviyoLineItems = [];
                                var klaviyoItemName = [];
                                var shoppingCartItems = []
                                shoppingCartItems = getWidget.cart().items();
                                $.each(shoppingCartItems, function(k, v) {
                                    var values = v.productData();
                                    var displayName = values.displayName.replace(/"/g, "");
                                    var lineItemsObj = {};
                                    lineItemsObj.ProductID = values.id;
                                    lineItemsObj.SKU = displayName;
                                    lineItemsObj.ProductName = displayName;
                                    lineItemsObj.Quantity = v.quantity();
                                    lineItemsObj.ItemPrice = v.listPrice;
                                    lineItemsObj.RowTotal = v.listPrice;
                                    lineItemsObj.ProductURL = 'https://www.petmate.com/' + values.route;
                                    lineItemsObj.ImageURL = 'https://www.petmate.com/' + values.primaryFullImageURL;
                                    lineItemsObj.ProductCategories = values.brandCategory;
                                    klaviyoItemName.push(displayName);
                                    klaviyoLineItems.push(JSON.stringify(lineItemsObj));
                                })
                                var displayName = prodData.displayName.replace(/"/g, "");
                                var klaviyoAddedCart = '<script id="klaviyoAddedCart" type="text/javascript">' +
                                    '_learnq.push(["track", "Added to Cart", {' +
                                    '"$value":"' + getWidget.cart().subTotal() + '",' +
                                    '"AddedItemProductName":"' + displayName + '",' +
                                    '"AddedItemProductID":"' + prodData.id + '",' +
                                    '"AddedItemSKU":"' + selectedSku.repositoryId + '",' +
                                    '"AddedItemCategories":["' + prodData.brandCategory + '"],' +
                                    '"AddedItemImageURL":"https://www.petmate.com' + selectedSku.primaryFullImageURL + '",' +
                                    '"AddedItemURL":"https://www.petmate.com' + prodData.route + '",' +
                                    '"AddedItemPrice":"' + selectedSku.listPrice + '",' +
                                    '"AddedItemQuantity":"' + getWidget.itemQuantity() + '",' +
                                    '"ItemNames": "[' + klaviyoItemName + ']' + '",' +
                                    '"CheckoutURL": "https://www.petmate.com/checkout",' +
                                    '"Items": [' + klaviyoLineItems + ']' +
                                    '}]);' +
                                    '</script>'
                                $("head").append(klaviyoAddedCart);
                            }, 500)

                        }

                    }
                    /*Ends*/
                }
                
                
                
                $('#err').text('item successfully added to cart').addClass('success').show();

                // To disable Add to cart button for three seconds when it is clicked and enabling again
                this.isAddToCartClicked(true);
                var self = this;
                setTimeout(enableAddToCartButton, 3000);

                function enableAddToCartButton() {
                    self.isAddToCartClicked(false);
                };

                //widget upgrade code change
                if (self.isInDialog()) {
                    $(".modal").modal("hide");
                }

                dataLayer.push({
                    'event': 'virtualPageView',
                    'page': {
                        'url': '/cart'
                    }
                });
            },

            /**
             * Retrieve list of spaces for a user
             */
            getSpaces: function(callback) {
                var widget = this;
                var successCB = function(result) {
                    var mySpaceOptions = [];
                    var joinedSpaceOptions = [];
                    if (result.response.code.indexOf("200") === 0) {

                        //spaces
                        var spaces = result.items;
                        spaces.forEach(function(space, index) {
                            var spaceOption = {
                                spaceid: space.spaceId,
                                spaceNameFull: ko.observable(space.spaceName),
                                spaceNameFormatted: ko.computed(function() {
                                    return space.spaceName + " (" + space.creatorFirstName + " " + space.creatorLastName + ")";
                                }, widget),
                                creatorid: space.creatorId,
                                accessLevel: space.accessLevel,
                                spaceOwnerFirstName: space.creatorFirstName,
                                spaceOwnerLastName: space.creatorLastName
                            };

                            // if user created the space, add it to My Spaces, otherwise add it to Joined Spaces
                            if (space.creatorId == swmRestClient.apiuserid) {
                                mySpaceOptions.push(spaceOption);
                            } else {
                                joinedSpaceOptions.push(spaceOption);
                            }
                        });

                        // sort each group alphabetically
                        mySpaceOptions.sort(mySpacesComparator);
                        joinedSpaceOptions.sort(joinedSpacesComparator);

                        widget.spaceOptionsGrpMySpacesArr(mySpaceOptions);
                        widget.spaceOptionsGrpJoinedSpacesArr(joinedSpaceOptions);

                        var groups = [];
                        var mySpacesGroup = {
                            label: widget.translate('mySpacesGroupText'),
                            children: ko.observableArray(widget.spaceOptionsGrpMySpacesArr())
                        };
                        var joinedSpacesGroup = {
                            label: widget.translate('joinedSpacesGroupText'),
                            children: ko.observableArray(widget.spaceOptionsGrpJoinedSpacesArr())
                        };

                        var createOptions = [];
                        var createNewOption = {
                            spaceid: "createnewspace",
                            spaceNameFull: ko.observable(widget.translate('createNewSpaceOptText'))
                        };
                        createOptions.push(createNewOption);
                        var createNewSpaceGroup = {
                            label: "",
                            children: ko.observableArray(createOptions)
                        };

                        groups.push(mySpacesGroup);
                        groups.push(joinedSpacesGroup);
                        groups.push(createNewSpaceGroup);
                        widget.spaceOptionsArray(groups);
                        widget.mySpaces(mySpaceOptions);

                        if (callback) {
                            callback();
                        }
                    }
                };
                var errorCB = function(resultStr, status, errorThrown) {};

                swmRestClient.request('GET', '/swm/rs/v1/sites/{siteid}/spaces', '', successCB, errorCB, {});
            },

            // SC-4166 : ajax success/error callbacks from beforeAppear does not get called in IE9, ensure dropdown options are populated when opening dropdown
            openAddToWishlistDropdownSelector: function() {
                var widget = this;
                if (widget.spaceOptionsArray().length === 0) {
                    widget.getSpaces();
                }
            },
            // this method validates if all the options of the product are selected before allowing
            // add to space. Unlike validateAddToCart, however, it does not take into account inventory.
            validateAddToSpace: function() {
                var allOptionsSelected = true;
                if (this.variantOptionsArray().length > 0) {
                    var variantOptions = this.variantOptionsArray();
                    for (var i = 0; i < variantOptions.length; i++) {
                        if (!variantOptions[i].selectedOption.isValid() && !variantOptions[i].disable()) {
                            allOptionsSelected = false;
                            break;
                        }
                    }
                    if (allOptionsSelected) {
                        // get the selected sku based on the options selected by the user
                        var selectedSKUObj = this.getSelectedSku(variantOptions);

                        var skuPriceData = this.product().getSkuPrice(selectedSKUObj);
                        if (selectedSKUObj === null || skuPriceData.listPrice === null) {
                            return false;
                        }
                    }
                } else { //if no variants are there check product listPrice is not null
                    if (this.listPrice() == null) {
                        return false;
                    }
                }

                // Requirement for configurable items. Do not allow item to be added to WL.
                if ((this.variantOptionsArray().length > 0) && this.selectedSku()) {
                    allOptionsSelected = allOptionsSelected &&
                        !this.selectedSku().configurable;
                } else {
                    // Check if the product is configurable. Since the product has only
                    // one sku,
                    // it should have the SKU as configurable.
                    allOptionsSelected = allOptionsSelected &&
                        !this.product().isConfigurable();
                }

                // get quantity input value
                var quantityInput = this.itemQuantity();
                if (quantityInput.toString() != "") {
                    if (!quantityInput.toString().match(/^\d+$/) || Number(quantityInput) < 0) {
                        return false;
                    }
                }

                var addToSpaceButtonFlag = allOptionsSelected && this.product().childSKUs().length > 0;
                if (!addToSpaceButtonFlag) {
                    $('#cc-prodDetailsAddToSpace').attr("aria-disabled", "true");
                }

                return addToSpaceButtonFlag;
            },

            //check whether all the variant options are selected and if so, populate selectedSku with the correct sku of the product.
            //this is generic method, can be reused in validateAddToSpace and validateAddToCart in future
            validateAndSetSelectedSku: function(refreshRequired) {
                var allOptionsSelected = true;
                if (this.variantOptionsArray().length > 0) {
                    var variantOptions = this.variantOptionsArray();
                    for (var i = 0; i < variantOptions.length; i++) {
                        if (!variantOptions[i].selectedOption.isValid() && !variantOptions[i].disable()) {
                            allOptionsSelected = false;
                            this.selectedSku(null);
                            break;
                        }
                        // //console.log(variantOptions,'variant options');
                    }
                    if (allOptionsSelected) {
                        // get the selected sku based on the options selected by the user
                        var selectedSKUObj = this.getSelectedSku(variantOptions);
                        if (selectedSKUObj === null) {
                            return false;
                        }
                        this.selectedSku(selectedSKUObj);
                    }
                    if (refreshRequired) {
                        this.refreshSkuData(this.selectedSku());
                    }
                }
                return allOptionsSelected;
            },

            // displays Add to Space modal
            addToSpaceClick: function(widget) {
                var variantOptions = this.variantOptionsArray();
                notifier.clearSuccess(this.WIDGET_ID);

                //get the selected options, if all the options are selected.
                var selectedOptions = this.getSelectedSkuOptions(variantOptions);
                //console.log(widgetModel.wishListStatus());
                if (widgetModel.wishListStatus() !== false) {
                    var selectedOptionsObj = {
                        'selectedOptions': selectedOptions
                    };
                    var newProduct = $.extend(true, {}, this.product().product, selectedOptionsObj);
                    newProduct.desiredQuantity = this.itemQuantity();

                    if (this.variantOptionsArray().length > 0) {
                        //assign only the selected sku as child skus
                        newProduct.childSKUs = [this.selectedSku()];
                    }
                    newProduct.productPrice = (newProduct.salePrice != null) ? newProduct.salePrice : newProduct.listPrice;
                    $.Topic(pubsub.topicNames.SOCIAL_SPACE_ADD).publishWith(newProduct, [{
                        message: "success"
                    }]);
                    dataLayer.push({
                        'event': 'virtualPageView',
                        'page': {
                            'url': '/wishlist'
                        }
                    });
                }
            },

            // displays Add to Space modal, triggered from selector button
            addToSpaceSelectorClick: function(widget) {
                var variantOptions = this.variantOptionsArray();
                notifier.clearSuccess(this.WIDGET_ID);

                //get the selected options, if all the options are selected.
                var selectedOptions = this.getSelectedSkuOptions(variantOptions);
                var selectedOptionsObj = {
                    'selectedOptions': selectedOptions
                };
                var newProduct = $.extend(true, {}, this.product().product, selectedOptionsObj);
                newProduct.desiredQuantity = this.itemQuantity();

                if (this.variantOptionsArray().length > 0) {
                    //assign only the selected sku as child skus
                    newProduct.childSKUs = [this.selectedSku()];
                }
                newProduct.productPrice = (newProduct.salePrice != null) ? newProduct.salePrice : newProduct.listPrice;
                $.Topic(pubsub.topicNames.SOCIAL_SPACE_SELECTOR_ADD).publishWith(newProduct, [{
                    message: "success"
                }]);
            },

            // automatically add product to selected space
            addToSpaceSelect: function(widget, spaceId) {
                var variantOptions = this.variantOptionsArray();
                notifier.clearSuccess(this.WIDGET_ID);

                //get the selected options, if all the options are selected.
                var selectedOptions = this.getSelectedSkuOptions(variantOptions);
                var selectedOptionsObj = {
                    'selectedOptions': selectedOptions
                };
                var newProduct = $.extend(true, {}, this.product().product, selectedOptionsObj);
                newProduct.desiredQuantity = this.itemQuantity();

                if (this.variantOptionsArray().length > 0) {
                    //assign only the selected sku as child skus
                    newProduct.childSKUs = [this.selectedSku()];
                }
                newProduct.productPrice = (newProduct.salePrice != null) ? newProduct.salePrice : newProduct.listPrice;
                $.Topic(pubsub.topicNames.SOCIAL_SPACE_ADD_TO_SELECTED_SPACE).publishWith(newProduct, [spaceId]);
            },

            /**
             * Fetch Facebook app id
             */
            fetchFacebookAppId: function() {
                var widget = this;
                var serverType = CCConstants.EXTERNALDATA_PRODUCTION_FACEBOOK;
                if (widget.isPreview()) {
                    serverType = CCConstants.EXTERNALDATA_PREVIEW_FACEBOOK;
                }
                ccRestClient.request(CCConstants.ENDPOINT_MERCHANT_GET_EXTERNALDATA,
                    null, widget.fetchFacebookAppIdSuccessHandler.bind(widget),
                    widget.fetchFacebookAppIdErrorHandler.bind(widget),
                    serverType);
            },

            /**
             * Fetch Facebook app id successHandler, update local and global scope data
             */
            fetchFacebookAppIdSuccessHandler: function(pResult) {
                var widget = this;
                widget.siteFbAppId(pResult.serviceData.applicationId);

                //if (widget.siteFbAppId()) {
                //  facebookSDK.init(widget.siteFbAppId());
                //}
            },

            /**
             * Fetch Facebook app id error handler
             */
            fetchFacebookAppIdErrorHandler: function(pResult) {
                logger.debug("Failed to get Facebook appId.", result);
            },

            // Share product to FB
            shareProductFbClick: function() {
                var widget = this;

                // open fb share dialog
                var protocol = window.location.protocol;
                var host = window.location.host;
                //Widget Upgrade Code Change
                var productUrlEncoded = encodeURIComponent(protocol + "//" + host + widget.product().route());

                var appID = widget.siteFbAppId();
                // NOTE: Once we can support the Facebook Crawler OG meta-tags, then we should try and use the newer Facebook Share Dialog URL
                //       (per https://developers.facebook.com/docs/sharing/reference/share-dialog).  Until then, we will use a legacy
                //       share URL.  Facebook may eventually not support this older URL, so would be good to replace it as soon as possible.
                //var fbShareUrl = "https://www.facebook.com/dialog/share?app_id=" + appID + "&display=popup&href=" + spaceUrlEncoded + "&redirect_uri=https://www.facebook.com";
                var fbShareUrl = "https://www.facebook.com/sharer/sharer.php?app_id=" + appID + "&u=" + productUrlEncoded;
                var facebookWin = window.open(fbShareUrl, 'facebookWin', 'width=720, height=500');
                if (facebookWin) {
                    facebookWin.focus();
                }
            },

            // Share product to Twitter
            shareProductTwitterClick: function() {
                var widget = this;
                var productNameEncoded = encodeURIComponent(widget.product().displayName());
                var protocol = window.location.protocol;
                var host = window.location.host;
                //Widget Upgrade Code Change
                var productUrlEncoded = encodeURIComponent(protocol + "//" + host + widget.product().route());
                var twitterWin = window.open('https://twitter.com/share?url=' + productUrlEncoded + '&text=' + productNameEncoded, 'twitterWindow', 'width=720, height=500');
                if (twitterWin) {
                    twitterWin.focus();
                }
            },

            // Share product to Pinterest
            shareProductPinterestClick: function() {
                var widget = this;
                var productNameEncoded = encodeURIComponent(widget.product().displayName());
                var protocol = window.location.protocol;
                var host = window.location.host;
                //Widget Upgrade Code Change
                var productUrlEncoded = encodeURIComponent(protocol + "//" + host + widget.product().route());
                var productMediaEncoded = encodeURIComponent(protocol + "//" + host + widget.product().primaryLargeImageURL());




                //var pinterestWin = window.open('http://pinterest.com/pin/create/bookmarklet/?url=' + productUrlEncoded + '&description=' + productNameEncoded + '&media=' + productMediaEncoded, 'pinterestWindow', 'width=720, height=500');

                var pinterestWin = window.open('http://pinterest.com/pin/create/bookmarklet/?media=' + productMediaEncoded + '&url=' + productUrlEncoded + 'e&description=' + productNameEncoded + '%2C%20available%20at%20%23surlatable&is_video=false', 'pinterestWindow', 'width=720, height=500');

                if (pinterestWin) {
                    pinterestWin.focus();
                }
            },

            // Share product by Email
            shareProductEmailClick: function() {
                var widget = this;
                var mailto = [];
                var protocol = window.location.protocol;
                var host = window.location.host;
                //Widget Upgrade Code Change
                var productUrl = protocol + "//" + host + widget.product().route();
                mailto.push("mailto:?");
                mailto.push("subject=");
                mailto.push(encodeURIComponent(widget.translate('shareProductEmailSubject', {
                    'productName': widget.product().displayName()
                })));
                mailto.push("&body=");
                var body = [];
                body.push(widget.translate('shareProductEmailBodyIntro', {
                    'productName': widget.product().displayName()
                }));
                body.push("\n\n");
                body.push(productUrl);
                mailto.push(encodeURIComponent(body.join("")));
                window.location.href = mailto.join("");
            },

            handleLoadEvents: function(eventName) {
                if (eventName.toUpperCase() === LOADING_EVENT) {
                    spinner.create(productLoadingOptions);
                    $('#cc-product-spinner').css('z-index', 1);
                } else if (eventName.toUpperCase() === LOADED_EVENT) {
                    this.removeSpinner();
                }
            },
            // Loads the Magnifier and/or Viewer, when required
            loadImage: function() {
                if (resourcesAreLoaded) {
                    var contents = $('#cc-image-viewer').html();
                    if (!contents) {
                        if (this.viewportWidth() > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                            this.loadMagnifier();
                        } else if (this.viewportWidth() >= CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) {
                            this.loadZoom();
                        } else {
                            //Load zoom on carousel
                            this.loadCarouselZoom();
                        }
                    } else {
                        this.loadViewer(this.handleLoadEvents.bind(this));
                    }
                } else if (resourcesNotLoadedCount++ < resourcesMaxAttempts) {
                    //setTimeout(this.loadImage,500);
                    this.loadImage;

                }
            },

            /*Thumbnail Image Repeat Fix*/
            groupImages: function(imageSrc) {

                var self = this;
                var images = [];
                var selectedOneSrc;
                var tempImageSrc = [];
                if (imageSrc) {
                    for (var j = 0; j < imageSrc.length; j++) {
                        if (j === 0) {
                            selectedOneSrc = imageSrc[j];
                        } else {
                            if (imageSrc[j] === selectedOneSrc) {
                                continue;
                            }
                        }
                        if (tempImageSrc.indexOf(imageSrc[j]) == -1) {

                            tempImageSrc.push(imageSrc[j]);
                        }

                    }
                    if (tempImageSrc) {
                        for (var i = 0; i < tempImageSrc.length; i++) {
                            if (i % 4 === 0) {
                                images.push(ko.observableArray([tempImageSrc[i]]));
                            } else {
                                images[images.length - 1]().push(tempImageSrc[i]);
                            }
                        }
                    }
                    self.koImageDisplayCount(tempImageSrc.length);
                }

                return images;
            },

            /*Ends*/



            /*groupImages: function(imageSrc) { 
               var self = this;
              var images = [];
              if (imageSrc) {
                for (var i = 0; i < imageSrc.length; i++) {
                  if (i % 4 == 0) {
                    images.push(ko.observableArray([imageSrc[i]]));
                  } else {
                    images[images.length - 1]().push(imageSrc[i]);
                  }
                }
              }
              return images;
                
            },*/
            /* checkitem: function() { // check function
                       var $this = $('#prodDetails-imgCarousel');
                       if ($('.carousel-inner .item:first').hasClass('active')) {
                           $('.left carousel-control').css('opacity', '0');
                           $this.children('.left.carousel-control').hide();
                           $this.children('.right.carousel-control').show();
                       } else if ($('.carousel-inner .item:last').hasClass('active')) {
                           //console.log("-----lastItem-------------");
                           $this.children('.left.carousel-control').show();
                           $this.children('.right.carousel-control').hide();
                       } else {
                           $this.children('.carousel-control').show();

                       }
                   }, */

            handleCarouselArrows: function(data, event) {
                // Handle left key
                if (event.keyCode == 37) {
                    $('#prodDetails-imgCarousel').carousel('prev');
                }
                // Handle right key
                if (event.keyCode == 39) {
                    $('#prodDetails-imgCarousel').carousel('next');
                }
            },

            handleCycleImages: function(data, event, index, parentIndex) {
                var absoluteIndex = index + parentIndex * 4;
                // Handle left key
                if (event.keyCode == 37) {
                    if (absoluteIndex == 0) {
                        $('#prodDetails-imgCarousel').carousel('prev');
                        $('#carouselLink' + (this.product().thumbImageURLs.length - 1)).focus();
                    } else if (index == 0) {
                        // Go to prev slide
                        $('#prodDetails-imgCarousel').carousel('prev');
                        $('#carouselLink' + (absoluteIndex - 1)).focus();
                    } else {
                        $('#carouselLink' + (absoluteIndex - 1)).focus();
                    }
                }
                // Handle right key
                if (event.keyCode == 39) {
                    if (index == 3) {
                        $('#prodDetails-imgCarousel').carousel('next');
                        $('#carouselLink' + (absoluteIndex + 1)).focus();
                    } else if (absoluteIndex == (this.product().thumbImageURLs.length - 1)) {
                        // Extra check when the item is the last item of the carousel
                        $('#prodDetails-imgCarousel').carousel('next');
                        $('#carouselLink0').focus();
                    } else {
                        $('#carouselLink' + (absoluteIndex + 1)).focus();
                    }
                }
            },

            loadImageToMain: function(data, event, index) {
             
              //  console.log("data, index...........", data, index)
              //  console.log("this.product().mediumImageURLs...........", ko.toJS(this.product().mediumImageURLs()))
                //console.log("this.product().thumbImageURLs...........", ko.toJS(this.product().thumbImageURLs()))
                 var tempActiveIndex = 0;
              if (data.type === 'video') {
                    $('#iframe').attr('src', data.mainImageContainer);
                    $('.video-holder').removeClass('hide');
                    $('.video-holder').addClass('show');
                    $('.cc-image-area').hide();
                  //  tempActiveIndex = index;
                    
                }
                else {
                          $('#iframe').attr('src', "");
                          $('.video-holder').removeClass('show');
                          $('.video-holder').addClass('hide');
                       
                      
                     
                    for (var i = 0; i < widget.product().mediumImageURLs().length; i++) {
                        if(widget.product().mediumImageURLs()[i].indexOf(data.mediumImageContainer) !=-1) {
                            tempActiveIndex = i;
                        }
                         
                    } 
                   // setTimeout(function(){
                         $('.cc-image-area').show();
                  //  },500)
                     this.activeImgIndex(tempActiveIndex);
                     var localImg = this.product().mediumImageURLs()[tempActiveIndex];
                     this.mainImgUrl(localImg);
                     
                }
                
                
              
                return false;
            },

            assignImagesToProduct: function(pInput) {

                //  //console.log("this.firstTimeRender ...", this.firstTimeRender)

                if (this.firstTimeRender == true) {
                    this.product().primaryFullImageURL(pInput.primaryFullImageURL);
                    this.product().primaryLargeImageURL(pInput.primaryLargeImageURL);
                    this.product().primaryMediumImageURL(pInput.primaryMediumImageURL);
                    this.product().primarySmallImageURL(pInput.primarySmallImageURL);
                    this.product().primaryThumbImageURL(pInput.primaryThumbImageURL);
                    this.firstTimeRender = false;
                }

                //console.log("pInput.thumbImageURLs ...", pInput.thumbImageURLs)

                this.product().thumbImageURLs(pInput.thumbImageURLs);
                this.product().smallImageURLs(pInput.smallImageURLs);
                this.product().mediumImageURLs(pInput.mediumImageURLs);
                this.product().largeImageURLs(pInput.largeImageURLs);
                this.product().fullImageURLs([]);
                this.product().fullImageURLs(pInput.fullImageURLs);
                this.product().sourceImageURLs(pInput.sourceImageURLs);

                this.mainImgUrl(pInput.primaryFullImageURL);
                //this.imgGroups(this.groupImages(pInput.thumbImageURLs));
                this.activeImgIndex(0);
                this.activeImgIndex.valueHasMutated();

                //Thumbnail Image Incorrect display Fix 

                var tempArraymedium = [];
                var tempArrayFull = [];
                var tempArrayLarge = [];
                for (var i = 0; i < this.product().mediumImageURLs().length; i++) {
                    if (tempArraymedium.indexOf(this.product().mediumImageURLs()[i]) == -1) {
                        tempArraymedium.push(this.product().mediumImageURLs()[i])

                    }
                }
                this.product().mediumImageURLs(tempArraymedium);

                for (var j = 0; j < this.product().fullImageURLs().length; j++) {
                    if (tempArrayFull.indexOf(this.product().fullImageURLs()[j]) == -1) {
                        tempArrayFull.push(this.product().fullImageURLs()[j]);
                    }
                }
                this.product().fullImageURLs(tempArrayFull);

                for (var k = 0; k < this.product().largeImageURLs().length; k++) {
                    if (tempArrayLarge.indexOf(this.product().largeImageURLs()[k]) == -1) {
                        tempArrayLarge.push(this.product().largeImageURLs()[k]);
                    }
                }
                this.product().largeImageURLs(tempArrayLarge);
                
                this.imgGroupRendering();
                //Ends
            },
            
            imgGroupRendering: function() {
                var widget = this;
                widget.koImageContainer([]);
                if(widget.product()) {
                    for (var i = 0; i < widget.product().mediumImageURLs().length; i++) {
                        widget.koImageContainer.push({
                            'type': "image",
                            //"thumbImageContainer": "/ccstore/v1/images/?source=/file/products/"+widget.getFilename(widget.product().mediumImageURLs()[i])+".jpg&height=100&width=100",
                            "thumbImageContainer": widget.replaceThumbImage(widget.product().mediumImageURLs()[i]),
                            "mainImageContainer": widget.product().mediumImageURLs()[i],
                            'mediumImageContainer': widget.product().mediumImageURLs()[i],
                        });
                         
                    } 
                    
                    if (widget.product().hasOwnProperty('videoUrl')) {
                        if (widget.product().videoUrl() !== null) {
                            if (widget.product().videoUrl().indexOf(',') != -1) {
                                getYouTubePath = widget.product().videoUrl().split(',');
                                console.log(getYouTubePath, '....getYouTubePath.....');
                                for (var k = 0; k < getYouTubePath.length; k++) {
                                   // console.log(getYouTubePath[k],'getYouTubePath-------------')
                                   //widget.product().mediumImageURLs().unshift("https://img.youtube.com/vi/" + getYouTubePath[k] + "/0.jpg");
                                    widget.koImageContainer.push({
                                        'type': "video",
                                        "thumbImageContainer": "https://img.youtube.com/vi/" + getYouTubePath[k] + "/0.jpg",
                                        "mainImageContainer": "https://www.youtube.com/embed/" +getYouTubePath[k],
                                        "mediumImageContainer": "https://img.youtube.com/vi/" + getYouTubePath[k] + "/0.jpg"
                                    });
                                    
                                }
                            } else {
                               
                                getYouTubePath = widget.product().videoUrl();
                                 //console.log(getYouTubePath,'getYouTubePath else-------------')
                                // widget.product().mediumImageURLs().unshift("https://img.youtube.com/vi/" + getYouTubePath + "/0.jpg");
                                widget.koImageContainer.push({
                                    'type': "video",
                                    "thumbImageContainer": "https://img.youtube.com/vi/" + getYouTubePath + "/0.jpg",
                                    "mainImageContainer": "https://www.youtube.com/embed/" + getYouTubePath,
                                    "mediumImageContainer": "https://img.youtube.com/vi/" + getYouTubePath + "/0.jpg"
                                });
                                
                            }
                        }
                        
                       

                    }

                   widget.imgGroups(widget.groupImages(widget.koImageContainer()));
                   /*console.log("widget.product().thumbImageURLs().........", ko.toJS(widget.product().thumbImageURLs()));
                   console.log("widget.product().mediumImageURLs().........", ko.toJS(widget.product().mediumImageURLs()));
                   console.log("widget.imgGroups.........", ko.toJS(widget.imgGroups()));*/
                }
            },
            replaceThumbImage: function(getImage) {
                if(getImage.indexOf('&')!='-1'){
                  var getImageUrl = getImage.split('&');
                  return getImageUrl[0]+'&height=100&width=100';
                }
            },
          
            checkResponsiveFeatures: function(viewportWidth) {
                //if(viewportWidth > 978) 
                if (viewportWidth > 580) {
                    this.isMobile(false);
                }
                //else if(viewportWidth <= 978){
                else if (viewportWidth <= 580) {
                    this.isMobile(true);
                }
            },
            priceUnavailableText: function() {
                return CCi18n.t('ns.PetReDesignLastestPDPWidget:resources.priceUnavailable');
            },



            quantityUpdateValue: function(data, event) {
                /* var theEvent = evt || window.event;
                 var key = theEvent.keyCode || theEvent.which;
                 key = String.fromCharCode( key );
                 var regex = /[0-9]|\./;
                 if( !regex.test(key) ) {
                   theEvent.returnValue = false;
                   if(theEvent.preventDefault) theEvent.preventDefault();
                 }
                   */
                var widget = this;
                //  //console.log(data , '---data ---')  ;
                //  //console.log(event , '----event---');\
                //  //console.log($(event.currentTarget.value) , '$(event.currentTarget.value)');
                //  //console.log('event.keyCode',event.keyCode)
                var getVal = $(event.currentTarget.value);
                if($('#CC-prodDetails-quantity0').val().length <= 1){
                    if (event.keyCode == 96 || event.keyCode == 48) {
                        $(event.currentTarget).blur();
                        return widget.itemQuantity(1);
                    }
                }
                /*if (event.keyCode == 96 || event.keyCode == 48) {
                    $(event.currentTarget).blur();
                    return widget.itemQuantity(1);
                } else {*/
                    if (event.keyCode >= 65 && event.keyCode <= 90) {
                        // //console.log("alphabet entered")
                        return widget.itemQuantity(1);
                        $('#CC-prodDetails-quantity-itemError').css('display', 'none');
                    } else if (event.keyCode >= 47 && event.keyCode <= 57) {
                        //console.log("number entered") 
                        var widget = this;
                        var test = $(event.currentTarget.value);
                        return test;
                    }
                //}

            },


            quantityUpdateValueInreplacement: function(data, event) {
                var widget = this;
                var changeVal;
                //   //console.log(data , '---data ---')  ;
                //   //console.log(event , '----event---');
                if (event.keyCode == 96 || event.keyCode == 48) {
                    $(event.currentTarget).blur();
                    changeVal = $(event.currentTarget);
                    changeVal[0].value = 1;
                    return changeVal;
                } else {
                    var test = $(event.currentTarget.value);
                    return test;
                }


            },
            changeQty: function(item, event, qtyType) {
                var widget = this;
                // //console.log(ko.toJS(item),'---------item----');
                //console.log("change qty triggered",event);
                var target = $(event.currentTarget);
                //console.log('target',event);
                var type = target.attr('data-type');
                var test = $(event.currentTarget.parentNode.parentNode.children);
                //console.log("test",test)
                var qtyVal = test[1].value
                //console.log('test',qtyVal)
                var currentVal = parseInt(qtyVal);
                //console.log('currentval',currentVal)



                if (!isNaN(currentVal)) {
                    if (type == 'minus') {
                        if (currentVal > test[1].min) {
                            test[1].value = currentVal - 1;
                        }
                    } else if (type == 'plus') {
                        if (currentVal < test[1].max) {
                            //console.log("current val",test[1]);
                            test[1].value = currentVal + 1;

                        }

                    }
                    $(test).focus();
                    $(test).blur();
                    if (qtyType == "PDP") {
                        widget.itemQuantity(test[1].value);
                    }

                } else {
                    input.val(0);
                }

                return false;
            },



            getSkuColor: function(skuColorLength) {
                if (skuColorLength === 1) {
                    //$('.cc-skuDropdownColor').trigger('click');
                    return true;
                } else {
                    return false;
                }
            },
            getSkuSize: function(skuSizeLength) {
                
            //PDP Video Starts
                    $('#iframe').attr('src', "");
                    $('.video-holder').removeClass('show');
                    $('.video-holder').addClass('hide');
                    $('.cc-image-area').show();

            //Ends
                
                
                
                
                if (skuSizeLength === 1) {
                    //  $('.cc-skuDropdownSize').trigger('click');
                    return true;
                } else {
                    return false;
                }
            },
            getSkuSelected: function(selectedKeyValue, CurrentKeyValue) {
                if (selectedKeyValue.selectedOption() != undefined) {
                    if (selectedKeyValue.selectedOption().key == CurrentKeyValue) {
                        return true;
                    } else {
                        return false;
                    }

                }

            },
            resetProductVariants: function(data, event) {
                var widget = this;
                widgetModel.koSurchargePrice(null);
                var firstchildSKU = widget.product().childSKUs()[0];
                widgetModel.getItemnumber(firstchildSKU.repositoryId());

                $(".skuvariantOptionSection .cc-skuDropdownColor").removeClass('SelectedSku selectSkuValue');
                widgetModel.resetBtn(false);


                $("#CC-prodDetails-sku-PetProductType_color").val($("#CC-prodDetails-sku-PetProductType_color option:first").val()).change();
                $("#CC-prodDetails-sku-PetProductType_size").val($("#CC-prodDetails-sku-PetProductType_size option:first").val()).change()

            },
            //widget upgrade code change
            isInDialog: function() {
                return $("#CC-prodDetails-addToCart").closest(".modal").length;
            }
        };
    }
);
