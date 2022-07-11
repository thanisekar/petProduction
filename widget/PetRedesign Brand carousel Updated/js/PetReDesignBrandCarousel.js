define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, ccRestClient, ccConstants, storageApi) {

        "use strict";
        var productIds = '';
        var dataLayer = [];
        var bvData = '';
        // properties defined in the return are the actual module
        var brandCollectionJSON = {
            "items": [{
                "childCategories": [{
                        "route": "/category/brand-aspenpet",
                        "image": "/file/general/brand-aspenpet.jpg",
                        "displayName": "Aspen Pet",
                        "id": "brand-aspenpet"
                    },
                    {
                        "route": "/category/brand-armandhammer",
                        "image": "/file/general/brand-armandhammer.jpg",
                        "displayName": "Arm & Hammer",
                        "id": "brand-armandhammer"
                    },
                    {
                        "route": "/category/brand-booda",
                        "image": "/file/general/brand-booda.jpg",
                        "displayName": "Booda",
                        "id": "brand-booda"
                    },
                    {
                        "route": "/category/brand-brandonmcMillan",
                        "image": "/file/general/brand-brandonmcMillan.jpg",
                        "displayName": "Brandon McMillan",
                        "id": "brand-booda"
                    },
                    {
                        "route": "/category/brand-Chuckit",
                        "image": "/file/general/brand-Chuckit.jpg",
                        "displayName": "Chuckit!",
                        "id": "brand-Chuckit"
                    },
                    {
                        "route": "/category/brand-fatcat",
                        "image": "/file/general/brand-fatcat.jpg",
                        "displayName": "Fat Cat",
                        "id": "brand-fatcat"
                    },
                    {
                        "route": "/category/brand-gamma2",
                        "image": "/file/general/brand-gamma2.jpg",
                        "displayName": "Gamma2",
                        "id": "brand-gamma2"
                    },
                    {
                        "route": "/category/brand-gensevenpets",
                        "image": "/file/general/brand-gensevenpets.jpg",
                        "displayName": "Gen7 Pets",
                        "id": "brand-gensevenpets"
                    },
                    {
                        "route": "/category/brand-hyper-pet",
                        "image": "/file/general/brand-hyper-pet.jpg",
                        "displayName": "Hyper Pet",
                        "id": "brand-hyper-pet"
                    },
                    {
                        "route": "/category/brand-jackson-galaxy",
                        "image": "/file/general/brand-jackson-galaxy.jpg",
                        "displayName": "Jackson Galaxy",
                        "id": "brand-jackson-galaxy"
                    },
                    {
                        "route": "/category/brand-jw",
                        "image": "/file/general/brand-jw.jpg",
                        "displayName": "JW",
                        "id": "brand-jw"
                    },
                    {
                        "route": "/category/brand-lazboy",
                        "image": "/file/general/brand-lazboy.jpg",
                        "displayName": "La-Z-Boy",
                        "id": "brand-lazboy"
                    },
                    {
                        "route": "/category/brand-petqwerks",
                        "image": "/file/general/brand-petqwerks.jpg",
                        "displayName": "Pet Qwerks",
                        "id": "brand-petqwerks"
                    },
                    {
                        "route": "/category/brand-petmate",
                        "image": "/file/general/brand-petmate.jpg",
                        "displayName": "Petmate",
                        "id": "brand-petmate"
                    },
                    {
                        "route": "/category/brand-ruffmaxx",
                        "image": "/file/general/brand-ruffmaxx.jpg",
                        "displayName": "Ruffmaxx",
                        "id": "brand-ruffmaxx"
                    },
                    {
                        "route": "/category/brand-Snoozzy",
                        "image": "/file/general/brand-Snoozzy.jpg",
                        "displayName": "SnooZZy",
                        "id": "brand-Snoozzy"
                    },

                    {
                        "route": "/category/brand-vittlesvault",
                        "image": "/file/general/brand-vittlesvault.jpg",
                        "displayName": "Vittles Vault",
                        "id": "brand-vittlesvault"
                    },
                    {
                        "route": "/category/brand-zoobilee",
                        "image": "/file/general/brand-zoobilee.jpg",
                        "displayName": "Zoobilee",
                        "id": "brand-zoobilee"
                    }




                ]

            }]
        };
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

            koBrandCollectionData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),
            collectionsLoaded: false,

            // END Copied from the collection widget

            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koBrandCollectionData);
            },

            getProductDetails: function() {
                var widget = this;
                widget.updateData(brandCollectionJSON.items[0].childCategories);
                widget.getCarouselArrow();
                /* ccRestClient.authenticatedRequest("/ccstoreui/v1/collections?categoryIds=" + widget.collectionId().toString() + "&fields=childCategories.id,childCategories.displayName,childCategories.route", {}, function (e) {
                 
                     
                 }, function (data) {}, "GET");*/
            },

            onLoad: function(widget) {
                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();
                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
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

                widget.updateSpanClass = function() {
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

                $("body").delegate(".brandCollectionCarousel", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow()
                });
            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function(page) {
                var widget = this;
                widget.getProductDetails();
            },

            getCarouselArrow: function() {
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