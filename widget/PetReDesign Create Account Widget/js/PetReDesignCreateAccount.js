/**
 * @fileoverview Petmate User Registration Widget.
 *
 * @author oracle
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'notifier', 'ccPasswordValidator', 'pubsub', 'CCi18n', 
   'ccConstants', 'navigation', 'ccLogger' ,'moment','./combodate.js','ccResourceLoader!global/PetReDesignValidationWidget'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, notifier, CCPasswordValidator, pubsub, CCi18n, CCConstants,
    navigation, ccLogger, moment) {

    "use strict";
    
    var getWidget = "";
     var obj = {};     
    var isFromCheckout = false;    
    return {
            // Observable Variables 
            email : ko.observable(''),
            emailConfirm : ko.observable(''),
            firstName : ko.observable(''),
            lastName : ko.observable(''),
            password : ko.observable(''),
            passwordConfirm : ko.observable(''),
            emailOpt : ko.observable(true),
            zipcode : ko.observable(''),
            petProfile: ko.observableArray(),
            emailError:ko.observable(false),
            ackCheckbox : ko.observable(false),
            koEmailSignupValue: ko.observable(),
      
      onLoad: function(widget) {     
                getWidget = widget;
                  $('.date-field').datepicker(),
                // add another pet details
               
                $("body").on(  "click", ".button--add",function() {
                    getWidget.petProfile.push(new getWidget.createPetProfile());
                });
                
                
                
      },
      beforeAppear: function(page) { 
      
        var getPageParam = getWidget.getUrlParameter("page");
        if(getPageParam != null && getPageParam == "checkout") {
            isFromCheckout = true;
        } else {
            isFromCheckout = false;
        }
          if(getWidget.user().loggedIn() && !getWidget.user().isUserSessionExpired()) {
              window.location = getWidget.user().myAccountHash;
          }
            getWidget.createUser();
            
            $.Topic("registerUser").subscribe(function() {
               getWidget.createUser(); 
            });
            var browser = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ? 'chrome' : 'other';
    
          
            if ($(window).width() < 1024) {   
            
                
                   $("body").on("click", ".PickDate",function(){
                            $('.date-field').datepicker().toggle();  
                        }); 
                   }
                   
                   
              
            
      },
                  GetRegistrationForm: function(e) {
                $.Topic('getregisterFormValidate.memory').publish('success');
            },
            registerFormValidate: function(e) {
                $.Topic('getregisterFormValidate.memory').publish('success');
                if (createaccountForm.form()) {
                    getWidget.createProfile();
                }
            },
            
      createUser: function() {
          getWidget.firstName('');
          getWidget.lastName('');
          getWidget.email('');
          getWidget.password('');
          getWidget.emailOpt(true);
          getWidget.zipcode('');
          getWidget.petProfile.push(new getWidget.createPetProfile());
      },
      createPetProfile : function() {
          this.petName = ko.observable('');
          this.petType = ko.observable('');
          this.petGender = ko.observable('');
          this.petBreed = ko.observable('');
          this.petDOB = ko.observable('');
      },
     
    //obj : {widgetId: "wi200045"},
    
    
     handleAutoLogin: function(obj) {
        var self = this;   
      //  //console.log("obj  ",ko.toJS(obj));
     //   //console.log("self   ",ko.toJS(self));
      //  //console.log("widget  ",ko.toJS(getWidget));
              self.user().login(self.email());
              self.user().client().login(self.user().login(), self.password(),
                // Success Function
                function() {
                  var data ={};
                  data.widgetId = getWidget.widgetId;
                  self.user().loginSuccessFunc(true);
                  //console.log("*************************LoggedIn*******");
                  $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).publish(data);
                   //   window.location='/profile';
                   
                   if(isFromCheckout) {
                       var widget = this;
                       // //console.log("handleCustomValidateCart ************");
                        if(getWidget.cart().items().length > 0) {
                           getWidget.cart().validatePrice = true;
                           getWidget.cart().skipPriceChange(true);
                            $.Topic(pubsub.topicNames.LOAD_CHECKOUT).publishWith(getWidget.cart(), [{message: "success"}]);
                          return false;
                        }
                        return true;
                   } else {
                       window.location = self.user().myAccountHash;
                   }
                  
                },
                // Error function
                function(pResult) {
                  pResult.widgetId = getWidget.widgetId;
                  self.user().loginErrorFunc();
                 
                 // //console.log("*************************Failed*******");
                  $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_FAILURE).publish(pResult);
                }
              );
          },
      createProfile: function(obj) {
          var inputParams = {};
          var user = getWidget.user();
        //  //console.log(user);
          var self = this;
		  
		//  //console.log(ko.toJS(getWidget.petProfile()));
		  
		  
         
       // //console.log("*************************CREATE PROFILE*****************");
        inputParams[CCConstants.PROFILE_EMAIL] = getWidget.email();
        inputParams[CCConstants.PROFILE_PASSWORD] = getWidget.password();
        inputParams[CCConstants.PROFILE_FIRST_NAME] = getWidget.firstName();
        inputParams[CCConstants.PROFILE_LAST_NAME] = getWidget.lastName();
        inputParams[CCConstants.PROFILE_RECEIVE_EMAIL] = getWidget.emailOpt()? 'yes':'no';
        inputParams["petProfileProperty"] = ko.toJSON(getWidget.petProfile());
        inputParams["zipcode"] = getWidget.zipcode();
        
        //console.log(ko.toJS(getWidget.petProfile()));
      //  //console.log("INPUT PARAMS.....",inputParams);
          
          user.adapter.persistCreate(CCConstants.ENDPOINT_CREATE_PROFILE, CCConstants.ENDPOINT_CREATE_PROFILE, inputParams,
          //success callback 
            function(data) {
              data.widgetId = getWidget.widgetId;
              getWidget.handleAutoLogin(user);
             // //console.log(getWidget);
            //  //console.log(user);
           
             
              // perform login and redirect to /profile page. Take a look at handleLogin in profile widget
            },
            function(data) {
              data.widgetId = getWidget.widgetId;
              if (data.errorCode == CCConstants.CREATE_PROFILE_USER_EXISTS){
                data.message = CCi18n.t('ns.common:resources.accountAlreadyExists');
                getWidget.emailError(true)
                $(".already_registerd > span").text(getWidget.email());
                $('html, body').animate({
                    'scrollTop' : $("#form-wrap").position().top
                });
              }
              
              $.Topic(pubsub.topicNames.USER_CREATION_FAILURE).publish(data);
            }
          );
          
           
        //Bronto New User Email
            if(getWidget.emailOpt()){
               var email = getWidget.email();
               getWidget.koEmailSignupValue(email)
               $('#brontoEmailId').remove();
                var brontoEmail = '<img id="brontoEmailId" src="https://app.bronto.com/public/?q=direct_add&fn=Public_DirectAddForm&id=bjoxunlmlfrmycqpxmpztvpnnlwkbof&email=' + getWidget.koEmailSignupValue() + '&createCookie=1" width="0" height="0" border="0" alt=""/>'
                $('body').append(brontoEmail);
           }
       
        //Ends
             
    
      },
      getUrlParameter : function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results === null){
           return null;
        }
        else{
           return results[1] || 0;
        }
      },
      getPetDob:function(getIndex){
         $('#DOB'+getIndex).combodate({
            firstItem: 'name',
            smartDays:true,
            minYear: 1970,
            maxYear: new Date().getFullYear()
        });
         
      }
    
     
    };
   
  });
 
 
