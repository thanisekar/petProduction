/**
 * @fileoverview Footer Widget.
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
  function (ko) {

    "use strict";
	var getWidget = "";
    return {
         kogetBrandPageId:ko.observable(true),
		onLoad: function(widget) {
		},

		beforeAppear: function(page) {         
			  var widget=this;
			  //New pixel traacking on 03/27/2020
        $("script[id='facebookTrackingPlp']").remove();
        if ($("script[id='facebookTrackingPlp']").length === 0) {
            var facebookTrackingPlp = 
            '<script id="facebookTrackingPlp">' +
                '!function(f,b,e,v,n,t,s)' +
                '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?' +
                'n.callMethod.apply(n,arguments):n.queue.push(arguments)};' +
                'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";' +
                'n.queue=[];t=b.createElement(e);t.async=!0;' +
                't.src=v;s=b.getElementsByTagName(e)[0];' +
                's.parentNode.insertBefore(t,s)}(window, document,"script",' +
                ' "https://connect.facebook.net/en_US/fbevents.js");' +
                'fbq("init", "585915662011996");' +
                'fbq("track", "PageView");' +
                '</script>' +
                '<noscript><img height="1" width="1" style="display:none"' +
                'src="https://www.facebook.com/tr?id=585915662011996&ev=PageView&noscript=1"' +
                '/></noscript>';
                
                var linqiaPLP = '<img src="https://linqia.ooh.li/c/d52af8ce2c478721.png"/> <script src="https://linqia.ooh.li/c/d52af8ce2c478721.js"></script>'
            $("head").append(facebookTrackingPlp,linqiaPLP);
        }
        //Ends
			if(page.contextId.indexOf('brand-') == 0){
		        widget.kogetBrandPageId(false);
		    }
		    else{
		         widget.kogetBrandPageId(true);
		    }
	    
		},
		
	
	
		
    };
  }
);
