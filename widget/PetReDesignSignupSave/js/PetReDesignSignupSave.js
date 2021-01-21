/**
 * @fileoverview Petmate Breadcrumb Widget.
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
    function(ko) {

        "use strict";
        return {
            onLoad: function(widget) {
                $("body").on("click", ".subscribe", function() {


                    console.log('Submit');
                    var modalInput = $(".fb-email").val();
                    var objNew = {
                        "emailId": modalInput.toString()
                    };

                    $.ajax({
                        url: "https://services.petmate.com:9090/email/signup",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(objNew),
                        success: function(response) {}
                    });


                });
            },

            beforeAppear: function(page) {

            }

        };
    }
);