define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, ccRestClient, ccConstants, storageApi) {

        "use strict";
        var productIds = '';
        var dataLayer = [];
        var bvData = '';
        var petMatepicks = [
            {
               "promotext":null,
               "startDateStr":"2019-02-22",
               "route":"/brandon-mcmillan-training-tool-kit/product/52087",
               "salePrice":null,
               "displayName":"Brandon McMillan Training Tool Kit",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v7625582670833103526/products/52087.TRAINING_TOOL_KIT.jpg&height=300&width=300",
               "id":"52087",
               "listPrice":"$19.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"2019-02-26",
               "route":"/petmate-pet-cafe-feeder-waterer-set/product/34053",
               "salePrice":null,
               "displayName":"Petmate Pet Cafe Feeder & Waterer Set",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v2655252750791052171/products/34053.PEARL_TAN.jpg&height=300&width=300",
               "id":"34053",
               "listPrice":"$36.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"01/01/2015",
               "route":"/petmate-clean-response-aluminum-spade-pan/product/71109",
               "salePrice":null,
               "displayName":"Petmate Clean Response Aluminum Spade & Pan",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v5634436826278378325/products/71109.BLACK_SILVER.jpg&height=300&width=300",
               "id":"71109",
               "listPrice":16.99,
               "minMaxPrice":"$16.99 - $24.99",
               "isminMaxprice":true,
               "IslistPrice":false,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"10/10/2018",
               "route":"/la-z-boy-duchess-fold-out-sleeper-sofa-with-iclean/product/85546",
               "salePrice":null,
               "displayName":"La-Z-Boy Duchess Fold Out Sleeper Sofa with iClean",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v4817716477928704118/products/85546.TEXTURED_GRAY.jpg&height=300&width=300",
               "id":"85546",
               "listPrice":"$199.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"04/02/2019",
               "route":"/chuckit-amphibous-fetch-balls-3-pack/product/32355",
               "salePrice":null,
               "displayName":"Chuckit! Amphibous Fetch Balls 3-Pack",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v2789344182990161962/products/32355.ORANGE_BLUE.jpg&height=300&width=300",
               "id":"32355",
               "listPrice":"$9.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":true
            },
            {
               "promotext":null,
               "startDateStr":"01/18/2019",
               "route":"/gen7pets-dress-blue-monaco-pet-stroller/product/G2350DB",
               "salePrice":null,
               "displayName":"Gen7Pets Dress Blue Monaco Pet Stroller",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v6240334059955592995/products/G2350DB.DRESS_BLUE.jpg&height=300&width=300",
               "id":"G2350DB",
               "listPrice":"$249.95",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"03/01/2016",
               "route":"/jackson-galaxy-comfy-clamshell/product/31385",
               "salePrice":null,
               "displayName":"Jackson Galaxy Comfy Clamshell",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v3888967220377657838/products/31385.PURPLE.jpg&height=300&width=300",
               "id":"31385",
               "listPrice":"$18.95",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"12/13/2016",
               "route":"/petmate-k9-control-retractable-leash/product/13994",
               "salePrice":null,
               "displayName":"Petmate K9 Control Retractable Leash",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v7035691235301268193/products/13994.BLACK.jpg&height=300&width=300",
               "id":"13994",
               "listPrice":17.95,
               "minMaxPrice":"$17.95 - $33.95",
               "isminMaxprice":true,
               "IslistPrice":false,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"01/01/2015",
               "route":"/fat-cat-big-mamas-scratch-n-play-ramp/product/610403",
               "salePrice":null,
               "displayName":"FAT CAT Big Mama's Scratch 'N Play Ramp",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v3920531259548497834/products/610403.MULTI.jpg&height=300&width=300",
               "id":"610403",
               "listPrice":"$19.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"01/01/2015",
               "route":"/petmate-kitty-kat-condo/product/25701",
               "salePrice":null,
               "displayName":"Petmate Kitty Kat Condo",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v4598734999407010477/products/25701.MOUSE_GRAY.jpg&height=300&width=300",
               "id":"25701",
               "listPrice":"$69.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":"EXCLUSIVE PETMATE OFFER",
               "startDateStr":"2018-11-28",
               "route":"/arm-hammer-sifting-litter-pan-value-pack/product/50099",
               "salePrice":null,
               "displayName":"Arm & Hammer Sifting Litter Pan Value Pack",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v5169103887986967097/products/50099.VALUE_PACK.jpg&height=300&width=300",
               "id":"50099",
               "listPrice":"$19.99",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            },
            {
               "promotext":null,
               "startDateStr":"10/25/2017",
               "route":"/jackson-galaxy-zip-mat/product/JG16",
               "salePrice":null,
               "displayName":"Jackson Galaxy Zip Mat",
               "x_freeShippingRibbon":null,
               "description":null,
               "onSale":false,
               "primarySmallImageURL":"/ccstore/v1/images/?source=/file/v3360429797649639843/products/JG16.GRAY.jpg&height=300&width=300",
               "id":"JG16",
               "listPrice":"$18.95",
               "isGetSalePrice":false,
               "isminMaxprice":false,
               "IslistPrice":true,
               "creationNewFlag":false
            }
         ]
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
            collectionsLoaded: false,


            // END Copied from the collection widget

            updateData: function (getData) {
                ko.mapping.fromJS(getData, {}, this.koDealsModelData);
            },
            getProductDetails: function () {
                var widget = this;
                widget.updateData(petMatepicks);
                 widget.getCarouselArrow();
                  
            },

            onLoad: function (widget) {
                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();
              
                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function () {
                    var groups = [];
                    if (widget.koDealsModelData) {
                        for (var i = 0; i < widget.koDealsModelData().length; i++) {
                            if (i % widget.itemsPerRow() === 0) {
                                //console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koDealsModelData()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koDealsModelData()[i]);
                            }
                        }
                    }
                    return groups;

                }, widget);

                widget.updateSpanClass = function () {
                    var classString = "";
                    var phoneViewItems = 0,
                        tabletViewItems = 0,
                        desktopViewItems = 0,
                        largeDesktopViewItems = 0;
                    //console.log(this.itemsPerRow(),'----Test---');
                    if (this.itemsPerRow() == this.itemsPerRowInPhoneView()) {
                        phoneViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInTabletView()) {
                        tabletViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInDesktopView()) {
                        desktopViewItems = 12 / this.itemsPerRow();
                        //console.log(desktopViewItems,'---desktopViewItems---')
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
                widget.checkResponsiveFeatures = function (viewportWidth) {
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
                    function () {
                        widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                        widget.viewportWidth($(window)[0].innerWidth || $(window).width());
                    });

                $("body").delegate(".collectionProdCarousel", "slid.bs.carousel", function (e) {
                    widget.getCarouselArrow();
                });

            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function (page) {
                var widget = this;
                
                widget.getProductDetails();
            },
            getCarouselArrow: function () {
                if ($('.home-carousel .item').length > 0) {
                    $('#cc-carousel-controls a').removeClass('disabled');
                    if ($(".home-carousel .item:first").hasClass("active")) {
                        $('#cc-carousel-left-control .corousel-left').addClass('disabled');
                    } else if ($(".home-carousel .item:last").hasClass("active")) {
                        $('#cc-carousel-right-control .corousel-right').addClass('disabled');
                    } else {
                        $('#cc-carousel-controls a').removeClass('disabled');
                    }
                }
            },
        };
    }
);