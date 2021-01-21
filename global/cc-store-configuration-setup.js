define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['ccStoreConfiguration'],
  //-------------------------------------------------------------------
  // Module definition
  //-------------------------------------------------------------------
  function(CCStoreConfiguration) {
     
    "use strict";
 
    return {
      // Override the default value (false) of enablePrioritizedLoading to true
	  onLoad: function() {
    CCStoreConfiguration.getInstance().enablePrioritizedLoading = false;
    CCStoreConfiguration.getInstance().enableLayoutsRenderedForLayout = false;
	  }
    };
});