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
	var productIds='';
    return {
       	getProductDetailList: ko.observableArray(),
        getFinalProductData:ko.observableArray([]),
		 updateData: function (getData) {
		     var widget=this;
		     
			ko.mapping.fromJS(getData,{}, this.getProductDetailList);
			ko.mapping.fromJS(getData,{}, this.getFinalProductData);
    
		
	    
       },
		onLoad: function(widget) {
		    getWidget = widget;
		    widget.getFinalProductData([]);
		},
		newMonthDisplay: function(data) {
		  
                if(data.startDateStr() !==null && data.startDateStr() !== "") {
                    var startDateArr = data.startDateStr().split("-");
                       var shortMon =["Jan","Feb", "Mar", "Apr","May" ,"Jun" ,"Jul" ,"Aug", "Sep" ,"Oct", "Nov","Dec"];
                     
                     var startDateFormat = shortMon[(parseInt(startDateArr[1])-1)]+" "+startDateArr[2]+", "+startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }
                
            },
		  getProductDetails:function(getProductId){
              var widget = this;
               i.authenticatedRequest("/ccstoreui/v1/products/?productIds="+ getProductId.toString() + "&fields=route,displayName,primaryFullImageURL,description,id,startDateStr", {}, function(e) {
                    widget.updateData(e);
                      
    			 }, function(data) {}, "GET");
      
            
        },

		beforeAppear: function(page) {
		  $(window).scroll(function() {
                    if ($('#educationArticleSectionWidget').length > 0) {
                        //check if your div is visible to user
                        // CODE ONLY CHECKS VISIBILITY FROM TOP OF THE PAGE
                        if ($(window).scrollTop() + $(window).height() >= $('#educationArticleSectionWidget').offset().top) {
                            if (!$('#educationArticleSectionWidget').attr('loaded')) {
                                $('#educationArticleSectionWidget').attr('loaded', true);
                                getWidget.getArticleProduct();
                            }
                        }
                    }
                });
		},
		getArticleProduct: function() {
                if (getWidget.productId() !== null) {
                    if (getWidget.productId().indexOf(',') != -1) {
                        productIds = getWidget.productId().split(',');
                        getWidget.getProductDetails(productIds);
                    } else {
                        productIds = getWidget.productId();
                        getWidget.getProductDetails(productIds);
                    }
                }
            },
    };
  }
);
