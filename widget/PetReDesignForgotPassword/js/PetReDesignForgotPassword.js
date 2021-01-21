define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'notifier', 'ccPasswordValidator', 'pubsub', 'CCi18n', 
   'ccConstants', 'navigation', 'ccLogger','ccResourceLoader!global/PetReDesignValidationWidget'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, notifier, CCPasswordValidator, pubsub, CCi18n, CCConstants,
    navigation, ccLogger) {
    "use strict";
    
    var getWidget ="";
    return {
        //Observable Variables
        resetEmail : ko.observable(true),
        resetPwdMsg : ko.observable(false),
        noProfileError : ko.observable(false),
      
      onLoad: function(widget) {
        var self = this;
        getWidget = widget;
        
      },
      beforeAppear: function(page) {
           if(getWidget.user().loggedIn() && !getWidget.user().isUserSessionExpired()) {
               window.location = getWidget.user().myAccountHash;
           }
      }, 
      
      forgetPwdFormValidate: function(data){
          var widget = this;
          $.Topic('getforGetPwdForm.memory').publish('success');
      },
        
        resetForgotPasswordSubmit : function(data){ 
          var widget = this;
          $.Topic('getforGetPwdForm.memory').publish('success');
          if(forgotPwd.form()) {
              widget.resetForgotPassword1(data)
              };
        },
         /**
       * Resets the password for the entered email id.
       */
      resetForgotPassword1: function(data,event) {
          
          //data.user().emailAddressForForgottenPwd.isModified(true);
          
        //   if(data.user().emailAddressForForgottenPwd  && data.user().emailAddressForForgottenPwd.isValid()) {
        //     data.user().resetForgotPassword();
            
        //   }
           var self = this;
           var inputParams = {};
            //alert("HIT");
          inputParams[CCConstants.LOGIN] = self.user().emailAddressForForgottenPwd();
          
          self.user().adapter.persistCreate(CCConstants.ENDPOINT_FORGOT_PASSWORD, 'id', inputParams, null,
            //success callback 
            function(data) {
             //   //console.log(data);
                self.resetEmail(false);
              self.resetPwdMsg(true);
             // //console.log(self.resetEmail())
              $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_SUCCESS).publish(data);
             // //console.log("PASSWORD SENT");
              
            },
            //error callback when an internal error occurs.
            function(data) {
              $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_FAILURE).publish(data);
             // //console.log("PASSWORD NOT SENT");
              self.noProfileError(true);
            });
        return true;
      }
        
    };
  }
);
