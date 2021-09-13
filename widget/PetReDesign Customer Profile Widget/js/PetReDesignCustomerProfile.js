/**
 * @fileoverview Customer Profile Widget.
 *
 * @author 
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub', 'navigation', 'viewModels/address', 'notifier', 'ccConstants', 'ccPasswordValidator', 'CCi18n', 'swmRestClient', 'ccRestClient', 'moment', './combodate.js', 'ccResourceLoader!global/PetReDesignValidationWidget'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, PubSub, navigation, Address, notifier, CCConstants, CCPasswordValidator, CCi18n, swmRestClient, CCRestClient, moment) {

        "use strict";

        var getWidget = "";
        var placeSearch, autocomplete;
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };
        var componentMapping = {
            street_number: 'txtAddress123',
            locality: 'txtCity23',
            administrative_area_level_1: 'selectState23',
            postal_code: 'txtZip23'
        };
    
    return {
        petProfileProperties: ko.observableArray(),
        petProfile : ko.observableArray(),
        koFirstName: ko.observable(),
        koLastName: ko.observable(),
        koEmail: ko.observable(),
        koDOB: ko.observable('Not provided'),
        koGender: ko.observable(),
        koEmailSubscribe: ko.observable(),
        koPhoneNumber: ko.observable('Not provided'),
        koViewZipCode: ko.observable('Not provided'),
        kopetProfileArray: ko.observableArray(),
        koZipcode: ko.observable(''),
        WIDGET_ID:        "customerProfile",
        ignoreBlur:   ko.observable(false),
         // Property to show edit screen.
        isUserDetailsEdited:                ko.observable(false),
        isUserProfileShippingEdited:        ko.observable(false),
        isUserProfileDefaultAddressEdited : ko.observable(false),
        isUserProfilePasswordEdited:        ko.observable(false),
        interceptedLink: ko.observable(null),
        isUserProfileInvalid: ko.observable(false),
        showSWM : ko.observable(true),
        isProfileLocaleNotInSupportedLocales : ko.observable(),
        isPetDetailsEdited: ko.observable(false),
        isPetNewPet: ko.observable(false),
        currentPetProfile: ko.observableArray(),
        newPetProfile:ko.observableArray([]),
        isnewPetDetails: ko.observable(false),
        billingAddressCounty: ko.observable(''),
        billingAddressCounty1: ko.observableArray(),
        koPetmateAddressEdited: ko.observable(false),
        koBusinessAddress:ko.observable(false),
        koNewCustomer: ko.observable(''),
        koEmailSubscribed: ko.observable(),
        koReceiveEmail:ko.observable(),
        koEmailSignupValue: ko.observable(),
        updateData: function(data) {

            ko.mapping.fromJS(data, {}, this.petProfile);
         
        },
        
        beforeAppear: function (page) {
         // Every time the user goes to the profile page,
         // it should fetch the data again and refresh it.
        var widget = this;
        widget.viewDefaultBillingAddress();
        
    
        
        getWidget.updateData(getWidget.fetchpetDetails());
                getWidget.createUser();
                getWidget.koViewZipCode(getWidget.fetchZipCodeDetails());
                getWidget.koDOB(getWidget.fetchUserDOB());
        
        widget.user().ignoreEmailValidation(false);
        // Checks whether the user is logged in or not
        // If not the user is taken to the home page
        // and is asked to login.
        if (widget.user().loggedIn() == false) {
          navigation.doLogin(navigation.getPath(), widget.links().home.route);
        } else if (widget.user().isSessionExpiredDuringSave()) {
          widget.user().isSessionExpiredDuringSave(false);
        } else {
          //reset all the password detals
          widget.user().resetPassword();
          this.getSubmittedOrderCountForProfile(widget);
          widget.showViewProfile(true);
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
        }
        },
            profileUpdateFormRendered: function() {
                setTimeout(function(){
                    $.Topic('editProfileFormValidate.memory').publish('success');
                },50)
            },
            editPetProfileFormRendered: function() {
                $.Topic('petInfoFormValidate.memory').publish('success');
            },
            changePwdFormRendered: function() {
                $.Topic('changePasswordFormValidate.memory').publish('success');
            },
            myAccountFormRendered: function() {
                setTimeout(function(){
                    $.Topic('myAccountAddressBoxFormValidate.memory').publish('success');
                },50)
            },
            getEditProfileForm: function() {
                $.Topic('editProfileFormValidate.memory').publish('success');
                if (editProfileForm.form()) {
                    getWidget.updateProfileInfo()
                }
            },
            getChangePasswordForm: function() {
                $.Topic('changePasswordFormValidate.memory').publish('success');
                if (changePasswordFormValidate.form()) {
                    getWidget.handleUpdateProfile()
                }
            },
            getMyAccountAddressBoxForm: function() {
                $.Topic('myAccountAddressBoxFormValidate.memory').publish('success');
                if (CustomerMyaccountAddressBookForm.form()) {
                    getWidget.updateAddressDetails()
                }
            },
            getPetInfoForm: function(data) {
                $.Topic('petInfoFormValidate.memory').publish('success');
                if (editPetProfileValidation.form()) {
                    getWidget.newPetDetails(data)
                }
            },
        createPetProfile:function() {
              this.petName = ko.observable('');
              this.petType = ko.observable('');
              this.petGender = ko.observable('');
              this.petBreed = ko.observable('');
              this.petDOB = ko.observable('');
          }, 
        createUser: function () {
          //  ////console.log("create user called", getWidget.user())
           //getWidget.koDOB((getWidget.user().dateOfBirth()== 'null' ) ? "" : getWidget.user().dateOfBirth());
           getWidget.koFirstName(getWidget.user().firstName());
           getWidget.koLastName(getWidget.user().lastName());
           getWidget.koPhoneNumber(getWidget.user().daytimeTelephoneNumber()=='null'? '': getWidget.user().daytimeTelephoneNumber());
           getWidget.koEmail(getWidget.user().email());
           getWidget.koDOB(getWidget.fetchUserDOB());
          // //console.log( getWidget.koDOB(),'////DOB////');
          var receiveEmailProperty;
          receiveEmailProperty = getWidget.user().receiveEmail;
           getWidget.koEmailSubscribe(typeof receiveEmailProperty ==="function" ? receiveEmailProperty() : receiveEmailProperty);
           getWidget.koZipcode(getWidget.fetchZipCodeDetails());
           getWidget.koGender(getWidget.user().gender());
          // ////console.log("-----phoneNumber--------");
         // ////console.log(getWidget.user().daytimeTelephoneNumber())
        },
        fetchUserDOB: function() {
            var user = getWidget.user();
            var UserDOBDetails = "";
            var profileDynamicProperties = getWidget.user().dynamicProperties();
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id() == "userDateOfBirth") {
                    
                    //UserDOBDetails = $.parseJSON(profileDynamicProperties[i].value());
                    UserDOBDetails = profileDynamicProperties[i].value();
                   // //console.log(UserDOBDetails,'///USER DOB///');
                    break;
                }
            }
            if (UserDOBDetails == null || UserDOBDetails == '' || UserDOBDetails == 'null') {
               // //console.log(UserDOBDetails,'///Checking Null///');
                UserDOBDetails = 'Not provided';
            }
            return UserDOBDetails;
        },
        fetchUpdateUserDOB: function(getData) {
             var userDOB = '';
            var profileDynamicProperties = getData.dynamicProperties;
            ////console.log(profileDynamicProperties);
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id == "userDateOfBirth") {
                    //userDOB = $.parseJSON(profileDynamicProperties[i].value());
                    userDOB = profileDynamicProperties[i].value;
                   // ////console.log(userDOB);
                    break;
                }
            }
            if (userDOB == null || userDOB == '' || userDOB == 'null') {
                userDOB = 'Not provided';
            }
            return userDOB;
        },
        fetchZipCodeDetails: function() {
            var user = getWidget.user();
            var zipCodeDetails = "";
            var profileDynamicProperties = getWidget.user().dynamicProperties();
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id() == "zipcode") {
                    zipCodeDetails = $.parseJSON(profileDynamicProperties[i].value());
                    ////console.log('zipcodedetails value',zipCodeDetails)
                    break;
                }
            }
            if (zipCodeDetails == null) {
                zipCodeDetails = "";
            }
            ////console.log('zipcodedetails',zipCodeDetails)
            return zipCodeDetails;
        },
        fetchUpdateZipCodeDetails: function(getData) {
           
          //  ////console.log("***********************************Profile**************");
             var zipCodeDetails = [];
            var profileDynamicProperties = getData.dynamicProperties;
          //  ////console.log(profileDynamicProperties);
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id == "zipcode") {
                   // ////console.log("***************Inside zip code***********");
                   // ////console.log("Dynamic Prop Zipcode",profileDynamicProperties[i].value);
                    zipCodeDetails = $.parseJSON(profileDynamicProperties[i].value);
                   // ////console.log(zipCodeDetails);
                    break;
                }
            }
            if (zipCodeDetails == null) {
                zipCodeDetails = [];
            }
            return zipCodeDetails;
        },
        addPetProfile: function(data){  
           // ////console.log("data",data);
            getWidget.petProfile.push(data);
          //  ////console.log('added',getWidget.petProfile());
            //getWidget.updateProfileInfo()
        },
        updateProfileInfo: function() {
            ////console.log("update data",data)
            
            $('.input-field').removeClass('error');
            $('label').removeClass('error');
            $('label').removeClass('showSuccess');
	        $('.displayErrorIcons').removeClass('showSuccess');
            
            
			var user = getWidget.user();
		
		//	////console.log("User Object...  ",ko.toJS(user));
		
			var getPetProfile = [];
			  getPetProfile = ko.toJS(getWidget.petProfile());
			  ////console.log("getPetProfile ", getPetProfile)
			  //getPetProfile.push(data);
			  var setPetProfile = [];
			  
			  for (var i=0; i < getPetProfile.length; i++) {
				  if(getPetProfile[i].petName != "") {
					  setPetProfile.push(getPetProfile[i]);
				  }
			  }
			 // ////console.log("setPetProfile", setPetProfile)
			 // ////console.log("setPetProfile string", JSON.stringify(setPetProfile))
            var inputParams = {};
            
              inputParams["userDateOfBirth"] = getWidget.koDOB();
              inputParams["daytimeTelephoneNumber"] = getWidget.koPhoneNumber();
              inputParams["firstName"] = getWidget.koFirstName();
              inputParams["lastName"] = getWidget.koLastName();
              inputParams["email"] = getWidget.koEmail();
              inputParams["receiveEmail"] = getWidget.koEmailSubscribe()
              inputParams["zipcode"] = getWidget.koZipcode();
              inputParams["gender"] = getWidget.koGender();
              inputParams["petProfileProperty"] = JSON.stringify(setPetProfile);
             // ////console.log("User Object params ...  ",inputParams);
             //console.log(getWidget.koDOB(),'DOB');

             //Send user Profile to Klaviyo
              //Klaviyo user Profile Signup
              var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
                "method": "POST",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache"
                },
                "data": {
                    "g": "W8hEMQ",//Master List Id
                    "$fields": "$source",
                    "email": getWidget.koEmail().toString(),
                    "$source": "Profile"
                }
            }

            $.ajax(settings).done(function(response) {});
			  
              ////console.log(inputParams);
            user.adapter.loadJSON(CCConstants.ENDPOINT_UPDATE_PROFILE, user.id(), inputParams,
              //success callback 
              function(data) {
                $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).publish(data);
				//getWidget.handleUpdateProfile();
				////console.log("****************UPDATE SUCESS************");
				////console.log(data)
				
				 getWidget.updateData(getWidget.fetchUpdatePetDetails(data));
                 getWidget.koViewZipCode(getWidget.fetchUpdateZipCodeDetails(data));
                 getWidget.koDOB(getWidget.fetchUpdateUserDOB(data));
                 //console.log('$$$$$$$$$ dob $$$$$$',getWidget.koDOB());
                 
                // ////console.log(getWidget.fetchUpdatePetDetails(data) , '-----');
				 $('#passwordSuccessMessage').css("display","none");
				 $('#profileSuccessMessage').css("display","block");
				 
				 $('html, body').animate({
                    scrollTop: "0px"
                }, 800);

                 
              },
              //error callback
              function(data) {
                $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_FAILURE).publish(data);
				getWidget.updateData(getWidget.fetchpetDetails());
				 $('#profileSuccessMessage').css("display","none");
              });
              //handleUpdateProfile();
              $.Topic("petProfileProperty").publish("success");
              getWidget.isPetDetailsEdited(false);
              $('#removePetNote').css("display","none");
              
      
          var emailFlagRegistration;
         emailFlagRegistration = getWidget.koEmailSubscribe;
          getWidget.koReceiveEmail(typeof emailFlagRegistration ==="function" ? emailFlagRegistration() : emailFlagRegistration);

              if(getWidget.koReceiveEmail() == 'yes'){
                    }
            else if(getWidget.koReceiveEmail() == 'no'){
                } 

          //Ends
        },
        removePetDetails: function(data) {
         //   ////console.log('delete petProfile data', data)
            getWidget.petProfile.remove(data);
            $('#removePetNote').css("display","block");
                $.Topic("callDynamicPetProfileVal.memory").publish("success");
			getWidget.updateProfileInfo();
            //getWidget.updateProfile(getWidget.fetchpetDetails());
            //$.Topic("petProfileProperty").publish("success");
        },
        cancelPetDetailsEdit: function(data){
                $.Topic("callDynamicPetProfileVal.memory").publish("success");
			getWidget.updateProfileInfo();
            getWidget.isPetDetailsEdited(false);
        },
        fetchpetDetails: function() {
            var user = getWidget.user();
          //  ////console.log("***********************************Profile**************");
             var petProfile1 = [];
            var profileDynamicProperties = getWidget.user().dynamicProperties();
           // ////console.log(profileDynamicProperties);
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id() == "petProfileProperty") {
                    var a = profileDynamicProperties[i];
                  //  ////console.log('aaaaaaaaaaaaaaaaaaaaa0', a.value());
                   // ////console.log('Values............', typeof(profileDynamicProperties[i].value()));
                    if(profileDynamicProperties[i].value().length > 2) {
                      //  ////console.log("***************Inside petprofile***********");
                      //  ////console.log('pet value', $.parseJSON(profileDynamicProperties[i].value()));
                        petProfile1 = $.parseJSON(profileDynamicProperties[i].value());
                      //  ////console.log(petProfile1);
                        break;
                    }
                }
            }
            if (petProfile1 == null) {
                petProfile1 = [];
            }
            return petProfile1;
        },
		fetchUpdatePetDetails: function(getData) {
           
          //  ////console.log("***********************************Profile**************");
             var petProfile1 = [];
            var profileDynamicProperties = getData.dynamicProperties;
           // ////console.log(profileDynamicProperties);
            for (var i in profileDynamicProperties) {
                if (profileDynamicProperties[i].id == "petProfileProperty") {
                 //   ////console.log("***************Inside petprofile***********");
                    petProfile1 = $.parseJSON(profileDynamicProperties[i].value);
                  //  ////console.log(petProfile1);
                    break;
                }
            }
            if (petProfile1 == null) {
                petProfile1 = [];
            }
            return petProfile1;
        },
        onLoad: function(widget) {
        /* Code For Loading The Google Auto Address Populate Starts*/
        var googleJs = document.createElement('script');
       // ////console.log(window.googleApiKey,'--------googleApiKey----------');
        //googleJs.setAttribute('src', '//maps.googleapis.com/maps/api/js?key=AIzaSyCAx2PpbbIFx___IGq4X984OL6GnXqlYFg&libraries=places');
        googleJs.setAttribute('src', '//maps.googleapis.com/maps/api/js?key=AIzaSyDvCQ6agetd61iFoh1TvmQfIdm4rVAo0dY&libraries=places');
        //googleJs.setAttribute('src', '//maps.googleapis.com/maps/api/js?key=' + window.googleApiKey + '&libraries=places');
        document.body.appendChild(googleJs);
        /* Code For Loading The Google Auto Address Populate Ends*/   
            
        getWidget = widget;
       
            
        var self = this;
        var isModalVisible = ko.observable(false);
        var clickedElementId = ko.observable(null);
        var isModalSaveClicked = ko.observable(false);
        
        widget.ErrorMsg = widget.translate('updateErrorMsg');
        widget.passwordErrorMsg = widget.translate('passwordUpdateErrorMsg');
        
        widget.getProfileLocaleDisplayName = function() {
          //Return the display name of profile locale
          for (var i = 0; i < widget.site().additionalLanguages.length; i++) {
                if (widget.user().locale() === widget.site().additionalLanguages[i].name) {
                    return widget.site().additionalLanguages[i].displayName;
                }
            }
        };
        
        //returns the edited locale to be displayed in non-edit mode
        widget.getFormattedProfileLocaleDisplayName = function(item) {
          return item.name.toUpperCase() + ' - ' + item.displayName;
        };
        
        // Clear edit profiles and set it to view only mode.
        widget.showViewProfile = function (refreshData) {
          // Fetch data in case it is modified or requested to reload.
          // Change all div tags to view only.
          if(refreshData) {
            widget.user().getCurrentUser(false);
          }
          widget.isUserDetailsEdited(false);
          widget.isUserProfileShippingEdited(false);
          widget.isUserProfileDefaultAddressEdited(false);
          widget.isUserProfilePasswordEdited(false);
        };
        
        // Reload shipping address.
        widget.reloadShipping = function() {
			////console.log("widget.reloadShipping user............",ko.toJS(widget.user()))
          //load the shipping address details
          if (widget.user().updatedShippingAddressBook) {
            var shippingAddresses = [];
            for (var k = 0; k < widget.user().updatedShippingAddressBook.length; k++)
            {
              var shippingAddress = new Address('user-shipping-address', widget.ErrorMsg, widget, widget.shippingCountries(), widget.defaultShippingCountry());
              shippingAddress.countriesList(widget.shippingCountries());
              
              shippingAddress.copyFrom(widget.user().updatedShippingAddressBook[k], widget.shippingCountries());
              shippingAddress.resetModified();
              shippingAddress.country(widget.user().updatedShippingAddressBook[k].countryName);
              shippingAddress.state(widget.user().updatedShippingAddressBook[k].state);
              shippingAddress.county(widget.user().updatedShippingAddressBook[k].county);
              shippingAddresses.push(shippingAddress);
            }
              
            widget.user().shippingAddressBook(shippingAddresses);
          }
        };
        
            widget.viewDefaultBillingAddress = function () {

                    var user = getWidget.user();

                    var defaultBillingAddress;

                    var billingAddressDynamicProperties = getWidget.user().dynamicProperties();

                    for (var i in billingAddressDynamicProperties) {
                        if (billingAddressDynamicProperties[i].id() == "profileBillingAddress") {
                            defaultBillingAddress = $.parseJSON(billingAddressDynamicProperties[i].value());
                            if (defaultBillingAddress != null) {
                                getWidget.billingAddressCounty1([]);
                                getWidget.billingAddressCounty1.push(defaultBillingAddress[0].county);
                              
                            }
                            break;
                        }
                    }

                    
                    
                };


            widget.viewDefaultBillingAddress = function () {

                    var user = getWidget.user();

                    var defaultBillingAddress;

                    var billingAddressDynamicProperties = getWidget.user().dynamicProperties();

                    for (var i in billingAddressDynamicProperties) {
                        if (billingAddressDynamicProperties[i].id() == "profileBillingAddress") {
                            defaultBillingAddress = $.parseJSON(billingAddressDynamicProperties[i].value());
                            if (defaultBillingAddress != null) {
                                getWidget.billingAddressCounty1([]);
                                getWidget.billingAddressCounty1.push(defaultBillingAddress[0].county);
                                //getWidget.billingAddressCounty(defaultBillingAddress[0].county);
                            }
                            break;
                        }
                    }

                    
                    
                };
        /**
         * Ignores password validation when the input field is focused.
         */
        widget.passwordFieldFocused = function(data, event) {
          if (this.ignoreBlur && this.ignoreBlur()) {
            return true;
          }
          this.user().ignorePasswordValidation(true);
          return true;
        };

        /**
         * Password is validated when the input field loses focus (blur).
         */
        widget.passwordFieldLostFocus = function(data, event) {
          if (this.ignoreBlur && this.ignoreBlur()) {
            return true;
          }
          this.user().ignorePasswordValidation(false);
          return true;
        };

        /**
         * Ignores confirm password validation when the input field is focused.
         */
        widget.confirmPwdFieldFocused = function(data, event) {
          if (this.ignoreBlur && this.ignoreBlur()) {
            return true;
          }
          this.user().ignoreConfirmPasswordValidation(true);
          return true;
        };

        /**
         * Confirm password is validated when the input field loses focus (blur).
         */
        widget.confirmPwdFieldLostFocus = function(data, event) {
          if (this.ignoreBlur && this.ignoreBlur()) {
            return true;
          }
          this.user().ignoreConfirmPasswordValidation(false);
          return true;
        };

        /**
         * Ignores the blur function when mouse click is up
         */
        widget.handleMouseUp = function() {
            this.ignoreBlur(false);
            this.user().ignoreConfirmPasswordValidation(false);
            return true;
          };
          
          /**
           * Ignores the blur function when mouse click is down
           */
          widget.handleMouseDown = function() {
            this.ignoreBlur(true);
            this.user().ignoreConfirmPasswordValidation(true);
            return true;
          };
          
        widget.hideModal = function () {
          if(isModalVisible() || widget.user().isSearchInitiatedWithUnsavedChanges()) {
            $("#CC-customerProfile-modal").modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
          }
        };
        
        widget.showModal = function () {
          $("#CC-customerProfile-modal").modal('show');
          isModalVisible(true);
        };
        
        // Handle cancel update.
        widget.handleCancelUpdate = function () {
           widget.showViewProfile(false);
           widget.handleCancelUpdateDiscard();
           $('.input-field').removeClass('error');
           $('label').removeClass('error');
           $('label').removeClass('showSuccess');
	       $('.displayErrorIcons').removeClass('showSuccess');
        };
        
        widget.ChangePwdCancelUpdate=function(){
                     $('#CC-customerProfile-soldPassword').val('');	
                     $('#createNewPassword-password,#confirm-password,#CC-customerProfile-soldPassword').removeClass('error')
	                 $('#createNewPassword-password').val('');		
	                 $('#confirm-password').val('');	
	                 $('#CC-customerProfile-soldPassword-error,#createNewPassword-password-error,#confirm-password-error').removeClass('error');
	                 $("#CC-customerProfile-soldPassword-error").html("");
	                 $('#createNewPassword-password-error').html("");
	                 $('#confirm-password-error').html("");
	                 $('#ChangePwd').removeClass('changePasswordbtn').addClass('disableChangePwd');
	                 $('#ChangePwd').attr('disabled','disabled');
	                 $('.cancel-button').css('display', 'none');
	                 $('label').removeClass('showSuccess');
	                 $('.displayErrorIcons').removeClass('showSuccess');
            
        };
        
        // Discards user changes and reset the data which was saved earlier.
        widget.handleCancelUpdateDiscard = function () {
          // Resets every thing.
          widget.showViewProfile(true);
          widget.user().resetPassword();
          widget.user().editShippingAddress(null);
          widget.reloadShipping();
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          widget.hideModal();
        };
        
        // Discards user changes and navigates to the clicked link.
        widget.handleModalCancelUpdateDiscard = function () {
          widget.handleCancelUpdate();
          if ( widget.user().isSearchInitiatedWithUnsavedChanges() ) {
            widget.hideModal();
            widget.user().isSearchInitiatedWithUnsavedChanges(false);
          }
          else {
            widget.navigateAway();
          }
        };
        
        // Add new Shipping address, then display for editing.
        widget.handleCreateShippingAddress = function () {
            widget.koBusinessAddress(false);
            widget.koPetmateAddressEdited(false);
           var addr = new Address('user-shipping-address', widget.ErrorMsg, widget, widget.shippingCountries(), widget.defaultShippingCountry());
           widget.editShippingAddress(addr);
           $('#defaultShippingAddressSuccess').text('Address added successfully');
        },
        
          widget.handleEditShippingAddress = function (addr) {
                widget.koPetmateAddressEdited(true);
                widget.editShippingAddress(addr);

            },
        
         widget.editShippingAddress = function (addr) {  
          if(addr.companyName()!=''){
              widget.koBusinessAddress(true);
          }
          if(widget.koBusinessAddress()){
                  $('.business-input').css('display' ,'block');
              
          }
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          widget.user().editShippingAddress(addr);
          widget.isUserProfileShippingEdited(true);
          $('#CC-customerProfile-sfirstname').focus();
          if (widget.shippingCountries().length == 0) {
            $('#CC-customerProfile-shippingAddress-edit-region input').attr('disabled', true);
          }
           $('#defaultShippingAddressSuccess').text('Your address has successfully been updated');
            getWidget.initAutocomplete();
        };
        
         widget.updateDefaultShipping = function (addr) {
                    widget.koPetmateAddressEdited(true);
                    widget.user().editShippingAddress(addr);
                    getWidget.updateAddressDetails();
                    $('#defaultShippingAddressSuccess').text('Your primary address has successfully been updated');
                }
         widget.updateDefaultBilling = function (addr) {
                    var inputParams = {};
                    var setBillingAddress = [];
                    var getBillingAddress;
                    getBillingAddress = ({
                        firstName: addr.firstName(),
                        lastName: addr.lastName(),
                        county: addr.county(),
                        city: addr.city(),
                        address1: addr.address1(),
                        address2: addr.address2(),
                        address3: addr.companyName(),
                        country: addr.country(),
                        phoneNumber: addr.phoneNumber(),
                        postalCode: addr.postalCode(),
                        state: addr.state()
                    });
                   
                    setBillingAddress.push(getBillingAddress);
                    inputParams["profileBillingAddress"] = JSON.stringify(setBillingAddress);
                    widget.user().adapter.loadJSON(CCConstants.ENDPOINT_UPDATE_PROFILE, widget.user().id(), inputParams,
                        //success callback 
                        function (data) {
                            $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).publish(data);
                             widget.reloadShipping();
                        },
                        //error callback
                        function (data) {
                            $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_FAILURE).publish(data);


                        });
                    getWidget.billingAddressCounty1([]);
                    getWidget.billingAddressCounty1.push(addr.county());
                    $('#defaultShippingAddressSuccess').text('Your primary address has successfully been updated');
                }
        
          widget.handleSelectDefaultShippingAddress = function (addr) {
          widget.selectDefaultShippingAddress(addr);
          widget.isUserProfileDefaultAddressEdited(true);
        };
        
          widget.handleRemoveShippingAddress = function (addr, event) {
              
             // ////console.log(addr);
                 $('#defaultShippingAddressSuccess').text('Address deleted successfully');
      
                 for(var i=0; i< widget.user().shippingAddressBook().length; i++){

                     if(addr.county() == widget.user().shippingAddressBook()[i].county()){
                      widget.user().shippingAddressBook.remove(addr);
                      widget.user().deleteShippingAddress(true);
                
                     }
                 }
                 
                
                  
                  
                  // If addr was the default address, reset the default address to be the first entry.
                    if (addr.isDefaultAddress() && widget.user().shippingAddressBook().length > 0) {
                        widget.selectDefaultShippingAddress(widget.user().shippingAddressBook()[0]);
                    }
        
                    // If we delete the last user address, notify other modules that might have
                    // cached it.
                    if (widget.user().shippingAddressBook().length === 0) {
                        $.Topic(PubSub.topicNames.USER_PROFILE_ADDRESSES_REMOVED).publish();
                    }
                    
					////console.log("after widget.user() observ...." , ko.toJS(widget.user()));
					
                    /*$.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(widget.user(), [{
                        message: "success"
                    }]);*/
					
                     widget.handleUpdateProfile();
             };
        
                widget.selectDefaultShippingAddress = function (addr) {
                  widget.user().selectDefaultAddress(addr);
                };
                
        // Display My Profile to edit.
        widget.editUserDetails = function () {
            
                $('#ProfileDOB').combodate({
                    firstItem: 'name',
                    smartDays:true,
                    minYear: 1924,
                    maxYear: new Date().getFullYear()
                }); 
                
            
            
            getWidget.createUser();
            notifier.clearError(widget.WIDGET_ID);
            notifier.clearSuccess(widget.WIDGET_ID);
            widget.isUserDetailsEdited(true);
            $('#CC-customerProfile-modal').modal('hide');
            $('#CC-customerProfile-edit-details-firstname').focus();
          
        };
        widget.editPetDetails = function () {
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          widget.isPetDetailsEdited(true);
          $('#CC-customerProfile-modal').modal('hide');
         
          if(getWidget.petProfile().length == 0){
                       
                        getWidget.petProfile.push(new getWidget.createPetProfile());
                        $(".deleteLink").text("Cancel");
                    }
          
          
        };
        widget.addNewPet = function () {
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          widget.isPetDetailsEdited(true);
          widget.isnewPetDetails(true);
          //widget.isPetNewPet(true);
          $('#CC-customerProfile-modal').modal('hide');
          getWidget.currentPetProfile();
          getWidget.currentPetProfile({
                  petName:ko.observable(''),
                  petType:ko.observable(''),
                  petGender:ko.observable(''),
                  petBreed:ko.observable(''),
                  petDOB:ko.observable('')
          });
          
             $('#petDOB').combodate({
                firstItem: 'name',
                smartDays:true,
                minYear: 1970,
                maxYear: new Date().getFullYear()
            }); 
            
          
          $(".deleteLink").text("Cancel");
        };
        widget.newPetDetails = function(getdata){
           // ////console.log('getdata',getdata);
            getWidget.currentPetProfile();
            getWidget.currentPetProfile(getdata);
            widget.isPetDetailsEdited(false);
           // ////console.log(getWidget.currentPetProfile());
            getWidget.petProfile.push(getWidget.currentPetProfile());
           // ////console.log('petprofile',getWidget.petProfile());
            getWidget.updateProfileInfo();
        }
        
        widget.editCurrentPetDetails = function (getdata) {
            getWidget.currentPetProfile([]);
            getWidget.currentPetProfile.push(getdata);
            widget.isPetDetailsEdited(true);
            widget.isnewPetDetails(false);
          
            $('#petDOB').combodate({
                firstItem: 'none',
                smartDays:true,
                minYear: 1970,
                maxYear: new Date().getFullYear()
            }); 
        };
         
        //Displays the Password edit option
        widget.editUserPassword = function () {
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          widget.isUserProfilePasswordEdited(true);
          widget.user().isChangePassword(true);
          $('#CC-customerProfile-soldPassword').focus();
        };
        
        // Handles User profile update
        widget.handleUpdateProfile = function () {
          $('span').removeClass('showSuccess');
           $('label').removeClass('showSuccess');
          if(widget.isUserProfilePasswordEdited()) {
            widget.user().isPasswordValid();
          }
          
          // Sends message for update
          $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(widget.user(), [{message: "success"}]);
        };
        
        // Handles User profile update and navigates to the clicked link.
        widget.handleModalUpdateProfile = function () {
          isModalSaveClicked(true);
          if ( widget.user().isSearchInitiatedWithUnsavedChanges() ) {
            widget.handleUpdateProfile();
            widget.hideModal();
            widget.user().isSearchInitiatedWithUnsavedChanges(false);
            return;
          }
          if (clickedElementId != "CC-loginHeader-myAccount") {
            widget.user().delaySuccessNotification(true);
          }
          widget.handleUpdateProfile();
        };
        
        
       // Handles if data does not change. 
        $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_NOCHANGE).subscribe(function() {
          // Resetting profile.
          widget.showViewProfile(false);
          // Hide the modal.
          widget.hideModal();
        });

        //handle if the user logs in with different user when the session expiry prompts to relogin
        $.Topic(PubSub.topicNames.USER_PROFILE_SESSION_RESET).subscribe(function() {
          // Resetting profile.
          widget.showViewProfile(false);
          // Hide the modal.
          widget.hideModal();
		  //get the count of the orders
          widget.getSubmittedOrderCountForProfile(widget);
        });
        
        // Handles if data is invalid.
        $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_INVALID).subscribe(function() {
          notifier.sendError(widget.WIDGET_ID, widget.ErrorMsg, true);
          if (isModalSaveClicked()) {
            widget.isUserProfileInvalid(true);
            isModalSaveClicked(false);
          }
          widget.user().delaySuccessNotification(false);
          // Hide the modal.
          widget.hideModal();
        });
        
        // Handles if user profile update is saved.
        $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function() {
          // update user in Social module
          if (widget.displaySWM) {
            var successCB = function(result){
              $.Topic(PubSub.topicNames.SOCIAL_SPACE_SELECT).publish();
              $.Topic(PubSub.topicNames.SOCIAL_SPACE_MEMBERS_INFO_CHANGED).publish();
            };
            var errorCB = function(response, status, errorThrown){};
            
            var json = {};
            if (widget.user().emailMarketingMails()) {
              json = {
                firstName : widget.user().firstName()
                , lastName : widget.user().lastName()
              };
            }
            else {
              json = {
	                firstName : widget.user().firstName()
	                , lastName : widget.user().lastName()
	                , notifyCommentFlag : '0'
                  , notifyNewMemberFlag : '0'
	            };
	          }
	          
            swmRestClient.request('PUT', '/swm/rs/v1/sites/{siteid}/users/{userid}', json, successCB, errorCB, {
              "userid" : swmRestClient.apiuserid
            });
          }
          
          widget.showViewProfile(true);
          // Clears error message.
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          if (!widget.user().delaySuccessNotification()) {
            notifier.sendSuccess(widget.WIDGET_ID, widget.translate('updateSuccessMsg'), true);
          }
          widget.hideModal();
          if (isModalSaveClicked()) {
            isModalSaveClicked(false);
            widget.navigateAway();
          }
        });
        
        // Handles if user profile update is failed.
        $.Topic(PubSub.topicNames.USER_PROFILE_UPDATE_FAILURE).subscribe(function(data) {
          if (isModalSaveClicked()) {
            widget.isUserProfileInvalid(true);
            isModalSaveClicked(false);
          }
          widget.user().delaySuccessNotification(false);
          // Hide the modal.
          widget.hideModal();
          if (data.status == CCConstants.HTTP_UNAUTHORIZED_ERROR) {
            widget.user().isSessionExpiredDuringSave(true);
            navigation.doLogin(navigation.getPath());
          } else {
            var msg = widget.passwordErrorMsg;
            notifier.clearError(widget.WIDGET_ID);
            notifier.clearSuccess(widget.WIDGET_ID);
            if (data.errorCode == CCConstants.USER_PROFILE_OLD_PASSWORD_INCORRECT) {
              $('#CC-customerProfile-soldPassword-phone-error').css("display", "block");
              $('#CC-customerProfile-soldPassword-phone-error').text(data.message);
              $('#CC-customerProfile-soldPassword-phone').addClass("invalid");
              $('#CC-customerProfile-spassword1-error').css("display", "block");
              $('#CC-customerProfile-spassword1-error').text(data.message);
              $('#CC-customerProfile-soldPassword').addClass("invalid");
            } else if (data.errorCode == CCConstants.USER_PROFILE_PASSWORD_POLICIES_ERROR) {
              $('#CC-customerProfile-spassword-error').css("display", "block");
              $('#CC-customerProfile-spassword-error').text(CCi18n.t('ns.common:resources.passwordPoliciesErrorText'));
              $('#CC-customerProfile-spassword').addClass("invalid");
              $('#CC-customerProfile-spassword-embeddedAssistance').css("display", "block");
              var embeddedAssistance = CCPasswordValidator.getAllEmbeddedAssistance(widget.passwordPolicies(), true);
              $('#CC-customerProfile-spassword-embeddedAssistance').text(embeddedAssistance);
            } else if (data.errorCode === CCConstants.USER_PROFILE_INTERNAL_ERROR) {
              msg = data.message;
              // Reloading user profile and shipping data in edit mode.
              widget.user().getCurrentUser(false);
              widget.reloadShipping();
            } else if (data.errors && data.errors.length > 0 && 
              (data.errors[0].errorCode === CCConstants.USER_PROFILE_SHIPPING_UPDATE_ERROR)) {
              msg = data.errors[0].message;
            } else {
              msg = data.message;
            }
            notifier.sendError(widget.WIDGET_ID, msg, true);
            widget.hideModal();
          }
        });
        
        $.Topic(PubSub.topicNames.USER_LOAD_SHIPPING).subscribe(function() {
          widget.reloadShipping();
        });
        
        $.Topic(PubSub.topicNames.UPDATE_USER_LOCALE_NOT_SUPPORTED_ERROR).subscribe(function() {
          widget.isProfileLocaleNotInSupportedLocales(true);
        });
        
        /**
         *  Navigates window location to the interceptedLink OR clicks checkout/logout button explicitly.
         */
        widget.navigateAway = function() {

          if (clickedElementId === "CC-header-checkout" || clickedElementId === "CC-loginHeader-logout" || clickedElementId === "CC-customerAccount-view-orders" 
              || clickedElementId === "CC-header-language-link" || clickedElementId.indexOf("CC-header-languagePicker") != -1) {
            widget.removeEventHandlersForAnchorClick();
            widget.showViewProfile(false);
            // Get the DOM element that was originally clicked.
            var clickedElement = $("#"+clickedElementId).get()[0];
            clickedElement.click();
          } else if (clickedElementId === "CC-loginHeader-myAccount") {
            // Get the DOM element that was originally clicked.
            var clickedElement = $("#"+clickedElementId).get()[0];
            clickedElement.click();
          } else {
            if (!navigation.isPathEqualTo(widget.interceptedLink)) {
              navigation.goTo(widget.interceptedLink);
              widget.removeEventHandlersForAnchorClick();
            }
          }
        };
        
        // handler for anchor click event.
        var handleUnsavedChanges = function(e, linkData) {
          var usingCCLink = linkData && linkData.usingCCLink;
          
          widget.isProfileLocaleNotInSupportedLocales(false);
          // If URL is changed explicitly from profile.
          if(!usingCCLink && !navigation.isPathEqualTo(widget.links().profile.route)) {
            widget.showViewProfile(false);
            widget.removeEventHandlersForAnchorClick();
            return true;
          }
          if (widget.user().loggedIn()) {
            clickedElementId = this.id;
            widget.interceptedLink = e.currentTarget.pathname;
            if (widget.user().isUserProfileEdited()) {
              widget.showModal();
              usingCCLink && (linkData.preventDefault = true);
              return false;
            }
            else {
              widget.showViewProfile(false);
            }
          }
        };
        
        var controlErrorMessageDisplay = function(e) {
          widget.isProfileLocaleNotInSupportedLocales(false);
        };
        
        /**
         *  Adding event handler for anchor click.
         */
        widget.addEventHandlersForAnchorClick = function() {
          $("body").on("click.cc.unsaved","a",handleUnsavedChanges);
          $("body").on("mouseleave", controlErrorMessageDisplay);
        };
        
        /**
         *  removing event handlers explicitly that has been added when anchor links are clicked.
         */
        widget.removeEventHandlersForAnchorClick = function(){
          $("body").off("click.cc.unsaved","a", handleUnsavedChanges);
        };
        
        /**
         *  returns true if any of the user details OR password OR shipping details edit is clicked.
         */ 
        widget.user().isUserProfileEdited = ko.computed({
          read: function() {
            return ( widget.isUserDetailsEdited() || widget.isUserProfilePasswordEdited() || widget.isUserProfileShippingEdited() || widget.isUserProfileDefaultAddressEdited() );
          },
          owner: widget
        });
        
         widget.cancelAddress = function () {
                    $('html, body').animate({
                        scrollTop: $("body").offset().top
                    }, 500);
                    widget.user().editShippingAddress(null);
                    widget.reloadShipping();
                    widget.isUserProfileShippingEdited(false);
                    notifier.clearError(widget.WIDGET_ID);
                    notifier.clearSuccess(widget.WIDGET_ID);
                }
        
          $('body').on( 'click', '#business',function(){
              $('.business-input').toggle();
          })
          
         $('body').on( 'focusin', '#CC-customerProfile-soldPassword',function(){
               $('.cancel-button').show();
               $('#ChangePwd').removeAttr('disabled')
               $('#ChangePwd').removeClass('disableChangePwd').addClass('changePasswordbtn');
          })
        
        
      },
           //Get count of orders for logged-in user
           getSubmittedOrderCountForProfile: function(widget) {
        var inputData = {};
        inputData[CCConstants.COUNT_ONLY] = true;
       // var url = "getFilterOrdersForProfile";
        var url = CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE;
        
        CCRestClient.request(url, inputData, 
            function(data){
              widget.user().countOfSubmittedOrders(data.numberOfOrders);
              },
            function(data) {
            });
      },
           updateAddressDetails: function() {
				var widget = this;
                
                widget.user().isShippingAddressBookModified(true);
            
                var isNickDuplicate = false;
                //var ck_name = /^[a-zA-Z\s'-,]+$/;
                //var name = widget.user().editShippingAddress().firstName();
              
                if (widget.koPetmateAddressEdited()) {
                    $.each(widget.user().shippingAddresses(), function (key, value) {
                        if (value.repositoryId() != widget.user().editShippingAddress().repositoryId) {
                            if (value.county() == widget.user().editShippingAddress().county()) {
                                $("#nickNameExist").css("display", "block");
                                isNickDuplicate = true;
                                return false;
                            }
                        }
                    })
                }
                else {
                    $.each(widget.user().shippingAddresses(), function (key, value) {

                        if (value.county() == widget.user().editShippingAddress().county()) {
                            $("#nickNameExist").css("display", "block");
                            isNickDuplicate = true;
                            return false;
                        }
                    })
                }


                if (isNickDuplicate) {
                    $('html, body').animate({
                        scrollTop: $('#myAccountAddressBook').offset().top
                      }, 1500)

                    return false;
                }
                $("#txtAddress323").focus().blur();
				
				widget.handleUpdateProfile();

               // ////console.log("getWidget.user() &&&&&&&&&&&&&&&&&&&&&&&", ko.toJS(getWidget.user()));


               /* var getShippingAddress = getWidget.user().editShippingAddress();
                
                
                var inputParams = {};
                 var test = getWidget.user().shippingAddressBook();
                 if (getWidget.koPetmateAddressEdited()) {
                    $.each(test, function (key, value) {
                        if (value.repositoryId != getWidget.user().editShippingAddress().repositoryId) {
                            
                        }
                    })
                 } else {
                    test.push(getShippingAddress);
                 }
                // ////console.log('Test!!!!!', test);
                inputParams[CCConstants.PROFILE_SHIPPING_ADDRESSES] = test;
                  
             //   ////console.log("User Object params $$$ ...  ",ko.toJS(inputParams));
                  
                getWidget.user().adapter.loadJSON(CCConstants.ENDPOINT_UPDATE_PROFILE, getWidget.user().id(), inputParams,
                 
                  function(data) {
                     if ($("#myaccount-profile").css("display") != "none") {
                        $('#passwordSuccessMessage').css("display", "block");
                        $("#defaultShippingAddressSuccess").css('display', 'none');
                    } else if ($("#myaccount-addressbook").css("display") != "none") {
                        $("#defaultShippingAddressSuccess").css('display', 'block');
                        $('#passwordSuccessMessage').css("display", "none");
                    }
                    
                    getWidget.clearForm();

                    getWidget.showViewProfile(true);
                  },
                  //error callback
                  function(data) {
                        //alert("HIT & RUN");
                  });

				*/
                
            },
            
             clearForm : function() {
                $('#txtAddressNickName12').val('');
                $('#txtFirstName22').val('');
                $('#txtLastName12').val('');
                $('#txtAddress123').val('');
                $('#txtAddress323').val('');
                $('#txtZip23').val('');
                $('#txtCity23').val('');
                $('#selectState23').val('');
                $('#txtPhoneNumber23').val('');
            },
        
            
        // for auto populating the address field in address book
            fillInAddress: function () {
                // Get the place details from the autocomplete object.
                var place = autocomplete.getPlace();
              //  ////console.log('Place', place);
                // Get each component of the address from the place details
                // and fill the corresponding field on the form.
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                  //  ////console.log('AddressType', addressType);
                    if (componentForm[addressType]) {
                        var value = place.address_components[i][componentForm[addressType]];
                        if (value == 'United States') {
                            value = "US";
                        }
                        if (addressType == 'street_number') {
                            i++;
                            var addressTypeRoute = 'route';
                            value = value + " " + place.address_components[i][componentForm[addressTypeRoute]];
                        }
                        $("#" + componentMapping[addressType]).val(value).change();
                    }
                    if (addressType == 'postal_code_suffix') {
                      //  var temp = $("#txtZip23").val() + "-" + place.address_components[i].long_name;
                        var temp = $("#txtZip23").val();
                        $("#txtZip23").val(temp).change();
                    }
                }
            },
            initAutocomplete: function () {
                // Create the autocomplete object, restricting the search to geographical
                // location types.  
                var options = {
                    types: ['geocode'],
                    componentRestrictions: {
                        country: "us"
                    }
                };
               //  ////console.log('Options', options);
                 autocomplete = new google.maps.places.Autocomplete((document.getElementById('txtAddress123')), options);
                // ////console.log('AUTOComplete Init', autocomplete);
                // ////console.log('place before', autocomplete.getPlace());
                // When the user selects an address from the dropdown, populate the address
                // fields in the form.
                
                autocomplete.addListener('place_changed', getWidget.fillInAddress);
            }
            
    };
  }
);
