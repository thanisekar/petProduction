/**
 * @fileoverview Petmate Site Map Widget.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['jquery','knockout'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko) {

        "use strict";
        var getSiteMapWidget = "";
        return {
            kositeMapModelData: ko.observableArray(),
            kositeMapDataRendered: ko.observable(false),
            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.kositeMapModelData);
            },
            onLoad: function(widget) {
                getSiteMapWidget = widget;
                
                getSiteMapWidget.kositeMapDataRendered.subscribe(function(newValue) { 
                    if(newValue){
                        //setTimeout(function(){
                         getSiteMapWidget.breakList();
                        //}, 100);
                    }
                })
               
            },

            beforeAppear: function(page) {
                getSiteMapWidget.siteMapFunction();
               
                
            },
            breakList:function(){
                  var listLength = $(".list").find("li").length;
                  //  //console.log("listLength");
                   //console.log(listLength);
                    var numInRow = Math.ceil(listLength / 4);
                   //console.log(numInRow);
                    for (var i=0;i<4;i++){
                        var listItems = $(".list").find("li").slice(0, numInRow);
                        var newList = $('<ul/>').append(listItems);
                      //  //console.log("listItems");
                        //console.log(listItems);
                        $(".dynamic-list-wrapper").append(newList);
                        $(".static-list-wrapper").show();
                        $(".dynamic-list-wrapper ul.list").hide();
                    }
            },
            
            siteMapFunction: function() {
                
                getSiteMapWidget.load("categoryList", ['rootCategory', 'cloudCatalog', 1e3], function(data1) {
                    if ($.type(data1) == "object") {
                        var tempData = [];
                        tempData.push(data1);
                        data1 = tempData;
                    }
                    //console.log(data1,'data1')
                    getSiteMapWidget.updateData(data1);
                    getSiteMapWidget.kositeMapDataRendered(true);
                });
            }
        };
    }
);