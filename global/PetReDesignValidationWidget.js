/**
 * @fileoverview  Petmate Custom Validation Widget.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccResourceLoader!global/jquery.validate', 'ccResourceLoader!global/jquery.additional-methods'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko) {
        window.createaccountForm = "";
        window.userLoginForm = "";
        window.geustUserForm = "";
        window.customGuestUserForm = "";
        window.checkoutLoginForm = "";
        window.checkoutCreateAccountForm = "";
        window.forgotPasswordForm = "";
        window.customerProfileForm = "";
        window.CustomerProfilePasswordForm = "";
        window.CustomerMyaccountAddressBookForm = "";
        window.editProfileForm = "";
        window.changePasswordFormValidate = "";
        window.forgotPwd = "";
        window.loginCheckoutForm = "";
        window.CustomerCheckoutAddressBookForm = "";
        window.CustomerBillingAddressBookForm = "";
        window.checkoutPaymentFormValidate = "";
        window.checkoutBTPaymentFormValidate = "";
        window.anonymousOrderForm = "";


        function userLogin() {
            $.validator.addMethod("loginFormemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "Invalid entry. Please enter valid email address, for example, john@smith.com.");

            userLoginForm = $("#loginForm").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    loginEmail: {
                        required: true,
                        loginFormemailFormat: true
                    },
                    loginPassword: {
                        required: true,
                    }
                },
                messages: {
                    loginEmail: {
                        required: "please enter an email.",
                        loginFormemailFormat: "This value should be a valid email."
                    },
                    loginPassword: {
                        required: "Please enter password."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
        };

        function forgotPasswordEmail() {
            $.validator.addMethod("forgotPasswordemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            forgotPwd = $("#forgotPassword").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    emailaddress: {
                        required: true,
                        forgotPasswordemailFormat: true
                    }
                },
                messages: {
                    emailaddress: {
                        required: "Please enter an email."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                }

            })
        };

        function createaccount() {
            $.validator.addMethod("createaccountemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("passwordPattern", function(value, element) {
                return this.optional(element) || value.match(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]))).{7,25}$/);
            }, "Password should be a minimum of 7 characters including 1 number & 1 uppercase letter. Please re-enter a new password using this criteria.");

            createaccountForm = $("#registerForm").validate({
                onfocusout: true,
                onkeyup: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    firstname: {
                        required: true,
                        allowCharacters: true
                    },
                    lastname: {
                        required: true,
                        allowCharacters: true
                    },
                    petname0: {
                        allowCharacters: true
                    },
                    petname1: {
                        allowCharacters: true
                    },
                    petbreed0: {
                        allowCharacters: true
                    },
                    petbreed1: {
                        allowCharacters: true
                    },
                    emailaddress: {
                        required: true,
                        createaccountemailFormat: true
                    },
                    confirmEmail: {
                        required: true,
                        createaccountemailFormat: true,
                        equalTo: "#CC-login-email"
                    },
                    password: {
                        required: true,
                        passwordPattern: true

                    },
                    confirmPassword: {
                        required: true,
                        passwordPattern: true,
                        equalTo: "#CCuserRegistration-password"
                    },
                    terms: {
                        required: true
                    }

                },
                messages: {
                    firstname: {
                        required: "Please enter first name."
                    },
                    lastname: {
                        required: "Please enter last name."
                    },
                    emailaddress: {
                        required: "Please enter an email."
                    },
                    confirmEmail: {
                        required: "You must verify your email address",
                        equalTo: "Your email address must match."
                    },
                    password: {
                        required: "Please enter password."
                    },
                    confirmPassword: {
                        required: "Please enter confirm password.",
                        equalTo: "This value should be the same."
                    },
                    terms: {
                        required: "This checkbox is required"
                    }

                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },

            });
            validatedob();
        };

        function validatedob() {
            $.validator.addMethod("futureDate", function(value, element) {
                var currentDate = new Date();
                var selectedDate = new Date(value);
                return this.optional(element) || selectedDate < currentDate;;
            }, "Can not enter a future date for Date of Birth");

            $('.petBirthday').each(function() {
                $(this).rules("add", {
                    futureDate: true,
                    messages: {
                        required: "Can not enter a future date for Date of Birth"
                    },
                });
            });
            $('.UserBirthday').each(function() {
                $(this).rules("add", {
                    futureDate: true,
                    messages: {
                        required: "Can not enter a future date for Date of Birth"
                    },
                });
            });
        };

        /* Profile page validation Starts */
        function editprofile() {
            $.validator.addMethod("editprofileemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("phoneUS", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 &&
                    value.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
            }, "Please enter phone number.");


            $.validator.addMethod("maskedPhone", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 && value.match(/^((\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4})|\(_{3}\) (_{3})-(_{4})|\(\s{3}\) (\s{3})-(\s{4})|\(\) -$/);
            }, "Please enter phone number.");

            $.validator.addMethod('numericOnly', function(value) {
                return /^[0-9]+$/.test(value);
            }, 'This value should be digits.');
            $.validator.addMethod('zipcodeNumber', function(value) {
                return /^[0-9]+$/.test(value);
            }, 'Please enter a valid Zip Code.');


            editProfileForm = $("#profileUpdateForm").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var len = form.target.length
                        for (var i = 0; i < len; i++) {
                            if ($(form.target[i]).hasClass('petBirthday')) {
                                var dob = $(form.currentTarget[i]);

                                if (dob.hasClass('error')) {
                                    $('html, body').animate({
                                        scrollTop: $("body").offset().top
                                    }, 1000);
                                }


                            } else {
                                validator.errorList[0].element.focus();
                            }
                        }

                    }
                },
                rules: {
                    firstname: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2,
                        maxlength: 40,
                    },
                    lastname: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2,
                        maxlength: 40,
                    },
                    emailaddress: {
                        required: true,
                        editprofileemailFormat: true,
                        minlength: 2,
                        maxlength: 100,
                    },
                    phonenumber: {
                        required: true,
                        //digits:true,
                        maskedPhone: true,
                        minlength: 10,
                        maxlength: 12,
                        phoneUS: true
                    },
                    zipcode: {
                        digits: true,
                        minlength: 5,
                        maxlength: 5,
                    }

                },
                messages: {
                    firstname: {
                        required: "Please enter first name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    lastname: {
                        required: "Please enter last name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    emailaddress: {
                        required: "Please enter an email.",
                    },
                    phonenumber: {
                        digits: "This value should be digits.",
                        minlength: "Your entry is not correct, please check your input."
                    },
                    zipcode: {
                        digits: "This value should be digits.",
                        minlength: "Please enter a valid Zip Code."
                    }

                },

                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },

            });
            callDynamicPetProfileValidate();
            $("#editProfilePhoneNumber").mask("999-999-9999");
        };

        function callDynamicPetProfileValidate() {
            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, function(value, element) {
                $(element).parents('.pet-add').find(".commonError").html('');
                return "Only letters, space, - or ' are allowed. Please check your input."
            });
            $.validator.addMethod("allowCharacters1", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");
            $.validator.addMethod("futureDate", function(value, element) {
                var currentDate = new Date();
                var selectedDate = new Date(value);
                return this.optional(element) || selectedDate < currentDate;
            }, "Can not enter a future date for Date of Birth");
            $('.petBreed').each(function() {
                $(this).rules("add", {
                    allowCharacters1: true,
                    minlength: 2,
                    maxlength: 40,
                    messages: {
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    }
                });
            });
            $('.pet-add-section').each(function() {
                //console.log("%%%%%%%%%%% DynaMic Pet Profile %%%%%%%%%");
                var self = this;
                $(self).find('.petname').rules("add", {
                    required: $(self).find('.petType')[0].selectedIndex != 0 ? true : false,
                    allowCharacters: true,
                    minlength: 2,
                    messages: {
                        required: function(value, element) {
                            $(element).parents('.pet-add').find(".commonError").html("Please enter pet name to save pet details.");
                            return ""
                        },
                        minlength: function(value, element) {
                            $(element).parents('.pet-add').find(".commonError").html('');
                            return "This value length is invalid. It should be between 2 and 40 characters long."
                        }
                    }
                });
            });
            $('.pet-add-section').each(function() {
                var self = this;
                $(self).find('.petType').rules("add", {
                    required: $(self).find('.petname').val() != "" ? true : false,
                    allowCharacters: true,
                    messages: {
                        required: function(value, element) {
                            $(element).parents('.pet-add').find(".commonError").html("Please enter pet type to save pet details.");
                            return ""
                        }
                    }
                });
            });
            $('.petBirthday').each(function() {
                $(this).rules("add", {
                    futureDate: true,
                    messages: {
                        required: "Can not enter a future date for Date of Birth"
                    },
                });
            });
            $('.UserBirthday').each(function() {
                $(this).rules("add", {
                    futureDate: true,
                    messages: {
                        required: "Can not enter a future date for Date of Birth"
                    },
                });
            });
        };

        /* Change Password Section Validation Starts */
        function changePasswordMethod() {
            $.validator.addMethod("passwordPattern", function(value, element) {
                return this.optional(element) || value.match(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]))).{7,25}$/);
            }, "Password must be a minimum of 7 characters including 1 uppercase letter and 1 number.");

            changePasswordFormValidate = $("#change-password-form").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    oldpassword: {
                        required: true,
                        passwordPattern: true
                    },
                    newpassword: {
                        required: true,
                        passwordPattern: true
                    },
                    passwordconfirm: {
                        required: true,
                        passwordPattern: true,
                        equalTo: "#createNewPassword-password"
                    },

                },
                messages: {
                    oldpassword: {
                        required: "Please enter password."
                    },
                    newpassword: {
                        required: "Please enter password."
                    },
                    passwordconfirm: {
                        required: "This value is required.",
                        equalTo: "This value should be the same"
                    },

                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
                submitHandler: function(form) {
                    // do other things for a valid form
                    form.submit();
                },
            });

        };
        /* Change Password Section Validation ends */

        /* MyAccount AddressBook section validation starts */
        function CustomerMyaccountAddressBook() {

            $.validator.addMethod("validateCity", function(value, element) {
                return this.optional(element) || value.match(/^[A-Za-z0-9?\s,.-]+$/);
            }, "Allows 1-30 alphanumeric characters, '.','-' and blank space.");

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("address", function(value, element) {
                return this.optional(element) || value.match(/^[a-z0-9 .\-#/,]+$/i);
            }, "Allows alphanumeric characters, '.','/','-','#' and bank space.");

            $.validator.addMethod("phoneUS", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 &&
                    //value.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
                    value.match(/^\d{3}-\d{3}-\d{4}$/);
            }, "Please enter phone number.");

            $.validator.addMethod('numericOnly', function(value) {
                return /^[0-9]+$/.test(value);
            }, 'Please enter a phone number with no dashes or spaces');

            $.validator.addMethod("nickNameValidation", function(value, element) {
                return this.optional(element) || value.length < 51;
            }, "This value is too long. It should have 50 characters or fewer.");

            $.validator.addMethod("zipcodeUS", function(value, element) {
                return this.optional(element) || /^((\d{5}-\d{4})|(\d{5})|([A-Z]\d[A-Z]\s\d[A-Z]\d))$/.test(value)
            }, "Please enter a valid Zip Code.");

            $.validator.addMethod("maskedPhone", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 && value.match(/^((\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4})|\(_{3}\) (_{3})-(_{4})|\(\s{3}\) (\s{3})-(\s{4})|\(\) -$/);
            }, "Please enter phone number.");

            CustomerMyaccountAddressBookForm = $("#myAccountAddressBook").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    txtAddressNickName12: {
                        required: true,
                        minlength: 3,
                        nickNameValidation: true
                    },
                    txtFirstName22: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtLastName12: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtAddress123: {
                        required: true,
                        address: true,
                        minlength: 3
                    },

                    txtCity23: {
                        required: true,
                        validateCity: true,
                        minlength: 2
                    },
                    country: {
                        required: true,
                    },
                    selectState23: {
                        required: true,
                    },
                    txtZip23: {
                        required: true,
                        zipcodeUS: true,
                        minlength: 5
                    }
                    ,
                    txtPhoneNumber23: {
                        required: true,
                        numericOnly: true,
                        maskedPhone: false,
                        minlength: 10,
                        maxlength: 12
                        //maskedPhone:true
                   }
                },


                messages: {
                    txtAddressNickName12: {
                        required: "Please enter a nickname for your address.",
                        minlength: "This value is too short. It should have 3 characters or more."

                    },
                    txtFirstName22: {
                        required: "Please enter first name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtLastName12: {
                        required: "Please enter last name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtAddress123: {
                        required: "Please enter shipping address.",
                        minlength: "This value length is invalid. It should be between 3 and 50 characters long."
                    },
                    country: {
                        required: "Please enter country."
                    },
                    txtCity23: {
                        required: "Please enter city.",
                        minlength: "This value length is invalid. It should be between 2 and 30 characters long."

                    },
                    selectState23: {
                        required: "Please select a state."
                    },
                    txtZip23: {
                        required: "Please enter zip Code.",
                        minlength: "Zip code should look like 99999 or 99999-9999"
                    },
                    txtPhoneNumber23: {
                        required: "Please enter valid phone number.",
                        minlength: "Your entry is not correct, please check your input.",
                        maxlength: "Your entry is not correct, please check your input."

                    },
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                }
            });
            //$("#txtPhoneNumber23").mask("999-999-9999");
        };
        /* MyAccount AddressBook section validation ends */

        /* Pet Information section Validation starts */
        function petProfileValidationMethod() {
            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");
            $.validator.addMethod("allowCharacters1", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");
            $.validator.addMethod("futureDate", function(value, element) {
                var currentDate = new Date();
                var selectedDate = new Date(value);
                return this.optional(element) || selectedDate < currentDate;
            }, "Can not enter a future date for Date of Birth");

            editPetProfileValidation = $("#editPetProfile").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    petName: {
                        required: true,
                    },
                    petType: {
                        required: true,

                    },
                    petGender: {

                    },
                    petBreed: {
                        allowCharacters1: true,
                        minlength: 2,
                        maxlength: 40,

                    },
                    petDOB: {
                        futureDate: true,
                    }
                },
                messages: {
                    petName: {
                        required: "please enter pet name to save pet details."
                    },
                    petType: {
                        required: "please enter pet type to save pet details."
                    },
                    petGender: {

                    },
                    petBreed: {
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    petDOB: {

                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                }
            });
        };
        /* Pet Information section Validation ends */

        /* Profile page validation ends */


        /* Checkout Page validation Starts */
        function checkoutGuestEmail() {
            //console.log("checkoutGuestEmail");
            $.validator.addMethod("guestUseremailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            customGuestUserForm = $("#checkoutGuestForm").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    email: {
                        required: true,
                        guestUseremailFormat: true
                    },
                    confirmEmail: {
                        required: true,
                        guestUseremailFormat: true,
                        equalTo: "#CC-checkoutRegistration-email"
                    }
                },
                messages: {
                    email: {
                        required: "Please enter an email."
                    },
                    confirmEmail: {
                        required: "You must verify your email address",
                        equalTo: "Your email address must match."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                    if ($(element).valid()) {

                    }
                },
                onkeydown: function(element) {
                    $(element).valid();
                }
            });
        };

        function checkoutCreateAccount() {
            $.validator.addMethod("checkoutCreateAccountemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("passwordPattern", function(value, element) {
                return this.optional(element) || value.match(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]))).{7,25}$/);
            }, "Password should be a minimum of 7 characters including 1 number & 1 uppercase letter. Please re-enter a new password using this criteria.");


            checkoutCreateAccountForm = $("#checkoutCreateAccountForm").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    firstname: {
                        required: true,
                        allowCharacters: true
                    },
                    lastname: {
                        required: true,
                        allowCharacters: true
                    },
                    password: {
                        required: true,
                        passwordPattern: true

                    },
                    confirmPassword: {
                        required: true,
                        passwordPattern: true,
                        equalTo: "#CCuserRegistration-password"
                    }

                },
                messages: {
                    firstname: {
                        required: "Please enter first name."
                    },
                    lastname: {
                        required: "Please enter last name."
                    },
                    password: {
                        required: "Please enter password."
                    },
                    confirmPassword: {
                        required: "Please enter confirm password.",
                        equalTo: "This value should be the same."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
        };

        function CustomerCheckoutAddressBook() {
            $.validator.addMethod("validateCity", function(value, element) {
                return this.optional(element) || value.match(/^[A-Za-z0-9?\s,.-]+$/);
            }, "Allows 1-30 alphanumeric characters, '.','-' and blank space.");


            $.validator.addMethod("allowCharacters", function(value, element) {

                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("address", function(value, element) {
                return this.optional(element) || value.match(/^[a-z0-9 .\-#/,]+$/i);
            }, "Allows alphanumeric characters, '.','/','-','#' and bank space.");

            $.validator.addMethod("phoneUS", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 &&
                    //value.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
                    value.match(/^\d{3}-\d{3}-\d{4}$/);
            }, "Please enter phone number.");

            $.validator.addMethod('numericOnly', function(value) {
                return /^[0-9]+$/.test(value);
            }, 'Please enter a phone number with no dashes or spaces');


            $.validator.addMethod("nickNameValidation", function(value, element) {
                return this.optional(element) || value.length < 51;
            }, "This value is too long. It should have 50 characters or fewer.");

            $.validator.addMethod("zipcodeUS", function(value, element) {
                return this.optional(element) || /^((\d{5}-\d{4})|(\d{5})|([A-Z]\d[A-Z]\s\d[A-Z]\d))$/.test(value)
            }, "Please enter a valid Zip Code.");



            $.validator.addMethod("maskedPhone", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 && value.match(/^((\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4})|\(_{3}\) (_{3})-(_{4})|\(\s{3}\) (\s{3})-(\s{4})|\(\) -$/);
            }, "Please enter phone number.");

            CustomerCheckoutAddressBookForm = $("#checkoutAddressBook").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    txtAddressNickName3: {
                        required: true,
                        nickNameValidation: true,
                        minlength: 3

                    },
                    txtFirstName3: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtLastName3: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtAddress31: {
                        required: true,
                        address: true,
                        minlength: 3
                    },

                    txtCity3: {
                        required: true,
                        validateCity: true,
                        minlength: 2
                    },
                    country: {
                        required: true,
                    },
                    selectState3: {
                        required: true,
                    },
                    txtZip3: {
                        required: true,
                        zipcodeUS: true,
                        minlength: 5
                    },
                    txtPhoneNumber3: {
                        required: true,
                        numericOnly: true,
                        maskedPhone: false,
                        minlength: 10,
                        maxlength: 12
                        //maskedPhone:true
                    }
                },
                messages: {
                    txtAddressNickName3: {
                        required: "Please enter a nickname for your address.",
                        minlength: "This value is too short. It should have 3 characters or more."

                    },
                    txtFirstName3: {
                        required: "Please enter first name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtLastName3: {
                        required: "Please enter last name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtAddress31: {
                        required: "Please enter address 1.",
                        minlength: "This value length is invalid. It should be between 3 and 50 characters long."
                    },
                    country: {
                        required: "Please enter country."
                    },
                    txtCity3: {
                        required: "Please enter city.",
                        minlength: "This value length is invalid. It should be between 2 and 30 characters long."
                    },
                    selectState3: {
                        required: "Please select a state."
                    },
                    txtZip23: {
                        required: "Please enter zip Code.",
                        minlength: "Zip code should look like 99999 or 99999-9999"
                    },
                    txtPhoneNumber3: {
                        required: "Please enter valid phone number.",
                        minlength: "Your entry is not correct, please check your input.",
                        maxlength: "Your entry is not correct, please check your input."

                    },
                },
                onfocusout: function(element) {
                    $(element).valid();
                    if ($(element).valid()) {}
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
           // $("#txtPhoneNumber3").mask("999-999-9999");
        };

        function CustomerBillingAddressBook() {
            $.validator.addMethod("validateCity", function(value, element) {
                return this.optional(element) || value.match(/^[A-Za-z0-9?\s,.-]+$/);
            }, "Allows 1-30 alphanumeric characters, '.','-' and blank space.");

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");

            $.validator.addMethod("address", function(value, element) {
                return this.optional(element) || value.match(/^[a-z0-9 .\-#/,]+$/i);
            }, "Allows alphanumeric characters, '.','/','-','#' and bank space.");

            $.validator.addMethod("maskedPhone", function(value, element) {
                value = value.replace(/\s+/g, "");
                return this.optional(element) || value.length > 9 && value.match(/^((\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4})|\(_{3}\) (_{3})-(_{4})|\(\s{3}\) (\s{3})-(\s{4})|\(\) -$/);
            }, "Please enter phone number.");

            $.validator.addMethod('numericOnly', function(value) {
                return /^[0-9]+$/.test(value);
            }, 'Please enter a phone number with no dashes or spaces');

            $.validator.addMethod("nickNameValidation", function(value, element) {
                return this.optional(element) || value.length < 51;
            }, "This value is too long. It should have 50 characters or fewer.");

            $.validator.addMethod("zipcodeUS", function(value, element) {
                return this.optional(element) || /^((\d{5}-\d{4})|(\d{5})|([A-Z]\d[A-Z]\s\d[A-Z]\d))$/.test(value)
            }, "Please enter a valid Zip Code.");

            CustomerBillingAddressBookForm = $("#billingAddressBook").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    txtAddressNickName121: {
                        required: true,
                        minlength: 3,
                        nickNameValidation: true
                    },
                    txtFirstName221: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtLastName121: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    },
                    txtAddress1234: {
                        required: true,
                        address: true,
                        minlength: 3
                    },

                    txtCity231: {
                        required: true,
                        validateCity: true,
                        minlength: 2
                    },
                    country1: {
                        required: true,
                    },
                    selectState231: {
                        required: true,
                    },
                    txtZip231: {
                        required: true,
                        zipcodeUS: true,
                        minlength: 5
                    },
                    txtPhoneNumber231: {
                        required: true,
                        numericOnly: true,
                        maskedPhone: false,
                        minlength: 10,
                        maxlength: 12
                    }

                },

                messages: {
                    txtAddressNickName121: {
                        required: "Please enter a nickname for your address",
                        minlength: "This value is too short. It should have 3 characters or more."

                    },
                    txtFirstName221: {
                        required: "Please enter first name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtLastName121: {
                        required: "Please enter last name.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    },
                    txtAddress1234: {
                        required: "Please enter address 1.",
                        minlength: "This value length is invalid. It should be between 3 and 50 characters long."
                    },
                    country1: {
                        required: "Please enter country"
                    },
                    txtCity231: {
                        required: "Please enter city.",
                        minlength: "This value length is invalid. It should be between 2 and 30 characters long."

                    },
                    selectState231: {
                        required: "Please select a state."
                    },
                    txtZip231: {
                        required: "Please enter zip Code.",
                        minlength: "Zip code should look like 99999 or 99999-9999"
                    },
                    txtPhoneNumber231: {
                        required: "Please enter phone number.",
                        minlength: "Your entry is not correct, please check your input.",
                        maxlength: "Your entry is not correct, please check your input."
                    },
                },
                onfocusout: function(element) {
                    $(element).valid();
                    if ($(element).valid()) {

                    }
                },
                onkeydown: function(element) {
                    $(element).valid();
                }
            });
            //$("#txtPhoneNumber231").mask("999-999-9999");
        };

        function checkoutuserLogin() {
            $.validator.addMethod("checkoutuserLoginemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "This value should be a valid email.");

            checkoutLoginForm = $("#checkoutLoginForm").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    loginEmail: {
                        required: true,
                        checkoutuserLoginemailFormat: true
                    },
                    loginPwd: {
                        required: true
                    }
                },
                messages: {
                    loginEmail: {
                        required: "Please enter an email.",
                        checkoutuserLoginemailFormat: "This value should be a valid email."
                    },
                    loginPwd: {
                        required: "Please enter password."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
        };

        function checkoutBTPaymentMethod() {
            //console.log("checkoutBTPaymentMethod...........")
            

            $.validator.addMethod("allowCharacters", function(value, element) {
                return this.optional(element) || value.match(/^[a-zA-Z\s'-,]+$/);
            }, "Only letters, space, - or ' are allowed. Please check your input.");


            checkoutBTPaymentFormValidate = $("#bt-payment-form").validate({
                onfocusout: false,
                //focusInvalid: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var firstInvalidElement = $(validator.errorList[0].element);
                        $('html,body').scrollTop(firstInvalidElement.offset().top - 200);
                        firstInvalidElement.focus();
                    }
                },

                rules: {
                    nameOnCard: {
                        required: true,
                        allowCharacters: true,
                        minlength: 2
                    }
                    /*cardType: {
                        required: true
                    }*/

                },
                messages: {
                    nameOnCard: {
                        required: "Name on card is required.",
                        minlength: "This value length is invalid. It should be between 2 and 40 characters long."
                    }
                    /*cardType: {
                        required: "Card Type is mandatory."
                    }*/
                },
                success: function(label) {
                    label.text("").removeClass("error").addClass("success");
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            }); // validate ends here
        };

        function checkoutPaymentMethod() {
            $.validator.addMethod("creditCardValidate", function(value, element) {
                var chkCard = detectCardTypeNumber(value, "#CC-checkoutPaymentDetails-cardType");
                if (chkCard != undefined) {
                    return true;
                } else {
                    return false;
                }

            }, "Invalid card number. Please check the card type and the card number.");

            checkoutPaymentFormValidate = $("#checkoutPaymentForm").validate({
                onfocusout: false,
                focusInvalid: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();

                    if (errors) {
                        var firstInvalidElement = $(validator.errorList[0].element);
                        $('html,body').scrollTop(firstInvalidElement.offset().top - 200);

                        firstInvalidElement.focus();
                    }
                },

                rules: {
                    nameOnCard: {
                        required: true
                    },
                    cardType: {
                        required: true,
                    },
                    cardNumber: {
                        required: true,
                        creditCardValidate: true,
                        digits: true
                    },
                    cardCVV: {
                        required: true,
                        digits: true,
                        minlength: 3
                    },
                    endMonth: {
                        required: true
                    },
                    endYear: {
                        required: true
                    }

                },
                messages: {
                    nameOnCard: {
                        required: "Name on Card is required."
                    },
                    cardType: {
                        required: "Card Type is required."
                    },
                    cardNumber: {
                        required: "Card Number is required."
                    },
                    cardCVV: {
                        required: "CVV is required.",
                        minlength: "Security Code should be 3-4 characters."
                    },
                    endMonth: {
                        required: "Expiration Month required."
                    },
                    endYear: {
                        required: "Expiration Year required."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
        };
        /* Checkout Page validation ends */

        /* Anonymous Order status validation starts */
        function anonymousOrder() {
            $.validator.addMethod("anonymousOrderemailFormat", function(value, element) {
                return this.optional(element) || value.match(/^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|in|gov|mil|cc|me))/);
            }, "Invalid entry. Please enter valid email address, for example, john@smith.com.");
            anonymousOrderForm = $("#anonymousOrderDetail").validate({
                onfocusout: false,
                invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        validator.errorList[0].element.focus();
                    }
                },
                rules: {
                    orderNumber: {
                        required: true,
                    },
                    email: {
                        required: true,
                        anonymousOrderemailFormat: true
                    }
                },
                messages: {
                    orderNumber: {
                        required: "Please enter order number."
                    },
                    email: {
                        required: "Please enter an email.",
                        anonymousOrderemailFormat: "This value should be a valid email."
                    }
                },
                onfocusout: function(element) {
                    $(element).valid();
                },
                onkeydown: function(element) {
                    $(element).valid();
                },
            });
        };
        /* Anonymous Order status validation starts */


        /* maskInput js starts*/
        function maskPhoneNumber() {
            function getPasteEvent() {
                var el = document.createElement('input'),
                    name = 'onpaste';
                el.setAttribute(name, '');
                return (typeof el[name] === 'function') ? 'paste' : 'input';
            }

            var pasteEventName = getPasteEvent() + ".mask",
                ua = navigator.userAgent,
                iPhone = /iphone/i.test(ua),
                android = /android/i.test(ua),
                caretTimeoutId;

            $.mask = {
                //Predefined character definitions
                definitions: {
                    '9': "[0-9]",
                    'a': "[A-Za-z]",
                    '*': "[A-Za-z0-9]"
                },
                dataName: "rawMaskFn",
                placeholder: '_',
            };

            $.fn.extend({
                //Helper Function for Caret positioning
                caret: function(begin, end) {
                    var range;

                    if (this.length === 0 || this.is(":hidden")) {
                        return;
                    }

                    if (typeof begin == 'number') {
                        end = (typeof end === 'number') ? end : begin;
                        return this.each(function() {
                            if (this.setSelectionRange) {
                                this.setSelectionRange(begin, end);
                            } else if (this.createTextRange) {
                                range = this.createTextRange();
                                range.collapse(true);
                                range.moveEnd('character', end);
                                range.moveStart('character', begin);
                                range.select();
                            }
                        });
                    } else {
                        if (this[0].setSelectionRange) {
                            begin = this[0].selectionStart;
                            end = this[0].selectionEnd;
                        } else if (document.selection && document.selection.createRange) {
                            range = document.selection.createRange();
                            begin = 0 - range.duplicate().moveStart('character', -100000);
                            end = begin + range.text.length;
                        }
                        return {
                            begin: begin,
                            end: end
                        };
                    }
                },
                unmask: function() {
                    return this.trigger("unmask");
                },
                mask: function(mask, settings) {
                    var input,
                        defs,
                        tests,
                        partialPosition,
                        firstNonMaskPos,
                        len;

                    if (!mask && this.length > 0) {
                        input = $(this[0]);
                        return input.data($.mask.dataName)();
                    }
                    settings = $.extend({
                        placeholder: $.mask.placeholder, // Load default placeholder
                        completed: null
                    }, settings);


                    defs = $.mask.definitions;
                    tests = [];
                    partialPosition = len = mask.length;
                    firstNonMaskPos = null;

                    $.each(mask.split(""), function(i, c) {
                        if (c == '?') {
                            len--;
                            partialPosition = i;
                        } else if (defs[c]) {
                            tests.push(new RegExp(defs[c]));
                            if (firstNonMaskPos === null) {
                                firstNonMaskPos = tests.length - 1;
                            }
                        } else {
                            tests.push(null);
                        }
                    });

                    return this.trigger("unmask").each(function() {
                        var input = $(this),
                            buffer = $.map(
                                mask.split(""),
                                function(c, i) {
                                    if (c != '?') {
                                        return defs[c] ? settings.placeholder : c;
                                    }
                                }),
                            focusText = input.val();

                        function seekNext(pos) {
                            while (++pos < len && !tests[pos]);
                            return pos;
                        }

                        function seekPrev(pos) {
                            while (--pos >= 0 && !tests[pos]);
                            return pos;
                        }

                        function shiftL(begin, end) {
                            var i,
                                j;

                            if (begin < 0) {
                                return;
                            }

                            for (i = begin, j = seekNext(end); i < len; i++) {
                                if (tests[i]) {
                                    if (j < len && tests[i].test(buffer[j])) {
                                        buffer[i] = buffer[j];
                                        buffer[j] = settings.placeholder;
                                    } else {
                                        break;
                                    }

                                    j = seekNext(j);
                                }
                            }
                            writeBuffer();
                            input.caret(Math.max(firstNonMaskPos, begin));
                        }

                        function shiftR(pos) {
                            var i,
                                c,
                                j,
                                t;

                            for (i = pos, c = settings.placeholder; i < len; i++) {
                                if (tests[i]) {
                                    j = seekNext(i);
                                    t = buffer[i];
                                    buffer[i] = c;
                                    if (j < len && tests[j].test(t)) {
                                        c = t;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }

                        function keydownEvent(e) {
                            var k = e.which,
                                pos,
                                begin,
                                end;

                            //backspace, delete, and escape get special treatment
                            if (k === 8 || k === 46 || (iPhone && k === 127)) {
                                pos = input.caret();
                                begin = pos.begin;
                                end = pos.end;

                                if (end - begin === 0) {
                                    begin = k !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
                                    end = k === 46 ? seekNext(end) : end;
                                }
                                clearBuffer(begin, end);
                                shiftL(begin, end - 1);

                                e.preventDefault();
                            } else if (k == 27) { //escape
                                input.val(focusText);
                                input.caret(0, checkVal());
                                e.preventDefault();
                            }
                        }

                        function keypressEvent(e) {
                            var k = e.which,
                                pos = input.caret(),
                                p,
                                c,
                                next;

                            if (e.ctrlKey || e.altKey || e.metaKey || k < 32) { //Ignore
                                return;
                            } else if (k) {
                                if (pos.end - pos.begin !== 0) {
                                    clearBuffer(pos.begin, pos.end);
                                    shiftL(pos.begin, pos.end - 1);
                                }

                                p = seekNext(pos.begin - 1);
                                if (p < len) {
                                    c = String.fromCharCode(k);
                                    if (tests[p].test(c)) {
                                        shiftR(p);

                                        buffer[p] = c;
                                        writeBuffer();
                                        next = seekNext(p);

                                        if (android) {
                                            setTimeout($.proxy($.fn.caret, input, next), 0);
                                        } else {
                                            input.caret(next);
                                        }

                                        if (settings.completed && next >= len) {
                                            settings.completed.call(input);
                                        }
                                    }
                                }
                                e.preventDefault();
                            }
                        }

                        function clearBuffer(start, end) {
                            var i;
                            for (i = start; i < end && i < len; i++) {
                                if (tests[i]) {
                                    buffer[i] = settings.placeholder;
                                }
                            }
                        }

                        function writeBuffer() {
                            input.val(buffer.join(''));
                        }

                        function checkVal(allow) {
                            //try to place characters where they belong
                            var test = input.val(),
                                lastMatch = -1,
                                i,
                                c;

                            for (i = 0, pos = 0; i < len; i++) {
                                if (tests[i]) {
                                    buffer[i] = settings.placeholder;
                                    while (pos++ < test.length) {
                                        c = test.charAt(pos - 1);
                                        if (tests[i].test(c)) {
                                            buffer[i] = c;
                                            lastMatch = i;
                                            break;
                                        }
                                    }
                                    if (pos > test.length) {
                                        break;
                                    }
                                } else if (buffer[i] === test.charAt(pos) && i !== partialPosition) {
                                    pos++;
                                    lastMatch = i;
                                }
                            }
                            if (allow) {
                                writeBuffer();
                            } else if (lastMatch + 1 < partialPosition) {
                                input.val("");
                                clearBuffer(0, len);
                            } else {
                                writeBuffer();
                                input.val(input.val().substring(0, lastMatch + 1));
                            }
                            return (partialPosition ? i : firstNonMaskPos);
                        }

                        input.data($.mask.dataName, function() {
                            return $.map(buffer, function(c, i) {
                                return tests[i] && c != settings.placeholder ? c : null;
                            }).join('');
                        });

                        if (!input.attr("readonly"))
                            input
                            .one("unmask", function() {
                                input
                                    .unbind(".mask")
                                    .removeData($.mask.dataName);
                            })
                            .bind("focus.mask", function() {
                                clearTimeout(caretTimeoutId);
                                var pos,
                                    moveCaret;

                                focusText = input.val();
                                pos = checkVal();

                                caretTimeoutId = setTimeout(function() {
                                    writeBuffer();
                                    if (pos == mask.length) {
                                        input.caret(0, pos);
                                    } else {
                                        input.caret(pos);
                                    }
                                }, 10);
                            })
                            .bind("blur.mask", function() {
                                checkVal();
                                if (input.val() != focusText)
                                    input.change();
                            })
                            .bind("keydown.mask", keydownEvent)
                            .bind("keypress.mask", keypressEvent)
                            .bind(pasteEventName, function() {
                                setTimeout(function() {
                                    var pos = checkVal(true);
                                    input.caret(pos);
                                    if (settings.completed && pos == input.val().length)
                                        settings.completed.call(input);
                                }, 0);
                            });
                        checkVal(); //Perform initial check for existing values
                    });
                }
            });
        };
        /*maskInput js ends*/

        function detectCardTypeNumber(number, cardType) {
            var re = {
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/,
                amex: /^3[47][0-9]{13}$/,
                discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,

            };
            if ($(cardType).val() === "") {
                return undefined;
            } else if ($(cardType).val() == "amex") {
                if (re.amex.test(number)) {
                    return 'AMEX';
                } else {
                    return undefined;
                }
            } else if ($(cardType).val() == "mastercard") {
                if (re.mastercard.test(number)) {
                    return 'MASTERCARD';
                } else {
                    return undefined;
                }
            } else if ($(cardType).val() == "visa") {
                if (re.visa.test(number)) {
                    return 'VISA';
                } else {
                    return undefined;
                }
            } else if ($(cardType).val() == "discover") {
                if (re.discover.test(number)) {
                    return 'DISCOVER';
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        }

        return {
            onLoad: function(widget) {
                maskPhoneNumber();
                
                $.Topic("getUserLoginForm.memory").subscribe(function() {
                    userLogin();
                });
                $.Topic("getforGetPwdForm.memory").subscribe(function() {
                    forgotPasswordEmail();
                });
                $.Topic("valdiateDOB").subscribe(function() {
                    validatedob();
                });
                $.Topic("getregisterFormValidate.memory").subscribe(function(e) {
                    createaccount();
                });
                $.Topic("editProfileFormValidate.memory").subscribe(function(e) {
                    editprofile();
                });
                $.Topic("callDynamicPetProfileVal.memory").subscribe(function() {
                    callDynamicPetProfileValidate();
                });
                $.Topic("changePasswordFormValidate.memory").subscribe(function() {
                    changePasswordMethod();
                });
                $.Topic("myAccountAddressBoxFormValidate.memory").subscribe(function() {
                    CustomerMyaccountAddressBook();
                });
                $.Topic("petInfoFormValidate.memory").subscribe(function() {
                    petProfileValidationMethod();
                });
                $.Topic("addCheckoutAddressFormValid.memory").subscribe(function() {
                    CustomerCheckoutAddressBook();
                });
                $.Topic("checkoutAddBillingAddress.memory").subscribe(function() {
                    CustomerBillingAddressBook();
                });
                $.Topic("customGuestUserFormValidate.memory").subscribe(function() {
                    checkoutGuestEmail();
                });
                $.Topic("checkoutCreateAccountFormValidate.memory").subscribe(function() {
                    checkoutCreateAccount();
                });
                $.Topic("customerCheckoutAddressBookFormValidate.memory").subscribe(function() {
                    CustomerCheckoutAddressBook();
                });
                $.Topic("customerBillingAddressBookFormValidate.memory").subscribe(function() {
                    CustomerBillingAddressBook();
                });
                $.Topic("checkoutLoginFormValidate.memory").subscribe(function() {
                    checkoutuserLogin();
                });
                $.Topic("checkoutBTPaymentDetails.memory").subscribe(function() {
                    checkoutBTPaymentMethod();
                });
                $.Topic("anonymousOrderDetailForm.memory").subscribe(function() {
                    anonymousOrder();
                });
                $.Topic("checkoutPaymentDetails").subscribe(function() {
                    checkoutPaymentMethod();
                });
            },
        };
    }
);