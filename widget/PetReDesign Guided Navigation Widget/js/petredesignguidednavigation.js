/**
 * @fileoverview Guided Navigation Widget. 
 * 
 */
define(

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout','viewModels/guidedNavigationViewModel', 'CCi18n',
  'ccConstants', 'pubsub'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, GuidedNavigationViewModel, CCi18n, CCConstants, pubsub) {  
  
    "use strict";
  
    return {
      displayRefineResults: ko.observable(false),
      koBrandId:ko.observable(''),
      /**
        Guided Navigation Widget.
        @private
        @name guided-navigation
        @property {observable GuidedNavigationViewModel} view model object representing the guided navigation details
       */
      onLoad: function(widget) {
        widget.guidedNavigationViewModel = ko.observable();
        //widget.guidedNavigationViewModel(new GuidedNavigationViewModel(widget.maxDimensionCount(), widget.maxRefinementCount(), widget.locale()));
        //Make all filters show
        widget.guidedNavigationViewModel(new GuidedNavigationViewModel("20", "20", widget.locale()));
        //Ends
        $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(obj){
          if (!this.navigation || this.navigation.length == 0) {
            widget.displayRefineResults(false);
          }
          else {
            widget.displayRefineResults(true);
          }
        });
        
        $.Topic(pubsub.topicNames.SEARCH_FAILED_TO_PERFORM).subscribe(function(obj) {
          widget.displayRefineResults(false);
        });
        
        $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(obj) {
          if ((this.navigation && this.navigation.length > 0) || (this.breadcrumbs && this.breadcrumbs.refinementCrumbs.length > 0)) {
            widget.displayRefineResults(true);
          }
          else {
            widget.displayRefineResults(false);
          }
        });
    	 $("body").on('click', '#CC-guidedNavigation-accordionSection .panel-heading',function(){
           	     //console.log('panel-heading');
        				 if($(this).next().is(':visible')){
        				 $(this).next().slideUp(300);
        				 $(this).find('.toggle-icon').removeClass("minus-icon").addClass('plus-icon')
        			
        			 }
        			 else if(!$(this).next().is(':visible')){
        				 $(this).next().slideDown(300);
        				 $(this).find('.toggle-icon').removeClass("plus-icon").addClass('minus-icon')
        			
        			 }
        		  });
        		  
		  	 $("body").on('click', '.see-more-less',function(){
		  	    if($('.see-more-less').prev('showMore')){
		  	         $('.panel-default').slideDown(300);
		  	        
		  	    }else if($('.see-more-less').prev('showLess')){
		  	         $('.panel-default').slideUp(300);
		  	    }
		  	 });
      },
      
       beforeAppear: function (page) {
           var widget=this;
           var brandID= widget.getUrlParameter("brand");
           if(brandID!=null){
               widget.koBrandId(brandID);
           }
           //console.log(brandID ,'********brandID*******')
      },
            hidePriceTest: function(){
                
                $('.nav-header:contains("Price Range")').text("Price");
            },
      getCategoryRefinementValue:function(categoryRefinementValue){
           var widget=this;
          if(widget.koBrandId()=='brand-jackson-galaxy' || widget.koBrandId()=='brand-aspenpet' || widget.koBrandId()=='brand-dogzilla' || widget.koBrandId()=='brand-wwe'|| widget.koBrandId()=='brand-Chuckit'){
              if(categoryRefinementValue.toLowerCase().indexOf('brands')!='-1'){
                  return '';
              }
               else {
                       if(categoryRefinementValue.indexOf('(')!='-1'){
                      var categoryrefinement=categoryRefinementValue.split('(');
                      var categoryrefinementText='<span class="refineTxts">'+categoryrefinement[0]+'</span>'
                      var categorygetNumericValue='<span class="greyColor">('+categoryrefinement[1]+'</span>'
                      return  categoryrefinementText.toLowerCase()+categorygetNumericValue;
                  }
                  
              }
          }
          else{
               if(categoryRefinementValue.indexOf('(')!='-1'){
                  var categoryrefinement1=categoryRefinementValue.split('(');
                  var categoryrefinementText1='<span class="refineTxts">'+categoryrefinement1[0]+'</span>'
                  var categorygetNumericValue1='<span class="greyColor">('+categoryrefinement1[1]+'</span>'
                  return  categoryrefinementText1.toLowerCase()+categorygetNumericValue1;
              }
             
          }
      },
      
      
      getrefinementSplitValue:function(getvalue){
          if(getvalue.indexOf('(')!='-1'){
              var refinement=getvalue.split('(');
              var refinementText='<span class="refineTxts">'+refinement[0]+'</span>'
              var getNumericValue='<span class="greyColor">('+refinement[1]+'</span>'
              return  refinementText.toLowerCase()+getNumericValue;

          }
          else{
              return getvalue;
          }
          
      },
        getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            }
      
    };
  }
);
