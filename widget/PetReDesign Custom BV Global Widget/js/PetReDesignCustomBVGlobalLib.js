/**
 * @fileoverview Petmate BV Widget.
 * 
 * @author Taistech
 */
define(
    // Dependencies
    ['jquery', 'knockout', "ccRestClient", "ccConstants", 'storageApi', 'pageLayout/search', 'viewModels/searchResultDetails'],
    function($, ko, t, c, storageApi, search, searchResDetails) {

        "use strict";
        var getWidget = "";
        var pageContextId = "";
        var inputParams = "";
        var brandBVCollectionId = "";
        var cartL1Category = "";
        var searchResultProductData = "";
        var getPageId = '';
        var count=0;
        return {
            koPageId: ko.observable(''),
            onLoad: function(widget) {
                getWidget = widget;
                $.Topic("searchResultProduct.memory").subscribe(function() {
                    getWidget.brandSearchSuccess(searchResultProductData);
                });

                $('body').delegate('.sorting-option-for-desktop li', 'click', function() {
                    //   getWidget.loadBVScript();
                });

                $('body').delegate('#sortingOptionsForMobile .sortingOptionsValues', 'click', function() {
                    //getWidget.loadBVScript();
                });

                $.Topic("updateBV-stars").subscribe(function(e) {
                    // getWidget.updateFeatureBVStars();
                });

                $.Topic("NOSEARCHRESULTS_BV.memory").subscribe(function(data) {
                    if (data != undefined || data.length > 0) {
                        if (getWidget.koPageId() == 'noSearchResults') {
                            if (typeof $BV !== undefined) {
                                /* recommendations products*/
                                var outputProductDataForCart = [];
                                $.each(data, function(key, value) {
                                    outputProductDataForCart.push(value.id)
                                });

                                $BV.ui('rr', 'inline_ratings', {
                                    productIds: outputProductDataForCart,
                                    containerPrefix: 'BVRRInlineGridDisplay'
                                });
                                /*var m = c.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                						w = {};
                						w['fields'] = 'items.id';
                						t.request(m, w, function(e2) {
                						  var filteredList = [];
                    						  $('div[id^="BVRRInlineGridDisplay-"]').each(function(i, obj){
                    						        filteredList.push($(this).attr('id').split('-').pop());
                    						  });
                						}); */
                            }
                        }
                    }
                });

                $.Topic("CART_BV.memory").subscribe(function(data) {
                    /*   //console.log(data, '---data-----');*/
                    if (data != undefined || data.length > 0) {
                        if (getWidget.koPageId() == 'cart') {
                            if (typeof $BV !== undefined) {
                                var outputProductDataForCart = [];
                                $.each(data, function(key, value) {
                                    outputProductDataForCart.push(value.id)
                                });

                                $BV.ui('rr', 'inline_ratings', {
                                    productIds: outputProductDataForCart,
                                    containerPrefix: 'BVRRInlineGridDisplay'
                                });
                                /*	var cartFirstItem = "";
                		         	if(getWidget.cart().items().length > 0) {
                			            cartFirstItem = ko.toJS(getWidget.cart().items()[0].productData());
                			        }
                			        if(cartFirstItem != "") {
                			            cartL1Category = "";
                			            getWidget.allProductCategory(cartFirstItem.parentCategories, "");
                			        }
                                	var m = c.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                						w = {};
                						w['fields'] = 'items.id';
                						var outputProductDataForCart = [];
                						t.request(m, w, function(e2) {
                						  $.each( e2.items, function( key, value ) {
                							  outputProductDataForCart.push(value.id)
                						  });
                						  var filteredList = [];
                    						  $('div[id^="BVRRInlineGridDisplay-"]').each(function(i, obj){
                    						        filteredList.push($(this).attr('id').split('-').pop());
                    						  });
                    						 
                    						  	$BV.ui( 'rr', 'inline_ratings', {
                                            		productIds : filteredList,
                                            	    containerPrefix : 'BVRRInlineGridDisplay'
                                            	});
                						});*/
                            }
                        }
                    }
                });

                $.Topic("PDPPRODUCT_BV").subscribe(function() {
                    if (getWidget.koPageId() == 'product') {
                       
                       
                        if (window.$BV !== undefined) {
                             
                            $BV.configure("global", {
                                productId: getWidget.product().id()
                            });
                            $BV.ui("rr", "show_reviews", {
                                doShowContent: function() {}
                            });
                            $BV.ui('rr', 'inline_ratings', {
                                productIds: getWidget.product().id(),
                                containerPrefix: 'BVRRInlineGridDisplay'
                            });
                            var relatedId = [];
                            if (getWidget.product().relatedProducts) {
                                for (var i = 0; i < getWidget.product().relatedProducts.length; i++) {
                                    relatedId.push(getWidget.product().relatedProducts[i].id);
                                }
                            }
                            if (relatedId.length > 0) {
                                $BV.ui('rr', 'inline_ratings', {
                                    productIds: relatedId,
                                    containerPrefix: 'BVRRInlineGridDisplay'
                                });
                            }
                        }
                    }
                });
                $.Topic("HOME_BV.memory").subscribe(function(data) {
                    getWidget.loadBVhomeScript(data);
                });
                $.Topic("getPLPProductsRating").subscribe(function() {
                    getWidget.loadPLPBVScript();
                });
                $.Topic("getSRProductsRatings").subscribe(function(data) {
                    getWidget.loadBVScript();
                });
            },

            beforeAppear: function(page) {
                ////console.log(page ,'----page----');
                getWidget.koPageId(page.pageId);

                function loadScript(url, callback) {
                    var script = document.createElement("script")
                    script.type = "text/javascript";
                    script.async = "async";
                    if (script.readyState) { //IE
                        script.onreadystatechange = function() {
                            if (script.readyState === "loaded" || script.readyState === "complete") {
                                script.onreadystatechange = null;
                                callback();
                            }
                        };
                    } else { //Others
                        script.onload = function() {
                            callback();
                        };
                    }
                    script.src = url;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }

                loadScript("//display.ugc.bazaarvoice.com/static/Petmate/en_US/bvapi.js", function() {
                    //getWidget.loadBVScript();
                });
                

                if (page.contextId != undefined) {
                    pageContextId = page.contextId;
                }
            },
            loadPLPBVScript: function(){
                    if (typeof $BV !== undefined) {
                    if (getWidget.koPageId() == "category") {
                            /**** Get Category Products */
                            var o = c.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                                u = {};
                            u[c.CATEGORY] = getWidget.category().id, u.includeChildren = !0;
                            u['fields'] = 'items.id';
                            var outputProduct = [];
                            t.request(o, u, function(e2) {
                                $.each(e2.items, function(key, value) {
                                    outputProduct.push(value.id)
                                });
                                var filteredList = [];

                                $('div[id^="BVRRInlineGridDisplay-"]').each(function(i, obj) {
                                    filteredList.push($(this).attr('id').split('-').pop());
                                });
                                //console.log('----------filteredList----------',filteredList)

                                $BV.ui('rr', 'inline_ratings', {
                                    productIds: filteredList,
                                    containerPrefix: 'BVRRInlineGridDisplay'
                                });
                            });
                            


                            if ($(window).width() < 1024) {
                                /**** Get Category Products */
                                var v = c.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                                    q = {};
                                q[c.CATEGORY] = getWidget.category().id, q.includeChildren = !0;
                                q['fields'] = 'items.id';
                                var outputProductData = [];
                                t.request(v, q, function(e2) {
                                    $.each(e2.items, function(key, value) {
                                        outputProductData.push(value.id)
                                    });
                                    var filteredList = [];
                                    // //console.log("outputProduct for category",outputProductData);
                                    $('div[id^="BVRRInlineGridDisplay-"]').each(function(i, obj) {
                                        //  //console.log('Index', i);
                                        //  //console.log('Object', $(this).attr('id'));
                                        filteredList.push($(this).attr('id').split('-').pop());
                                    });
                                    //	  //console.log('Filtered List', filteredList);
                                    $BV.ui('rr', 'inline_ratings', {
                                        productIds: filteredList,
                                        containerPrefix: 'BVRRInlineGridDisplayForMobile'
                                    });
                                });
                            }
                    }
                }
            },
            loadBVScript: function() {
                if (typeof $BV !== undefined) {
                    if (getWidget.koPageId() == "searchresults") {
                            brandBVCollectionId = 'BVRRInlineGridDisplay';
                            if ($(window).width() < 1024) {
                                brandBVCollectionId = 'BVRRInlineGridDisplaySearchMobile';
                            }
                            inputParams = {};
                            if (getWidget.getUrlParameter("Ntt") != null) {
                                inputParams["Ntt"] = unescape(getWidget.getUrlParameter("Ntt"));
                            }
                            if (getWidget.getUrlParameter("Nty") != null) {
                                inputParams["Nty"] = getWidget.getUrlParameter("Nty");
                            }
                            if (getWidget.getUrlParameter("No") != null) {
                                inputParams["No"] = getWidget.getUrlParameter("No");
                            }
                            if (getWidget.getUrlParameter("Nrpp") != null) {
                                inputParams["Nrpp"] = 100 //getWidget.getUrlParameter("Nrpp");
                            }
                            if (getWidget.getUrlParameter("N") != null) {
                                inputParams["N"] = getWidget.getUrlParameter("N");
                            }
                            getWidget.createNewBrandSearch(search.getInstance(), getWidget);
                    }
                }
                
            },
            loadBVhomeScript: function(data){
                //console.log('home data',data)
                if (typeof $BV !== undefined) {
                    if (getWidget.koPageId() == 'home') {
                        //console.log('home');
                            if (data != undefined && data.length > 0) {
                                var outputProduct_f = data;
                                //console.log('outputProduct_f',outputProduct_f)
                                window.$BV.ui('rr', 'inline_ratings', {
                                    productIds: outputProduct_f,
                                    containerPrefix: 'BVRRCollection'
                                });
                            }
                    }
                }
            },

            createNewBrandSearch: function(searchViewModal, widget) {
                var search, url, id;
                inputParams[c.VISITOR_ID] = storageApi.getInstance().getItem(c.VISITOR_ID);
                inputParams[c.VISIT_ID] = storageApi.getInstance().getItem(c.VISIT_ID);
                inputParams[c.SEARCH_LANGUAGE] = searchViewModal.searchLocale();
                inputParams[c.SEARCH_TYPE] = searchViewModal.searchType;
                id = 'guidedsearch';
                widget.brandSearchSuccess(inputParams);
            },

            brandSearchSuccess: function(data) {
                setTimeout(function() {
                    var filteredList = [];
                    $('div[id^="BVRRInlineGridDisplay-"]').each(function(i, obj) {
                        filteredList.push($(this).attr('id').split('-').pop());
                    });
                    if (typeof $BV !== undefined) {
                        $BV.ui('rr', 'inline_ratings', {
                            productIds: filteredList,
                            containerPrefix: brandBVCollectionId
                        });
                    }
                }, 2000);
            },

            brandSearchError: function(data) {},

            getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            },
            allProductCategory: function(data, getParentId) {
                $.each(data, function(key, value) {
                    if (value.repositoryId == "cat70001") {
                        cartL1Category = getParentId;
                        getWidget.getProduct();
                        return false;
                    }
                    if (value.fixedParentCategories) {
                        getWidget.allProductCategory(value.fixedParentCategories, value.repositoryId)
                    }
                })
            },

            getProduct: function() {
                /**** Get Category Products */
                var o = c.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                    u = {};
                u[c.CATEGORY] = cartL1Category, u.includeChildren = !0;
                u['fields'] = 'items.id';
                var outputProduct = [];
                t.request(o, u, function(e2) {
                    $.each(e2.items, function(key, value) {
                        outputProduct.push(value.id);
                    });
                    $BV.ui('rr', 'inline_ratings', {
                        productIds: outputProduct,
                        containerPrefix: 'BVRRCartTopSellerCollection'
                    });
                });
            },

            updateFeatureBVStars: function() {
                var outputProduct_f = [];
                $.each(getWidget.user().koFeaturedItems(), function(key, value) {
                    outputProduct_f.push(value.id)
                })
                $BV.ui('rr', 'inline_ratings', {
                    productIds: outputProduct_f,
                    containerPrefix: 'BVRRFeaturedCollection'
                });
            },
        };
    }
);