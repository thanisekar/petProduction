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
            phoneNum: ko.observable(null),
            onLoad: function(widget) {
                    
                    
                     /* email validation */


                widget.phoneNum.extend({

                    pattern: {
                        params: /^[0-9]+$/,
                        message: widget.translate('Please enter a phone number with no dashes or spaces'),
                    }
                });
                widget.validationModel = ko.validatedObservable({
                    phoneNum: widget.phoneNum

                });
            },

            beforeAppear: function(page) {
                
                
                $(function () {
                  $("#phone").keydown(function () {});
                  $("#phone").keyup(function () {});
                });
                // click on button submit
                $(".carousel-control-left,.carousel-control-right").on('click', function() {
                    $('#displayName').text($('#name').val());
                    $('#displayEmail').text($('#email').val());
                    $('#displayPhone').text($('#phone').val());
                    $('#orgName').text($('#hero').val());
                    $('#orgWeb').text($('#web').val());
                     $('#displaycityNstate').text($('#cityNstate').val());
                    $('#displaysomeName').text($('#someName').val());
                    $('#displaysomeEmail').text($('#someEmail').val());
                });
                $("#form").submit(function(e) {
                    e.preventDefault();
                    //console.log(JSON.stringify($("#form").serializeArray()),'JSON.stringify($("#form").serializeArray())');
                    $('.success-msg').css('display', 'block');
                    $('.success-msg').fadeOut(12000);
                    //Construct Input JSON     
                    var finalData = {};
                    $.each($('form').serializeArray(), function() {
                        finalData[this.name] = this.value;
                    });

                    // at this stage the result object will look as expected so you could use it
                    console.log(finalData, 'finalData1');

                    //return;
                    var inputData = {
                        "INSERT_GAMMA_JSON_DATA": {
                            "InputParameters": {
                                "RCV_DATA": {
                                    "RCV_DATA_ITEM": [
                                        finalData
                                    ]
                                }
                            }
                        }
                    }


                    console.log(inputData, 'inputData');
                    // send ajax
                    $.ajax({
                        url: "https://services.petmate.com:9090/gamma/gammaUser",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(inputData),
                        success: function(response) {

                            console.log(response);
                        },
                        error: function(xhr, resp, text) {
                            console.log(xhr, resp, text);
                        }
                    });




                });
            }

        };
    }
);