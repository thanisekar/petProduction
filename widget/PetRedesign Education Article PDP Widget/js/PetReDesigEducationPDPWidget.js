/**
 * @fileoverview Product Details Widget.
 * 
 */
define(

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'jquery', 'pubsub', 'ccConstants', 'koValidate', 'notifier', 'CCi18n', 'storeKoExtensions', 'swmRestClient', 'spinner', 'pageLayout/product', 'ccRestClient', 'pinitjs'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, $, pubsub, CCConstants, koValidate, notifier, CCi18n, storeKoExtensions, swmRestClient, spinner, product, ccRestClient, pinitjs) {

    "use strict";
    var widgetModel;
    var getData = [];
    var getCurrentData = [];
    var getPath = "";
    var MediaValue = "";
    //var dataLayer = [];

    var LOADED_EVENT = "LOADED";
    var LOADING_EVENT = "LOADING";

    var productLoadingOptions = {
        parent: '#cc-product-spinner',
        selector: '#cc-product-spinner-area'
    };


    return {
      itemQuantity: ko.observable(1),
      koArticleProductCategory: ko.observableArray([]),
      isMediaArticle : ko.observable(false),
      isGiftCard : ko.observable(false),
      imgGroups: ko.observableArray(),
      getFinalProductData:ko.observableArray([]),
      getRecommendedProductData:ko.observableArray([]),
      
       updateData: function (getData) {
		     var widget=this;
		     
			ko.mapping.fromJS(getData,{}, this.getFinalProductData);
    
	    
       },
       updateDataRecommended: function (getData) {
		     var widget=this;
			ko.mapping.fromJS(getData,{}, this.getRecommendedProductData);
			 $.Topic('sendRecommendedProducts.memory').publish(widget.getRecommendedProductData());
              console.log(widget.getRecommendedProductData(),'getRecommendedProductData');
	    
       },


      onLoad: function (widget) {
          widgetModel = widget;
           $('body').delegate('.social-sharing', 'click', function() {
                    var name = $(this).attr('id');
                    getWidget.socialLink(name);
                });
                
                
      },

      beforeAppear: function (page) {
            var widget = this;
           getPath = window.location.href;
          
          if(widget.getUrlParameter("media")!=null || widget.getUrlParameter("media")!=undefined){
              var redirectMediaLink=widget.getUrlParameter("media");
               widget.isMediaArticle(true);
                widget.isGiftCard(false);
          }
          else{
              widget.isMediaArticle(false);
               widget.isGiftCard(false);
          }
         
        
         if(widget.product().brand() == "GiftGuides"){
             widget.isGiftCard(true);
         }else{
             widget.isGiftCard(false);
         }

        if (widget.product()) {
        widget.imgGroups(widget.groupImages(widget.product().thumbImageURLs()));
        }
        widget.loaded(true);
        this.itemQuantity(1);
        
        
        var getSocialInterval = setInterval(function() {
                        if ($("#petmateSocialIcons").length > 0) {
                            getSocialInterval = window.clearInterval(getSocialInterval);
                            widget.createSocialLink();
                        }
                    }, 100);
       //Fix for articles image stylings
        setTimeout(function(){$( "#CC-prodDetails-longDescription img" ).addClass( "img-responsive" );},1000)
        var nextIds = [];
        nextIds.push(widget.product().previousId());
        nextIds.push(widget.product().nextid());
        widget.getProductDetailsPDP(nextIds);
        //widget.receiveProductId();
        
        
      },
      
      
      getProductDetailsPDP:function(getProductId){
              var widget = this;
               ccRestClient.authenticatedRequest("/ccstoreui/v1/products/?productIds="+ getProductId.toString() + "&fields=route,displayName,id", {}, function(e) {
                    widget.updateData(e);
    			 }, function(data) {}, "GET");
      
            
        },
        
        getRecommendedPDP:function(getProductId){
            console.log(getProductId,'getProductId');
              var widget = this;
               ccRestClient.authenticatedRequest("/ccstoreui/v1/products/?productIds="+ getProductId + "&fields=route,displayName,id,primarySmallImageURL,listPrice", {}, function(e) {
                    widget.updateDataRecommended(e);
    			 }, function(data) {}, "GET");
      
            
        },
        
        receiveProductId : function() {
            var widget = this;
            console.log('receiveProductId');
             widget.getRecommendedProductData('');
             console.log(widget.product().ratingCount(),'widget.product().ratingCount()');
                if ((widget.product().ratingCount() !== null) && (widget.product().ratingCount() !== "0")) {
                    if (widget.product().ratingCount().indexOf(',') != -1) {
                        var productIds = widget.product().ratingCount().split(',');
                        widget.getRecommendedPDP(productIds);
                    }
                }else{
                    console.log('getRecommendedProductData else');
                    $.Topic('sendRecommendedProducts.memory').publish(widget.getRecommendedProductData());
                }
            },
     
        
        createSocialLink: function() {
            var widget = this;
                        var addthisLength = $('script[src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5552cdc32f05e920"]').length;
                        if (window.addthis) {
                            window.addthis = null;
                            window._adr = null;
                            window._atc = null;
                            window._atd = null;
                            window._ate = null;
                            window._atr = null;
                            window._atw = null;
                        }
                        if (addthisLength !== 0) {
                            $('script[src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5552cdc32f05e920"]').remove();
                            window['addthis_share'].url = window.location.href;
                            window['addthis_share'].title = window.document.title;
                            window['addthis_share'].image = "https://www.petmate.com/file/products/litter_box_101.jpg";
    
                        }
    
                        widget.loadScript("//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5552cdc32f05e920", function() {
                            window.addthis.toolbox('.addthis_sharing_toolbox');
                        });
    
                    },
        loadScript: function (url, callback) {
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
                    },
        socialLink: function(socialType) {
                    if (getWidget.product()) {}
                    var prod = getWidget.product().product;
                    var siteURL = window.location.href;
                    var pageTitle;
    
                    pageURL = siteURL;
                    var productTitle, pageTitle = encodeURIComponent(prod.displayName);
                    var pageImg = window.location.origin + encodeURIComponent(prod.primaryFullImageURL);
                    var addy = socialType;
                    var redirect_uri = pageURL + "#socialCloseWindow";
                    if (addy == "google_plus") {
                        popURL = 'https://plus.google.com/share?url=' + encodeURIComponent(pageURL);
                    }
                    var iconWin = window.open(popURL, "_blank", "toolbar=no, scrollbars=no, resizable=yes, top=350, left=250, width=500, height=400");
    
                },
      /**
       * Fetch Facebook app id
       */
      fetchFacebookAppId: function() {
        var widget = this;
        var serverType = CCConstants.EXTERNALDATA_PRODUCTION_FACEBOOK;
        if (widget.isPreview()){
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
      fetchFacebookAppIdSuccessHandler: function(pResult){
        var widget = this;
        widget.siteFbAppId(pResult.serviceData.applicationId);
        
        //if (widget.siteFbAppId()) {
        //  facebookSDK.init(widget.siteFbAppId());
        //}
      },
      
      /**
       * Fetch Facebook app id error handler
       */
      fetchFacebookAppIdErrorHandler: function(pResult){
        logger.debug("Failed to get Facebook appId.", result);
      },
      
      // Share product to FB
      shareProductFbClick: function() {
        var widget = this;
        
        // open fb share dialog
        var protocol = window.location.protocol;
        var host = window.location.host;
        var productUrlEncoded = encodeURIComponent(protocol + "//" + host + "/product/" + widget.product().id());
      
        var appID = widget.siteFbAppId();
        // NOTE: Once we can support the Facebook Crawler OG meta-tags, then we should try and use the newer Facebook Share Dialog URL
        //       (per https://developers.facebook.com/docs/sharing/reference/share-dialog).  Until then, we will use a legacy
        //       share URL.  Facebook may eventually not support this older URL, so would be good to replace it as soon as possible.
        //var fbShareUrl = "https://www.facebook.com/dialog/share?app_id=" + appID + "&display=popup&href=" + spaceUrlEncoded + "&redirect_uri=https://www.facebook.com";
        var fbShareUrl = "https://www.facebook.com/sharer/sharer.php?app_id=" + appID + "&u=" + productUrlEncoded;
        var facebookWin = window.open(fbShareUrl, 'facebookWin', 'width=720, height=500');
        if(facebookWin){
          facebookWin.focus();
        }
      },
      
      // Share product to Twitter
      shareProductTwitterClick: function() {
        var widget = this;
        var productNameEncoded = encodeURIComponent(widget.product().displayName());
        var protocol = window.location.protocol;
        var host = window.location.host;
        var productUrlEncoded = encodeURIComponent(protocol + "//" + host + "/product/" + widget.product().id());
        var twitterWin = window.open('https://twitter.com/share?url=' + productUrlEncoded + '&text=' + productNameEncoded, 'twitterWindow', 'width=720, height=500');
        if(twitterWin){
          twitterWin.focus();
        }
      },

      // Share product to Pinterest
      shareProductPinterestClick: function() {
        var widget = this;
        var productNameEncoded = encodeURIComponent(widget.product().displayName());
        var protocol = window.location.protocol;
        var host = window.location.host;
        var productUrlEncoded = encodeURIComponent(protocol + "//" + host + "/product/" + widget.product().id());
        var productMediaEncoded = encodeURIComponent(protocol + "//" + host + widget.product().primaryLargeImageURL());
        
   
    
    
        //var pinterestWin = window.open('http://pinterest.com/pin/create/bookmarklet/?url=' + productUrlEncoded + '&description=' + productNameEncoded + '&media=' + productMediaEncoded, 'pinterestWindow', 'width=720, height=500');
    
    var pinterestWin = window.open('http://pinterest.com/pin/create/bookmarklet/?media=' + productMediaEncoded + '&url=' + productUrlEncoded + 'e&description=' + productNameEncoded + '%2C%20available%20at%20%23surlatable&is_video=false', 'pinterestWindow', 'width=720, height=500');
    
        if(pinterestWin){
          pinterestWin.focus();
        }
      },
      
      // Share product by Email
      shareProductEmailClick: function() {
        var widget = this;
        var mailto = [];
        var protocol = window.location.protocol;
        var host = window.location.host;
        var productUrl = protocol + "//" + host + "/product/" + widget.product().id();
        mailto.push("mailto:?");
        mailto.push("subject=");
        mailto.push(encodeURIComponent(widget.translate('shareProductEmailSubject', {'productName': widget.product().displayName()})));
        mailto.push("&body=");
        var body = [];
        body.push(widget.translate('shareProductEmailBodyIntro', {'productName': widget.product().displayName()}));
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


      groupImages: function(imageSrc) { 
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
          
      },


      
      getUrlParameter: function(name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return null;
            }
            else{
               return results[1] || 0;
            }
          }
    };
  }
);
