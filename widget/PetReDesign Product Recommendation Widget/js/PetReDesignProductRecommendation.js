define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pageLayout/product', 'ccLogger', 'ccRestClient', 'ccConstants', 'pubsub', 'js/recsRequest', 'pageLayout/cart', 'promise'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, Product, logger, ccRestClient, ccConstants, pubsub, recsRequest, cartModel) {

        "use strict";
        var curPageId;
        var newRoute = "";

        var addProductId = "";
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
            productGroups: ko.observableArray(),
            products: ko.observableArray(),
            titleText: ko.observable(),
            spanClass: ko.observable(),
            isCollectionVisible: ko.observable(true),
            variantOptionsArray: ko.observableArray([]),
            // END Copied from the collection widget

            onLoad: function(widget) {


                $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(function(page) {
                    curPageId = page.pageId;
                });

                // publishing with it the slotId (widget's Id), numRecs
                $.Topic(pubsub.topicNames.RECS_WHO_WANT_RECS).subscribe(function(obj) {
                    // pages() return an array of pageIds that this widget is to appear on
                    // pageIds are like 'home', 'product' and etc.
                    var pagesToAppearOn = widget.pages();

                    var pageIdInObj = obj.pageId;
                    if (pagesToAppearOn.indexOf(pageIdInObj) > -1) {
                        var eventObj = {};
                        eventObj.id = widget.id();
                        eventObj.numRecs = widget.numRecs();
                        eventObj.restriction = widget.restriction ? widget.restriction() : 'Blended';
                        eventObj.strategy = widget.strategy ? widget.strategy() : 'Unrestricted';
                        eventObj.pageId = curPageId;
                        $.Topic(pubsub.topicNames.RECS_WANT_RECS).publish(eventObj);
                    }
                });
                // End publishing RECS_WANT_RECS topic


                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();

                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
                    var groups = [];
                    if (widget.recommendations) {
                        for (var i = 0; i < widget.recommendations().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                //console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.recommendations()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.recommendations()[i]);
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

                /**
                 * Updates the focus when product details is loaded
                 */
                widget.updateFocus = function() {
                    $.Topic(pubsub.topicNames.UPDATE_LISTING_FOCUS).publish();
                    return true;
                };

                widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                $(window).resize(
                    function() {
                        widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                        widget.viewportWidth($(window)[0].innerWidth || $(window).width());
                    });

                // Add the callback function for when the widget is rendered
                // that applies the carousel.
                // This is called by the onRender binding handler used on the
                // carousel wrapper element.  The element that set the 
                // onRender callback is passed into the function.
                widget.applyCarouselCallback = function(element) {
                    // Apply the bootstrap carousel to the element.
                    // Setting "data-interval=false" in the template should mean 
                    // we don't have to specify "interval: false" here, but 
                    // there's a bug in bootstrap, so we need it for now.
                    // @see http://stackoverflow.com/questions/10521165/bootstrap-javascript-carousel-doesnt-stop-cycling
                    $(element).carousel({ interval: false });
                };

                // send a clickThru request to the recs server using IMGRequest
                widget.recordClickThru = function(recSetId, event, id) {
                    var requestPath = function(resource) {
                        var requestPathStr = widget.recsHostPortPath + "/" +
                            resource + "/3.0/json/" +
                            widget.site().tenantId +
                            (widget.recsVisitorId ? "/" + widget.recsVisitorId : "") +
                            (widget.recsSessionId ? "?sessionId=" + widget.recsSessionId : "");
                        return requestPathStr;
                    };

                    var fetchRecsHostnameSuccessHandler = function(pResult) {
                        var host = pResult.serviceData.host;
                        var port = pResult.serviceData.port;
                        var path = pResult.serviceData.path;

                        var portPart = "";
                        if (port && port !== null && port !== "" && port !== "0") {
                            portPart = ':' + port;
                        }
                        if (host && path) {
                            widget.recsHostPortPath = "//" + host + portPart + "/" + path;

                            new recsRequest.IMGRequest(requestPath("clickThru"), { 'click': { 'recSetId': recSetId, 'productId': id } });
                        } else {
                            logger.warning("Recs hostname not configured, this widget will do nothing");
                        }
                    };

                    var fetchRecsHostnameErrorHandler = function(pResult) {};

                    if (!widget.recsHostPortPath) {
                        ccRestClient.request(ccConstants.ENDPOINT_MERCHANT_GET_EXTERNALDATA, null,
                            fetchRecsHostnameSuccessHandler,
                            fetchRecsHostnameErrorHandler,
                            ccConstants.EXTERNALDATA_PRODUCTION_RECS
                        );
                    } else {
                        new recsRequest.IMGRequest(requestPath("clickThru"), { 'click': { 'recSetId': recSetId, 'productId': id } });
                    }
                    return true;
                };

                /**
                 * Get the data useful for recommendations from the CartViewModel.
                 * This returns both the simple list of productIds as well as objects with quantity and price data.
                 * In this way it is useful for both the cart and checkout information.
                 *
                 * @param model a CartViewModel instance
                 * @return a 2 index array where index 0 is the array of productIds and index 1 is the array of line item info
                 */
                var getProductDataFromCartViewModel = function(model) {
                        var items = model.items(),
                            item,
                            length = items.length,
                            productIds = [],
                            lineItemInfo = [];

                        while (length--) {
                            // get a reference so we don't have to use the index
                            item = items[length];

                            // push onto the array of productIds
                            productIds.push(item.productId);
                            // push onto the array of line item product info
                            lineItemInfo.push({
                                productId: item.productId,
                                quantity: item.quantity(),
                                price: item.itemTotal()
                            });
                        }

                        // return both lists
                        return [productIds, lineItemInfo];
                    },
                    populateCCProducts = function(recsObservableArray, uvRecsArray, recSetId, recsProducts) {
                        var listProducts = function(productIds) {
                            // Exit early if there's no need to call CC.
                            if (productIds.length == 0)
                                return Promise.resolve([]);

                            var data = {
                                storePriceListGroupId: widget.site().selectedPriceListGroup().id,
                                productIds: productIds
                            };

                            return new Promise(function(resolve, reject) {
                                ccRestClient.request(
                                    ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                                    data,
                                    resolve,
                                    function(response) { reject({ "response": response, "requestedProductIds": productIds }); }
                                );
                            });
                        }; // end of listProducts function.

                        // TODO: Change promise["catch"](fn) to promise.catch(fn) when CC no longer uses
                        //       Rhino to examine the JavaScript at startup.
                        listProducts(recsProducts.map(function(p) { return p.repositoryid; }))["catch"](
                                function(err) {
                                    if (err.response && err.response.status && (err.response.status.charAt(0) == "4") && err.response.errors) {
                                        var badIds = err.response.errors
                                            .filter(function(e) { return e.errorCode === "20031"; })
                                            .map(function(e) { return e.moreInfo; });
                                        var goodIds = err.requestedProductIds.filter(function(p) { return badIds.indexOf(p) < 0; })
                                        if (goodIds.length < err.requestedProductIds.length)
                                            return listProducts(goodIds);
                                    }
                                    return Promise.reject(); // Something isn't right.  Give up.
                                })
                            .then(function(response) {
                                response.forEach(function(product) {
                                    // use the storefront listing product which has a bunch of APIs for pricing
                                    // adding a recSetId for sending clickthru request
                                    recsObservableArray.push({
                                        id: product.id,
                                        recSetId: recSetId,
                                        ccProduct: new Product(product)
                                    });

                                    // universal variable product
                                    // @see http://tools.qubitproducts.com/uv/developers/specification/#toc_9
                                    var uvProduct = {
                                        id: product.repositoryId,
                                        url: product.route,
                                        name: product.displayName,
                                        description: product.description,
                                        manufacturer: product.brand,
                                        // TODO, the following property, category, is not in CC product, and is null in recs product
                                        category: null,
                                        //subcategory:
                                        //linked_products:
                                        // @see http://en.wikipedia.org/wiki/ISO_4217#Active_codes
                                        unit_sale_price: product.listPrice,
                                        //unit_price:
                                        //reviews:
                                    };


                                    // this sets up the objects the universal variable is expecting
                                    uvRecsArray.push(uvProduct);
                                });








                                $.Topic(pubsub.topicNames.RECS_RECOMMENDATIONS_CHANGED).publish(uvRecsArray);
                            })["catch"](
                                function(err) {
                                    // Do nothing, we've encounted an unrecoverable issue.
                                });
                    }, // end of populateCCProducts
                    /**
                     * Updates the knockout model for recommendations on the page with
                     * data returned from the Recs servers.
                     *
                     * @param slots The slots json hash returned by the server
                     */
                    processRecommendations = function(slotData) {
                        var i, products, recSetId, product,
                            // recs for updating the universal variable
                            uvRecs = [];

                        widget.recommendations.removeAll();

                        // of course this only works with one recslot on the page
                        products = slotData.recs;
                        recSetId = slotData.recSetId;

                        populateCCProducts(widget.recommendations, uvRecs, recSetId, products);
                    };

                // subscribe to RECS_HAVE_RECS topic, if get any data, process it
                $.Topic(pubsub.topicNames.RECS_HAVE_RECS).subscribe(function(eventData) {
                    //logger.debug(JSON.stringify(eventData.data));
                    //logger.debug(JSON.stringify(eventData.visitorId));
                    //logger.debug(JSON.stringify(eventData.sessionId));
                    widget.recsVisitorId = eventData.visitorId;
                    widget.recsSessionId = eventData.sessionId;

                    // only interested in the event that is for the same slot, which is identified by widget.id()
                    var slotIds = Object.keys(eventData.data);
                    if (slotIds.indexOf(widget.id()) > -1) {
                        processRecommendations(eventData.data[widget.id()]);
                    }
                });

                $("body").delegate(".ootbCarousel", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow()
                });
            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function(currPage) {},
            handleAddToCartRecommendation: function(data, event) {
                var widget = this;

                newRoute = data.route();

                var variantOptions = data.variantOptionsArray;



                var selectedOptions = this.getSelectedSkuOptions(variantOptions);
                var selectedOptionsObj = {
                    'selectedOptions': selectedOptions
                };
                var newProduct = $.extend(true, {}, data.product, selectedOptionsObj);
                newProduct.orderQuantity = parseInt(1, 10);
                addProductId = newProduct.id;



                $.when($.Topic(pubsub.topicNames.CART_ADD).publishWith(
                    newProduct, [{
                        message: "success"
                    }])).then(function() {});


                $.Topic(pubsub.topicNames.CART_ADD_SUCCESS).subscribe(function() {
                    //console.log("cart item added");
                    var localCart = widget.cart().allItems();

                    $.each(localCart, function(k, v) {
                        //if (v.productId === addProductId) { Add during shipping surcharge release
                        // v.product_route_ref(newRoute);
                        // }
                        if (v.productId === addProductId && v.product_productURL() === null) {


                            var newbreadCrumb = data.brandCategory();

                            v.product_productURL(newbreadCrumb);

                            addProductId = "";



                        }

                    });
                    if (widget.user().loggedIn()) {
                        widget.cart().updateCurrentProfileOrder();
                    } else {
                        widget.cart().cartUpdated();
                    }

                });




            },
            getSelectedSkuOptions: function(variantOptions) {

                var selectedOptions = [],
                    listingVariantImage;
                for (var i = 0; i < variantOptions.length; i++) {
                    if (!variantOptions[i].disable()) {

                        selectedOptions.push({
                            'optionName': variantOptions[i].optionDisplayName,
                            'optionValue': variantOptions[i].originalOptionValues()[0].key,
                            'optionId': variantOptions[i].actualOptionId,
                            'optionValueId': "Test Id"
                        });
                        //this.wishListStatus(true);
                    } else {
                        //this.wishListStatus(false);
                        // this.wishListValidation();
                        return false;
                    }
                }


                return selectedOptions;

            },
            getCarouselArrow: function() {
                if ($('.carousel-ootb .item').length > 0) {
                    $('#cc-carousel-controls-ootb a').removeClass('disabled');
                    if ($(".carousel-ootb .item:first").hasClass("active")) {
                        $('#cc-carousel-left-control-ootb .corousel-left').addClass('disabled');
                    } else if ($(".carousel-ootb .item:last").hasClass("active")) {
                        $('#cc-carousel-right-control-ootb .corousel-right').addClass('disabled');
                    } else {
                        $('#cc-carousel-controls-ootb a').removeClass('disabled');
                    }
                }
            }
        };
    }
);