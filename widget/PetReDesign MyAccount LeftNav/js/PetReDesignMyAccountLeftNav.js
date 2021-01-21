/**
 * @fileoverview petmate My Account Left Nav WWidget.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, t) {

        "use strict";
        var getWidget = "";
        var getPath = "";
        var toggleMenuLink = "";
        
        
        return {
            koIsLoggedinUser: ko.observable(),
            koOnlineClasses: ko.observable(''),
            onLoad: function(widget) {
                getWidget = widget;
                getWidget.koIsLoggedinUser = ko.pureComputed(function() {
                    if (getWidget.user().loggedIn()) {
                        $(".myaccount-leftnav").parent().parent().removeClass("hide");
                    } else {
                        $(".myaccount-leftnav").parent().parent().addClass("hide");
                    }
                    return getWidget.user().loggedIn();
                }).extend({
                    notify: 'always'
                });
                getWidget.koIsLoggedinUser.subscribe(function(newValue) { 
            
                })
                
            },

            beforeAppear: function(page) {
                $('.myaccount-listing').find('.main-link').click(function(e) {
                
                    $(this).children('ul').slideToggle('fast');
                    
                });
                $('.myaccount-listing').promise().done(function() {
                    getWidget.selectNav();
                  });
                

                $("body").on( "click", ".myaccount-left-link",function(e) {
                    
                        // console.log('....page Ready...')
                        getWidget.selectNav();
                    
                });
                
             
                
            },
            myaccountLeftNavSelected: function(){
               $.Topic(t.topicNames.PAGE_READY).subscribe(function() {
                     getWidget.selectNav();
             }) 
                
                    
            },
            selectNav: function() {
                getPath = window.location.pathname + window.location.hash;
                $(".myaccount-listing li").removeClass("selected");
             /*   $.Topic("myaccount-leftnav-address-click").publish("success");
                $.Topic("myaccount-leftnav-payment-click").publish("success");*/
                var selectedId = "";
                $('#passwordSuccessMessage').css("display","none");
				$("#defaultShippingAddressSuccess").css('display','none');
				$('#profileSuccessMessage').css("display","none");
				
				 $.Topic(t.topicNames.PAGE_READY).subscribe(function() {
				//      console.log('....page Ready...');
                if (getPath == "/profile") {
                    $(".my-account").hide();
                    $("#" + $("#myaccount-link-profile").attr("data-target")).show();
                    $("#myaccount-link-profile").parent().addClass("selected");
                    selectedId = $("#myaccount-link-profile");
                    $.Topic("getProfileAddressPage").publish("success");
                }  
                   else if (getPath == "/orderHistory") {
                    $("#myaccount-link-orderhistory").parent().addClass("selected");
                    selectedId = $("#myaccount-link-orderhistory");
                }
                
                    else if (getPath == "/wishlist") {
                        $("#myaccount-link-wishlist").parent().addClass("selected");
                        selectedId = $("#myaccount-link-wishlist");
                    } 
                    else {
                        $(".my-account").hide();
                        $("#" + $("#myaccount-link-profile").attr("data-target")).show();
                        $("#myaccount-link-profile").parent().addClass("selected");
                        selectedId = $("#myaccount-link-profile");
                        $.Topic("getProfileAddressPage").publish("success");
                    }
                }); 
              /*  if ($(window).width() < 991) {
                    $("#myAccountMobileTxt").html(selectedId.html());
                    $(".myaccount-listing").hide();
                    $("#myAccountMobilelnk").find(".my-account-angle-arrow").removeClass("fa-angle-down").addClass("fa-angle-right");
                }*/
            }
        };
    }
);