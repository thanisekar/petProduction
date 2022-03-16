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
        // properties defined in the return are the actual module
        var brandCollectionJSON = {
   "items":[
      {
         "childCategories":[
			   {
				  "route":"/category/brand-Chuckit",
				  "displayName":"Chuckit!",
				  "id":"brand-Chuckit"
			   },
			   {
				  "route":"/category/brand-healthychews",
				  "displayName":"Healthy Chews",
				  "id":"brand-healthychews"
			   },
			   {
				  "route":"/category/brand-petqwerks",
				  "displayName":"Pet Qwerks",
				  "id":"brand-petqwerks"
			   },
			   {
				  "route":"/category/brand-jw",
				  "displayName":"JW",
				  "id":"brand-jw"
			   },
			   {
				  "route":"/category/brand-lazboy",
				  "displayName":"La-Z-Boy",
				  "id":"brand-lazboy"
			   },
			   {
				  "route":"/category/brand-vittlesvault",
				  "displayName":"Vittles Vault",
				  "id":"brand-vittlesvault"
			   },
			   {
				  "route":"/category/brand-gensevenpets",
				  "displayName":"Gen7 Pets",
				  "id":"brand-gensevenpets"
			   },
			   {
				  "route":"/category/brand-armandhammer",
				  "displayName":"Arm & Hammer",
				  "id":"brand-armandhammer"
			   },
			   {
				  "route":"/category/brand-fatcat",
				  "displayName":"Fat Cat",
				  "id":"brand-fatcat"
			   },
			   {
				  "route":"/category/brand-aspenpet",
				  "displayName":"Aspen Pet",
				  "id":"brand-aspenpet"
			   },
			   {
				  "route":"/category/brand-jackson-galaxy",
				  "displayName":"Jackson Galaxy",
				  "id":"brand-jackson-galaxy"
			   },
			   {
				  "route":"/category/brand-petmate",
				  "displayName":"Petmate",
				  "id":"brand-petmate"
			   },
			   {
				  "route":"/category/brand-precisionpetproducts",
				  "displayName":"Precision Pet Products",
				  "id":"brand-precisionpetproducts"
			   },
			   {
				  "route":"/category/brand-brandonmcMillan",
				  "displayName":"Brandon McMillan",
				  "id":"brand-brandonmcMillan"
			   },
			   {
				  "route":"/category/brand-dogzilla",
				  "displayName":"Dogzilla",
				  "id":"brand-dogzilla"
			   },
			   {
				  "route":"/category/brand-ruffmaxx",
				  "displayName":"Ruffmaxx",
				  "id":"brand-ruffmaxx"
			   },
			   {
				  "route":"/category/brand-Snoozzy",
				  "displayName":"SnooZZy",
				  "id":"brand-Snoozzy"
			   },
			   {
				  "route":"/category/brand-booda",
				  "displayName":"Booda",
				  "id":"brand-booda"
			   },
			   {
				  "route":"/category/brand-zoobilee",
				  "displayName":"Zoobilee",
				  "id":"brand-zoobilee"
			   }
			]
    
        }
]
		};
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

            koBrandCollectionData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),
            collectionsLoaded: false,

            // END Copied from the collection widget

            updateData: function (getData) {
                ko.mapping.fromJS(getData, {}, this.koBrandCollectionData);
            },

            getProductDetails: function () {
                var widget = this;
                widget.updateData(brandCollectionJSON.items[0].childCategories);
                widget.getCarouselArrow();
               /* ccRestClient.authenticatedRequest("/ccstoreui/v1/collections?categoryIds=" + widget.collectionId().toString() + "&fields=childCategories.id,childCategories.displayName,childCategories.route", {}, function (e) {
                
                    
                }, function (data) {}, "GET");*/
            },

            onLoad: function (widget) {
                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();
                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function () {
                    var groups = [];
                    if (widget.koBrandCollectionData) {
                        for (var i = 0; i < widget.koBrandCollectionData().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                //console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koBrandCollectionData()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koBrandCollectionData()[i]);
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

                $("body").delegate(".brandCollectionCarousel", "slid.bs.carousel", function (e) {
                    widget.getCarouselArrow()
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
                if ($('.brandCollectionCarousel .brand-carousel .item').length > 0) {
                    //console.log("brandCollectionCarousel")
                    $('#brand-carousel-controls a').removeClass('disabled');
                    if ($(".brand-carousel .item:first").hasClass("active")) {
                        //console.log('first item active');
                        $('#brand-carousel-left-control .brand-corousel-left').addClass('disabled');
                    } else if ($(".brand-carousel .item:last").hasClass("active")) {
                        //console.log('last item active');
                        $('#brand-carousel-right-control .brand-corousel-right').addClass('disabled');
                    } else {
                        $('#brand-carousel-controls a').removeClass('disabled');
                    }
                }
            }
        };
    }
);