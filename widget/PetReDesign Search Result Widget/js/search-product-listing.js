define(['knockout', 'viewModels/productListingViewModelFactory', 'CCi18n',
        'ccConstants', 'pubsub', 'pageLayout/product', 'storageApi', 'pageLayout/search', 'viewModels/searchResultDetails', 'viewModels/guidedNavigationViewModel', 'spinner', 'jquery', 'ccRestClient'
    ],

    function(ko, ProductListingViewModelFactory, CCi18n, CCConstants, pubsub, Product, storageApi, search, searchResultsViewModal, guidedNavigationViewModal, spinner, $, ccRestClient) {

        "use strict";
        var loadCount = 1;
        var previousSearch = false;
        var itemsPerPage = 12;
        var itemsPerRow = 3;
        var offset = 0;
        var currentListType = '';
        var pageData;
        var viewPortWidth;
        /*custom variables*/
        var getWidget = "";
        var getPageId = "";
        var getPath = "";
        var mCategorySubscription;
        var inputParams;
        /*custom variables */
        return {
            productListingElementFocus: ko.observable(false),
            displayRefineResults: ko.observable(false),
            WIDGET_ID: 'productListing',
            productsPerPage: ko.observable(),
            /* custom knockout variables */
            currentPageUrl: ko.observable(),
            koContextId: ko.observable(''),
            koSelectedIndex: ko.observable(0),
            sortOptionIndexValue: ko.observable(0),
            kogetCatgory: ko.observable(''),
            articleProduts: ko.observableArray([]),
            brandSearchResult: ko.observable(true),
            koPageId: ko.observable(''),
            koSearchResultText: ko.observable(''),
            kosearchResultProductListing: ko.observableArray([]),
            /* custom knockout variables*/

            changeProductsPerPage: function(itemsPerPage, firstPageLink) {
                window.sessionStorage.setItem("itemsPerPage", itemsPerPage);
                getWidget.productsPerPage(parseInt(window.sessionStorage.getItem("itemsPerPage")));
                if (isNaN(getWidget.productsPerPage())) {
                    widget.listingViewModel().pageNumber = 1;
                    getWidget.listingViewModel().recordsPerPage(CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE);
                } else {
                    getWidget.listingViewModel().recordsPerPage(parseInt(getWidget.productsPerPage()));
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
                /*custom event function for click the products and education button section */
                $('body').on('click', '.searchTab', function() {
                    if ($(this).html() == "Products") {
                        $("#CC-productListing").show();
                        $("#CC-articleListing").hide();
                        $('#CC-guidedNavigation-column').show();
                        $(".petmate-search-guided-nav").removeClass("hide");
                        //  setTimeout(function(){
                        $("#CC-articleListing").parent().parent().removeClass('educationArticleSection');
                        // },500)

                    } else if ($(this).html() == "Education") {
                        $("#CC-productListing").hide();
                        $("#CC-articleListing").show();
                        $('#CC-guidedNavigation-column').hide();
                        $(".petmate-search-guided-nav").addClass("hide");
                        //  $("#CC-articleListing").parents().parents().addClass('educationArticleSection');
                        // setTimeout(function(){
                        $("#CC-articleListing").parent().parent().addClass('educationArticleSection');
                        //   },500)
                    }
                });
                /*custom event function for click the products and education button section */

                if (window.sessionStorage.getItem("itemsPerPage")) {
                    widget.productsPerPage(parseInt(window.sessionStorage.getItem("itemsPerPage")));
                } else {
                    widget.productsPerPage(24);
                    window.sessionStorage.setItem("itemsPerPage", widget.productsPerPage());
                }


                // create productTypes map for which listingVaariant exists.
                var productListingTypesMap = {};
                if ((widget.productTypes) && (widget.productTypes())) {
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
                        "displayText": CCi18n.t("ns.search-product-listing:resources.sortByRelevanceText"),
                        "order": ko.observable("none"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "listPrice",
                        "displayText": CCi18n.t("ns.search-product-listing:resources.sortByPriceAscText"),
                        "order": ko.observable("asc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "listPrice",
                        "displayText": CCi18n.t("ns.search-product-listing:resources.sortByPriceDescText"),
                        "order": ko.observable("desc"),
                        "maintainSortOrder": true,
                        "serverOnly": true
                    }, {
                        "id": "product.startDateStr",
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

                if (widget.listingViewModel().sortOptions().length == 0) {
                    widget.listingViewModel().sortOptions(sortOptions);
                }

                widget.listingViewModel().idToSearchIdMap = {
                    "default": "product.relevance",
                    "startDateStr": "product.startDateStr",
                    "listPrice": "sku.activePrice",
                    "salePrice": "sku.salePrice"
                };

                widget.listingViewModel().submitSearch = function() {
                    //widget.articleProduts([]);
                    var searchTerm = '';
                    var recSearchType = '';
                    if (this.searchText().trim()) {
                        searchTerm = CCConstants.PRODUCT_DISPLAYABLE + CCConstants.SEARCH_PROPERTY_SEPARATOR + this.searchText().trim();
                    }

                    if (this.parameters && this.parameters.searchType) {
                        recSearchType = this.parameters.searchType;
                    }
                    var searchFilterRec = 'product.x_surchargeProductFilter:TRUE';
                    var searchParams = {
                        getFromUrlParam: true,
                        newSearch: false,
                        recordsPerPage: 24,
                        recordOffSet: this.recordOffSet,
                        recDYMSuggestionKey: this.recDYMSuggestionKey,
                        //recSearchKey: "product.productType", //Removed after 18B upgrade
                        searchType: recSearchType,
                        recFilter: searchFilterRec
                    };
                    if (this.parameters.Ns) {
                        var sortValues = decodeURIComponent(this.parameters.Ns).split("|");

                        if (sortValues.length === 2) {
                            searchParams.sortDirectiveProperty = sortValues[0];
                            searchParams.sortDirectiveOrder = sortValues[1] == "1" ? "desc" : "asc";
                        }
                    } else {
                        //console.log('in here!!!!!');
                        this.sortDirectiveProp('default');
                    }

                    if (widget.listingViewModel().idToSearchIdMap[this.sortDirectiveProp()] !== 'product.relevance') {
                        searchParams.sortDirectiveProperty = widget.listingViewModel().idToSearchIdMap[this.sortDirectiveProp()];
                        searchParams.sortDirectiveOrder = (searchParams.sortDirectiveProperty == "product.relevance") ? "none" : this.sortDirectiveOrder();
                    } else {
                        searchParams.sortDirectiveProperty = "";
                        searchParams.sortDirectiveOrder = "";
                    }
                    //Fix for surcharge search
                    if (search.getInstance().searchKeysMap) {
                        search.getInstance().searchKeysMap["Nr"] = searchFilterRec;
                    }
                    //Ends
                    // //console.log("searchParams......", searchParams);    
                    $.Topic(pubsub.topicNames.SEARCH_CREATE).publishWith(
                        searchParams, [{
                            message: "success"
                        }]);



                }

                searchResultsViewModal.formatSearchResults = function(records, articleSearch) {


                    var formattedRecs = [];
                    for (var i = 0; i < records.length; i++) {


                        var formattedRec = searchResultsViewModal.formatRecord(records[i].records[0]);
                        if (!articleSearch && formattedRec.hasOwnProperty('record.type') && formattedRec['record.type'][0] == 'ArticleProduct') {
                            continue;
                        }

                        if (articleSearch && formattedRec.hasOwnProperty('record.type') && formattedRec['record.type'][0] != 'ArticleProduct') {
                            continue;
                        }

                        /*if(formattedRec.hasOwnProperty('record.type.raw') && formattedRec['record.type.raw'][0] == 'ArticleProduct') {
                          continue;
                        } */
                        //console.log("formattedRec...........................", formattedRec);
                        // //console.log(formattedRec['record.type'][0]);

                        formattedRec.childSKUs = searchResultsViewModal.formatChildSkus(records[i].records);
                        //List of attributes (on top level records) to exclude while adding response data to view model
                        var exclusionAttributeList = [
                            "sku.maxActivePrice", "sku.minActivePrice", "product.repositoryId"
                        ];

                        // Adding new product attributes (added on top level records) to the formattedRec
                        for (var recordKey in records[i].attributes) {
                            if (exclusionAttributeList.indexOf(recordKey) == -1) {
                                formattedRec[recordKey] = records[i].attributes[recordKey];
                            }
                        }

                        if (articleSearch && formattedRec["product.longDescription"] && formattedRec["product.longDescription"][0]) {
                            formattedRec.longDescription = formattedRec["product.longDescription"][0];
                        }

                        if (formattedRec["product.creationDate"] && formattedRec["product.creationDate"][0]) {
                            var date = new Date(formattedRec["product.creationDate"][0] * 1);
                            formattedRec.creationDate = date;
                        }

                        if (records[i].attributes["sku.maxActivePrice"] && records[i].attributes["sku.maxActivePrice"][0]) {
                            formattedRec.maxActivePrice = records[i].attributes["sku.maxActivePrice"][0];
                        }
                        if (records[i].attributes["sku.minActivePrice"] && records[i].attributes["sku.minActivePrice"][0]) {
                            formattedRec.minActivePrice = records[i].attributes["sku.minActivePrice"][0];
                        }
                        formattedRec.originalRecord = records[i];
                        formattedRecs.push(formattedRec);
                    }
                    //console.log("..........formattedRecs...........", formattedRecs);
                    return formattedRecs;
                }

                searchResultsViewModal.update = function(result) {
                    //console.log('....................hacked into the search update............................');
                    //console.log('result..............................', result);

                    var originalTerms = [];
                    var originalSearchTerms = [];

                    if (result != null) {

                        if (result["@error"]) {

                            log.error("An error occurred while searching -" + result["@error"]);

                            return;
                        }

                        if (result.resultsList) {
                            var tmpSearchResults = ("records" in result.resultsList) ? result.resultsList.records : [];

                            searchResultsViewModal.searchResults = searchResultsViewModal.formatSearchResults(tmpSearchResults);
                            searchResultsViewModal.totalRecordsFound = ("totalNumRecs" in result.resultsList) ? result.resultsList.totalNumRecs : 0;
                            //searchResultsViewModal.totalRecordsFound = searchResultsViewModal.searchResults.length;
                            searchResultsViewModal.recordsPerPage = ("totalNumRecs" in result.resultsList) ? result.resultsList.recsPerPage : CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
                            searchResultsViewModal.recordOffSet = ("firstRecNum" in result.resultsList) ? (result.resultsList.firstRecNum - 1) : 0;

                            var additionalPage = (searchResultsViewModal.totalRecordsFound % searchResultsViewModal.recordsPerPage) > 0 ? 1 : 0;
                            searchResultsViewModal.pageCount = (searchResultsViewModal.totalRecordsFound > 0) ? (Math.floor(searchResultsViewModal.totalRecordsFound / searchResultsViewModal.recordsPerPage) + additionalPage) : 0;
                            if ("pagingActionTemplate" in result.resultsList) {
                                searchResultsViewModal.pagingActionTemplate = result.resultsList.pagingActionTemplate;
                            }
                        }

                        if (result.searchAdjustments) {
                            // Need to remove wildcard from search terms
                            if (result.searchAdjustments.originalTerms) {
                                originalTerms = result.searchAdjustments.originalTerms;
                            }

                            if (typeof String.prototype.endsWith !== 'function') {
                                String.prototype.endsWith = function(suffix) {
                                    /*return searchResultsViewModal.indexOf(suffix, searchResultsViewModal.length - suffix.length) !== -1;*/
                                };
                            }

                            // Remove product displayable flag from search terms
                            if (typeof originalTerms[0] != "undefined" && originalTerms[0] == CCConstants.PRODUCT_DISPLAYABLE) {
                                originalTerms.splice(0, 1);
                            }
                            originalSearchTerms = originalTerms.slice();

                            $.each(originalTerms, function(index, value) {
                                if (value.endsWith(CCConstants.SEARCH_WILDCARD)) {
                                    originalTerms[index] = value.substr(0, (value.length - 1));
                                }
                            });

                            result.searchAdjustments.originalTerms = originalTerms;
                            result.searchAdjustments.originalSearchTerms = originalSearchTerms;
                        }
                        searchResultsViewModal.searchAdjustments = result.searchAdjustments;
                        searchResultsViewModal.breadcrumbs = result.breadcrumbs;
                        if (result.navigation) {
                            searchResultsViewModal.navigation = result.navigation.navigation;
                        }
                    }
                }



                if (widget.user().catalog) {
                    widget.listingViewModel().catalog = widget.user().catalog.repositoryId;
                }

                widget.sortingCallback = function(evt) {
                    //console.log('product-sortAction called up')
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
                        recSearchKey: CCConstants.PRODUCT_DISPLAYABLE_PROPERTY + CCConstants.SEARCH_PROPERTY_SEPARATOR,
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
                    // Add scroll if it is mobile view only
                    if (widget.listingViewModel().viewportMode() == CCConstants.TABLET_VIEW ||
                        widget.listingViewModel().viewportMode() == CCConstants.PHONE_VIEW) {
                        $(window).on('scroll.page', widget.scrollHandler);
                        widget.listingViewModel().pageNumber = 1;
                        widget.listingViewModel().currentPage(1);
                    }
                };

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
                    // widget.setNewFlagToProducts();

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
                    $.Topic("searchResultProduct.memory").publish();

                    return rows;
                }, widget).extend({
                    deferred: true
                });

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

                /**
                 * Updated the grids when the category has been upated 
                 */
                var categoryUpdate = function(value) {

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

                if (widget.category() && widget.listType() != CCConstants.LIST_VIEW_SEARCH) {
                    categoryUpdate(widget.category());
                }

                if (widget.listType() != CCConstants.LIST_VIEW_SEARCH) {
                    if (mCategorySubscription != undefined) {
                        mCategorySubscription.dispose();
                    }

                    //If there's already a current category then set the update.
                    mCategorySubscription = widget.category.subscribe(categoryUpdate, widget);
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

                $("body").on("click", ".showSortingOptions", function() {
                    $('.sortingOptionsForMobileView ').addClass('displayedSortingOptions');
                })

                $("body").on("click", "#sortingOptionsForMobile-Close", function() {
                    $('.sortingOptionsForMobileView ').removeClass('displayedSortingOptions');
                })



                var widget = this;
                currentListType = widget.listType();


                /* to get the article product data */
                $("#CC-productListing").show();
                $("#CC-articleListing").hide();

                $.Topic("PetmateArticleProducts").subscribe(function() {
                    //	//console.log("-----------petmatearticpleProducts-------------");
                    getWidget.articleProductData();
                });
                /* to get the article product data */


                if (widget.category() && widget.listType() != CCConstants.LIST_VIEW_SEARCH) {
                    widget.categoryUpdate(widget.category());
                }
                // Updating refinements in the GuidedNavigation widget only if search is available.
                if (widget.dimensionId() && widget.listType() === CCConstants.LIST_VIEW_PRODUCTS) {
                    widget.updateRefinements();
                }
                widget.listingViewModel().handleResponsiveViewports();

                $("body").on("click", "#CC-product-listing-sortby-controls .sorting-values", function() {
                    var obj = $(this);
                    //console.log(obj.index() , '--------obj.index()')
                    $("#CC-product-listing-sortby").prop('selectedIndex', obj.index()).change();
                    getWidget.koSelectedIndex(obj.index());

                });



                $("body").on("click", "#sortingOptionsForMobile .sortingOptionsValues", function() {
                    //var obj = $(this); $(".subTypeSelector:checked");
                    var radioButtons = $("input:radio[name='sortingOptions']");
                    //console.log(radioButtons , 'radiobuttons');
                    var selectedIndexValue = radioButtons.index(radioButtons.filter(':checked'));
                    //console.log($(this))
                    //    var selectedIndex = $("#sortingOptionsForMobile:checked").index();
                    //console.log(selectedIndexValue , '----this---' );
                    //     //console.log(obj.index() , '--------obj.index()111')
                    $("#CC-product-listing-sortby").prop('selectedIndex', selectedIndexValue).change();
                    getWidget.koSelectedIndex(selectedIndexValue);

                });

                $("body").on("click", ".prodListingAddToWishlist", function(e, data) {
                    //console.log('rrrrrrrrrr', e)
                    var productId = $(this).data("prod-id");
                    //      var skuId = $(this).data("sku-id");
                    var catSkuList = [];
                    var catSkuListIds = {};
                    var id = $(this)[0].id;
                    var quanty;
                    catSkuList.push(productId);
                    catSkuListIds[CCConstants.PRODUCT_IDS] = catSkuList;
                    catSkuListIds["dataItems"] = "repositoryid";
                    catSkuListIds["debugOn"] = "true";
                    //console.log("...........id..............", catSkuList)

                    ccRestClient.request(CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, catSkuListIds, function(e) {
                        if (e.length > 0) {
                            //var s = e[0];
                            //console.log('product data ---------', e);

                            var n = e,
                                r = [],
                                s = "";
                            //for (var o = 0; n.childSKUs.length > o; o += 1) e.catRefId === n.childSKUs[o].repositoryId && (s = n.childSKUs[o]);
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


            setNewFlagToProducts: function() {
                var widget = this;
                var getData = [];
                var productIDs = [];
                getData = ko.toJS(widget.listingViewModel().currentProducts());
                //getData = widget.listingViewModel().currentProducts();


                for (var i = 0; i < getData.length; i++) {
                    //console.log('startDateStr', getData[i]['product.startDateStr'][0]);
                    //console.log('product id',getData[i].product.id)
                    productIDs.push(getData[i].product.id);

                    if (getData.length === productIDs.length) {
                        $.Topic('getSRProductsRatings').publish('success');
                    }

                    if (getData[i].hasOwnProperty('product.startDateStr')) {
                        //console.log('Success');
                        var arrivalDate = getData[i]['product.startDateStr'][0];

                        //console.log(arrivalDate, '$$$$$$$$$$$$$$ arrival date $$$$$$$$$$$$$$');

                        if (arrivalDate != null) {

                            //  //console.log(arrivalDate, '---------date--------')
                            var newCreatedDate = arrivalDate;
                            //   //console.log(newCreatedDate, 'newCreatedDate');
                            var today = new Date();
                            //console.log(today,'console');
                            var dd = today.getDate();
                            //console.log(dd,'Todays dd');
                            var mm = today.getMonth() + 1; //January is 0!
                            //console.log(mm,'Todays mm');
                            var yyyy = today.getFullYear();
                            //console.log(yyyy,'Todays yyyy');
                            var newFlag = false;

                            if (dd < 10) {
                                dd = '0' + dd
                            }

                            if (mm < 10) {
                                mm = '0' + mm
                            }
                            //console.log(dd,'Todays dd');
                            //console.log(mm,'Todays mm');
                            today = yyyy + '-' + mm + '-' + dd;
                            //today = mm + '-' + dd + '-' + yyyy;
                            //console.log(today,'Todays string');
                            var todaysDate = new Date(today);
                            var CurrentDate = new Date(newCreatedDate);
                            var diffDays = parseInt((todaysDate - CurrentDate) / (1000 * 60 * 60 * 24));
                            //console.log(todaysDate, 'today');
                            //console.log(todaysDate, 'todaysDate');
                            //console.log(CurrentDate, 'CurrentDate');
                            //console.log(diffDays, 'diffDays');
                            if ((diffDays > 0) && (diffDays <= 30)) {
                                var newFlag = true;
                                //   //console.log("newTag");
                            } else {
                                var newFlag = false;
                                //   //console.log("noNewTag")
                            }
                        } else if (arrivalDate == null) {
                            newFlag = false;
                        }
                    } else {
                        newFlag = false;
                    }

                    // //console.log('before creation %%%%%%%%%%%%%%%%% ', ko.toJS(widget.listingViewModel().currentProducts()));

                    widget.listingViewModel().currentProducts()[i].creationNewFlag = ko.observable(newFlag);

                }

                /* if(widget.koSelectedIndex() == 3){
                 }*/

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
            },


            /* To display only 150 characters in description for article products*/

            truncate: function(string) {
                var combinedString = string;
                var finalString;
                if(combinedString){
                    if (combinedString.length > 150) {
                        var getString = combinedString.substring(0, 150) + '...';
                        return getString;
    
                    } else {
                        return string;
                    }
                }
            },


            /*  */

            /* TO diplay the date in comma separated*/

            newMonthDisplay: function(data) {
                if (data !== null && data !== "") {

                    var startDateArr = data.split("-");
                    var shortMon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    var startDateFormat = shortMon[(parseInt(startDateArr[1]) - 1)] + " " + startDateArr[2] + ", " + startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }

            },


            /* ends here  */


            /* --- to get the Article products ----*/

            getArticleSearch: function() {
                //getPath = window.location.pathname + window.location.hash;
                getPath = window.location.href;
                window.articleSearchBackToListLink = getPath;
                localStorage.setItem('articleList', getPath);
                var allcookies = localStorage.getItem('articleList');
                //	//console.log(allcookies,'cookies');
                window.articleSearchBackToListLink = allcookies;
                // //console.log(window.articleSearchBackToListLink)
                //  //console.log("----searchGetPathText-------");
                // //console.log(getPath);
                //window.location = data;
                ///console.log(data);
            },
            getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            },
            createArticleSearch: function(searchViewModal, widget) {
                var search, url, id;
                /*inputParams[CCConstants.VISITOR_ID] = storageApi.getInstance().getItem(CCConstants.VISITOR_ID);
                inputParams[CCConstants.VISIT_ID] = storageApi.getInstance().getItem(CCConstants.VISIT_ID);
                inputParams[CCConstants.SEARCH_LANGUAGE] = searchViewModal.searchLocale();
                inputParams[CCConstants.SEARCH_TYPE] = "guided";
                id = 'guidedsearch';
                searchViewModal.adapter.loadJSON('search', id, inputParams, widget.articleSearchSuccess, widget.articleSearchError);
                */
                var searchTerm = getWidget.getUrlParameter("Ntt");
                var articleSearchInputParams = {};
                articleSearchInputParams['q'] = 'productType co "Article" and (displayName co "' + searchTerm + '" or longDescription co "' + searchTerm + '" or description co "' + searchTerm + '")';
                //articleSearchInputParams[CCConstants.CATEGORY] = 'articles';
                //articleSearchInputParams['q'] = '(displayName co "'+searchTerm + '" or longDescription co "'+searchTerm+'" or description co "'+searchTerm+'")';
                var o = CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS;
                //articleSearchInputParams.includeChildren = !0;
                //widget.articleProduts([])
                ccRestClient.request(o, articleSearchInputParams, function(e) {
                    getWidget.articleProduts(e.items);
                    getWidget.destroySpinner();
                }, widget.articleSearchError);
            },
            articleSearchSuccess: function(data) {
                //  //console.log("success brand search data............", data);
                if (data.resultsList) {
                    var tmpSearchResults = ("records" in data.resultsList) ? data.resultsList.records : [];
                    var searchResults = searchResultsViewModal.formatSearchResults(tmpSearchResults, true);
                    //  //console.log("search article Results............", searchResults);
                    if (searchResults != '') {
                        getWidget.articleProduts(searchResults);
                    }
                    getWidget.destroySpinner();
                    /*var outputProduct_bc = [];
                    $.each( searchResults, function( key, value ) {
                    	outputProduct_bc.push(value.id[0]);
                    })*/
                }

            },
            articleSearchError: function(data) {
                //console.log("success error data............", data);
                getWidget.destroySpinner();
            },
            articleProductData: function() {
                inputParams = {};
                if (getWidget.getUrlParameter("Ntt") != null) {
                    inputParams["Ntt"] = getWidget.getUrlParameter("Ntt");
                }
                if (getWidget.getUrlParameter("Nty") != null) {
                    inputParams["Nty"] = getWidget.getUrlParameter("Nty");
                }
                if (getWidget.getUrlParameter("No") != null) {
                    inputParams["No"] = getWidget.getUrlParameter("No");
                }
                if (getWidget.getUrlParameter("Nrpp") != null) {
                    inputParams["Nrpp"] = getWidget.getUrlParameter("Nrpp");
                }
                //inputParams["N"] = 3094113394;
                getWidget.createArticleSearch(search.getInstance(), getWidget);
            },
            /**
             * Destroy the 'loading' spinner.
             * @function  OrderViewModel.destroySpinner
             */
            destroySpinner: function() {
                // //console.log("destroyed");
                $('#loadingModal').hide();
                spinner.destroy();
            },

            /**
             * Create the 'loading' spinner.
             * @function  OrderViewModel.createSpinner
             */
            createSpinner: function(loadingText) {
                var indicatorOptions = {
                    parent: '#loadingModal',
                    posTop: '0',
                    posLeft: '50%'
                };
                var loadingText = CCi18n.t('ns.common:resources.loadingText');
                $('#loadingModal').removeClass('hide');
                $('#loadingModal').show();
                indicatorOptions.loadingText = loadingText;
                spinner.create(indicatorOptions);
            }

            /*--  ends article prodcut data--*/
        };
    });