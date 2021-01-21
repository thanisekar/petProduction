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
    ['knockout'],
  
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko) {
  
      "use strict";
      var getWidget = "";
      var value="";
      
                 
      return {
          embededUrl: ko.observableArray([]),
              
              
              
  
          onLoad: function(widget) {
              widget.embededUrl([]);  
                    
              
              if(widget.VideoUrl()!==null){
                   if(widget.VideoUrl().indexOf(',')!=-1){
                    value = widget.VideoUrl().split(',');
                    for(var i=0; i < value.length; i++){
                        widget.embededUrl.push(value[i]);
                    }
                   } 
                   else{
                        value = widget.VideoUrl();
                        widget.embededUrl.push(value);
                   }
              }
              
            
              
              
          },
  
          beforeAppear: function(page) {   
              //test 
             // console.log('12/11');
            $(document).ready(function() {
                     	$('.keri').carousel({
                      interval: 3000
                    }) 
                   $(".keri").swiperight(function() {
                      $(this).carousel('prev');
                    });
                   $(".keri").swipeleft(function() {
                      $(this).carousel('next');
                   });
                });
          
          }
          
      
      
          
      };
    }
  );
  