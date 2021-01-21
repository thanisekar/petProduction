define(['knockout', 'viewModels/productListingViewModelFactory', 'CCi18n',
        'ccConstants', 'pubsub', 'pageLayout/product', 'ccStoreConfiguration', 'storageApi', 'jquery', 'ccRestClient', 'moment', 'ccConstants'
    ],

    function(ko, ProductListingViewModelFactory, CCi18n, CCConstants, pubsub, Product, CCStoreConfiguration, storageApi, $, ccRestClient, moment, ccConstants) {

        "use strict";
        var loadCount = 1;
        var previousSearch = false;
        var itemsPerPage = 12;
        var itemsPerRow = 3;
        var offset = 0;
        var currentListType = '';
        var pageData;
        var viewPortWidth;
        var getWidget = "";
        var getPageId = "";
        var getPath = "";
        var getPageId = '';
        var indexVal= 0;
        return {
            productListingElementFocus: ko.observable(false),
            displayRefineResults: ko.observable(false),
            WIDGET_ID: 'productListing',
            productsPerPage: ko.observable(),
            currentPageUrl: ko.observable(),
            koContextId: ko.observable(''),
            koSelectedIndex: ko.observable(0),
            sortOptionIndexValue: ko.observable(0),
            koGetCategories:ko.observableArray([]),
            koUserDetails:ko.observable(),
            
            itemsPerRowInLargeDesktopView: ko.observable(4),
            itemsPerRowInDesktopView: ko.observable(4),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(2),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),

            changeProductsPerPage: function(itemsPerPage, firstPageLink) {
               // window.sessionStorage.setItem("itemsPerPage", itemsPerPage);
               // getWidget.productsPerPage(parseInt(window.sessionStorage.getItem("itemsPerPage")));
                if (isNaN(itemsPerPage)) {
                    widget.listingViewModel().pageNumber = 1;
                    getWidget.listingViewModel().recordsPerPage(CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE);
                } else {
                    getWidget.listingViewModel().recordsPerPage(parseInt(itemsPerPage));
                }
                getWidget.listingViewModel().itemsPerPage = getWidget.listingViewModel().recordsPerPage();
                getWidget.listingViewModel().load(1);
                $("html, body").animate({
                    scrollTop: 0
                }, "1000");
            },

            goToPageView: function() {
                $("html, body").animate({
                    scrollTop: 0
                }, "1000");
            },

            onLoad: function(widget) {
                
                
                

                getWidget = widget;
                
                
               
                //console.log(getWidget.collectionId(),'getWidget.collectionId');
                
                 
                // set up the recommendations ko observable
                  //widget.koGetCategories(widget.category().childCategories);
                widget.recommendations = ko.observableArray();
                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
                    var groups = [];
                    if (widget.koGetCategories() != null) {
                        
                        for (var i = 0; i < widget.koGetCategories().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                
                                groups.push(ko.observableArray([widget.koGetCategories()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koGetCategories()[i]);
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

                $("body").delegate(".brandCollectionCarousel", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow()
                });
            
                $('body').on('click', '#catVideo', function() {
                    $('#categoryVideoWrap').css('display', 'block');
                    $('#categorySizeChartWrap').css('display', 'none')
                    $('.video-One').show();
                    $('.video-Two').show();
                    $('.sizechart').hide();
                  
                });
                $('body').on( 'click','#sizing', function() {
                    $('#categoryVideoWrap').css('display','none');
                    $('#categorySizeChartWrap').css('display','block')
                    $('.video-One').hide();
                    $('.video-Two').hide();
                    $('.sizechart').show();  
                }); 
                
                
                
                widget.koUserDetails(widget.user);
                 widget.productsPerPage(itemsPerPage);
              
                // create productTypes map for which listingVaariant exists.
                var productListingTypesMap = {};
                if (widget.productTypes()) {
                    ko.utils.arrayForEach(widget.productTypes(), function(productType) {
                        for (var i = 0; i < productType.variants.length; i++) {
                            if (productType.variants[i].listingVariant) {
                                productListingTypesMap[productType.id] = productType.variants[i];
                                break;
                            }
                        }
                    });
                }
                widget.productListingTypes = productListingTypesMap;

                // disabling refine results button if there are no results for the selected category.
                $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(obj) {
                    if (!this.navigation || this.navigation.length == 0) {
                        widget.displayRefineResults(false);
                    } else {
                        widget.displayRefineResults(true);
                    }
                });

                // disabling refine results button if search is unavailable.
                $.Topic(pubsub.topicNames.SEARCH_FAILED_TO_PERFORM).subscribe(function(obj) {
                    widget.displayRefineResults(false);
                });

                //Sets the focus to the first element in the product listing page
                $.Topic(pubsub.topicNames.UPDATE_FOCUS).subscribe(function(obj) {
                    if (this.WIDGET_ID === widget.WIDGET_ID) {
                        widget.productListingElementFocus(true);
                    }
                });

                var self = this;
                // TODO: This sortOptions property would make a nice
                // configuration option. Should be specified server-side in widget 
                // configuration
                var sortOptions = [{
                        "id": "default",
                        "displayText": CCi18n.t("ns.petredesignProductListingWidget:resources.sortByRelevanceText"),
                        "order": ko.observable("none"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "listPrice",
                        "displayText": CCi18n.t("ns.petredesignProductListingWidget:resources.sortByPriceAscText"),
                        "order": ko.observable("asc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "listPrice",
                        "displayText": CCi18n.t("ns.petredesignProductListingWidget:resources.sortByPriceDescText"),
                        "order": ko.observable("desc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "startDateStr",
                        "displayText": "New",
                        "order": ko.observable("desc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    },
                    {
                        "id": "salePrice",
                        "displayText": "Sale",
                        "order": ko.observable("desc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }
                ];
                currentListType = widget.listType();

                widget.listingViewModel = ko.observable();
                widget.listingViewModel(
                    ProductListingViewModelFactory.createListingViewModel(widget));
                if (widget.listType() === CCConstants.LIST_VIEW_PRODUCTS) {
                    widget.listingViewModel().sortOptions(sortOptions);
                } else {
                    widget.listingViewModel().sortOptions(searchSortOptions);
                }

                // Optimizing product grid rows formation
                widget.listingViewModel().productGridExtension = true;
                // Using generic sort, to avoid hard coding of sort keys
                widget.listingViewModel().useGenericSort = true;
                // Using client side Product view model caching
                widget.listingViewModel().isCacheEnabled = widget.isViewModelCacheEnabled ? widget.isViewModelCacheEnabled() : false;
                // Specifying number of categories to cache on client side
                widget.listingViewModel().viewModelCacheLimit = widget.viewModelCacheLimit ? widget.viewModelCacheLimit() : 3;

                if (widget.listingViewModel().sortOptions().length == 0) {
                    widget.listingViewModel().sortOptions(sortOptions);
                }

                widget.listingViewModel().idToSearchIdMap = {
                    "default": "product.relevance",
                    "startDateStr": "product.startDateStr",
                    "listPrice": "sku.activePrice",
                    "salePrice": "sku.salePrice"
                };

                if (widget.user().catalog) {
                    widget.listingViewModel().catalog = widget.user().catalog.repositoryId;
                }

                widget.sortingCallback = function(evt) {
                
                    var element = $('#CC-product-sortAction');

                    $(element).focus();
                };

                /**
                 * Updates the refinement list for the selected category.
                 */
                widget.updateRefinements = function() {
                    var searchParams = {
                        recordsPerPage: itemsPerPage,
                        recordOffSet: offset,
                        newSearch: false,
                        navigationDescriptors: widget.dimensionId(),
                        suppressResults: false,
                        searchType: CCConstants.SEARCH_TYPE_SIMPLE
                    };
                    $.Topic(pubsub.topicNames.SEARCH_CREATE_CATEGORY_LISTING).publishWith(searchParams, [{
                        message: "success"
                    }]);

                    var categoryInfo = {
                        categoryRoute: widget.category().route,
                        categoryName: widget.category().displayName,
                        repositoryId: widget.category().repositoryId,
                        dimensionId: widget.dimensionId()
                    };
                    storageApi.getInstance().setItem("category", JSON.stringify(categoryInfo));
                    $.Topic(pubsub.topicNames.CATEGORY_UPDATED).publish(categoryInfo);
                };

                /**
                 * Scroll handler method used in phone and tablet modes.
                 *
                 * Method gets next set of products once bottom of product listing
                 * element comes into view
                 **/
                widget.scrollHandler = function(eventData) {

                    var scrollTop = $(window).scrollTop();
                    var viewportHeight = $(window).height();

                    var productListElement = $('#product-grid').hasClass('active') ? '#product-grid' : '#product-list';

                    var productListHeight = $(productListElement).height();

                    if ((scrollTop + viewportHeight) >= ((productListHeight / 5) * 4)) {
                        widget.listingViewModel().incrementPage();
                    }
                };

                // Scroll handle for mobile view
                widget.scrollHandleOnViewPort = function() {
                    // Clear previous scrolls
                    $(window).off('scroll.page');
                    widget.listingViewModel().isLoadOnScroll(false);
                    // Add scroll if it is mobile view only
                    if (widget.listingViewModel().viewportMode() == CCConstants.TABLET_VIEW ||
                        widget.listingViewModel().viewportMode() == CCConstants.PHONE_VIEW) {
                        $(window).on('scroll.page', widget.scrollHandler);
                        widget.listingViewModel().pageNumber = 1;
                        widget.listingViewModel().currentPage(1);
                        // if current page is already 1, then we need to trigger the computation of current products
                        widget.listingViewModel().isLoadOnScroll(true);
                    }
                };
                widget.productGrid = ko.observableArray([]);

                widget.changePageForSearch = function(otherData) {
                    // Do not search if the type is undefined or any other type that search.
                    if (this.parameters.type != CCConstants.PARAMETERS_SEARCH_QUERY) {
                        return;
                    }
                    if (this.parameters.page) {
                        widget.listingViewModel().pageNumber = parseInt(this.parameters.page);
                    } else {
                        widget.listingViewModel().pageNumber = 1;
                    }
                    widget.listingViewModel().parameters = this.parameters;
                    if (widget.listType() == CCConstants.LIST_VIEW_SEARCH) {

                        // Setting the recordsPerPage from widget configuration		
                        if (isNaN(widget.productsPerPage())) {
                            widget.listingViewModel().recordsPerPage(CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE);
                        } else {
                            widget.listingViewModel().recordsPerPage(parseInt(widget.productsPerPage()));
                        }
                        widget.listingViewModel().itemsPerPage = widget.listingViewModel().recordsPerPage();
                        // Add scroll for mobile view
                        widget.scrollHandleOnViewPort();
                        widget.listingViewModel().load(1);
                    }
                    // Add pagination type as type 2
                    widget.listingViewModel().paginationType(2);
                };

                // Handle the page change event data to generate pages
                $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(widget.getPageUrlData.bind(widget));
                // Handle the pagination calls
                $.Topic(pubsub.topicNames.PAGE_PAGINATION_CHANGE).subscribe(widget.changePage.bind(widget));
                // Handle search
                $.Topic(pubsub.topicNames.PAGE_PARAMETERS).subscribe(widget.changePageForSearch);

                /**
                 * Formats the updated products  
                 */
                widget.formatProducts = function(products) {
                    var formattedProducts = [];
                    var productsLength = products.length;
                    for (var i = 0; i < productsLength; i++) {
                        if (products[i]) {
                            formattedProducts.push(new Product(products[i]));
                        }
                    }
                    return formattedProducts;
                };

                widget.resultsText = ko.computed(function() {
                    return widget.listingViewModel().resultsText();
                }, widget.listingViewModel());

                widget.updateFocus = function() {
                    $.Topic(pubsub.topicNames.UPDATE_LISTING_FOCUS).publish();
                    return true;
                };

                widget.updateFocusAndDisableQV = function(data, evt) {
                    //hide the QV to prevent the user clicking it while the main PDP is loading
                    $(".quickViewElement").hide();
                    return widget.updateFocus();
                };

                //Create productGrid computed for the widget
                widget.productGrid = ko.computed(function() {
                
                    var numElements, start, end, width;
                    var rows = [];

                    var products;

                    if (($(window)[0].innerWidth || $(window).width()) > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                        var startPosition, endPosition;
                        // Get the products in the current page
                        startPosition = (widget.listingViewModel().currentPage() - 1) * widget.listingViewModel().itemsPerPage;
                        endPosition = startPosition + widget.listingViewModel().itemsPerPage;
                        products = widget.listingViewModel().currentProducts();
                    } else {
                        var startPosition, endPosition;
                        // Get the products in the current page
                        products = widget.listingViewModel().currentProducts();
                    }
               
                 
                    if (!products) {
                        return;
                    }

                    numElements = products.length;

                    width = parseInt(widget.listingViewModel().itemsPerRow(), 10);
                    start = 0;
                    end = start + width;

                    while (end <= numElements) {
                        rows.push(products.slice(start, end));
                        start = end;
                        end += width;
                    }

                    if (end > numElements && start < numElements) {
                        rows.push(products.slice(start, numElements));
                    }
                   
                      widget.setNewFlagToProducts();
                    // BV sunscription for stars
                     $.Topic("CATEGORY_BV").publish();
                    
                    return rows;
                }, widget).extend({
                    deferred: true
                });

                // Below subscription updated productGrid observable array.
                /*  widget.productGridComputed.subscribe(function(newValues) {
                  if (newValues && newValues.length > 0) {
                    if(widget.listingViewModel().refreshValues == true) {
                      widget.productGrid(newValues);
                      widget.listingViewModel().refreshValues = false;
                    }
                    else {
                      widget.productGrid.push.apply(widget.productGrid, newValues); //Push the new row into the grid.
                    }
        
        
                  }
                });*/

                /**
                 * Updated the grids when the category has been upated 
                 */
                widget.categoryUpdate = function(value) {

                    if (!value) {
                        return;
                    }

                    var category = widget.listingViewModel().category();
                    if (widget.listType() !== CCConstants.LIST_VIEW_PRODUCTS) {

                        widget.listType(CCConstants.LIST_VIEW_PRODUCTS);
                        widget.listingViewModel(
                            ProductListingViewModelFactory.createListingViewModel(widget));
                    }

                    if ((!category || (category.id != value.id)) || (previousSearch) || (!widget.listingViewModel().paginationOnly)) {

                        widget.listingViewModel().resetSortOptions();
                        widget.listingViewModel().category(value);
                        widget.listingViewModel().clearOnLoad = true;
                        widget.listingViewModel().load(1);
                        widget.listingViewModel().paginationType(1);
                        previousSearch = false;
                    }
                };

                /**
                 * Issue with bootstrap tab-contents in that sometimes it loses the 
                 * active tab, this ensures we have a tab chosen 
                 */
                widget.ensureActiveTab = function() {
                    if (!($('#product-grid').hasClass('active') ||
                            $('#product-list').hasClass('active'))) {
                        $('#product-grid').addClass('active');
                    }
                };

                /**
                 *  Handle the widget response when the search result have been updated.
                 */
                if (widget.listType() !== CCConstants.LIST_VIEW_PRODUCTS) {
                    $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(obj) {
                        widget.category(null);
                        previousSearch = true;
                        if (widget.listType() !== CCConstants.LIST_VIEW_SEARCH) {
                            widget.listType(CCConstants.LIST_VIEW_SEARCH);
                            widget.listingViewModel(
                                ProductListingViewModelFactory.createListingViewModel(widget));
                        }
                        widget.ensureActiveTab();
                        if ((this.navigation && this.navigation.length > 0) || (this.breadcrumbs && this.breadcrumbs.refinementCrumbs.length > 0)) {
                            widget.displayRefineResults(true);
                        } else {
                            widget.displayRefineResults(false);
                        }
                    });
                }

                viewPortWidth = $(window).width();

                // Check on viewport resize
                $(window).resize(function() {
                    //Adding window.innerWidth for it to work correctly with the actual screen width
                    var windowWidth = (window.innerWidth || $(window).width());
                    if (widget.isActiveOnPage(pageData) && windowWidth != viewPortWidth) {
                        widget.listingViewModel().checkResponsiveFeatures(windowWidth);
                        widget.scrollHandleOnViewPort();
                        widget.listingViewModel().cleanPage();
                        viewPortWidth = windowWidth;
                    }
                });
                
               
               

            },

            beforeAppear: function(page) {
                    getWidget.koContextId(page.contextId);
                  $("body").on("click",".showSortingOptions",  function() {
                      $('.sortingOptionsForMobileView ').addClass('displayedSortingOptions');
                  })
                
                $("body").on( "click", "#sortingOptionsForMobile-Close",function() {
                      $('.sortingOptionsForMobileView ').removeClass('displayedSortingOptions');
                  })
                  
                /* to find the article product tab */
                
                   var PlpPageSearch = $('.PLPsearch').val();
                   var idvalue=PlpPageSearch;
                   localStorage.setItem('AdminId', idvalue);
                   var allcookies= localStorage.getItem('AdminId');
                   	window.PlpPageSearch = allcookies;
                
                /*  ends here */
                
                var widget = this;
              
                if(page.pageId='category'){
                 
                        $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                       
                         if($(window).width()>1024){
                               $('.product-listing').parent().parent().addClass('productListingContainerWidth');
                        }
                        else{
                             $('.product-listing').parent().parent().removeClass('productListingContainerWidth');
                        }
                    })
 
                       
                 
                  
                  
                       $( window ).resize(function() {
                        
                                    $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                                        if($(window).width()>1024){
                                               $('.product-listing').parent().parent().addClass('productListingContainerWidth');
                                        }
                                        else{
                                             $('.product-listing').parent().parent().removeClass('productListingContainerWidth');
                                        }
                                    })
                                        
                                
                            });
                }
                
                currentListType = widget.listType();
                
                widget.koGetCategories(widget.category().childCategories );

                if (widget.category() && widget.listType() != CCConstants.LIST_VIEW_SEARCH) {
                    widget.categoryUpdate(widget.category());
                }
                // Updating refinements in the GuidedNavigation widget only if search is available.
                if (widget.dimensionId() && widget.listType() === CCConstants.LIST_VIEW_PRODUCTS) {
                    widget.updateRefinements();
                }
                widget.listingViewModel().handleResponsiveViewports();

                $("body").on( "click", "#CC-product-listing-sortby-controls .sorting-values",function() {
                    var obj = $(this);
                    $("#CC-product-listing-sortby").prop('selectedIndex', obj.index()).change();
                    getWidget.koSelectedIndex(obj.index());

                });
                
                
                
                 $("body").on( "click","#sortingOptionsForMobile .sortingOptionsValues", function() {
                    var radioButtons = $("input:radio[name='sortingOptions']");
                    var selectedIndexValue = radioButtons.index(radioButtons.filter(':checked'));
                    $("#CC-product-listing-sortby").prop('selectedIndex', selectedIndexValue ).change();
                    getWidget.koSelectedIndex(selectedIndexValue);

                });

                  $("body").on( "click", ".prodListingAddToWishlist",function(e, data) {
                    var productId = $(this).data("prod-id");
                    var catSkuList = [];
                    var catSkuListIds = {};
                    var id = $(this)[0].id;
                    var quanty;
                    catSkuList.push(productId);
                    catSkuListIds[CCConstants.PRODUCT_IDS] = catSkuList;
                    catSkuListIds["dataItems"] = "repositoryid";
                    catSkuListIds["debugOn"] = "true";
                    

                    ccRestClient.request(CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, catSkuListIds, function(e) {
                        if (e.length > 0) {
                            
                            var n = e,
                                r = [],
                                s = "";
                           
                            for (var u in n.productVariantOptions) r.push({
                                optionValue: s[n.productVariantOptions[u].optionName],
                                optionId: n.productVariantOptions[u].optionId
                            });
                            var a = {
                                    selectedOptions: r
                                },
                                f = $.extend(!0, {}, n, a),
                                l = e.updatableQuantity;
                            f.desiredQuantity = l, f.childSKUs = [s], f.productPrice = f.salePrice != null ? f.salePrice : f.listPrice, $.Topic(pubsub.topicNames.SOCIAL_SPACE_ADD).publishWith(f, [{
                                message: "success"
                            }])

                        }
                    }, function(data) {});
                });
            },
            getCarouselArrow: function() {
                   
                if ($('.brandCollectionCarousel .brand-carousel .item').length > 0) {
                  
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
            },
            carouselArrowRender: function(){
                getWidget.getCarouselArrow() 
            }, 

            setNewFlagToProducts: function() { 
                var widget = this;
                var getData = [];
                var productIDs = [];
                getData = ko.toJS(widget.listingViewModel().currentProducts());
                getData = widget.listingViewModel().currentProducts();
             

                for (var i = 0; i < getData.length; i++) {
                 
                     productIDs.push(getData[i].product.id);
                     
                     if(getData.length === productIDs.length ){
                        $.Topic('getPLPProductsRating').publish('success')
                    }
                     
                    if (getData[i].hasOwnProperty('startDateStr')) {
                        var arrivalDate = getData[i].startDateStr();
                       

                        if (arrivalDate != null) {
                            var newCreatedDate = arrivalDate;
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

                    widget.listingViewModel().currentProducts()[i].creationNewFlag = ko.observable(newFlag);
                     
                }
                
                /*Criteo */
                if(productIDs.length>0){
                    if ($("script[id='productListing']").length === 0) {
                      var criteoProductListingTag =  
                        '<script type="text/javascript" id="productListing">'+
                        'var dataLayer = dataLayer || [];'+
                        'dataLayer.push({'+
                        '"event":"ListingPage",'+
                        '"PageType":"ListingPage",'+
                        '"email":"'+ widget.user().emailAddress() + '",'+
                        '"ProductIDList":"[' + productIDs + ']",'+
                        '});'+
                        '</script>';
                         $("head").append(criteoProductListingTag);
                   }
                   /*Criteo  end here*/
                }
                
                
                
              
            },

            getPageUrlData: function(data) {
                var widget = this;
                // Set the data to the widget level variable
                pageData = data;
                // Only change these properties if we're on the correct page.
                if (data.pageId == CCConstants.CATEGORY_CONTEXT || data.pageId == CCConstants.SEARCH_RESULTS) {
                    widget.listingViewModel().pageId(data.pageId);
                    widget.listingViewModel().contextId(data.contextId);
                    widget.listingViewModel().seoslug(data.seoslug);
                }
            },

            changePage: function(data) {
                var widget = this;
                // Handle the page number change
                if (data.page) {
                    widget.listingViewModel().pageNumber = parseInt(data.page);
                } else {
                    widget.listingViewModel().pageNumber = 1;
                    widget.listingViewModel().initializeIndex();
                }
                // Add scroll for mobile view
                if (widget.listType() == CCConstants.LIST_VIEW_PRODUCTS) {
                    widget.scrollHandleOnViewPort();
                }
                if ((widget.listType() == CCConstants.LIST_VIEW_PRODUCTS) && data.paginationOnly) {
                    widget.listingViewModel().getPage(widget.listingViewModel().pageNumber);
                }
                widget.listingViewModel().paginationOnly = data.paginationOnly;
            },

            /**
             * Handles click on refine results 
             */
            handleRefineResults: function(data, event) {

                if (!($('#CC-overlayedGuidedNavigation-column').hasClass('open')) && !($('#CC-overlayedGuidedNavigation').hasClass('CC-overlayedGuidedNavigation-mobileView'))) {
                    $('#CC-overlayedGuidedNavigation').addClass('CC-overlayedGuidedNavigation-mobileView');
                    // Add a pubsub to open guided navigation
                    $.Topic(pubsub.topicNames.OVERLAYED_GUIDEDNAVIGATION_SHOW).publish();
                }
                if (($(window)[0].innerWidth || $(window).width()) < CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) {
                    // Remove the scroll handling when the refinements is open in the mobile view.
                    // This saves extra calls when refinements are loaded.
                    $(window).off('scroll.page');
                    $('html, body').css('overflow-y', 'hidden');
                }
                $('#CC-overlayedGuidedNavigation-done').focus();
                return false;
            }
        };
    });