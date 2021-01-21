/**
 * @fileoverview footer Widget.
 * 
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, pubsub) {
  
    "use strict";
        var getWidget;
        var emailval;
        var getPageId;
    return {
        
      linkList:   ko.observableArray(),
      Email: ko.observable(null),
      onLoad: function(widget) { 
       //console.log("........onload calling.........");
          getWidget = widget;
          
        // save the links in an array for later
             widget.linkList.removeAll();
            for(var propertyName in widget.links()) {
              widget.linkList.push(widget.links()[propertyName]);
              
            }
        
            $('body').on( 'click', '.footer-panel-heading',function() {
                       if(!$(this).siblings('.footer-panel-collapse').hasClass('active')){
                            //console.log('not visible make it visible'); 
            			 	$(this).siblings('.footer-panel-collapse').slideDown(500).addClass('active');
            				$(this).find('.toggle_icon').removeClass("footer-plus-icon").addClass('footer-minus-icon');
            			}
        		      else  if($(this).siblings('.footer-panel-collapse').hasClass('active')){
            			    //console.log('make it visible');
            				$(this).siblings('.footer-panel-collapse').slideUp(500).removeClass('active');
            				$(this).find('.toggle_icon').removeClass("footer-minus-icon").addClass('footer-plus-icon');
            				
        			}
           })
        
        
        
   
        
                
                
            /* email validation */    
                
         
          widget.Email.extend({
                  
                  pattern: {
                    params: /^([\d\w-\.]+@([\d\w-]+\.)+(com|edu|org|net|ca|me))/,
                    message: widget.translate('Please enter a valid email address.'),
                  }
                });
           widget.validationModel = ko.validatedObservable({
                  Email: widget.Email
                  
                });
                
                
        /* email validation ends here */
        /*var emailVar = {}
       emailVar.emailId="testabcd@a.com" ;*/
        
        $("body").on("click",".submitMail", function(){
            
         //  console.log("......submit click......") 
           
           var modalInput = $("#emailAddressinPopUp").val();
           var homeInput = $("#emailSignUp").val();
           var inputVal  = "";
           if(modalInput){
               inputVal = modalInput;
           }
           else{
               inputVal = homeInput;
           }
           var objNew = {"emailId":inputVal.toString()};
          // console.log(objNew);
           if (getWidget.validationModel.isValid() && emailval !== "") {
            $.ajax({
            url: "https://services.petmate.com:9090/email/signup",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(objNew),
            success: function(response){
              //  console.log(response,'Success Message');
                $('.success-msg').css('display','block');
                $('.success-msg').fadeOut(8000);
                $("#emailSignUp").val('');
            }
        }); 
           }
           else{
             //  console.log(".......email invalid.........")
           }
           
           
        });
        
        $.Topic("SIDECAR_RELOAD.memory").subscribe(function(){
            console.log("SIDECAR_RELOAD subscribe...........");
            //New Format
             $("script[id='sideCarHome']").remove();
                      if ($("script[id='sideCarHome']").length === 0) {
                          var sideCarGlobal = 
                          '<script id="sideCarHome">'+ 
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
           /*window.renderBadge = function() {
               var ratingBadgeContainer = document.createElement("div");
               document.body.appendChild(ratingBadgeContainer);
               window.gapi.load("renderBadge", function(){
                   window.gapi.ratingbadge.render(ratingBadgeContainer, {"merchant_id": 120624534,"position": "BOTTOM_RIGHT"});
                   
               });
               
           } */    
           $("body").append('<script src="https://apis.google.com/js/platform.js?onload=renderBadge" async defer></script>');
           
      }, 
      
      
      
      
      
     
       beforeAppear: function(page) {


                var axel = Math.random() + "";
                var a = axel * 10000000000000;
                //Start of DoubleClick Floodlight Tag: Retargeting
                $("body").prepend('<iframe src="https://8236608.fls.doubleclick.net/activityi;src=8236608;type=retar0;cat=retar0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>');
                
                //Start of DoubleClick Floodlight Tag: Sale
                //Start of DoubleClick Floodlight Tag: Site Visit
                $("body").prepend('<iframe src="https://8236608.fls.doubleclick.net/activityi;src=8236608;type=sitev0;cat=sitev0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=1;num=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>');
             
        var widget=this;
            
         /* critio home tag*/        
        if(page.pageId=='home'){
                $("script[id='criteoHome']").remove();
                   if ($("script[id='criteoHome']").length === 0) {
            		 var criteoHomePageTag =  
                        '<script type="text/javascript" id="criteoHome">'+
                        'var dataLayer = dataLayer || [];'+
                        'dataLayer.push({'+
                        '"event":"HomePage",'+
                        '"PageType":"HomePage",'+
                        '"email":"'+ getWidget.user().emailAddress() + '"'+
                        '});'+
                        '</script>';
                        $("head").append(criteoHomePageTag);
    		     }
        }
            /* critio home tag*/        
            
           /* critio tag*/  
            
         $("script[id='CriterAllPgeTag']").remove();
            if ($("script[id='CriterAllPgeTag']").length === 0) {
               var criteoAllPageTag =  
                '<script type="text/javascript" id="CriterAllPgeTag">'+
                'var dataLayer = dataLayer || [];'+
                'dataLayer.push({'+
                '"email":"'+ getWidget.user().emailAddress() + '"'+
                '});'+
                '</script>';
                $("head").append(criteoAllPageTag);
               }
               
                /* critio tag*/    
          
               
               /* GTM tracking code */
          
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer',widget.gtmID());
                
                /* Gtm Tracking code ens here */
                    
                   /* steel house tracking pixel script starts*/
                    var steelHouseTrackingPixel = '<script type="text/javascript">'+
            	            '(function(){"use strict";var e=null,b="4.0.0",'+
            	            'n="21400",'+
            	            'additional="term=value",'+
            	            't,r,i;try{t=top.document.referer!==""?encodeURIComponent(top.document.referrer.substring(0,2048)):""}catch(o){t=document.referrer!==null?document.referrer.toString().substring(0,2048):""}try{r=window&&window.top&&document.location&&window.top.location===document.location?document.location:window&&window.top&&window.top.location&&""!==window.top.location?window.top.location:document.location}catch(u){r=document.location}try{i=parent.location.href!==""?encodeURIComponent(parent.location.href.toString().substring(0,2048)):""}catch(a){try{i=r!==null?encodeURIComponent(r.toString().substring(0,2048)):""}catch(f){i=""}}var l,c=document.createElement("script"),h=null,p=document.getElementsByTagName("script"),d=Number(p.length)-1,v=document.getElementsByTagName("script")[d];if(typeof l==="undefined"){l=Math.floor(Math.random()*1e17)}h="dx.steelhousemedia.com/spx?"+"dxver="+b+"&shaid="+n+"&tdr="+t+"&plh="+i+"&cb="+l+additional;c.type="text/javascript";c.src=("https:"===document.location.protocol?"https://":"http://")+h;v.parentNode.insertBefore(c,v)})()'+
                            '</script>';
                            $("body").append(steelHouseTrackingPixel);
            /* steel house tracking pixel script ends*/  
            
                /* Add Ad Shoppers Pixel script starts */
                var js = document.createElement("script"); js.type = "text/javascript"; js.async = true; js.id = "AddShoppers";
                js.src = ("https:" == document.location.protocol ? "https://shop.pe/widget/" : "http://cdn.shop.pe/widget/") + "widget_async.js#5a036113d559300b568becb7";
                document.getElementsByTagName("head")[0].appendChild(js);
                /* Add Ad Shoppers Pixel script ends */
            
               
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                
                  ga('create', 'UA-92830133-1', 'auto');
                  ga('send', 'pageview');
          
          
 
               
               /*Google Pixel*/
               

                $('head').prepend("<script async src='https://www.googletagmanager.com/gtag/js?id=AW-1035470412'></script>");
                window.dataLayer = window.dataLayer || []; 
                window.gtag = function() {
                    dataLayer.push(arguments);
                }
                gtag('js', new Date()); 
                gtag('config', 'AW-1035470412'); 
               
               
               /*Ends*/


                /* Google customer review program script implementation starts here */
                
                //$("body").append('<script src="https://apis.google.com/js/platform.js?onload=renderBadge" async defer></script>');
                
                    /*var renderBadge = 
                      '<script>' +
                    	'window.renderBadge = function() {' +
                    	'var ratingBadgeContainer = document.createElement("div");' +
                    	'document.body.appendChild(ratingBadgeContainer);' +
                    	'window.gapi.load("renderBadge", function(){' +
                    	'window.gapi.ratingbadge.render(ratingBadgeContainer, {"merchant_id": 120624534,"position": "BOTTOM_RIGHT"});' +
                    	'});' +
                    	'}' +
                    	'</script>';
                    	$("body").append(renderBadge);*/
                    	
                    	
                    	//BEGIN GCR Language Code -->
                        var gcrLang = "<script>window.___gcfg = {lang: 'en_US'};</script>";
                        $("body").append(gcrLang);
                        //<!-- END GCR Language Code -->

                /* google customer review implementation ends here */
               /*Ends*/

               
              $('body').on( 'keyup','#emailSignUp', function() {
                  console.log("......on change......");
                  emailval = $("#emailSignUp").val();
                  $(".submit-btn").css('display', 'block');
                  // var focusInterval = setInterval(function(){
                  if (getWidget.validationModel.isValid() && emailval !== "") {
                     
                     
                      
                      $("#emailAddressinPopUp").val(emailval);
                 
                     //window.clearInterval(focusInterval);
                    }
                    else{
                       
                         
                    }
                     
                    //}, 50);
              });
              
           
       }
      
      
    };
  }
);
