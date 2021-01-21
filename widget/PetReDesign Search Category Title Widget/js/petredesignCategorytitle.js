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
  function (ko, ccRestClient,ccConstants ) {

    "use strict";
	var getWidget = "";
	var brandID=''
    return {
        kogetCatgory: ko.observable(),
        koCollectionData:ko.observableArray([]),
		onLoad: function(widget) {
		        getWidget=widget;
		    
		},
	

		beforeAppear: function(page) { 
		    getWidget.koCollectionData([]);
        	brandID= getWidget.getUrlParameter("brand")
         /*	//console.log(brandID, 'brandID')*/
         	if(brandID!=null){
         	    getWidget.getCollectionDetails(brandID);
         	}else if(brandID==null){
         	    getWidget.koCollectionData([]);
         	}
         
		},
		getCollectionDetails:function(getCollectionId){
            var widget = this;
             var l_c = {};
               var data1;
                l_c["depth"] = "max";
                var id = getCollectionId;
                 ccRestClient.request(ccConstants.ENDPOINT_COLLECTIONS_GET_COLLECTION, l_c, function(e1) {
                     //console.log(e1, '-koCollectionData---');
                     getWidget.koCollectionData.push({'displayName':e1.displayName , 'description':e1.description, 'longDescription':e1.longDescription });
                  }, function(e1) {                
                }, id);
          },
          getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            },
	   
	
		
    };
  }
);
