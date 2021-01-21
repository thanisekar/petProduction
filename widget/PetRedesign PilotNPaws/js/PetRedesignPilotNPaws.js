define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'storageApi'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, ccRestClient, ccConstants, storageApi) {

        "use strict";
        var productIds = '';
        var dataLayer = [];
        var bvData = '';
        // properties defined in the return are the actual module
        var brandCollectionJSON = {
        "items":[
      {
         "childCategories":[
			   {
				  "image":"PNP_Image1_Web.jpg",
				  "content":"Havana and her 5 puppies went from a life of horror to Husky House in Matawan, NJ all thanks to Pilots N Paws volunteer Pilots.",
				  "altText":"PilotsNPaws-rescue1"
			   },
			   {
				  "image":"PNP_Image2_Web.jpg",
				  "content":"Mama Mia and her 7 puppies went from a kill shelter in Texas and caught 4 Pilots N Paws Freedom Flights to New Jersey where they'll all get forever homes.",
				  "altText":"PilotsNPaws-rescue2"
			   },
			   {
				  "image":"PNP_Image3_Web.jpg",
				  "content":"Nikki, a gorgeous husky was found by Louisiana animal control as a stray. A volunteer Pilots N Paws Pilot flew Nikki to her forever home in West Palm Beach, Florida where life is now a beach for blue eyed Nikki.",
				  "altText":"PilotsNPaws-rescue3"
			   },
			  {
				  "image":"PNP_Image4_Web.jpg",
				  "content":"Maybe it's the luck of the Irish, but this volunteer Pilots N Paws pilot flew this pup to his forever home on Saint Patrick's Day",
				  "altText":"PilotsNPaws-rescue4"
			   },{
				  "image":"PNP_Image5_Web.jpg",
				  "content":"The immediate trust these fur babies show when they get on board a Pilots N Paws Freedom Flight tells our pilots they know they're being saved, and only blue skies are ahead.",
				  "altText":"PilotsNPaws-rescue5"
			   },{
				  "image":"PNP_Image6_Web.jpg",
				  "content":"Another abandoned senior saved. Thank you Pilots N Paws pilots for flying jake from Texas to his new home in Colorado. Jake's smile says it all.",
				  "altText":"PilotsNPaws-rescue6"
			   },{
				  "image":"PNP_Image7_Web.jpg",
				  "content":"Pilots N Paws volunteer pilots flew this little fur-kid to her new fur-everyh family. Another rescue dog saved with a Pilots N Paws Freedom Flight.",
				  "altText":"PilotsNPaws-rescue7"
			   },{
				  "image":"PNP_Image8_Web.jpg",
				  "content":"Pilots N Paws volunteer pilots helped Numa get to his new foster home in Arkansas after he lost his home in the Houston floods. Fingers crossed that Numa gets his happy every after soon.",
				  "altText":"PilotsNPaws-rescue8"
			   }
			   
			]
    
            }
        ]
		};
		var adoptPetJSON = {
        "items":[
      {
         "childCategories":[
			   {
				  "image":"AdoptionStory1_Image.jpg",
				  "content":"We used Adopt-A-Pet to find our newest fur baby Cody through Citizens for Animal Protection and can't say enough about how great the process was! Without Adopt-A-Pet, we never would have found him in time! Thank you!! (Cody says thank you too - he loves his new home and new sister!)",
				  "altText":"Adopt-A-Pet_AdoptionStory1"
			   },
			   {
				  "image":"AdoptionStory2_Image.jpg",
				  "content":"We decided to adopt and we're blessed to find a bonded pair of Australian Shepherds (sisters) that needed to be re-homed. May 2019 will make a year that our girls have been with us. We keep in touch with the former owners and share pictures, videos, & stories about Sugar and Spice and their adventures in Virginia. Thank you for helping our family grow in love! It was through your Rehome Program that I found these precious girls.",
				  "altText":"Adopt-A-Pet_AdoptionStory2"
			   },
			   {
				  "image":"AdoptionStory3_Image.jpg",
				  "content":"We adopted our puppy, Monterey from In Our Hands Rescue out of NYC. Everyone at the rescue had patience with my overwhelming excitement and numerous emails. Some would say he's lucky to have us as a family, but clearly we are blessed to have him forever. Thank you Adopt-A-Pet for the countless emails and helping us find our missing link. Our family is complete.",
				  "altText":"Adopt-A-Pet_AdoptionStory3"
			   },
			  {
				  "image":"AdoptionStory4_Image.jpg",
				  "content":"This pretty princess was used for breeding. We looked and looked all over for the perfect hound since our last Basset crossed the Rainbow Bridge on 3/16/2020. We looked on Adopt-A-Pet and found Jujubee, who is now being called Sadie Mae. Within 3 days I applied and adopted her. She will never breed again or sleep in a field.",
				  "altText":"Adopt-A-Pet_AdoptionStory4"
			   },{
				  "image":"AdoptionStory5_Image.jpg",
				  "content":"We are so happy with our new baby Taz. Thanks to Adopt-A-Pet and South Lake Animal League for making this possible for us. You all are amazing people who work tirelessly to help animals find forever homes. We had been searching for 2 months after our dog, Woodstock died from cancer. This litter JRT is everything to us because of you.",
				  "altText":"Adopt-A-Pet_AdoptionStory5"
			   },{
				  "image":"AdoptionStory6_Image.jpg",
				  "content":"Meet our new sweetheart, Davee adopted from Winnebago County Animal Service on 8/20/2019. WCAS adoption process was quick and efficient which I much appreciated. I refer them as an excellent pet adoption resource. Davee joing 1 brother and 3 sister pups comparable in size and temperament; therefore, enjoying fun-filled playful days!",
				  "altText":"Adopt-A-Pet_AdoptionStory6"
			   },{
				  "image":"AdoptionStory7_Image.jpg",
				  "content":"Luna and I have already developed a wonderful rhythm and communication. When she wants or needs something, she reaches out with one paw and taps me gently on the let. She gets braver with each walk and is getting to know her new neighbors (human and canine). Everyday, I love her more and more. I think my heart has swelled to at least twice its usual size. I can't beging to tell you what a gift you have given us both. To me and Luna, you are angels!",
				  "altText":"Adopt-A-Pet_AdoptionStory7"
			   },{
				  "image":"AdoptionStory8_Image.jpg",
				  "content":"We met them this evening and fell completely in love! We recently lost our beloved cat to cancer, and we are ready to open our hearts and home to these wonderful boys. It's a perfect fit - thank you for offering this amazing service!",
				  "altText":"Adopt-A-Pet_AdoptionStory8"
			   }
			   
			]
    
            }
        ]
		};
        return {
            // BEGIN Copied from the collection widget
            itemsPerRowInLargeDesktopView: ko.observable(4),
            itemsPerRowInDesktopView: ko.observable(4),
            itemsPerRowInTabletView: ko.observable(4),
            itemsPerRowInPhoneView: ko.observable(2),
            itemsPerRow: ko.observable(),
            viewportWidth: ko.observable(),
            viewportMode: ko.observable(),
            spanClass: ko.observable(),

            koBrandCollectionData: ko.observableArray([]),
            koDealsIsFlagData: ko.observableArray([]),
            koProductId: ko.observable(),
            collectionsLoaded: false,

            // END Copied from the collection widget

            updateData: function (getData) {
                ko.mapping.fromJS(getData, {}, this.koBrandCollectionData);
            },

            getProductDetails: function (data) {
                var widget = this;
                if(data.pageId == 'pilotsnpaws'){
                      widget.updateData(brandCollectionJSON.items[0].childCategories);
                }else if(data.pageId == 'adoptapet'){
                      widget.updateData(adoptPetJSON.items[0].childCategories);
                }
              
                widget.getCarouselArrow();
               /* ccRestClient.authenticatedRequest("/ccstoreui/v1/collections?categoryIds=" + widget.collectionId().toString() + "&fields=childCategories.id,childCategories.displayName,childCategories.route", {}, function (e) {
                
                    
                }, function (data) {}, "GET");*/
            },

            onLoad: function (widget) {
                
                $("body").delegate(window, "scroll", function () {
                     
                });
               
                $(".brandCollectionCarousel").scroll(function () {
                    console.log("cc_img__resize_wrapper");
                });
                // set up the recommendations ko observable
                widget.recommendations = ko.observableArray();
                /**
                 * Groups the recommendations based on the viewport
                 */
                widget.recommendationsGroups = ko.computed(function () {
                    var groups = [];
                    if (widget.koBrandCollectionData) {
                        for (var i = 0; i < widget.koBrandCollectionData().length; i++) {
                            if (i % widget.itemsPerRow() == 0) {
                                //console.log(widget.itemsPerRow(),'----Itemsperrow');
                                groups.push(ko.observableArray([widget.koBrandCollectionData()[i]]));
                            } else {
                                groups[groups.length - 1]().push(widget.koBrandCollectionData()[i]);
                            }
                        }
                    }
                    return groups;

                }, widget);

                widget.updateSpanClass = function () {
                    var classString = "";
                    var phoneViewItems = 0,
                        tabletViewItems = 0,
                        desktopViewItems = 0,
                        largeDesktopViewItems = 0;
                    //console.log(this.itemsPerRow(),'----Test---');
                    if (this.itemsPerRow() == this.itemsPerRowInPhoneView()) {
                        phoneViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInTabletView()) {
                        tabletViewItems = 12 / this.itemsPerRow();
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInDesktopView()) {
                        desktopViewItems = 12 / this.itemsPerRow();
                        //console.log(desktopViewItems,'---desktopViewItems---')
                    }
                    if (this.itemsPerRow() == this.itemsPerRowInLargeDesktopView()) {
                        largeDesktopViewItems = 12 / this.itemsPerRow();
                    }
                    if (phoneViewItems > 0) {
                        classString += "col-xs-" + phoneViewItems;
                    }
                    if ((tabletViewItems > 0) && (tabletViewItems != phoneViewItems)) {
                        classString += " col-sm-" + tabletViewItems;
                    }
                    if ((desktopViewItems > 0) && (desktopViewItems != tabletViewItems)) {
                        classString += " col-md-" + desktopViewItems;
                    }
                    if ((largeDesktopViewItems > 0) && (largeDesktopViewItems != desktopViewItems)) {
                        classString += " col-lg-" + largeDesktopViewItems;
                    }

                    widget.spanClass(classString);
                };
                /**
                 * Checks the size of the current viewport and sets the viewport and itemsPerRow
                 * mode accordingly
                 */
                widget.checkResponsiveFeatures = function (viewportWidth) {
                    if (viewportWidth > ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.LARGE_DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.LARGE_DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInLargeDesktopView());
                        }
                    } else if (viewportWidth > ccConstants.VIEWPORT_TABLET_UPPER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.DESKTOP_VIEW) {
                            widget.viewportMode(ccConstants.DESKTOP_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInDesktopView());
                        }
                    } else if (viewportWidth >= ccConstants.VIEWPORT_TABLET_LOWER_WIDTH &&
                        viewportWidth <= ccConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
                        if (widget.viewportMode() != ccConstants.TABLET_VIEW) {
                            widget.viewportMode(ccConstants.TABLET_VIEW);
                            widget.itemsPerRow(widget.itemsPerRowInTabletView());
                        }
                    } else if (widget.viewportMode() != ccConstants.PHONE_VIEW) {
                        widget.viewportMode(ccConstants.PHONE_VIEW);
                        widget.itemsPerRow(widget.itemsPerRowInPhoneView());
                    }
                    widget.updateSpanClass();
                };

                widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                $(window).resize(
                    function () {
                        widget.checkResponsiveFeatures($(window)[0].innerWidth || $(window).width());
                        widget.viewportWidth($(window)[0].innerWidth || $(window).width());
                    });

                $("body").delegate(".brandCollectionCarousel", "slid.bs.carousel", function (e) {
                    widget.getCarouselArrow()
                });
            },
            handleHoverModal: function(data,event){
                  var modalId = "#myModal-"+data.altText();
                  setTimeout(function(){
                       $(modalId).modal('show');
                  },150)
                 

            },

            /**
             * Runs late in the page cycle on every page where the widget will appear.
             */
            beforeAppear: function (page) {
                var widget = this;
                  widget.getProductDetails(page);
            },
            
            getCarouselArrow: function () {
                if ($('.brandCollectionCarousel .brand-carousel .item').length > 0) {
                    //console.log("brandCollectionCarousel")
                    $('#brand-carousel-controls a').removeClass('disabled');
                    if ($(".brand-carousel .item:first").hasClass("active")) {
                        //console.log('first item active');
                        $('#brand-carousel-left-control .brand-corousel-left').addClass('disabled');
                    } else if ($(".brand-carousel .item:last").hasClass("active")) {
                        //console.log('last item active');
                        $('#brand-carousel-right-control .brand-corousel-right').addClass('disabled');
                    } else {
                        $('#brand-carousel-controls a').removeClass('disabled');
                    }
                }
            }
        };
    }
);