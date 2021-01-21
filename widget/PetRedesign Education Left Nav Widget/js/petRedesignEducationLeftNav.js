define(['knockout','CCi18n','ccConstants', 'pubsub', 'storageApi', 'ccRestClient'], 

function(ko, CCi18n, CCConstants, pubsub, storageApi, rest) {  
  
  "use strict";
  var getWidget = '';
  return {
      koGetCategoryList: ko.observableArray(),
		updateData: function (getData) {
			ko.mapping.fromJS(getData,{}, this.koGetCategoryList);
			//console.log('****************' , ko.toJS(this.koGetCategoryList));
		},
        onLoad: function(widget) {
                getWidget = widget;
                //console.log(getWidget,'getwidget');
              
        },
        
        beforeAppear: function (page) {
        	 var widget = this;
                        var l_c = {};
                            l_c["depth"] = "max";
                            var id = widget.collectionId();
                            //console.log(widget.collectionId() , 'widget.collectionId')
                             rest.request(CCConstants.ENDPOINT_COLLECTIONS_GET_COLLECTION, l_c, function(e1) {
                                    //console.log(e1 ,'-------------%%%%%%%%%%%%%%---------------' );
                                     if($.type(e1) == "object") {
                        				var tempData = [];
                        			   	tempData.push(e1);
                        			  	e1 = tempData;
                        			 }
                        		    	 //console.log(e1);
            		            	  widget.updateData(e1);
                                
                              }, function(e1) {
                               
                            }, id);

            				  /* var dataUrl = ""	;
            				   var url = window.location.hostname;
            		            var o = CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
            					u = {};
            					u[CCConstants.CATEGORY] = widget.collectionId(), u.includeChildren = !0;
                                //u['fields'] = 'items.arrivalDate,items.onSale,items.ratingCount,items.promotext,items.primaryFullImageURL,items.route,items.displayName,items.listPrice,items.salePrice,items.startDateStr,items.id';
            					rest.request(o, u, function(e) {
            					   //console.log('petRedesign Data1 before', e);
                							for(var j=0;j<e.length;j++){
                                		       var imagePath = e[j].primaryFullImageURL.split('=');
                                               e[j].primaryFullImageURL=ko.observable(imagePath[1]);
                                              // //console.log(imagePath[1] ,'---------- img path---');
                        		            }
                        		            
                        		            	getWidget.updateData(e);
            					});
            			*/
            		
            		
                  $("body").on( "click",".mobile-category-link", function() {
                      $('.mobile-category-modal').addClass('displayedMobileCat');
                  })
                
                $("body").on( "click", ".filterCloseIcon",function() {
                      $('.mobile-category-modal ').removeClass('displayedMobileCat');
                  })
                  	
            		
         }
          
  };
});
