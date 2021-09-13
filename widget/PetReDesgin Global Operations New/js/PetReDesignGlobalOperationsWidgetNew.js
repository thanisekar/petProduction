/**
 * @fileoverview petmate Global Widget.
 *
 * @author Taistech
 */
 define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockouton
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub', 'navigation', 'ccConstants', 'spinner', 'CCi18n', 'storageApi', "ccRestClient", "ccResourceLoader!global/petmateJquery.slimscroll"],
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, t, n, CCconstants, spinner, CCi18n, storageApi, restClient) {
        var getWidget = "";
        var pubsub = "";
        var currentPageId = '';
        var loggedInParam = "";
        var pageDetails = "";
        var userOrderPaymentInfo = [];
        var getData = [];
        window.PlpPageSearch;
        window.articleSearchBackToListLink;
        var getPath = "";
        var getPage = "";

        //handle auto-closing of window for FB
        if (window.location.hash == '#socialCloseWindow') window.close();

        return {
            siteFbAppId: ko.observable(''),
            koIsLoggedinUser: ko.observable(),
            koProdSpecLink: ko.observable(false),
            koPageId: ko.observable(),
            koSubTotal: ko.observable(),
            koDiscount: ko.observable(),
            koTax: ko.observable(),
            koTotal: ko.observable(),
            /**
             * Fetch Facebook app id
             */
            fetchFacebookAppId: function() {
                var widget = this;
                var serverType = CCconstants.EXTERNALDATA_PRODUCTION_FACEBOOK;
                if (widget.isPreview()) {
                    serverType = CCconstants.EXTERNALDATA_PREVIEW_FACEBOOK;
                }
                restClient.request(CCconstants.ENDPOINT_MERCHANT_GET_EXTERNALDATA,
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


            },

            /**
             * Fetch Facebook app id error handler
             */
            fetchFacebookAppIdErrorHandler: function(pResult) {
                logger.debug("Failed to get Facebook appId.", result);
            },

            onLoad: function(widget) {

                getWidget = widget;
                widget.appendScript('https://apps.bazaarvoice.com/deployments/petmate/main_site/production/en_US/bv.js');
                widget.appendScript('//nsg.symantec.com/Web/Seal/gjs.aspx?SN=965624406');
                widget.appendScript('https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=S3dfRa');


                //widget.appendScript('https://www.myus.com/_/Signup/RemoteRegistration?aid=1006685&noimg=1');
                //Cookie

                //console.log(ko.toJS(widget) , '------ widget---');
                //console.log(widget.pageContext().page.name,'--------')

               //Insert New Curalate

                //$('script[id="curalate"]').remove();

                if ($('script[id="curalate"]').length === 0) {
                    var curalateObject = "<script id='curalate'>var CRL8_SITENAME = 'petmate-lnuqyt';!function(){var e=window.crl8=window.crl8||{},n=!1,i=[];e.ready=function(e){n?e():i.push(e)},e.pixel=e.pixel||function(){e.pixel.q.push(arguments)},e.pixel.q=e.pixel.q||[];var t=window.document,o=t.createElement('script'),c=e.debug||-1!==t.location.search.indexOf('crl8-debug=true')?'js':'min.js';o.async=!0,o.src=t.location.protocol+'//edge.curalate.com/sites/'+CRL8_SITENAME+'/site/latest/site.'+c,o.onload=function(){n=!0,i.forEach(function(e){e()})};var r=t.getElementsByTagName('script')[0];r.parentNode.insertBefore(o,r.nextSibling)}();</script>";

                    $("head").append(curalateObject);
                }

                //Ends
                

                $.Topic(t.topicNames.PAGE_READY).subscribe(function(obj) {
                    if (widget.pageContext().page.name == 'home') {


                        if (document.cookie.indexOf('Sigin_cookie') != -1) {} else {
                            //setTimeout(function() {
                            //$(".modalBtn").trigger("click");
                            $("#emailSignupModal").modal('show');
                            getWidget.setCookie('Sigin_cookie', 'yes');
                            // }, 15000);

                        }

                    }

                });




                // get FB app ID
                //"Removing for site performance" 
                widget.fetchFacebookAppId();




                /* "Removing for site performance"
                $('body').delegate('#global-social-shareemail', 'click', function(e) {
                     e.preventDefault();
                     var getPath = window.location.pathname;
                     var productNameEncoded = "";
                     if (getPath.indexOf("brand-Chuckit") != -1) {
                         productNameEncoded = "Brand Chuckit";
                     }
                     if (getPath.indexOf("brand-jackson-galaxy") != -1) {
                         productNameEncoded = "Jackson Galaxy";
                     }
                     if (getPath.indexOf("brand-jw") != -1) {
                         productNameEncoded = "JW";
                     }
                     if (getPath.indexOf("brand-dogzilla") != -1) {
                         productNameEncoded = "Dogzilla";
                     }
                     if (getPath.indexOf("brand-aspenpet") != -1) {
                         productNameEncoded = "Aspenpet";
                     }
                     if (getPath.indexOf("brand-wwe") != -1) {
                         productNameEncoded = "WWE";
                     }

                     if (getPath.indexOf("brandChuckitAbout") != -1) {
                         productNameEncoded = "Brand Chuckit About";
                     }
                     if (getPath.indexOf("brandJacksonGalaxyAbout") != -1) {
                         productNameEncoded = "Jackson Galaxy About";
                     }
                     if (getPath.indexOf("brandJwAbout") != -1) {
                         productNameEncoded = "JW About";
                     }
                     if (getPath.indexOf("brandDogzillaAbout") != -1) {
                         productNameEncoded = "Dogzilla About";
                     }
                     if (getPath.indexOf("brandAspenpetAbout") != -1) {
                         productNameEncoded = "Aspenpet About";
                     }
                     if (getPath.indexOf("brandWweAbout") != -1) {
                         productNameEncoded = "WWE About";
                     }

                     if (widget.product()) {
                         productNameEncoded = widget.product().displayName();
                     }
                     var mailto = [];
                     var productUrl = window.location.href;
                     mailto.push("mailto:?");
                     mailto.push("subject=");
                     mailto.push(encodeURIComponent(widget.translate(productNameEncoded)));
                     mailto.push("&body=");
                     var body = [];
                     body.push(widget.translate(productNameEncoded));
                     body.push("\n\n");
                     body.push(productUrl);
                     mailto.push(encodeURIComponent(body.join("")));
                     window.location.href = mailto.join("");
                 });*/


                if (navigator.userAgent.match(/AppleWebKit/) && !navigator.userAgent.match(/Chrome/)) {
                    if (!navigator.userAgent.match(/iPad/i) && !navigator.userAgent.match(/iPhone/i)) {
                        // desktop safari
                        $("body").addClass("safari-desktop");
                    }

                }
                pubsub = t;


                //     minicart drop down element height  
                /*var findCartitems = setInterval(function() {
                    if ($(".dropdowncartItems").is(':visible')) {
                        //console.log('global js dropdown mini cart');
                        if (ko.toJS(getWidget.cart().items().length) >= 3) {
                            $('.dropdowncartItems').slimScroll({
                                height: '460px',
                                railVisible: true,
                                alwaysVisible: true
                            });

                        } else if (ko.toJS(getWidget.cart().items().length) <= 2) {
                            $('.slimScrollBar,.slimScrollRail').remove();
                        }

                    }
                    window.clearInterval(findCartitems);

                }, 500)*/



                $(document).touchstart(function(e) {
                    var container = $(".content");
                    if (!container.is(e.target) // if the target of the click isn't the container...
                        &&
                        container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        $('.content').css("display", "none");
                        $('.fa-shopping-cart').css("color", "#51534a");
                        $('.cartName').css({
                            "background-color": "#d9e021",
                            "color": "#51534a"
                        });
                    }
                });


                getWidget.twoColumnLayout();
                $(window).resize(function() {
                    getWidget.twoColumnLayout();
                });




                $.Topic(t.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    //setTimeout(function() {
                    if (getWidget.getUrlParameter("page") != "checkoutLogin" && window.location.pathname.indexOf("/checkout")) {

                        getWidget.destroySpinner();
                        n.goTo(getWidget.user().myAccountHash);
                    } else {
                        getWidget.destroySpinner();
                    }
                    //}, 3000)

                });

                $.Topic(t.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(function(obj) {
                    n.goTo("/login");
                });

                /*Function to update dynamic properties for Showing Order Details Payment Information*/

                /*mobile device zoom in issue fix*/
                $(document).ready(function() {
                    $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');

                });

                //Added password hint for header login element
                setTimeout(function() {
                    $("#CC-userRegistration-password, #CC-updatePassword-password").after("<div class='pass-hint'>*Password should be a minimum of 7 characters including 1 number & 1 uppercase letter</div>");
                }, 500)

            },

            setCookie: function(key, value) {
                var expires = new Date();
                expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
                document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
            },
            customNotifications: function() {
                $.Topic(pubsub.topicNames.CART_REMOVE_SUCCESS).subscribe(function() {
                    setTimeout(function() {
                        if ($('.cc-notification-message:contains("No items found in cart data")')) {
                            $(".cc-notification-message").text("No items found in cart");
                        }
                    }, 400)
                })
                $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(function() {
                    setTimeout(function() {
                        if ($('.cc-notification-message:contains("Response failed JSON Validation. Validated using authorize response schema. Errors: (Error:Missing required property: merchantTransactionId). ")')) {
                            $(".cc-notification-message").text("There was an error processing your order. Please contact our Consumer Services Team at 1-877-738-6283");
                        }
                    }, 200)
                })
            },
            beforeAppear: function(page) {

                widget = getWidget;
                //Make pages load on Top
                window.scrollTo(0, 0);
                //Ends
                /*if(page.pageId == 'cart'){
                    if (getWidget.getUrlParameter("abandonemail") != null) {
                         console.log("abandonemail");
                         if (getWidget.user().loggedIn() && !getWidget.user().isUserSessionExpired()) {
                             n.goTo("/cart");
                         }
                         else{
                             n.goTo("/login");
                         }
                     }
                }*/

                widget.koSubTotal(widget.cart().subTotal());
                widget.koDiscount(widget.cart().orderDiscount());
                widget.koTax(widget.cart().tax());
                widget.koTotal(widget.cart().total());

                

                $("html, body").animate({
                    scrollTop: 0
                }, "slow");

                getWidget.koPageId = page.pageId;




                $('body').delegate('.searchdeleteIcon', 'click', function() {
                    $('.mobilesearchElement #CC-headerWidget-Search_mobile, #CC-headerWidget-Search').focus();
                    $('.mobilesearchElement #typeaheadDropdown').css('display', 'none');
                    $('#CC-headerWidget-Search, #CC-headerWidget-Search_mobile').val('')

                });

                $('body').delegate('#CC-headerWidget-Search, #CC-headerWidget-Search_mobile', 'focusout', function() {

                    $('.searchdeleteIcon').fadeOut('fast');
                    $('.searchIcon').removeClass("searchIconHover");
                    $('.mobilesearchElement #CC-headerWidget-Search, .mobilesearchElement #CC-headerWidget-Search_mobile').val('');

                    if ($(window).width() <= 1024) {

                        $('#searchIconForMobileDev').addClass('searchIconforMobile').removeClass('searchIconHoverformobile');
                        $('.CancelLink').css('display', 'none');
                        $('.mobilesearchElement #CC-headerWidget-Search, .mobilesearchElement #CC-headerWidget-Search_mobile').val('');
                        $('.close-icon').css('display', 'none');
                        $('.search-query').css("width", "100% !important;");


                    }
                });

                $('body').delegate('#CC-headerWidget-Search, #CC-headerWidget-Search_mobile', 'focusin', function() {
                    if ($(window).width() <= 1024) {

                        $('#searchIconForMobileDev').addClass('searchIconHoverformobile').removeClass('searchIconforMobile ');
                        $('.CancelLink').css('display', 'block');
                        $('.search-query').css("width", "85% !important;");

                    }
                });

                $('body').delegate('input:not(#CC-headerWidget-Search)', 'keyup', function() {
                    if (page.pageId == 'profile' || page.pageId == 'createaccount' || page.pageId == 'checkout' || page.pageId == 'login') {

                        if ($(this).hasClass('valid')) {
                            if ($(this).val() != '') {
                                $(this).next().next().addClass('showSuccess')
                            }
                        } else if ($(this).hasClass('error')) {

                            $(this).next().next().removeClass('showSuccess');

                        } else {
                            $(this).next().next().removeClass('showSuccess');
                        }

                    }
                })


                //  redesign code ends here 



                getData = ko.toJS(getWidget.product());
                var getPathURL = window.location.host;
                getPath = window.location.pathname + window.location.hash;

                if (window.location.href.match(/^.*k9control/)) {
                    window.location.replace("/k9-control-retractable-leash/product/13994");
                } else if (window.location.href.match(/^.*jacksongalaxy/)) {
                    window.location.replace("/brandLanding/brand-jackson-galaxy");
                }

                if (window.location.pathname != "/login" && decodeURIComponent(getWidget.getUrlParameter("page")) == "/profile" && getWidget.getUrlParameter("loggedIn") == "false") {
                    setInterval(function() {
                        $("body").removeClass("modal-open");
                    }, 50);
                    n.goTo("/login?loggedIn=false&page=profile");
                }
                if ($(window).width() < 1024) {
                    $("body").delegate("#dropdowncart .heading", "click", function() {
                        setInterval(function() {
                            if ($("#dropdowncart .content").is(':visible')) {
                                $("#dropdowncart.active").css('background-color', '#0081c6');
                                $('.fa-shopping-cart').css('color', '#fff');
                                $('.cartName').css('color', 'rgb(0, 129, 198)');
                                $('.cartName').css('background-color', 'rgb(147, 217, 255)');
                            } else if ($("#dropdowncart .content").is(':hidden')) {
                                $("#dropdowncart").css('background-color', '#fff');
                                $('.fa-shopping-cart').css('color', '#51534a');
                                $('.cartName').css('color', 'rgb(81, 83, 74)');
                                $('.cartName').css('background-color', 'rgb(217, 224, 33)');

                            }
                        }, 50);
                    });
                }


                pageDetails = page.pageId;


                $('body').delegate('#CC-checkoutPaymentDetails-cardType', 'change', function() {
                    if ($('#CC-checkoutPaymentDetails-cardNumber').val() != '') {
                        $('#CC-checkoutPaymentDetails-cardNumber').focus();
                        $('#CC-checkoutPaymentDetails-cardNumber').blur();
                    }
                });
                $('body').delegate('.paymentimages', 'click', function() {
                    if ($('#CC-checkoutPaymentDetails-cardNumber').val() != '') {
                        $('#CC-checkoutPaymentDetails-cardNumber').focus();
                        $('#CC-checkoutPaymentDetails-cardNumber').blur();
                    }
                });

                getWidget.twoColumnLayout();
                $(window).resize(function() {
                    getWidget.twoColumnLayout();
                });

                if (getWidget.getUrlParameter("loggedIn") != null) {
                    // setTimeout(function() {
                    $(".modal-backdrop").remove();
                    // }, 1500)
                }


                $('body').delegate('#dropdowncart', 'mouseover', function() {
                    if ($('#dropdowncart').not(':visible') && getWidget.cart().items().length > 0) {
                        $("#CC-header-cart-total").trigger("click");
                    }
                    $('.content').css("display", "block");

                    /* var finditems = setInterval(function() {
                         if ($(".dropdowncartItems").is(':visible')) {
                             //  console.log('dropdown mini cart');
                             if (ko.toJS(getWidget.cart().items().length) >= 3) {
                                 $('.dropdowncartItems').slimScroll({
                                     height: '460px',
                                     railVisible: true,
                                     alwaysVisible: true
                                 });

                             } else if (ko.toJS(getWidget.cart().items().length) <= 2) {
                                 $('.slimScrollBar,.slimScrollRail').remove();
                             }

                         }
                         window.clearInterval(finditems);

                     }, 50) */


                });




                $('body').delegate('#dropdowncart', 'mouseout', function() {
                    /**/
                    $('.content').css("display", "none");
                    /*     $('.fa-shopping-cart').css("color", "#51534a");
                         $('.cartName').css({
                             "background-color": "#d9e021",
                             "color": "#51534a"
                         });*/
                });
                // to display the video section  modal window in PDP page  redesign code 

                $("body").delegate(".pdp-video", "click", function() {
                    var videoUrl = $(this).attr('videourl');
                    $('#videoModal').modal('show');
                    $("#videoSrc").attr('src', videoUrl);
                });

                $('#videoModal').on('hide.bs.modal', function(e) {
                    var $if = $(e.delegateTarget).find('iframe');
                    var src = $if.attr("src");
                    $if.attr("src", '/empty.html');
                    $if.attr("src", src);
                });



                // to model window ends here 

                /*MiniCart Checkout PubSub*/

                widget.checkSessionExpire();
                $.Topic(pubsub.topicNames.USER_SESSION_EXPIRED).subscribe(function(data) {
                    //console.log('Minicart Expire One');
                    if (getWidget.user().isUserSessionExpired() == true) {
                        //console.log('Minicart Expire Two');
                        $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).publishWith([{
                            message: "success"
                        }]);
                        window.location = '/login';
                        //n.goTo("/login");
                    }

                });

                $.Topic("update-stars").subscribe(function(e) {
                    $('span.stars').stars();
                });
                // reorder the product in order details page 
                $.Topic("addToCart").subscribe(function(data) {
                    var self = this;
                    var quantity = data.quantity;
                    var skuId = data.catRefId;
                    var productId = data.productId;
                    var displayName = data.displayName;
                    var thumbUrl = data.primaryThumbImageURL;
                    var a = CCconstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
                    var l = {};
                    var p = productId;
                    var output = [];
                    restClient.request(a, l, function(output) {
                        var skuItem = {};
                        for (var index in output.childSKUs) {
                            if (skuId == output.childSKUs[index].repositoryId) {
                                skuItem = output.childSKUs[index];
                            }
                        }

                        var t = [];
                        var result = {};
                        for (var variant in output.productVariantOptions) {
                            t.push({
                                optionName: output.productVariantOptions[variant].optionName,
                                optionValue: skuItem[output.productVariantOptions[variant].optionId]
                            });
                        }

                        result = {
                            selectedOptions: t
                        };

                        var s = $.extend(!0, {}, output, result);
                        s.childSKUs = [skuItem], s.orderQuantity = parseInt(quantity, 10);
                        $.when($.Topic(pubsub.topicNames.CART_ADD).publishWith(s, [{
                            message: "success"
                        }])).then(function() {
                            if (pageDetails === 'guestorderdetails') {
                                window.location = '/cart';
                            }
                        });
                    }, function(output) {
                        output.status == 404 ? i.goTo("404") : u && output && u(output);
                    }, p);



                });
                // reorder the product ends here 
                $.fn.stars = function() {
                    return $(this).each(function() {
                        // Get the value
                        var val = parseFloat($(this).attr('title'));
                        // Make sure that the value is in 0 - 5 range, multiply to get width
                        var size = Math.max(0, (Math.min(5, val))) * 16;
                        // Create stars holder
                        var $span = $('<span />').width(size);
                        // Replace the numerical value with stars
                        $(this).html($span);
                    });
                }

                /*         var findClass=setInterval(function(){
                             if($('#page').hasClass('mp-pushed')){
                                 $('.mobile-navbar-link-button').addClass('open');
                             }else{
                                  $('.mobile-navbar-link-button').removeClass('open');
                             }
                             clearInterval(findClass);
                         })
                         
                         */
                $(document).ready(function() {
                    $('.mobile-navbar-link-button').click(function() {
                        if ($(this).hasClass('open')) {
                            $(this).removeClass('open');
                        } else {
                            $(this).addClass('open');
                        }

                    });


                    $('#page').click(function() {
                        if ($(window).width() <= 1024) {
                            $('.mobile-navbar-link-button').removeClass('open')
                        }

                    })
                });
                // redesign code to change the placeholder text
                function changePlaceholder() {
                    if ($(window).width() > 1024) {
                        $("#CC-headerWidget-Search").attr("placeholder", "Search pet products & education");
                    } else {
                        $("#CC-headerWidget-Search").attr("placeholder", "Search");
                    }
                }

                $(window).resize(function() {
                    changePlaceholder();
                });

                //redesign code ends here for placeholder text
                widget.customNotifications()

            },
            appendScript: function(filepath) {
                if ($('head script[src="' + filepath + '"]').length > 0) {
                    return;
                }
                var ele = document.createElement('script');
                ele.setAttribute("type", "text/javascript");
                ele.setAttribute("src", filepath);
                ele.async = true;
                $('head').append(ele);
            },

            //Session Expire Check function
            checkSessionExpire: function() {
                if (getWidget.user().isUserSessionExpired()) {
                    //console.log('checkSessionExpire Two');
                    if (getWidget.pageContext().page.name == 'cart' || getWidget.pageContext().page.name == 'checkout') {
                        //console.log('checkSessionExpire Three');
                        $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).publishWith([{
                            message: "success"
                        }]);
                        window.location = "/login";
                    }
                }

            },
            twoColumnLayout: function() {

                setTimeout(function() {
                    /*Redesign Code Starts here*/
                    if ($(window).width() >= 1024) {
                        $("#CC-petredesign-productListing").parents(".col-sm-9").addClass('ContainerfullWidth');
                        $(".educationLeftNav").parents(".col-sm-3").addClass("ContainerfullWidth"); /**** hiding filter if there is no product in search page */
                        $(".education-plp").parents(".col-sm-9").addClass('ContainerfullWidth');
                        $("#categoryCLP").parents(".col-sm-10").addClass('ContainerfullWidth');
                    }

                    /*Redesign Code Ends here*/

                }, 1000);
            },

            getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            },
            /**
             * Destroy the 'loading' spinner.
             * @function  OrderViewModel.destroySpinner
             */
            destroySpinner: function() {
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
            },
        };
    }
);