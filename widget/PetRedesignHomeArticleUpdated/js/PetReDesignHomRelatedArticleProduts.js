define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, ccRestClient, ccConstants, storageApi) {

        "use strict";
        var productIds = '';
        var getWidget = "";
        var dataLayer = [];
        var bvData = '';
        // properties defined in the return are the actual module
        return {
            // BEGIN Copied from the collection widget
            itemsPerRowInLargeDesktopView: ko.observable(4),
            itemsPerRowInDesktopView: ko.observable(4),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(1),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),

            koDealsModelData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),


            // END Copied from the collection widget

            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koDealsModelData);
               // getWidget.getProductIds(getData);
               

            },
            getProductDetails: function(getProductId) {
               //console.log(getProductId.toString(),'getProductId.toString()');
                var widget = this;
                ccRestClient.authenticatedRequest("/ccstoreui/v1/products/?productIds=" + getProductId.toString() + "&fields=route,displayName,primarySmallImageURL,description,id,startDateStr", {}, function (e) {
                    widget.updateData(e);
                    console.log("e-->",e);
                }, function(data) {}, "GET");
            },
         

            updateFeatureData: function(getData) {

                var salePrice;
                var isSalePrice = false;
                var productIDs = [];
                getWidget.koDealsModelData(getData);
                getWidget.koDealsIsFlagData([])

                var minutes = 1000 * 60;
                var hours = minutes * 60;
                var days = hours * 24;



                for (var i = 0; i < getWidget.koDealsModelData().length; i++) {
                    
                    productIDs.push(getWidget.koDealsModelData()[i].id);
                    if(getWidget.koDealsModelData().length === productIDs.length ){
                        $.Topic("HOME_BV.memory").publish(productIDs);
                    }
                    
                    if (getData[i].hasOwnProperty('startDateStr')) {
                        var arrivalDate = getWidget.koDealsModelData()[i].startDateStr;
                        if (arrivalDate != null) {

                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1; //January is 0!
                            var yyyy = today.getFullYear();
                            var newFlag = false;

                            if (dd < 10) {
                                dd = '0' + dd
                            }

                            if (mm < 10) {
                                mm = '0' + mm
                            }


                            today = yyyy + '-' + mm + '-' + dd;

                            var todaysDate = new Date(today);
                            var CurrentDate = new Date(arrivalDate);
                            var diffDays = parseInt((todaysDate - CurrentDate) / (1000 * 60 * 60 * 24));

                            if ((diffDays > 0) && (diffDays <= 30)) {
                                var newFlag = true;

                            } else {
                                var newFlag = false;

                            }
                        } else if (arrivalDate == null) {
                            newFlag = false;
                        }
                    } else {
                        newFlag = false;
                    }
                    // //console.log('sale price',getWidget.koDealsModelData()[i].salePrice);
                    salePrice = getWidget.koDealsModelData()[i].salePrice;
                    if (salePrice != "" && salePrice != 'null' && salePrice != null && salePrice != 'undefined') {
                        isSalePrice = true;
                        // //console.log('sale price called',isSalePrice)
                    } else {
                        isSalePrice = false;
                        //console.log('no sale price',isSalePrice)
                    }
                    getWidget.koDealsModelData()[i].creationNewFlag = ko.toJS(ko.observable(newFlag));

                    var newFlagProduct = {
                        'id': getWidget.koDealsModelData()[i].id,
                        'isNewFlag': newFlag,
                        'isSaleFlag': isSalePrice
                    }
                    getWidget.koDealsIsFlagData.push(newFlagProduct);
                }
                /*bvData='';
                bvData=getWidget.koDealsModelData();
              
              $.Topic("HOME_BV").publish(bvData);*/
            },

            /*GetBVCollections: function() {
                $.Topic("HOME_BV.memory").publish(productIds);
            },*/

            onLoad: function(widget) {

                getWidget = widget;
                

                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();

                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function() {
                    var groups = [];
                    if (widget.koDealsModelData) {
                        for (var i = 0; i < widget.koDealsModelData().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                ////console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koDealsModelData()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koDealsModelData()[i]);
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
                $("body").delegate(".collectionProdCarousel-a", "slid.bs.carousel", function(e) {
                    widget.getCarouselArrow();
                });

            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function(page) {
                getWidget.getProductIds();
            },
            
            truncate:function(string){
                 //console.log(string(),'string');
                 var getString;
        			   getString=string();
        			   if(getString){
        			        if (string().length > 155 )
                           {
                             getString= string().substring(0,155)+'...'; 
                               return getString;
                           }
                           else{
                                return getString;
                           }
        			   }
                       
             
                 },
            
            newMonthDisplay: function(data) {
                if(data.startDateStr !==null && data.startDateStr !== "") {
                    var startDateArr = data.startDateStr().split("-");
                       var shortMon =["Jan","Feb", "Mar", "Apr","May" ,"Jun" ,"Jul" ,"Aug", "Sep" ,"Oct", "Nov","Dec"];
                     
                     var startDateFormat = shortMon[(parseInt(startDateArr[1])-1)]+" "+startDateArr[2]+", "+startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }
                
            },
            getCarouselArrow: function () {
                if ($('.home-carousel-a .item').length > 0) {
                    $('#cc-carousel-controls-a a').removeClass('disabled');
                     $('.collectionProdCarousel-a a').removeClass('disabled');
                    if ($(".home-carousel-a .item:first").hasClass("active")) {
                        $('#cc-carousel-left-control-a .corousel-left').addClass('disabled');
                        $('#cc-carousel-left-control-a-m .corousel-left').addClass('disabled');
                    } else if ($(".home-carousel-a .item:last").hasClass("active")) {
                        $('#cc-carousel-right-control-a .corousel-right').addClass('disabled');
                         $('#cc-carousel-right-control-a-m .corousel-right').addClass('disabled');
                    } else {
                        $('#cc-carousel-controls-a a').removeClass('disabled');
                         $('.collectionProdCarousel-a a').removeClass('disabled');
                    }
                }
            },

            getProductIds: function() {
                if (getWidget.ArticleImage1Des() !== null) {
                    if (getWidget.ArticleImage1Des().indexOf(',') != -1) {
                        productIds = getWidget.ArticleImage1Des().split(',');
                        getWidget.getProductDetails(productIds);

                    } else {
                        productIds = getWidget.ArticleImage1Des();
                        getWidget.getProductDetails(productIds);
                    }
                }
            },
        };
    }
);
