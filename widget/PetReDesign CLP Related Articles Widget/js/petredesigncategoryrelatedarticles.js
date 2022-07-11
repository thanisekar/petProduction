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
		truncate:function(string){
                 var getString;
        			   getString=string;
        			   if(getString){
        			        if (string.length > 155 )
                           {
                             getString= string.substring(0,155)+'...'; 
                               return getString;
                           }
                           else{
                                return getString;
                           }
        			   }
                       
             
                 },
		newMonthDisplay: function(data) {
                if(data.startDateStr !==null && data.startDateStr !== "") {
                    var startDateArr = data.startDateStr.split("-");
                       var shortMon =["Jan","Feb", "Mar", "Apr","May" ,"Jun" ,"Jul" ,"Aug", "Sep" ,"Oct", "Nov","Dec"];
                     
                     var startDateFormat = shortMon[(parseInt(startDateArr[1])-1)]+" "+startDateArr[2]+", "+startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }
                
            },
	   
	   getArticleProducts:function(getArticleId){
	       var getProductId='';
	       
	       if(getArticleId=='dogarticle'){
	           getProductId='a90222,a90221,a90156';
	        }
	        else if(getArticleId=='catarticle'){
	            getProductId='a90223,a10002,a90217';
	        }
	        else if(getArticleId=='birdarticle'){
	            getProductId='a90153,a90082,a90062';
	        }
	              
	              
	        i.authenticatedRequest("/ccstoreui/v1/products/?productIds="+ getProductId.toString() + "&fields=route,displayName,primaryFullImageURL,id,description,startDateStr", {}, function(data) {
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
