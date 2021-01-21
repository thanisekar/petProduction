define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'notifier', 'ccPasswordValidator', 'pubsub', 'CCi18n', 
   'ccConstants', 'navigation', 'ccLogger'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, notifier, CCPasswordValidator, pubsub, CCi18n, CCConstants,
    navigation, ccLogger) {
    "use strict";
    
    var getWidget ="";
    return {
        //Observable Variables
        
      
      onLoad: function(widget) {
        var self = this;
        getWidget = widget;
         
        $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_SUCCESS).subscribe(function(data) {
          $('#CC-forgotPasswordMessagePane').show();
        });
        
          $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_FAILURE).subscribe(function(data) {
          notifier.sendError(widget.WIDGET_ID, data.message, true);
        });
        
        $.Topic(pubsub.topicNames.USER_PASSWORD_GENERATED).subscribe(function(data) {
          widget.user().showCreateNewPasswordMsg(true);
          widget.user().hasFieldLevelError(false);
          widget.user().createNewPasswordError(CCi18n.t('ns.common:resources.createNewPasswordError'));
          widget.user().resetPassword();
          $('#CC-createNewPassword-oldPassword-error').empty();
          $('#CC-createNewPassword-password-error').empty();
          $('#CC-createNewPassword-password-embeddedAssistance').empty();
          $('#CC-createNewPassword-oldPassword').removeClass("invalid");
          $('#CC-createNewPassword-password').removeClass("invalid");
          $('#CC-createNewPasswordPane').show();
          $('#CC-createNewPassword-oldPassword').focus();
          widget.user().oldPassword.isModified(false);
        });
        
        $.Topic(pubsub.topicNames.USER_PASSWORD_EXPIRED).subscribe(function(data) {
          widget.user().ignoreEmailValidation(false);
          $('#CC-forgotPasswordSectionPane').show();
          $('#CC-forgotPwd-input').focus();
          widget.user().emailAddressForForgottenPwd('');
          widget.user().emailAddressForForgottenPwd.isModified(false);
          widget.user().forgotPasswordMsg(CCi18n.t('ns.common:resources.resetPwdText'));
        });
        
        $.Topic(pubsub.topicNames.USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL).subscribe(function(data) {
              widget.user().handleLogin();
        });
        
      },
      beforeAppear: function(page) {
        //   if(getWidget.user().loggedIn() && !getWidget.user().isUserSessionExpired()) {
        //       window.location = getWidget.user().myAccountHash;
        //   }
            // //console.log("*******LOGIN******");
             //console.log(this.user().login());
      },
      
      /**
       * this method is triggered when the user clicks on the save 
       * on the create new password model
       */
      updateExpiredPassword : function() {
      var self = this;
      var inputParams = {};
      inputParams[CCConstants.PROFILE_LOGIN] = self.user().login();
      inputParams[CCConstants.PROFILE_OLD_PASSWORD] = getWidget.oldPassword();
      inputParams[CCConstants.PROFILE_NEW_PASSWORD] = getWidget.newPassword();
      inputParams[CCConstants.PROFILE_CONFIRM_PASSWORD] = getWidget.confirmPassword();
      self.adapter.persistCreate(CCConstants.ENDPOINT_UPDATE_EXPIRED_PASSWORD, 'id', inputParams,
        //success callback 
        function(data) {
          $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL).publish(data);
          var currentPassword = self.user().newPassword();
          self.user().resetPassword();
          self.user().password(currentPassword);
        },
        //error callback
        function(data) {
          self.user().resetPassword();
          $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_FAILURE).publish(data);
        }
      );
    },
      
      /**
       * Invoked when Login method is called
       */
       handleLogin: function(data, event) {
          if (data.user().validateLogin()) {
            data.user().updateLocalData(false, false);
            $.Topic(pubsub.topicNames.USER_LOGIN_SUBMIT).publishWith(data.user(), [{message: "success"}]);
          }
        return true;
      },

    };
  }
);
