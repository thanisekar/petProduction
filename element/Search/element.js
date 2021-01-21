define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'pubsub', 'notifications', 'ccConstants', 
  'ccResourceLoader!global/searchResultsDetailsOverride','placeholderPatch', 'navigation'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, pubsub, notifications, CCConstants, searchTypeahead, 
    placeholder, navigation) {
    "use strict";

    var ELEMENT_NAME = 'search-box-new';
	var typeAheadSearchVal;

    return {
      elementName: ELEMENT_NAME,

      searchText:         ko.observable(""),
      SEARCH_SELECTOR:    '.search-query',
	  
      handleKeyPress: function(data, event) {
        // displays modal dialog if search is initiated with unsaved changes.
			if ( data.user().isUserProfileEdited() ) {
			  $("#CC-customerProfile-modal").modal('show');
			  data.user().isSearchInitiatedWithUnsavedChanges(true);
			  return false;
			}
		
        var keyCode;
		
		keyCode = (event.which ? event.which : event.keyCode);
		
		
		
        switch(keyCode) {
          case CCConstants.KEY_CODE_ENTER:
            // Enter key
            this['elements'][ELEMENT_NAME].handleSearch(data, event);
             $("input#CC-headerWidget-Search-Mobile").blur();
			   typeAheadSearchVal = $('.typeAheadSearchInput').val();
		    	var idvalue=typeAheadSearchVal;
                localStorage.setItem('AdminId', idvalue);
                var allcookies= localStorage.getItem('AdminId');
				window.PlpPageSearch = allcookies;
            return false;
        }
        return true;
      },
		
	  
	  
      // publishes a message to say create a search 
      handleSearch: function(data, event){
        // Executing a full search, cancel any search typeahead requests
        $.Topic(pubsub.topicNames.SEARCH_TYPEAHEAD_CANCEL).publish([{message:"success"}]);
        
        var trimmedText = $.trim(this.searchText());
		
        if (trimmedText.length != 0){
           typeAheadSearchVal = $('.typeAheadSearchInput').val();
			var idvalue=typeAheadSearchVal;
            localStorage.setItem('AdminId', idvalue);
            var allcookies= localStorage.getItem('AdminId');
			window.PlpPageSearch = allcookies;
          // Send the search results and the related variables for the Endeca query on the URI
           navigation.goTo("/searchresults" + "?"
            + CCConstants.SEARCH_TERM_KEY + "="
            + encodeURIComponent(this.searchText().trim()) + "&"
            + CCConstants.SEARCH_DYM_SPELL_CORRECTION_KEY + "="
            + encodeURIComponent(CCConstants.DYM_ENABLED) + "&"
            + CCConstants.SEARCH_NAV_ERECS_OFFSET + "=0&"
            + CCConstants.SEARCH_REC_PER_PAGE_KEY + "="
            + CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE+ "&"
            + CCConstants.SEARCH_RANDOM_KEY + "=" + Math.floor(Math.random()*1000) + "&"
            + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_SIMPLE + "&"
            + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY);
          this.searchText('');
        }
      },
	  
	  

      // Initializes search typeahead and the placeholder text
      initializeSearch: function() {
        this['elements'][ELEMENT_NAME].initTypeahead.bind(this)();
        this['elements'][ELEMENT_NAME].addPlaceholder();
		
		this['elements'][ELEMENT_NAME].searchText.subscribe(function(newValue){
			//console.log('subscribe observable length', newValue.length)
			//  console.log('subscribe observable', newValue)
				if(newValue.length>0){
					$('.searchdeleteIcon').css('display', 'block');
					$('.searchIcon').addClass("searchIconHover");
			  }
			   else if(newValue.length==0){
					$('.searchdeleteIcon').css('display', 'none');
			   }
			  
		  });
      },

      initTypeahead: function() {
        var typeAhead = searchTypeahead.getInstance(this['elements'][ELEMENT_NAME].SEARCH_SELECTOR, this.site().selectedPriceListGroup().currency);
        notifications.emptyGrowlMessages();
      },

      addPlaceholder : function(){
        $('#CC-headerWidget-Search-Desktop').placeholder();
        $('#CC-headerWidget-Search-Mobile').placeholder();
      },

      /**
       * Invoked when the search text box is in focus.
       * Used to fix the bug with growl messages not clearing on clicking
       * the search box
       */
      searchSelected: function() {
        notifications.emptyGrowlMessages();
        $.Topic(pubsub.topicNames.OVERLAYED_GUIDEDNAVIGATION_HIDE).publish([{message: "success"}]);
      },
	  
	   searchKeyboardCmd :function(){
		   var keyCode;
		  if(keyCode === 13) {
		  $('#typeaheadDropdown').hide();
		  typeAheadSearchVal = $('.typeAheadSearchInput').val();
		  var idvalue=typeAheadSearchVal;
		  localStorage.setItem('AdminId', idvalue);
		  var allcookies= localStorage.getItem('AdminId');
		  window.PlpPageSearch = allcookies;	
		 }
		
	  },
	  getPlaceHolderVale:function(){
		  if($(window).width()>1024){
			  return 'Search pet products & education'
		  }
		  else if($(window).width()<1024){
			   return 'Search'
		  }
	  },

      /**
       * Hide the search typeahead dropdown when the button is used for search
       */ 
      hideSearchDropdown: function(data, event) {  
        var keyCode = (event.which ? event.which : event.keyCode);
        if(keyCode === CCConstants.KEY_CODE_ENTER) {
          $('#typeaheadDropdown').hide();
		  typeAheadSearchVal = $('.typeAheadSearchInput').val();
		   var idvalue=typeAheadSearchVal;
           localStorage.setItem('AdminId', idvalue);
           var allcookies= localStorage.getItem('AdminId');
			window.PlpPageSearch = allcookies;
        } else {
          return true;
        }        
      }
    };
  }
);
