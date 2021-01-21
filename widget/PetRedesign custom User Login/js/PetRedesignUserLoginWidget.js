define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'notifier', 'ccPasswordValidator', 'pubsub', 'CCi18n', 
   'ccConstants', 'navigation', 'ccLogger', 'spinner','ccResourceLoader!global/PetReDesignValidationWidget'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, notifier, CCPasswordValidator, pubSub, CCi18n, CCConstants,
    navigation, ccLogger, spinner) {
    "use strict";
    
    var getWidget ="";
    var getPath = "";
    return {
        //Observable Variables
        email : ko.observable(''),
        password : ko.observable(''),
        error : ko.observable(false),
        oldPassword1 : ko.observable(''),
        newPassword1 : ko.observable(''),
        confirmPassword1 : ko.observable(''),
        loginPane : ko.observable(true),
        passwordReset : ko.observable(false),
        
        //anonymousOrderLookUp
        orderno: ko.observable(''),
        orderEmail: ko.observable(''),
        OrderIDError : ko.observable(false),
        orderID : ko.observable(''),
        OrderEmailError : ko.observable(''),
      onLoad: function(widget) {
        var self = this;
        getWidget = widget;
        
        $.Topic(pubSub.topicNames.USER_LOGIN_FAILURE).subscribe(function(data){
            getWidget.error(true);
            getWidget.destroySpinner();
        });
        $.Topic(pubSub.topicNames.USER_PASSWORD_GENERATED).subscribe(function(data) {
            getWidget.loginPane(false);
            getWidget.passwordReset(true);
            getWidget.destroySpinner();
        });
      },
      beforeAppear: function(page) {
         
            getWidget.destroySpinner();
            var pageDetail = page;
            var para = pageDetail.contextId;
          
            $.Topic("login").subscribe(function() {
                getWidget.loginDetail();
            });
              
              $.Topic("resetPassword").subscribe(function() {
                 getWidget.passwordResets(); 
              });
              
              
            if(getWidget.getUrlParameter("rdp") != null) {
                getWidget.user().pageToRedirect("/"+getWidget.getUrlParameter("rdp"));
            } 
        
            
          /*Remember User Details Start*/
          if (localStorage.chkbx && localStorage.chkbx != '') {
                    $('#rememberpassword').attr('checked', 'checked');
                    $('#CC-login-email').val(localStorage.usrname);
                    $('#CC-login-password').val(localStorage.pass);
                } else {
                    $('#rememberpassword').removeAttr('checked');
                    $('#CC-login-email').val('');
                    $('#CC-login-password').val('');
                }
          /*Remember User Details Ends*/
      },
      resetPwdFormRendered:function(){
          $.Topic('changePasswordFormValidate.memory').publish('success');
      },
      resetPwdForm:function(data){
          $.Topic('changePasswordFormValidate.memory').publish('success');
          if(changePasswordFormValidate.form()){ getWidget.savePassword(data) }
      },
      anonymousOrderDetailFormRendered:function(){
          $.Topic('anonymousOrderDetailForm.memory').publish('success');
      },
      anonymousOrderDetailForm:function(){
          $.Topic('anonymousOrderDetailForm.memory').publish('success');
          if(anonymousOrderForm.form()) { getWidget.getOrderDetails(); }
      },
      GetLoginFormRendered:function(){
          $.Topic('getUserLoginForm.memory').publish('success');
      },
      getUserLoginForm:function(){
          $.Topic('getUserLoginForm.memory').publish('success');
          if(userLoginForm.form()){getWidget.handleCustomLogin();}
      },
      
            
      /*Anonymous Order LookUp*/
      getOrderDetails: function() {
            getWidget.createSpinner();
            var loginUrl = getWidget.loginURL();
            var user ={
                    username: getWidget.userName(),
                    password: getWidget.loginPassword()
                };
            var getOrderUrl = getWidget.getOrderURL();
         
           
            var orderId = getWidget.orderno().trim().toLowerCase();
            var email = getWidget.orderEmail().trim();
            
            
            $.ajax({ // รง Ajax call to get the token
                url: loginUrl,
                type: "POST",
                data: user,
                async: false,
                success: function(data) {
                    getWidget.createSpinner();
                    $.ajax({ //  รง Ajax call to getorder Api
                        url: getOrderUrl + '/' + orderId,
                        data: {
                            email: email
                        },
                        beforeSend: function(xhr) {
                            getWidget.createSpinner();
                            xhr.setRequestHeader('Authorization', data.id);
                            getWidget.OrderEmailError(false);
                            getWidget.OrderIDError(false);
                        },
                        async: false,
                        success: function(order) {
                            getWidget.createSpinner();
                            window.location = '/guestorderdetails/'+getWidget.orderno().trim().toLowerCase() + ',' + getWidget.orderEmail().trim();
                        },
                        error: function(data, status) {
                            getWidget.createSpinner();
                            
                            if(data.responseText.indexOf('email') > -1) {
                                getWidget.OrderEmailError(true);
                                getWidget.orderEmail(getWidget.orderEmail().trim());
                            } else if(data.responseText.indexOf('order') > -1) {
                               getWidget.OrderIDError(true);
                               getWidget.orderID(getWidget.orderno().trim().toLowerCase());
                           
                            }
                            getWidget.destroySpinner();
                        }
                    });
                },
                error: function(data, status) {
                    getWidget.destroySpinner();
                   
                }
            });
            
      },
    
        passwordResets : function() {
             getWidget.oldPassword1('');
             getWidget.newPassword1('');
             getWidget.confirmPassword1('');
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
      loginDetail : function() {
          getWidget.email('');
          getWidget.password('');
      },
      handleCustomLogin : function() {
          var self = this;
          var email, password;
          email = $("#CC-login-email").val();
          password = $("#CC-login-password").val();
           if($('#rememberpassword').is(':checked')) {
                // save username and password
                localStorage.usrname = $('#CC-login-email').val();
                localStorage.pass = $('#CC-login-password').val();
                localStorage.chkbx = $('#rememberpassword').val();
            } else {
                localStorage.usrname = '';
                localStorage.pass = '';
                localStorage.chkbx = '';
            }
          $("#CC-login-input").val(email).change();
          $("#CC-login-password-input").val(password).change();
          $("#CC-userLoginSubmit").trigger("click");
          getWidget.createSpinner();
          getWidget.error(false);
          
      },
      /**
       * Destroy the 'loading' spinner.
       * @function  OrderViewModel.destroySpinner
       */
      destroySpinner: function() {
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
      },
      handleLogin : function(obj) {
          var inputParams = {};
          var user = getWidget.user();
          inputParams[CCConstants.PROFILE_EMAIL] = getWidget.email();
          inputParams[CCConstants.PROFILE_PASSWORD] = getWidget.password();
          var self=this;
          self.user().login(inputParams.email);
          self.user().client().login(self.user().login(), inputParams.password,
                // Success Function
                    function() {
                      var data ={};
                      data.widgetId = getWidget.widgetId;
                      self.user().loginSuccessFunc(true);
                      $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).publish(data);
                      
                            window.location = self.user().myAccountHash;
                    },
                    // Error function
                    function(pResult) {
                         if (pResult.error == CCConstants.PASSWORD_EXPIRED) {
                                self.user().isPasswordExpired(true);
                                $.Topic(pubSub.topicNames.USER_PASSWORD_EXPIRED).publish();
                          } 
                          else 
                          if (pResult.error == CCConstants.PASSWORD_GENERATED) {
                                self.user().isPasswordExpired(true);
                                $.Topic(pubSub.topicNames.USER_PASSWORD_GENERATED).publish();
                                self.loginPane(false);
                                self.passwordReset(true);
                                
                                
                          } 
                          else 
                          {
                                self.user().loginErrorFunc();
                                $.Topic(pubSub.topicNames.USER_LOGIN_FAILURE).publish(pResult);
                          }
                      pResult.widgetId = getWidget.widgetId;
                      self.user().loginErrorFunc();
                      $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_FAILURE).publish(pResult);
                      self.error(true);
                    }
                  );
         
        },
         savePassword : function(obj) {
          var self = this;
          var inputParams = {};
          var user = getWidget.user();
          inputParams[CCConstants.PROFILE_LOGIN] = self.user().login();
          inputParams[CCConstants.PROFILE_OLD_PASSWORD] = getWidget.oldPassword1();
          inputParams[CCConstants.PROFILE_NEW_PASSWORD] = getWidget.newPassword1();
          inputParams[CCConstants.PROFILE_CONFIRM_PASSWORD] = getWidget.confirmPassword1();
          self.user().adapter.persistCreate(CCConstants.ENDPOINT_UPDATE_EXPIRED_PASSWORD, 'id', inputParams,
            //success callback 
            function(data) {
              $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL).publish(data);
              var currentPassword = self.user().newPassword();
              self.user().resetPassword();
              self.user().password(currentPassword);
              window.location = '/login';
           
            },
            //error callback
            function(data) {
              self.user().resetPassword();
              $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_FAILURE).publish(data);
              $('#currentPasswordError').removeClass('hide');
              setTimeout(function () {
                $(".currentPassword").focus();
              }, 50);
              
            }
          );
        },
        


    };
  }
);
