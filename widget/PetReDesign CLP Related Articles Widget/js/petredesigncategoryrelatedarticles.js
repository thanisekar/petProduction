/**
 * @fileoverview Petmate Carousel Widget.
 *
 * @author oracle
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'ccConstants', 'ccRestClient'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, r, i) {

    "use strict";
	var getPageId = "";
	var getWidget = "";
    return {
		koClpRelatedArticles:ko.observableArray([]),
		koGetRouteCategoryPath:ko.observableArray([]),
		onLoad: function(widget) {
		   getWidget=widget;
		},
		
		beforeAppear: function(page) {
		    //console.log('page',page.contextId);
		   	getWidget.koClpRelatedArticles([]);
		   	getWidget.koGetRouteCategoryPath([]);
		    if(page.contextId=='dogs'){
		          getWidget.getArticleProducts('dogarticle'); 
					  
		    } else if(page.contextId=='cats'){
		         getWidget.getArticleProducts('catarticle'); 
					  
		    } else if(page.contextId=='birds'){
		          getWidget.getArticleProducts('birdarticle'); 
					  
		    }
			
            
		
		},
	   
	   getArticleProducts:function(getArticleId){
	       var getProductId='';
	       
	       if(getArticleId=='dogarticle'){
	           getProductId='a90055,a90064,a90073';
	        }
	        else if(getArticleId=='catarticle'){
	            getProductId='a90087,a90083,a90074';
	        }
	        else if(getArticleId=='birdarticle'){
	            getProductId='a90082,a90007,a90077';
	        }
	              
	              
	        i.authenticatedRequest("/ccstoreui/v1/products/?productIds="+ getProductId.toString() + "&fields=route,displayName,primaryFullImageURL,id", {}, function(data) {
	          //  console.log(data ,'----article data--');
                    //widget.updateData(e);
                    for(var j=0;j<data.length;j++){
            		       var imagePath = data[j].primaryFullImageURL.split('=');
                           data[j].primaryFullImageURL=ko.observable(imagePath[1]);
                       
    		            }  
    		            
    		             getWidget.koClpRelatedArticles(data);
    		            
                      
    			 }, function(data) {}, "GET");       
	              
	               /* var o = r.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
				      u = {};
					  u[r.CATEGORY] = getArticleId , u.includeChildren = !0,u.limit=3;
                      u['fields'] = 'items.primaryFullImageURL,items.route,items.displayName,items.id';
					  i.request(o, u, function(e) {
					        var data1 = e.items;
					     
    				           for(var j=0;j<data1.length;j++){
                    		       var imagePath = data1[j].primaryFullImageURL.split('=');
                                   data1[j].primaryFullImageURL=ko.observable(imagePath[1]);
                               
            		            }   
            		            getWidget.koClpRelatedArticles(data1);
            		            
					});*/
						 var l_c = {};
    			         l_c["depth"] = "max";
    		            i.request(r.ENDPOINT_COLLECTIONS_GET_COLLECTION, l_c, function(e1) {
    			           getWidget.koGetRouteCategoryPath.push({'route':e1.route , 'id':e1.id });
    			           
    			        }, function(e1) {
                       
                       }, getArticleId);

	       
	   },

		
	
       
        
    };
  }
);
