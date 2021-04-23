/**
 * @fileoverview Order History.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['knockout', 'spinner', 'pubsub', 'viewModels/orderHistoryViewModel', 'notifier', 'CCi18n', 'ccConstants', 'navigation', "ccRestClient"],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, spinner, pubsub, OrderHistoryViewModel, notifier, CCi18n, CCConstants, navigation, restClient) {

        "use strict";
        var getWidget = "";

        return {
            ordersArray: ko.observableArray([]),
            fetchOrderPaymentInfo: ko.observableArray([]),
            isDisplayOrder: ko.observable(),
            getPaymentJsonObj: function(data) {
                return JSON.parse(data);
            },
            onLoad: function(widget) {
                getWidget = widget;
                getWidget.createSpinner();
                var self = this;
                widget.historyViewModel = ko.observable();
                widget.historyViewModel(new OrderHistoryViewModel());
                getWidget.fetchPaymentInfo();
                
                //Create historyGrid computed for the widget
                widget.historyGrid = ko.computed(function() {
                    var numElements, start, end, width;
                    var rows = [];
                    var orders;

                    /**** Update order item details */

                    if (($(window)[0].innerWidth || $(window).width()) > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                        var startPosition, endPosition;
                        // Get the orders in the current page
                        startPosition = (widget.historyViewModel().currentPage() - 1) * widget.historyViewModel().itemsPerPage;
                        endPosition = startPosition + widget.historyViewModel().itemsPerPage;

                        orders = widget.historyViewModel().data.slice(startPosition, endPosition);
                    } else {
                        orders = widget.historyViewModel().data();
                    }
                    if (!orders) {
                        return;
                    }

                    
                    var startLoop = startPosition;
                    //Commenting because of error
                    /**** Update order item details */
                  /*for (var i = 0; i < orders.length; i++) {  
                        widget.historyViewModel().data()[startLoop].orderDetails = ko.observable();
                        getWidget.getProfileOrder(orders[i].orderId, i);
                        startLoop = startLoop + 1;
                    }*/

                    numElements = orders.length;
                    width = parseInt(widget.historyViewModel().itemsPerRow(), 10);
                    start = 0;
                    end = start + width;
                    while (end <= numElements) {
                        rows.push(orders.slice(start, end));
                        start = end;
                        end += width;
                    }
                    if (end > numElements && start < numElements) {
                        rows.push(orders.slice(start, numElements));
                    }
                    
                    return rows;

                }, widget);
                 if (widget.historyGrid().length == 0) {
                        widget.isDisplayOrder(true);
                        getWidget.destroySpinner();
                    }



                $.Topic(pubsub.topicNames.ORDERS_GET_HISTORY_FAILED).subscribe(function(data) {
                    if (this.status == CCConstants.HTTP_UNAUTHORIZED_ERROR) {
                        widget.user().handleSessionExpired();
                        if (navigation.isPathEqualTo(widget.links().profile.route) || navigation.isPathEqualTo(widget.links().orderHistory.route)) {
                            navigation.doLogin(navigation.getPath, widget.links().home.route);
                        }
                    } else {
                        navigation.goTo('/profile');
                    }
                });

             

            },
            beforeAppear: function(page) {
                var widget = this;
                if (widget.user().loggedIn() == false) {
                    navigation.doLogin(navigation.getPath(), widget.links().orderhistoryanonymous.route);
                } else {
                    widget.historyViewModel().clearOnLoad = true;
                    widget.historyViewModel().load(1, 1);
                }

            },
            fetchPaymentInfo: function() {
              
                var localCart = getWidget.cart();
                var items = localCart.items();
                for (var k in localCart.dynamicProperties()) {
                    if (localCart.dynamicProperties()[k].id() == "orderPaymentInfo") {
                        getWidget.fetchOrderPaymentInfo($.parseJSON(localCart.dynamicProperties()[k].value()));
                        break;
                    }
                }
               
            },
            getProfileOrder: function(getOrderId, getIndex) {
                var widget = this;
                var a = CCConstants.ENDPOINT_GET_ORDER;
                var l = {};
              l['fields']='shippingAddress,billingAddress,id,order,payments,shippingGroups'
                var p = getOrderId;
                restClient.request(a, l, function(profileOrder) {
                  // console.log(profileOrder , '----profile order --- ');
                    widget.historyGrid()[getIndex][0].orderDetails(profileOrder);
                    widget.historyViewModel().data()[getIndex].orderDetails(profileOrder);

                }, function(prodDetail) {

                }, p);
                if (widget.historyGrid().length > 0) {
                        widget.isDisplayOrder(false);
                        getWidget.destroySpinner();

                    }

            },
            maskPhoneNumber: function(getPhone) {
                if (getPhone == 'null' || getPhone == null || getPhone == '') {
                    return '';
                } else {
                    return getPhone.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
                }
            },
            /**
             * Destroy the 'loading' spinner.
             * @function  OrderViewModel.destroySpinner
             */
            destroySpinner: function() {
                //console.log("destroyed");
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
            
            /*Upgraded Codes*/
            /**
       * Called when the user sorts the order history based on creation date , status:
       * @param sortOrder : order of sort either ascending or descending
       * @param sortTerm : attribute on which the sort needs to be performed
       */
      clickToSort: function(sortOrder,sortTerm){
        var widget=this;
       widget.sortDirections()[sortTerm]=sortOrder;
      /* if(sortTerm=="submittedDate"){
         widget.sortDirections()["state"]="both";
       }else if(sortTerm=="state"){
         widget.sortDirections()["submittedDate"]="both";
       } */
       widget.sortDirections.valueHasMutated();
        var sortString=sortTerm+":"+sortOrder;
        widget.historyViewModel().sortProperty=sortString;
        widget.historyViewModel().refinedFetch();
      
      },
      getFilteredStatus: function(valueSelected){
        var widget = this;
	    var filtertext = valueSelected;
	    widget.historyViewModel().filterArray=filtertext;
	    widget.historyViewModel().refinedFetch();
      }, 
      
      clickOrderDetails: function (data, event) {
        var widget = this;
        widget.user().validateAndRedirectPage(this.links().orderDetails.route+'/'+ data.orderId);
        return false;
      },      
      mergeToCart: function (data, event) {
          var widget = this;
          if(data.orderId){
        	  widget.selectedOrderId(data.orderId);
          }
          widget.cart().mergeCart(true);
          ccRestClient.request(CCConstants.ENDPOINT_GET_ORDER, null,
                  function(order) {
            var state = order.state;
            var success = function(){
              widget.user().validateAndRedirectPage("/cart");
            };
            var error = function(errorBlock){
            var errMessages = "";
            var displayName;
            for(var k=0;k<errorBlock.length;k++){
              errMessages = errMessages + "\r\n" + errorBlock[k].errorMessage;
            }
            notifier.sendError("CartViewModel", errMessages, true);
          };
          widget.cart().addItemsToCart(order.order.items, success, error);
          widget.selectedOrderId(null);
          },
          function(data) {
              // If not go 404
              navigation.goTo(self.contextData.global.links['404'].route);
              widget.cart().mergeCart(false);
              widget.selectedOrderId(null);
            }, 
            widget.selectedOrderId());
        },
        
        setSelectedOrderId: function (data, event) {
            this.selectedOrderId(data.orderId);
        }
        };
    }
);