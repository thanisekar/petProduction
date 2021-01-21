/**
 * @fileoverview Petmate Search List View Tab.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    
    ['jquery', 'knockout', 'spinner', 'CCi18n', 'pubsub', 'storageApi', 'pageLayout/search', 'viewModels/searchResultDetails',"https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5552cdc32f05e920"],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, spinner, CCi18n, t, c, storageApi, search, searchResDetails) {

        "use strict";
        var getWidget = "";
        var inputParams = "";
        return {
            koSearchListTabView: ko.observable(''),
            
            onLoad: function(widget) {
                getWidget = widget;
            },

            beforeAppear: function(page) {
                var widget = this;
               
              $('body').on( 'click','#educationArticleTab', function() {
                  //console.log("educationTab fired")
                  getWidget.createSpinner();
              })
                /*if(window.PlpPageSearch == 'undefined'){
                    window.PlpPageSearch = ' ';
                }*/
                /*var idvalue=window.PlpPageSearch;
                localStorage.setItem('AdminId', idvalue);*/
                
                /***Get the Session variable***/
                
                    //searchListView= localStorage.getItem('AdminId');
                    var allcookies= localStorage.getItem('AdminId');
                    window.PlpPageSearch = allcookies;
                widget.koSearchListTabView(window.PlpPageSearch);
                //console.log(widget.koSearchListTabView(),'---searchlistviewtab---');
               
            },
             getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results==null){
                   return null;
                }
                else{
                   return results[1] || 0;
                }
              },
            createNewBrandSearch: function(searchViewModal, widget) {
    	        var search, url, id;
    	        inputParams[c.VISITOR_ID] = storageApi.getInstance().getItem(c.VISITOR_ID);
    	        inputParams[c.VISIT_ID] = storageApi.getInstance().getItem(c.VISIT_ID);
    	        inputParams[c.SEARCH_LANGUAGE] = searchViewModal.searchLocale();
    	        inputParams[c.SEARCH_TYPE] = "guided";
    	        id = 'guidedsearch';
    	        searchViewModal.adapter.loadJSON('search', id, inputParams, widget.brandSearchSuccess, widget.brandSearchError);
    	    },
    	    brandSearchSuccess: function(data) {
	     //   //console.log("success brand search data............", data);
	        if (data.resultsList){
	        var tmpSearchResults = ("records" in data.resultsList) ? data.resultsList.records : [];
	        var searchResults = searchResDetails.formatSearchResults(tmpSearchResults);
	         //   //console.log("search brand Results............", searchResults);
	            /*var outputProduct_bc = [];
	            $.each( searchResults, function( key, value ) {
	            	outputProduct_bc.push(value.id[0]);
	            })*/
	        }
	    
	    },
	    
	    brandSearchError: function(data) {
	        //console.log("success error data............", data)
	    },
            articleProductData: function() {
                 inputParams = {};
        	       			if(getWidget.getUrlParameter("Ntt") != null) {
        			        	inputParams["Ntt"] = getWidget.getUrlParameter("Ntt");
        			        }
        			        if(getWidget.getUrlParameter("Nty") != null) {
        			        	inputParams["Nty"] = getWidget.getUrlParameter("Nty");
        			        }
        			        if(getWidget.getUrlParameter("No") != null) {
        			        	inputParams["No"] = getWidget.getUrlParameter("No");
        			        }
        			        if(getWidget.getUrlParameter("Nrpp") != null) {
        			        	inputParams["Nrpp"] = getWidget.getUrlParameter("Nrpp");
        			        }
        			        if(getWidget.getUrlParameter("N") != null) {
        			        	inputParams["N"] = 3094113394;
        			        }
        			        getWidget.createNewBrandSearch(search.getInstance(), getWidget);
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
      }
        };
    }
);