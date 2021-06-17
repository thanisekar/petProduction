/**
 * @fileoverview footer Widget.
 * 
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'spinner', 'pubsub'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, spinner, pubsub) {

        "use strict";
        var getWidget = "";
        var emailval;
        var getPageId;
        return {

            linkList: ko.observableArray(),
            Email: ko.observable(null),
            koEmailSignupValue: ko.observable(''),
            onLoad: function(widget) {
                getWidget = widget;
                //Scroll to top
                $("body").delegate("#toTop", "click", function() {
                    $("html, body").animate({ scrollTop: 0 }, 1000);
                });
                $(window).scroll(function() {
                    if ($(this).scrollTop()) {
                        $('#toTop').fadeIn();
                    } else {
                        $('#toTop').fadeOut();
                    }
                });
                //Ends
                $.Topic("Spinner.memory").subscribe(function() {
                    widget.destroySpinner();
                });

                

                /* GTM tracking code */
                (function(w, d, s, l, i) {
                    w[l] = w[l] || [];
                    w[l].push({
                        'gtm.start': new Date().getTime(),
                        event: 'gtm.js'
                    });
                    var f = d.getElementsByTagName(s)[0],
                        j = d.createElement(s),
                        dl = l != 'dataLayer' ? '&l=' + l : '';
                    j.defer = true;
                    j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                    f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'dataLayer', 'GTM-PRSZPD');

                /* Gtm Tracking code ens here */


                /* steel house tracking pixel script starts*/
                var steelHouseTrackingPixel = '<script type="text/javascript">' +
                    '(function(){"use strict";var e=null,b="4.0.0",' +
                    'n="31153",' +
                    'additional="term=value",' +
                    't,r,i;try{t=top.document.referer!==""?encodeURIComponent(top.document.referrer.substring(0,2048)):""}catch(o){t=document.referrer!==null?document.referrer.toString().substring(0,2048):""}try{r=window&&window.top&&document.location&&window.top.location===document.location?document.location:window&&window.top&&window.top.location&&""!==window.top.location?window.top.location:document.location}catch(u){r=document.location}try{i=parent.location.href!==""?encodeURIComponent(parent.location.href.toString().substring(0,2048)):""}catch(a){try{i=r!==null?encodeURIComponent(r.toString().substring(0,2048)):""}catch(f){i=""}}var l,c=document.createElement("script"),h=null,p=document.getElementsByTagName("script"),d=Number(p.length)-1,v=document.getElementsByTagName("script")[d];if(typeof l==="undefined"){l=Math.floor(Math.random()*1e17)}h="dx.steelhousemedia.com/spx?"+"dxver="+b+"&shaid="+n+"&tdr="+t+"&plh="+i+"&cb="+l+additional;c.type="text/javascript";c.src=("https:"===document.location.protocol?"https://":"http://")+h;v.parentNode.insertBefore(c,v)})()' +
                    '</script>';
                $("body").append(steelHouseTrackingPixel);
                /* steel house tracking pixel script ends*/
                (function(i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function() {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.defer = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');


                 /*Google Analytics doskocilpetmate@gmail.com*/
                 $('head').prepend("<script defer src='https://www.googletagmanager.com/gtag/js?id=UA-155409198-1'></script>");
                 window.dataLayer = window.dataLayer || [];
                 window.gtag = function() {
                     dataLayer.push(arguments);
                 }
                 gtag('js', new Date());
                 gtag('config', 'UA-155409198-1'); // dosckocilpetmate@gmail.com GA code
                 gtag('config', 'AW-828992767'); //trimax tracking
                 /*Ends*/


                
                
                


                //Trimax Pubsub call
                $.Topic("trimaxOrder.memory").subscribe(function(trimaxOrderConfirmation) {
                    $("script[id='trimaxOrderId']").remove();
                    //console.log(trimaxOrderConfirmation,'trimaxOrderConfirmation');
                    if ($("script[id='trimaxOrderId']").length === 0) {
                        $("head").append(trimaxOrderConfirmation);
                    }

                });


                //Ends

                //Bronto Script


                var brontoHeaderScript = '<script bronto-popup-id="ab0a6242-1739-45c5-85b7-95652b63b808" src="https://cdn.bronto.com/popup/delivery.js"></script>'
               $("head").append(brontoHeaderScript);
               //Attentive Script

                var attentiveScript = '<script src="https://cdn.attn.tv/petmate/dtag.js"></script>'
               $("body").append(attentiveScript);
              //Bing Tracking Tag
               
              var bingTrackingScript = '<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"134203866"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>';
              $("head").append(bingTrackingScript);
              
                var brontoCommerceTag =
                    '<script data-name="__br_tm" type="text/javascript">' +
                    'var _bsw = _bsw || [];' +
                    '_bsw.push(["_bswId", "d7a4119bd35c40559d2b8aa3d30dc78576a0e02c41d9cc260680e24af76e53f1"]);' +
                    '(function() {' +
                    'var bsw = document.createElement("script");' +
                    'bsw.type = "text/javascript";' +
                    'bsw.async = true;' +
                    'bsw.src = ("https:" == document.location.protocol ? "https://" : "http://") + "js.bronto.com/c/aylvxl2i83pejg41ms09mzxajhp4vpldjj8cb7ip7ybjpc4w1h/d7a4119bd35c40559d2b8aa3d30dc78576a0e02c41d9cc260680e24af76e53f1/s/b.min.js";' +
                    'var t = document.getElementsByTagName("script")[0];' +
                    't.parentNode.insertBefore(bsw, t);' +
                    '})();' +
                    '</script>'
                $("head").append(brontoCommerceTag);
                //Ends


                $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                    //$("script[id='AddShoppers']").remove();
                    var n = document.getElementById("AddShoppers");
                    if (n !== null) {
                        if (window.AddShoppersWidget) {
                            AddShoppersWidget.API.reload();
                        }
                    } else {
                        var js = document.createElement("script");
                        js.type = "text/javascript";
                        js.async = true;
                        js.id = "AddShoppers"
                        js.src = ("https:" == document.location.protocol ? "https://shop.pe/widget/" : "http://cdn.shop.pe/widget/") + "widget_async.js#5a036113d559300b568becb7";
                        document.getElementsByTagName("head")[0].appendChild(js);
                    }
                });


                // save the links in an array for later
                widget.linkList.removeAll();
                for (var propertyName in widget.links()) {
                    widget.linkList.push(widget.links()[propertyName]);

                }

                $('body').on('click', '.footer-panel-heading', function() {
                    if (!$(this).siblings('.footer-panel-collapse').hasClass('active')) {
                        //console.log('not visible make it visible'); 
                        $(this).siblings('.footer-panel-collapse').slideDown(500).addClass('active');
                        $(this).find('.toggle_icon').removeClass("footer-plus-icon").addClass('footer-minus-icon');
                    } else if ($(this).siblings('.footer-panel-collapse').hasClass('active')) {
                        //console.log('make it visible');
                        $(this).siblings('.footer-panel-collapse').slideUp(500).removeClass('active');
                        $(this).find('.toggle_icon').removeClass("footer-minus-icon").addClass('footer-plus-icon');

                    }
                })







                /* email validation */


                widget.Email.extend({

                    pattern: {
                        params: /^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|me|mil|cc))/,
                        message: widget.translate('Please enter a valid email address.'),
                    }
                });
                widget.validationModel = ko.validatedObservable({
                    Email: widget.Email

                });


                /* email validation ends here */
                /*var emailVar = {}
       emailVar.emailId="testabcd@a.com" ;*/

                $("body").on("click", ".submitMail", function() {
                    //Bronto email signup
                    emailval = $("#emailSignUp").val();
                    widget.koEmailSignupValue(emailval);
                    $('#brontoEmailId').remove();
                    var brontoEmail = '<img id="brontoEmailId" src="https://app.bronto.com/public/?q=direct_add&fn=Public_DirectAddForm&id=bjoxunlmlfrmycqpxmpztvpnnlwkbof&email=' + getWidget.koEmailSignupValue() + '&&list1=0bcd03ec000000000000000000000019c915" width="0" height="0" border="0" alt=""/>'
                    $('body').append(brontoEmail);
                    //Ends
                    var modalInput = $("#emailAddressinPopUp").val();
                    var homeInput = $("#emailSignUp").val();
                    var inputVal = "";
                    if (modalInput) {
                        inputVal = modalInput;
                    } else {
                        inputVal = homeInput;
                    }
                    var objNew = { "emailId": inputVal.toString() };
                    // console.log(objNew);
                    if (getWidget.validationModel.isValid() && emailval !== "") {
                        $.ajax({
                            url: "https://services.petmate.com:9090/email/signup",
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(objNew),
                            success: function(response) {
                                //  console.log(response,'Success Message');
                                $('.success-msg').css('display', 'block');
                                $('.success-msg').fadeOut(8000);
                                $("#emailSignUp").val('');
                            }
                        });
                    } else {
                        //  console.log(".......email invalid.........")
                    }


                });

                $.Topic("SIDECAR_RELOAD.memory").subscribe(function() {
                    //console.log("SIDECAR_RELOAD subscribe...........");
                    //New Format
                    $("script[id='sideCarHome']").remove();
                    if ($("script[id='sideCarHome']").length === 0) {
                        var sideCarGlobal =
                            '<script id="sideCarHome">' +
                            '!function(s,i,d,e,c,a,r){' +
                            'a=s.createElement("script");' +
                            'a.async=1;' +
                            'a.setAttribute("data-id",i(d));' +
                            'a.setAttribute("data-domain",i(e));' +
                            'a.setAttribute("data-other",JSON.stringify(c));' +
                            'a.id="_SCJS_";' +
                            'a.src="https://d3v27wwd40f0xu.cloudfront.net/js/tracking/sidecar.js";' +
                            'r=s.getElementsByTagName("script")[0]||s.getElementsByTagName("body")[0];' +
                            'r.parentNode.insertBefore(a,r);' +
                            '}' +
                            '(document,encodeURI,937,".petmate.com",{});' +
                            '</script>'
                        $("body").append(sideCarGlobal);
                    }
                })

                //Ends

                /* Google customer review program script implementation starts here */
                $("body").append('<script src="https://apis.google.com/js/platform.js?onload=renderBadge" defer></script>');

                var renderBadge =
                    '<script>' +
                    'window.renderBadge = function() {' +
                    'var ratingBadgeContainer = document.createElement("div");' +
                    'document.body.appendChild(ratingBadgeContainer);' +
                    'window.gapi.load("ratingbadge", function(){' +
                    'window.gapi.ratingbadge.render(ratingBadgeContainer, {"merchant_id": 120624534,"position": "BOTTOM_RIGHT"});' +
                    '});' +
                    '}' +
                    '</script>';
                $("body").append(renderBadge);
                /* Google customer review program script implementation End here */
                /* BEGIN GCR Language Code */
                var gcrLanguageCode = '<script>' +
                    'window.___gcfg = {' +
                    'lang: "en_US"' +
                    '};' +
                    '</script>';
                $("body").append(gcrLanguageCode);
                /* End GCR Language Code */

                /* Google customer review program script implementation End here */
            },







            beforeAppear: function(page) {


                var axel = Math.random() + "";
                var a = axel * 10000000000000;
                var widget = this;
                
                
                if (window['ga']) {
                    ga('create', 'UA-92830133-1', 'auto');
                    ga('send', 'pageview');
                }

                /* critio home tag*/
                if (page.pageId == 'home') {
                    $("script[id='criteoHome']").remove();
                    if ($("script[id='criteoHome']").length === 0) {
                        var criteoHomePageTag =
                            '<script type="text/javascript" id="criteoHome">' +
                            'var dataLayer = dataLayer || [];' +
                            'dataLayer.push({' +
                            '"event":"HomePage",' +
                            '"PageType":"HomePage",' +
                            '"email":"' + getWidget.user().emailAddress() + '"' +
                            '});' +
                            '</script>';
                        $("head").append(criteoHomePageTag);
                    }
                }
                /* critio home tag*/

                /* critio tag*/

                $("script[id='CriterAllPgeTag']").remove();
                if ($("script[id='CriterAllPgeTag']").length === 0) {
                    var criteoAllPageTag =
                        '<script type="text/javascript" id="CriterAllPgeTag">' +
                        'var dataLayer = dataLayer || [];' +
                        'dataLayer.push({' +
                        '"email":"' + getWidget.user().emailAddress() + '"' +
                        '});' +
                        '</script>';
                    $("head").append(criteoAllPageTag);
                }

                /* critio tag*/












                /*Share A Sale*/
                //Master Tag
                $("script[id='shareSaleMasterId']").remove();
                if ($("script[id='shareSaleMasterId']").length === 0) {
                    var shareSaleMaster =
                    '<script src="https://www.dwin1.com/19038.js" type="text/javascript" defer="defer"></script>';
                    $("head").append(shareSaleMaster);
                }
                //Ends

                function shareasaleGetCookie(e) {
                    var r = e + "=";
                    var a = decodeURIComponent(document.cookie);
                    var o = a.split(";");
                    for (var n = 0; n < o.length; n++) {
                        var t = o[n];
                        while (t.charAt(0) == " ") { t = t.substring(1) }
                        if (t.indexOf(r) == 0) { return t.substring(r.length, t.length) }
                    }
                    return ""
                }
                shareasaleGetCookie();
                $('body').on('keyup', '#emailSignUp', function() {
                    //console.log("......on change......");
                    emailval = $("#emailSignUp").val();
                    $(".submit-btn").css('display', 'block');
                    // var focusInterval = setInterval(function(){
                    if (getWidget.validationModel.isValid() && emailval !== "") {



                        $("#emailAddressinPopUp").val(emailval);

                        //window.clearInterval(focusInterval);
                    } else {


                    }

                    //}, 50);
                });

                setTimeout(function() {
                    _GUARANTEE.ResetKickers();
                }, 2000)

            },
            destroySpinner: function() {
                setTimeout(function() {
                    //Adding class to add/remove border in   Fat Cat page  

                    if (getWidget.pageContext().page.name === "bigmamasroadtrip") {
                        $('#main').addClass('bigmamasroadtrip');

                    } else {
                        if ($('#main').hasClass('bigmamasroadtrip')) {
                            console.log('Checking');
                            $('#main').removeClass('bigmamasroadtrip');
                        }
                    }
                    $('#loadingModal').hide();
                    spinner.destroy();
                }, 100)

            },


            createSpinner: function(loadingText) {
                var indicatorOptions = {
                    parent: '#loadingModal',
                    posTop: '0',
                    posLeft: '50%'
                };
                var loadingText = " ";
                $('#loadingModal').removeClass('hide');
                $('#loadingModal').show();
                indicatorOptions.loadingText = loadingText;
                spinner.create(indicatorOptions);
            }


        };
    }
);