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