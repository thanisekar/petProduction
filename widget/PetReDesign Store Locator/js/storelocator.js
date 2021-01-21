/**
 * @fileoverview petmate Storelocator Widget.
 *
 * @author oracle
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['knockout','spinner', 'CCi18n','pubsub', 'ccConstants', 'ccRestClient', '//maps.googleapis.com/maps/api/js?key=AIzaSyDvCQ6agetd61iFoh1TvmQfIdm4rVAo0dY'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, spinner, CCi18n, PubSub, CCConstants, CCRestClient) {

        "use strict";
        //var getWidget = "";  
        var zoomLevel = 6;
        var bounds = new google.maps.LatLngBounds();
        var getMapWidget = "";
        var storeObj = {
            "stores": []
        }
        var storeAddress = [];
        var latLongArray = [];
        var lat = '';
        var lng = '';
        var address = {};
        var storeFilter = [];
        for (var i = 0; i < storeObj.stores.length; i++) {
            latLongArray.push(new google.maps.LatLng(storeObj.stores[i][0], storeObj.stores[i][1]));
            storeAddress.push(storeObj.stores[i]);
         
        }

        return {
            koStoreAddressModelData: ko.observableArray(),
            storePrint: ko.observableArray([]),
            storePrintOtherDatas: ko.observableArray([]),
            errorEmpty: ko.observable(false),
            noResultError: ko.observable(false),
            showResults: ko.observable(''),
            updateData: function(getData) {
                ko.mapping.fromJS(getData, {}, this.koStoreAddressModelData);
            },
            onLoad: function(widget) {
                getMapWidget = widget;
                getMapWidget.createSpinner();
                
         
               

                $('body').on( 'change','.radio1', function() {
                    var query = $("#store_search_query").val().trim();
                    getMapWidget.storeCheck();
                });
                $('body').on( 'click','#storeSearchBtn', function() {
                    $("#cities").val("Select One");
                    $("#states").val("Select One");
                    var radius = $("#radius").val();
                    var zoomLevel = 8;
                    if ((radius * 1) > 20) {
                        zoomLevel = 5;
                    }
                    getMapWidget.refreshMapSearch($("#zipCode").val(), zoomLevel, radius);
                    return false;
                });
                $('body').on( 'change','#cities', function() {
                    $("#states").val("Select One");
                    $("#zipCode").val("");
                    getMapWidget.refreshMap($(this).val(), 10);
                    return false;
                });

                $('body').on( 'change','#states', function() {
                    $("#cities").val("Select One");
                    $("#zipCode").val("");
                    getMapWidget.refreshMap($(this).val(), 6);
                    return false;
                });
                  $('body').on( 'keypress','#store_search_query', function() {
               
                    if (event.which == 13) {
                       var address = $("#store_search_query").val();
                       getMapWidget.storeCheck();
                    }
                });
                $('body').on( 'click','#loadmoreResults', function(){
                    $('.more-results').addClass('hide');
                    $('.loadmore').removeClass('hide')
                })
                
            },
            
               beforeAppear: function(page) {
                   getMapWidget.createSpinner();
                   latLongArray = [];
                   getMapWidget.noResultError(false);
                   getMapWidget.errorEmpty(false);
                   getMapWidget.storePrint.removeAll();
                    getMapWidget.storePrintOtherDatas.removeAll();
                    setTimeout(function(){
                        getMapWidget.initialize();
                    }, 1000);
                
                
              
                
                
                
                $.ajax({
                    url: "https://petmatenews.azurewebsites.net/petmateStoreLocatorAPI.php?latitude=32.7476492&longitude=-97.09248989999999&miles=50",
                    type: 'GET',
                    async: false,
                    success: function(data) {
                        
                        
                    }
                });
                
                
               
            //    setTimeout(function(){
                  getMapWidget.destroySpinner();
              //  }, 1000);
            },
            
            initialize: function() {
                if (latLongArray.length > 0) {
                    var mapProp = {
                        center: latLongArray[0],
                        zoom: zoomLevel,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scaleControl: true
                    };

                    var map = new google.maps.Map(document.getElementById("mapCanvasContainer"), mapProp);
                    for (var i = 0; i < latLongArray.length; i++) {
                        var marker = new google.maps.Marker({
                            position: latLongArray[i],
                            map: map,
                            title: 'Click to zoom'
                        });
                        //bounds.extend(marker.position);
                        getMapWidget.attachMessage(marker, i, map)
                    }
                    //map.fitBounds(bounds);
                } else {
                    var defaultMapProp = {
                        center: new google.maps.LatLng(37.09024, -95.712891),
                        zoom: 4,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scaleControl: true
                    };
                    map = new google.maps.Map(document.getElementById("mapCanvasContainer"), defaultMapProp);
                }
            },
            
            storeCheck: function() {
                address = encodeURI($("#store_search_query").val());
                $('.more-results').removeClass('hide');
                $('.loadmore').addClass('hide');
                if (address != '') {
                    getMapWidget.createSpinner();
                    getMapWidget.findStore(address);
                    getMapWidget.errorEmpty(false);
                } else if (address == '') {
                    latLongArray = [];
					getMapWidget.initialize();
					getMapWidget.storePrint.removeAll();
					getMapWidget.storePrintOtherDatas.removeAll();
                    getMapWidget.noResultError(false);
                    getMapWidget.errorEmpty(true);
                }
            },


            findStore: function() {
              
                var radioVal = $("input[type='radio'][name='radio']:checked").val();
                /* For mobile distance is dispalyed as dopdown*/
                var dropDownVal = $('#selectedDistance :selected').text();
                var mile = '';
                if ($(window).width() < 767) {
                   mile = dropDownVal;
                }
                else {
                    mile = radioVal;
                }
                //console.log("mile",mile)
                var location = getMapWidget.getStoreLocation(address);
                lat = location.lat;
                lng = location.lng

                /*alert('Latitude: ' + lat + ' Logitude: ' + lng, address, mile);*/

                var radius = mile;
                var zoomLevel = 4;
                switch (mile) {
                    case "10":
                        radius = 10;
                        zoomLevel = 11;
                        break;
                    case "25":
                        radius = 9;
                        zoomLevel = 10;
                        break;
                    case "50":
                        radius = 8;
                        zoomLevel = 8;
                        break;
                }
              
                getMapWidget.storePrint.removeAll();
                getMapWidget.storePrintOtherDatas.removeAll();
                $.get(getMapWidget.storeLocatorLink() + "?latitude=" + lat + '&longitude=' + lng + '&miles=' + mile, function(data) {   
                    getMapWidget.destroySpinner();
                  
                    storeObj.stores = [];
                    storeObj.stores.push(data.stores);
                
                    getMapWidget.storePrint([]);
                    getMapWidget.storePrintOtherDatas([]);
                    for (var i = 0; i < storeObj.stores[0].length; i++) {
                        latLongArray.push(lat, lng);
                        storeAddress.push(storeObj.stores[0][i]);
                    }
					getMapWidget.noResultError(false);
					for (var k = 0; k < storeObj.stores[0].length; k++) {
                            if (address == storeObj.stores[0][k].postalcode || address == storeObj.stores[0][k].city || address == storeObj.stores[0][k].state) {
                                getMapWidget.storePrint.push(storeObj.stores[0][k]);
                             
                               
                            }
                            if ((address != storeObj.stores[0][k].postalcode && address != '') || (address == storeObj.stores[0][k].city && address != '') || ( address == storeObj.stores[0][k].state && address != '')) {
                                getMapWidget.storePrintOtherDatas.push(storeObj.stores[0][k]);
                               
                                
                            }
                     }
						
					if(getMapWidget.storePrint().length == 0 && getMapWidget.storePrintOtherDatas().length == 0 ) {
					    latLongArray = [];
					    getMapWidget.initialize();
						getMapWidget.noResultError(true);
					} else {
                        getMapWidget.refreshMapSearch($("#store_search_query").val(), zoomLevel, radius);
                        getMapWidget.showResults('');
                        var  combineTwoArray=$.merge( getMapWidget.storePrint() , getMapWidget.storePrintOtherDatas() );
                       
                        getMapWidget.showResults(combineTwoArray );
                       //console.log( getMapWidget.showResults(),'----combineTwoArray--');
                 
                    }
                 
                });
            },

            test: function(searchTerm) {
                var output = [];
                var stores = storeObj.stores[0];
                for (var i = 0; i < stores.length; i++) {
                    for (var j = 2; j < 4; j++) {
                        if (stores[i][j].indexOf(searchTerm) != -1) {
                            output.push(stores[i]);
                        }
                    }
                }
                return output;
            },
            testLatLong: function(lat, lng, miles) {
                var output = [];
                var stores = storeObj.stores[0];
              
                for (var i = 0; i < stores.length; i++) {
                    var distance = getMapWidget.getDistanceFromLatLonInKm(lat, lng, stores[i].latitude, stores[i].longitude);
                    if (distance <= miles) {
                        output.push(stores[i]);
                    }
                }
                return output;
            },
            refreshMap: function(searchTerm, zoom) {
                var stores = getMapWidget.test(searchTerm);
            
                latLongArray = [];
                storeAddress = [];
                var location = getMapWidget.getStoreLocation(searchTerm);
                for (var i = 0; i < stores.length; i++) {
                    latLongArray.push(new google.maps.LatLng(stores[i][0], stores[i][1]));
                    var distance = getMapWidget.fetchDistance(location.lat, location.lng, stores[i][0], stores[i][1])
                    stores[i].push(distance);
                    storeAddress.push(stores[i]);
                }
                storeAddress.sort(function(a, b) {
                    return a[9] - b[9]
                });
                getMapWidget.updateData(storeAddress);
                if (latLongArray.length > 0) {
                    zoomLevel = zoom;
                } else {
                    zoomLevel = 4;
                }
                getMapWidget.initialize();
            },
            refreshMapSearch: function(searchTerm, zoom, miles) {
                var stores = storeObj.stores[0];
                  
                    latLongArray = [];
                    storeAddress = [];
                
                    for (var i = 0; i < stores.length; i++) {
                        latLongArray.push(new google.maps.LatLng(stores[i].latitude, stores[i].longitude));
                       
                        storeAddress.push(stores[i]);
                        
                    }
                  
                    storeAddress.sort(function(a, b) {
                        return a[9] - b[9]
                    });
                    getMapWidget.updateData(storeAddress);


                    if (latLongArray.length > 0) {
                        zoomLevel = zoom;
                    } else {
                        zoomLevel = 4;
                    }
                    getMapWidget.initialize();
            },

            attachMessage: function(marker, number, map) {
                if (storeAddress.length > 0) {
                    var content = '<div align="left"><strong>' + storeAddress[number].storeName + '</strong><br>' + storeAddress[number].address1 + '<br>' + storeAddress[number].city + ', '+ storeAddress[number].state + ' '+ storeAddress[number].postalcode + '<br>'+storeAddress[number].phoneNumber+' </div>'
                    var infowindow = new google.maps.InfoWindow({
                        content: content
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                        //map.setZoom(15);
                        map.setCenter(marker.getPosition());
                    });
                }
            },

         

            fetchDistance: function(lat, lng, storeLat, storeLng) {
                var temLat = storeLat - lat;
                var temLng = storeLng - lng;
                var value = Math.pow(69.1 * temLat, 2) + Math.pow(69.1 * temLng * Math.cos(lat / 57.3), 2);
                var distance = Math.sqrt(value);
                return Math.round(distance * 10) / 10;
            },

            getStoreLocation: function(searchTerm) {
                var location = {};
                $.ajax({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDvCQ6agetd61iFoh1TvmQfIdm4rVAo0dY&address=" + searchTerm,
                    type: "get",
                    async: false,
                    success: function(data) {
                        location = data.results[0].geometry.location;
                        
                    }
                });
                return location;
            },
            getDistanceFromLatLonInKm: function(lat1, lon1, lat2, lon2) {
                var R = 3959; // Radius of the earth in miles
                var dLat = getMapWidget.deg2rad(lat2 - lat1); // deg2rad below
                var dLon = getMapWidget.deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(getMapWidget.deg2rad(lat1)) * Math.cos(getMapWidget.deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in miles
                return d;
            },
            deg2rad: function(deg) {
                return deg * (Math.PI / 180)
            },
            
            /**
       * Destroy the 'loading' spinner.
       * @function  OrderViewModel.destroySpinner
       */
      destroySpinner: function() {
         // //console.log("destroyed");
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
      }
         
            
        };
    }
);

