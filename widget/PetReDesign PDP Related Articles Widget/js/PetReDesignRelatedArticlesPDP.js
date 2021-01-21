/**
 * @fileoverview petmate Carousel Widget
 * 
 * @author oracle
 */
 
define(
    ['jquery', 'knockout','ccRestClient','ccConstants'],
    function($, ko ,ccRestClient, ccConstants) {
        'use strict';
        var getRelatedArticles='';
      
        return {
          kogetRelatedArticles:ko.observableArray(),
          relatedArticlesData:ko.observableArray([]),
         	updateData: function (getData) {
         	    var widget=this;
    			ko.mapping.fromJS(getData,{}, this.kogetRelatedArticles);
    		    	widget.relatedArticlesData.push(getData)
    		},

            // On Load
            onLoad: function(widget) {
              
            },

            getProductDetails:function(getProductId){
                  var widget = this;
                    ccRestClient.authenticatedRequest("/ccstoreui/v1/products/"+ getProductId.toString() + "?fields=route,displayName,primaryFullImageURL,description,id", {}, function(e) {
                          widget.updateData(e);
        			 }, function(data) {}, "GET");
                
            },

            //Before appear of the page
            beforeAppear: function(page) {
              var widget = this;
              widget.relatedArticlesData([]);
                if(widget.product().hasOwnProperty('petRelatedArticles')){
                  if(widget.product().petRelatedArticles()!==null){
                       if( widget.product().petRelatedArticles().indexOf(',')!=-1){
                            widget.relatedArticlesData([]);
                            getRelatedArticles = widget.product().petRelatedArticles().split(',');
                            for(var i=0;i<getRelatedArticles.length;i++){
                          widget.getProductDetails(getRelatedArticles[i]);
                        
                            
                                }
                         }
                         else{
                              widget.relatedArticlesData([]);
                              getRelatedArticles = widget.product().petRelatedArticles();
                              widget.getProductDetails(getRelatedArticles);
                         }
                  }
           
              
            }
           //New pixel tracking PDP on 03/27/2020
           $("script[id='facebookTrackingPdp']").remove();
           if ($("script[id='facebookTrackingPdp']").length === 0) {
               var facebookTrackingPdp = 
               '<script id="facebookTrackingPdp">' +
                   '!function(f,b,e,v,n,t,s)' +
                   '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?' +
                   'n.callMethod.apply(n,arguments):n.queue.push(arguments)};' +
                   'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";' +
                   'n.queue=[];t=b.createElement(e);t.async=!0;' +
                   't.src=v;s=b.getElementsByTagName(e)[0];' +
                   's.parentNode.insertBefore(t,s)}(window, document,"script",' +
                   ' "https://connect.facebook.net/en_US/fbevents.js");' +
                   'fbq("init", "585915662011996");' +
                   'fbq("track", "PageView");' +
                   '</script>' +
                   '<noscript><img height="1" width="1" style="display:none"' +
                   'src="https://www.facebook.com/tr?id=585915662011996&ev=PageView&noscript=1"' +
                   '/></noscript>';
                   
                   var linqiaPdp = '<img src="https://linqia.ooh.li/c/a8a65ade84c34685.png"/> <script src="https://linqia.ooh.li/c/a8a65ade84c34685.js"></script>'
               $("head").append(facebookTrackingPdp,linqiaPdp);
           }
           //Ends

            },


           truncate:function(string ){
			var getString;
                   if (string.length > 230 )
                   {
                     getString= string.substring(0,230)+'...'; 
                       
                       return getString;
                       
                   }
                   else{
                        return string;
                   }
             
          }
          
        }

    });