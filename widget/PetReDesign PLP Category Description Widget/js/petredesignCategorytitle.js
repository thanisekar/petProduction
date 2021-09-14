/**
 * @fileoverview Footer Widget.
 *
 * @author Taistech
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['knockout','ccRestClient','ccConstants'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, ccRestClient, ccConstants) {

    "use strict";
	var getWidget = "";
    
    return {
        isBrandPage : ko.observable(false),
        koGetCategoriesArticles:ko.observableArray([]),
        itemsPerRowInLargeDesktopView: ko.observable(4),
            itemsPerRowInDesktopView: ko.observable(4),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(2),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),
		onLoad: function(widget) {
		    getWidget = widget;
		    $('body').delegate('.show_hide', 'click', function() {
		             var txt = $(".plpCategoryDescription p:not(:first)").is(':visible') ? 'Read More' : 'Read Less';
                        $(".show_hide").text(txt);
                        $('.plpCategoryDescription p:not(:first)').slideToggle(300);
                });
                
                widget.recommendationsGroupsArticles = ko.computed(function() {
                    var groups = [];
                    if (widget.koGetCategoriesArticles() != null) {
                        
                        for (var i = 0; i < widget.koGetCategoriesArticles().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                
                                groups.push(ko.observableArray([widget.koGetCategoriesArticles()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koGetCategoriesArticles()[i]);
                            }
                        }
                    }
                    return groups;
 
                }, widget);
                
                widget.updateSpanClass = function() {
                    var classString = "";
                    var phoneViewItems = 0,
                        tabletViewItems = 0,
                        desktopViewItems = 0,
                        largeDesktopViewItems = 0;
                    ////console.log(this.itemsPerRow(),'----Test---');
                    if (this.itemsPerRow() == this.itemsPerRowInPhoneView()) {
                        phoneViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInTabletView()) {
                        tabletViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInDesktopView()) {
                        desktopViewItems = 12 / this.itemsPerRow();
                        ////console.log(desktopViewItems,'---desktopViewItems---')
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInLargeDesktopView()) {
                        largeDesktopViewItems = 12 / this.itemsPerRow();
                    }
                    if (phoneViewItems > 0) {
                        classString += "col-xs-" + phoneViewItems;
                    }
                    if ((tabletViewItems > 0) && (tabletViewItems != phoneViewItems)) {
                        classString += " col-sm-" + tabletViewItems;
                    }
                    if ((desktopViewItems > 0) && (desktopViewItems != tabletViewItems)) {
                        classString += " col-md-" + desktopViewItems;
                    }
                    if ((largeDesktopViewItems > 0) && (largeDesktopViewItems != desktopViewItems)) {
                        classString += " col-lg-" + largeDesktopViewItems;
                    }

                    widget.spanClass(classString);
                };
                /**
                 * Checks the size of the current viewport and sets the viewport and itemsPerRow
                 * mode accordingly
                 */
                widget.checkResponsiveFeatures = function(viewportWidth) {
                    if (viewportWidth > ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.LARGE_DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.LARGE_DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInLargeDesktopView());
                        }
                    } else if (viewportWidth > ccConstants.VIEWPORT_TABLET_UPPER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInDesktopView());
                        }
                    } else if (viewportWidth >= ccConstants.VIEWPORT_TABLET_LOWER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.TABLET_VIEW) {
                            widget.viewportMode(ccConstants.TABLET_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInTabletView());
                        }
                    } else if (widget.viewportMode() != ccConstants.PHONE_VIEW) {
                        widget.viewportMode(ccConstants.PHONE_VIEW);
                        widget.itemsPerRow(widget.itemsPerRowInPhoneView());
                    }
                    widget.updateSpanClass();
                };

                widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                $(window).resize(
                    function() {
                        widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                        widget.viewportWidth($(window)[0].innerWidth || $(window).width());
                    });
                    
                     $("body").delegate(".articleCollectionCarousel", "slid.bs.carousel", function(e) {
                        widget.getArticleCarouselArrow();
                    });
		},

		beforeAppear: function(page) {         
		//	console.log("page",page);
		//	console.log("getWidget",getWidget)
		  var widget = getWidget;
		if (getWidget.category()) {
                    var prodIds;
                    if (getWidget.category().description !== null) {
                    if (getWidget.category().description.indexOf(',') != -1) {
                        prodIds = getWidget.category().description.split(',');

                    } else {
                        prodIds = getWidget.category().description;
                    }
                }
                    if(prodIds){
                    ccRestClient.authenticatedRequest("/ccstoreui/v1/products/?productIds=" + prodIds.toString() + "&fields=route,displayName,primarySmallImageURL,description,id,startDateStr", {}, function (s) {
                    //widget.updateData(e);
                    console.log("s prodId-->",s);
                    getWidget.koGetCategoriesArticles(s);
                  
                     }, function(data) {}, "GET");
                    }

                }
		
		
		if($('.plpCategoryDescription p').length > 1){
		    $(".plpCategoryDescription p:not(:first)").css("display","none");
		    $('.show_hide').show();
		}else{
		    $(".plpCategoryDescription p:not(:first)").css("display","none");
		    $('.show_hide').hide();
		}
			if(page.contextId.indexOf("brand") != -1){
			    
			  //  console.log("brand page")
			    getWidget.isBrandPage(true);
			}
			else{
			  //  console.log("category page")
			    getWidget.isBrandPage(false);  
			}
	    
		},
		
		 getArticleCarouselArrow: function() {
                   
                if ($('.articleCollectionCarousel .article-carousel .item').length > 0) {
                  
                    $('#article-carousel-controls a').removeClass('disabled');
                    if ($(".article-carousel .item:first").hasClass("active")) {
                        //console.log('first item active');
                        $('#article-carousel-left-control .article-corousel-left').addClass('disabled');
                    } else if ($(".article-carousel .item:last").hasClass("active")) {
                        //console.log('last item active');
                        $('#article-carousel-right-control .article-corousel-right').addClass('disabled');
                    } else {
                        $('#article-carousel-controls a').removeClass('disabled');
                    }
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
                     console.log(data,'newMonthDisplay');
                if(data.startDateStr !==null && data.startDateStr !== "") {
                    var startDateArr = data.startDateStr.split("-");
                       var shortMon =["Jan","Feb", "Mar", "Apr","May" ,"Jun" ,"Jul" ,"Aug", "Sep" ,"Oct", "Nov","Dec"];
                     
                     var startDateFormat = shortMon[(parseInt(startDateArr[1])-1)]+" "+startDateArr[2]+", "+startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }
                
            },
		
	
	
		
    };
  }
);
