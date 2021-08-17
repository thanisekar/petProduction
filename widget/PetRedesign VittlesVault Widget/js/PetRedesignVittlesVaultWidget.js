define(['knockout', 'CCi18n', 'ccConstants', 'pubsub', 'storageApi', 'ccRestClient'],

    function(ko, CCi18n, CCConstants, pubsub, storageApi, rest) {

        "use strict";
        var getWidget = '';

        return {
            koGetCollectionList: ko.observableArray([]),
            koGetRecommendedData: ko.observable(),


            onLoad: function(widget) {
                getWidget = widget;
               
            },

            beforeAppear: function(page) {
                var widget = this;
                widget.categoryCollectionsFunction();
                $( ".btn-link" ).click(function() {
                  $(this).find(".plus").toggle();
                });


            },




            newMonthDisplay: function(data) {
                //console.log("get date")
                if (data.startDateStr !== null && data.startDateStr !== "") {

                    var startDateArr = data.startDateStr.split("-");
                    var shortMon = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

                    var startDateFormat = shortMon[(parseInt(startDateArr[1]) - 1)] + " " + startDateArr[2] + ", " + startDateArr[0];
                    return startDateFormat;
                } else {
                    return "";
                }

            },
            categoryCollectionsFunction: function() {
                if (getWidget.enabled()) {
                    var dataUrl = "";
                    var url = window.location.hostname;

                    var o = CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
                        u = {};
                    u[CCConstants.CATEGORY] = getWidget.collectionId(), u.includeChildren = !0;
                    //	u['fields'] = 'category.id, category.displayName, category.longDescription, category.route, items.creationDate,items.route,items.primaryFullImageURL,items.route,items.displayName,items.longDescription,items.startDateStr,items.id';
                    rest.request(o, u, function(e) {
                        //  console.log('Data1 before', e);
                        for (var j = 0; j < e.length; j++) {
                            var imagePath = e[j].primaryFullImageURL.split('=');
                            e[j].primaryFullImageURL = ko.observable(imagePath[1]);
                        }
                        getWidget.koGetCollectionList([])
                        getWidget.koGetCollectionList.push(e)
                    });



                }
            }


        };
    });