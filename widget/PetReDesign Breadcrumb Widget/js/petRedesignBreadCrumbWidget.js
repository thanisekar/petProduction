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
        var getWidget = "";
        var brandId = "";
        return {
            koPageId: ko.observable(''),
            koContextId: ko.observable(''),
            koTitle: ko.observable(''),
            koSearchText: ko.observable(''),
            koMyAccountAddressBook: ko.observable(false),
            koProductData: ko.observableArray(),
            koBrandName : ko.observable(),
            koBrandPage: ko.observableArray([]),
            onLoad: function(widget) {
                getWidget = widget;
                //console.log("user $$$$$$$$$", ko.toJS(widget.user()))
            },

            beforeAppear: function(page) {
                //console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTtt');
                //console.log(page , '-----------------page breadcrumb widget ');
                //console.log(page.pageId , '-----------------page page.pageId ');
                //console.log(page.contextId , '---contextId----------------');
            
                getWidget.koPageId(page.pageId);
              
                getWidget.koProductData([]);
                getWidget.koContextId(page.contextId);
                if(page.contextId == "brand-Chuckit") {
                    getWidget.koBrandName('Chuckit!®');
                }
                else if(page.contextId == "brand-jackson-galaxy") {
                    getWidget.koBrandName('Jackson Galaxy®');
                }
                else if(page.contextId == "brand-jw") {
                    getWidget.koBrandName('JW Pet®');
                }
                else if(page.contextId == "brand-dogzilla") {
                    getWidget.koBrandName('Dogzilla®');
                }
                else if(page.contextId == "brand-aspenpet") {
                    getWidget.koBrandName('Aspen Pet®');
                }
                else if(page.contextId == "brand-wwe") {
                    getWidget.koBrandName('WWE®');
                }
                else if(page.contextId == "brandonmcmillan") {
                    getWidget.koBrandName('Brandon Mcmillan®');
                }
                 else if(page.contextId == "petmate") {
                    getWidget.koBrandName('Petmate®');
                }
                else {
                    getWidget.koBrandName("");
                }
                if(page.pageId == "searchresults") {
                   // //console.log('getNtt!!!!!!!!!', getNtt);
                     if(getWidget.getUrlParameter("Ntt")!=null) {
                         var getNtt = getWidget.getUrlParameter("Ntt");
                         var setNtt = "";
                        getNtt = getNtt.replace(/%20/gi, " ");
                       // //console.log('getNtt1111!!!!!!!!!', getNtt);
                        if(getNtt.indexOf("%7C") != -1) {
                            getNtt = getNtt.split("%7C");
                            setNtt = getNtt[1];
                        } else {
                            setNtt = getNtt;
                        }
                        setNtt = decodeURIComponent(setNtt);
                         getWidget.koSearchText(setNtt);
                    }
                    else if(getWidget.getUrlParameter("brand")!=null) {
                           var brandName = getWidget.getUrlParameter("brand");
                           //console.log(brandName, '----brandName---');
                            if(brandName == "brand-Chuckit") {
                                getWidget.koBrandName('Chuckit!®');
                            }
                            else if(brandName == "brand-jackson-galaxy") {
                                getWidget.koBrandName('Jackson Galaxy®');
                            }
                            else if(brandName == "brand-jw") {
                                getWidget.koBrandName('JW Pet®');
                            }
                            else if(brandName == "brand-dogzilla") {
                                getWidget.koBrandName('Dogzilla®');
                            }
                            else if(brandName == "brand-aspenpet") {
                                getWidget.koBrandName('Aspen Pet®');
                            }
                            else if(brandName== "brand-wwe") {
                                getWidget.koBrandName('WWE®');
                            }
                            else if(brandName== "brandonmcmillan") {
                                getWidget.koBrandName('Brandon Mcmillan®');
                            }
                            else if(brandName== "petmate") {
                                getWidget.koBrandName('Petmate®');
                            }
                            else {
                                getWidget.koBrandName("");
                            }
                    }
                     //console.log("setNtt ^^^^^", setNtt)
                   
                }
               if(page.pageId == "profile") {
                   getWidget.getProfileParameter();
                  
                }
                /*setTimeout(function(){
                    if ($(window).width() > 640) {
                        if(page.pageId == "Checkout-Login") {
                            
                            $('#CC-petmatebreadcrumbWidget').parent().css('margin-bottom','0px');
                        }
                    }
                },500);
                setTimeout(function(){
                    if ($(window).width() < 640) {
                        if(page.pageId == "checkout") {
                            $('#CC-petmatebreadcrumbWidget').css('display','none');
                            $('#CC-petmatebreadcrumbWidget').parent().css('display','none');
                        }
                    }
                },2000);*/

                getWidget.koBrandPage([]);
                if(page.pageId.indexOf("-about") !=-1) {
                    brandId = "";
                    getWidget.koBrandPage([]);
                    var splitBrand = page.pageId.split("-about");
                    brandId = splitBrand[0];
                     if(brandId == "brand-Chuckit") {
                        getWidget.koBrandPage.push({"brandName": "Chuckit!&#174;", "brandUrl": "/brand-landing/"+brandId});
                     } else if(brandId == "brand-jackson-galaxy") {
                        getWidget.koBrandPage.push({"brandName": "Jackson Galaxy&#8482;", "brandUrl": "/brand-landing/"+brandId});
                     } else if(brandId == "brand-jw") {
                        getWidget.koBrandPage.push({"brandName": "JW Pet&#174;", "brandUrl": "/brand-landing/"+brandId});
                     } else if(brandId == "brand-dogzilla") {
                        getWidget.koBrandPage.push({"brandName": "Dogzilla&#174;", "brandUrl": "/brand-landing/"+brandId});
                     } else if(brandId == "brand-aspenpet") {
                        getWidget.koBrandPage.push({"brandName": "Aspen Pet&#174;", "brandUrl": "/brand-landing/"+brandId});
                     } else if(brandId == "brand-wwe") {
                        getWidget.koBrandPage.push({"brandName": "WWE&#174;", "brandUrl": "/brand-landing/"+brandId});
                     } 
                }

                $.Topic("getProfileAddressPage").subscribe(function() {
                    getWidget.getProfileParameter();
                });

            },
            getProfileParameter: function() {
               var getprofileUrl = window.location.hash.substr(1);
                if(getprofileUrl == "addressbook") {
                    getWidget.koMyAccountAddressBook(true);
                } else {
                    getWidget.koMyAccountAddressBook(false);
                }
            },
	        getUrlParameter: function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results==null){
                   return null;
                }
                else{
                   return results[1] || 0;
                }
              }
            
              
             
        };
    }
);