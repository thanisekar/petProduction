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
  function (ko,ccRestClient,ccConstants) {

    "use strict";
	var getWidget = "";
    return {
		onLoad: function(widget) {
		  /* widget.makeSearchRequest()*/
		},
    	/* makeSearchRequest: function (callback) {
                var params = {
                    'No': 0,
                    'Nrpp': 1,
                    'visitorId': null,
                    'visitId': null,
                    'language': 'en',
                    'searchType': 'simple.template'
                };
                //Object.assign(params, options);
                ccRestClient.authenticatedRequest('/ccstoreui/v1/search', params, function (data) {
                    //console.log(data, '--------- success call ---------');
                    //console.log(data.navigation, '--------- Navigstion ---------');
                    //console.log(data.navigation.navigation, '--------- brand refinement results ---------');
                }, function (data) {
                    //console.log('Error Search ----- ', data);
                });
            },*/

		beforeAppear: function(page) {         
			
	    
		},
		
	
	
		
    };
  }
);
