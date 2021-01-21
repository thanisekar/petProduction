/**
 * @fileoverview idex Mega Menu Widget.
 *
 * @author Taistechwouapy
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  // Adding knockout
  //-------------------------------------------------------------------
  ['jquery', 'knockout','spinner','pubsub','ccRestClient' , "ccConstants", 'ccResourceLoader!global/jquery.multilevelpushmenu', 'storageApi'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, spinner, pubsub, r , ccConstants , megaMenuPushMenu, storageApi) {

    "use strict";

	var widgetCateoryImages;
	var categoryData,CategoryImageData;
	var getRootCategoryId=[];
	var getBrandCollectionId='';
    var brandRefinementResults='';
    var getBrandListId='';
    var currentWidget = null;
    var getSaleUrl='';
    
	/****** MenuStructure Config ****/
          var menuStructure = {
            "dogs": {
                "template": "template1",
                "categoryImage": true,
                "categoryImageUrl": "/file/collections/dogs_menuimage.jpg",
                "columns": [{
                        "column": ["L1-accessoriesL2-dog-accessories", "L1-apparelL2-dog-apparel", "L1-beddingL2-dog-beds"]
                    },
                    {
                        "column": ['L1-collars-leashesL2-dog-collars-leashes', 'L1-feeding-wateringL2-dog-feeding-watering']
                    },
                    {
                        "column": ["L1-groomingL2-dog-grooming", 'L1-kennels-carriersL2-dog-kennels-carriers', 'L1-sheltersL2-dog-shelters']
                    },
                    {
                        "column": ['L1-toysL2-dog-toys', 'L1-travelL2-dog-travel', "L1-waste-managementL2-dog-waste-management"]
                    }
                ]
            },
            "cats": {
                "template": "template1",
                "categoryImage": true,
                "categoryImageUrl": "/file/collections/cats_menuimage.jpg",
                "columns": [{
                        "column": ['L1-accessoriesL2-cat-accessories', 'L1-beddingL2-cat-beds', 'L1-collars-leashesL2-cat-collars-leashes', 'L1-feeding-wateringL2-cat-feeding-watering']
                    },
                    {
                        "column": ['L1-groomingL2-cat-grooming', 'L1-kennels-carriersL2-cat-kennels-carriers', 'L1-sheltersL2-cat-shelters']
                    },
                    {
                        "column": ['L1-toysL2-cat-toys', 'L1-travelL2-cat-travel', 'L1-waste-managementL2-cat-waste-management']
                    }
                ]
            },
            "birds": {
                "template": "template1",
                "categoryImage": true,
                "categoryImageUrl": "/file/collections/birds_menuimage.jpg",
                "columns": [{
                    "column": ['L1-accessoriesL2-bird-accessories', 'L1-feeding-wateringL2-bird-feeding-watering', 'L1-groomingL2-bird-grooming', 'L1-sheltersL2-bird-shelter', 'L1-toysL2-bird-toys']
                }, ]
            }
         /*  "petmate-brands":{
                "template": "template2",
                "categoryImage": true,
                "categoryImageUrl": '/file/collections/petmate-brands_menuimage.jpeg',
                "columns": [{
                        "column": ['brand-aspenpet', 'brand-armandhammer', 'brand-booda', 'brand-brandonmcMillan','brand-calmz' ,'brand-Chuckit']
                    },
                    {
                        "column": ['brand-dogzilla', 'brand-fatcat' ,'brand-jackson-galaxy', 'brand-jw', 'brand-muttnation', 'brand-petmate']
                    },
                    {
                        "column": ['brand-precisionpetproducts', 'brand-ruffmaxx', 'brand-wetnoz', 'brand-wouapy','brand-wwe','brand-lazboy' ]
                    }
                 ]
               }*/
            
        
        };
        
		/****** MenuStructure Config ends ****/
	
    return {
		koMenuModelData: ko.observableArray(),
		koCategoryImageData:ko.observableArray(),
		categoryImage : ko.observable(false),
		koCategoryImage:ko.observableArray([]),
		brandList:ko.observableArray([]),
		koMenuStructure:ko.observable(menuStructure),
		koCategoryData:ko.observable(),
        koGuidedNavigationStateAndNValue:ko.observableArray([]),
        kofinalCategories:ko.observableArray([]),
		koOnsale:ko.observable(),
		getChildCategoriesId: ko.observableArray([]),
		kobrandImages:ko.observableArray(),
		updateData: function (getData) {
			ko.mapping.fromJS(getData,{}, this.koMenuModelData );
		
		},
		

		
		updateCategoryImageData:function(getCategoryImageData){
		    ko.mapping.fromJS(getCategoryImageData,{}, this.koCategoryImageData );
		    
		 
		  
		},
		
		
		onLoad: function(widget) {
		  //Megamenu hide on Click Fix
		  
            $('body').on('click', '.subCatagoryLevel1 a, .brand-images a, .cc-desktop-dropdown .dropdown-toggle',  function(){
                $(".subCatagory").css("display", "none");
            });
		    $('body').on('mouseenter', '.cc-desktop-dropdown .dropdown-toggle', function(){
		        $(".subCatagory").css("display", "none");
                $(this).next().css("display", "block");
            });
            $('body').on('mouseleave', '.cc-desktop-dropdown .dropdown-toggle',  function(){
                $(this).next().css("display", "none");
            });
            $('body').on('mouseenter', '.subCatagory',  function(){
                $(this).css("display", "block");
            });
		  $('body').on('mouseleave', '.subCatagory',  function(){
                $(this).css("display", "none");
            });
		  
		  
		  
		  
		  //Ends
		    
		
		},
	
		beforeAppear: function(page) {
		    var widget=this;
			 widget.createSpinner();
			 widget.kobrandImages(this.fields().split(','));
         	$.Topic("Spinner.memory").publish('success');
		      
			var lastDataCacheTimeStamp = storageApi.getInstance().getItem("lastDataCacheTimeStamp");
			if(!lastDataCacheTimeStamp) {
				lastDataCacheTimeStamp = 0;
			}
			
			function checkAndCacheData(refreshData) {
				if(refreshData) {
					var d = new Date();
					var n = d.getTime();
					storageApi.getInstance().setItem("lastDataCacheTimeStamp", n);
					
				}
				if(refreshData || !storageApi.getInstance().getItem("megamenuData")) {
					var url = window.location.hostname;
					var params = {};
					params['fields'] = "childCategories,childCategories.id,childCategories.displayName,childCategories.route,childCategories.childCategories,childCategories.childCategories.id,childCategories.childCategories.displayName,childCategories.childCategories.route,childCategories.childCategories.childCategories.id,childCategories.childCategories.childCategories.displayName,childCategories.childCategories.childCategories.route";
					params['disableActiveProdCheck'] = true;
					params['catalogId'] = "cloudCatalog";
					params['maxLevel'] = 1000;
					params['expand'] = "childCategories";

					r.authenticatedRequest('/ccstoreui/v1/collections/rootCategory', params, function(data1) {
						storageApi.getInstance().setItem("megamenuData", JSON.stringify(data1));
						generateMegamenu(data1);
					});
				} else {
					var getMegaMenu = JSON.parse(storageApi.getInstance().getItem("megamenuData"))
					generateMegamenu(getMegaMenu);
				}
            }			
		    
		    function generateMegamenu(data1) {
				CategoryImageData=[]; 
			   var l={}; 
				$.each(data1.childCategories, function(key, value) {
				 
					var childDisplayName = value.displayName;
					var childId =value.id;
					if (childId == 'dogs') {
						if (value.childCategories.length > 0) {
							for (var i = 0; i < value.childCategories.length; i++) {
								value.childCategories[i].displayName = value.childCategories[i].displayName.replace('dog ', '').trim();
							}
						}
					}
					if (childId == 'cats') {
						if (value.childCategories.length > 0) {
							for (var j = 0; j < value.childCategories.length; j++) {
								value.childCategories[j].displayName = value.childCategories[j].displayName.replace('cat ', '').trim();
							}
						}
					}
					if (childId =='birds') {
						if (value.childCategories.length > 0) {
							for (var k = 0; k < value.childCategories.length; k++) {
								value.childCategories[k].displayName = value.childCategories[k].displayName.replace('bird ', '').trim();
							}
						}
					}

					if (childId == 'petmate-brands') {
						getBrandListId='';
						getBrandListId =childId;
					  
					}
				});
				widget.renderMobileMenuNew();
				widget.updateData(data1.childCategories);
			}
           
			r.authenticatedRequest("/ccstoreui/v1/publish",{},
			function(data) {
				//console.log("publish data...............", data);
				var clearCache = false;
				if((data.lastPublishedTimeStamp * 1) >  (lastDataCacheTimeStamp * 1)) {
					clearCache = true;
				}
			//	console.log("clearCache...............", clearCache);
			//	console.log("clearCache...............", data.lastPublishedTimeStamp , lastDataCacheTimeStamp);
				checkAndCacheData(clearCache);
			}, function(data) {
				checkAndCacheData(true);
			});
		      
		      
		      
		      currentWidget = this;
    		  $('body').on( 'touchstart','.mobileProfilelogoutLinks', function(){
		        $("#CC-loginHeader-logout").trigger('click');
		    });
		      $('body').on('click','.mobileProfilelogoutLinks',  function(){
		        $("#CC-loginHeader-logout").trigger('click');
		    });
		    
		   $('body').on( 'touchstart', '.menu-close',function(){
		        $('.menu-close').trigger('click'); 
		    });
		    
		    $('body').on( 'mouseover','.dropdown-toggle', function(){
		           $('.dropdown-toggle').parent().find('.dropdown-toggle').children().addClass('greyColor');
		           $(this).parent().find('.dropdown-toggle').children().removeClass('greyColor');
		      
		    });
		      $('body').on( 'mouseleave','.dropdown-toggle', function(){
		        $('.dropdown-toggle').parent().find('.dropdown-toggle').children().removeClass('greyColor');
		    });
		    
	
		},
    destroySpinner: function() {
        //  //console.log("destroyed");
          $('#loadingModal').hide();
          spinner.destroy();
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
          },
		testHeight : function(){
		    if($('ul.nav.navbar-nav > li').length > currentWidget.koMenuModelData().length){
    		       $('.subCategory1').each(function(){
    		           var $c = $(this);
    		           var outerHeight=$c.outerHeight();
    		           $('.subCategory1Image',$c.parent()).css('height',outerHeight +'px');
    		       });    
    		    }
		},
    	showHelpCenterDetails:function(){
		     $('#help-center').toggle();
	  	}, 
	  	
		showMyaccountDetails:function(){
		    $('#myaccount-details').toggle();
		   
		},
		
 	    showLoggedInDetails:function(){
 	         $('#loggedin-details').toggle();
 	    },
		
		renderMobileMenuNew: function() {
		    $('#page').addClass("site-outer");
		    
		 
		   //  $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
		   setTimeout(function(){
		          $('#mp-menu').pushMenu({
                    type: 'overlap',
                    levelSpacing: 0,
                    backClass: 'mp-back',
                    trigger: '.mobile-navbar-link',
                    pusher: '#page',
                    scrollTop: false
                });
		   },500)
    		 
		 //    });

		},
		

	
    };
  }
);


