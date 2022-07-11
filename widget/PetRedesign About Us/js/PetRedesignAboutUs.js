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
				  "image":"facesofpetmate_Richard_Daphne.png",
				  "content":"Meet Daphne! She's a cute 6-year-old miniature Dachshund who enjoys people watching and hanging out in dads office while he works. When she's not people watching, she enjoys taking short naps under his desk in her work bed. At home, Daphne loves to eat treats, bark at every squirrel she sees, play with her toys, and get her beauty sleep.",
				  "altText":"Meet-Richard-and-Daphne"
			   },
			   {
				  "image":"facesofpetmate_casey_hazel.png",
				  "content":"Meet Casey and Hazel! Casey works on our Sales Team here at Petmate and has been bringing Hazel to the office since she was 8 weeks old! Hazel, who is now 3, is a chunky English Lab who loves coming to work and enjoying treats from mom's co-workers. When she's not working hard for treats in the office, Hazel's favorite thing to do is go swimming in the pool, which is where you can find her every hot summer weekend in Texas.",
				  "altText":"Meet-Caey-and-Hazel"
			   },
			   {
				  "image":"facesofpetmate_karl_kodi.png",
				  "content":"Say hi to Karl & Kodi! Karl works on our product development team here at Petmate, with Kodi tagging along. Kodi is a gorgeous 2-year-old Siberian Husky who loves coming to work with his dad and hanging out with his friends in the office. When Kodi isn't at work with dad, he enjoys long hikes. Karl describes Kodi as very sassy which has gotten him his very own Instagram account: @kodiak_the_siberian_husky",
				  "altText":"Meet-Karl-and-Kodi"
			   },
			  {
				  "image":"facesofpetmate_kelly_koby.png",
				  "content":"Meet Koby! He's a happy 2-year-old Shetland Sheepdog who loves coming to work with mom. Every morning, he dances at the front door hoping he gets to go to work with mom. While mom works, Koby enjoys playing with the other dogs in the office as well as hoping in your lap to make sure you get to pet him. At home, his favorite thing to do is play in the water as his dad tries to water the plants.",
				  "altText":"Meet-Kelly-and-Koby"
			   },{
				  "image":"facesofpetmate_jill_pepper.png",
				  "content":"Meet Jill and Pepper! Jill works in our product development department here at Petmate and brings her sweet 11-year-old dog, Pepper to work with her every day. Pepper's favorite thing about coming to work with his mom is testing all the new toys she makes. When he's not at work with mom, Pepper enjoys making his presence known while herding all the other dogs at the dog park.",
				  "altText":"Meet-Jill-and-Pepper"
			   },{
				  "image":"facesofpetmate_lindsey_peyton.png",
				  "content":"Meet Peyton! She's a sweet 7-year-old, soft-coated Wheaten Terrier who was rescued by her mom, Lindsey in 2013. In between meetings she attends with mom, Peyton loves getting all the attention from anyone who stops by to say hi and will smother you in kisses as long as you let her. At home, her favorite thing to do is nap... that is, when she can catch a break from her mischievous kitten brother.",
				  "altText":"Meet-Lindsey-and-Peyton"
			   },{
				  "image":"facesofpetmate_alyson_sunny.png",
				  "content":"Meet Sunny! She's a one-and-a-half-year-old Cocker Spaniel who loves coming to the office with her momma! Her favorite thing about coming to the office is the belly rubs and pets she gets from all the people who pass by her mom's desk during the day. At home, this spunky girl loves playing on the outdoor trampoline and can jump from the group up to the opening in one single jump!",
				  "altText":"Meet-Alyson-and-Sunny"
			   },{
				  "image":"facesofpetmate_katie_lucky.png",
				  "content":"Meet Lucky Boy! He's an 8-year-old Staffordshire Terrier who is a total mama's boy. His favorite thing about coming to work with mom is getting to test all the new toys Petmate creates. When he's not testing toys, he loves sitting in his very own chair so it's easier for humans to pet him as they walk by. He has so much fun at work with mom, that he snoozes the whole ride home. At home, his favorite thing to do is snuggle under the covers and chase his tail.",
				  "altText":"Meet-Katie-and-Lucky"
			   },{
				  "image":"facesofpetmate_TiffaneyandCupcake.png",
				  "content":"Meet Cupcake! She's a cuddly 8-year-old part Dachshund part Coton de Tulear mix that loves coming into the office with her mom, Tiffaney. Her favorite thing about coming to work is getting the spend the whole day by her mom's side. While Tiffaney works hard, you can find Cupcake snoozing the day away in her comfy bed on her mom's desk.",
				  "altText":"Meet-Donna-and-Teddy"
			   },{
				  "image":"facesofpetmate_Tess_Seymour.png",
				  "content":"Meet Seymour! He's a spunky 1-year-old Terrier Mix... we think. His most favorite thing about coming to work with mom is getting extra love, attention, and treats from mom's friends. While mom works, you can find Seymour playing with the other dogs in the office or cuddled up in his bed, snoozing the day away. At home, Seymour enjoys laying out in his backyard catching some rays and going through his collection of bowties.",
				  "altText":"Meet-Tess-and-Seymour"
			   },{
				  "image":"facesofpetmate_keri_millie.png",
				  "content":"Meet Millie! She's a loving 8-year-old Maltipoo who thinks she's a real life princess. Her favorite part about coming to work with mom is getting to spend the whole day right by her side and getting all the lovins' from moms friends. After long days at the office, Millie goes home to her castle and finds the fluffiest stack of pillows and gets her beauty rest.",
				  "altText":"Meet-Keri-and-Millie"
			   },{
				  "image":"facesofpetmate_Dave_LucyLou.png",
				  "content":"Meet Lucy Lou! She's a sweet and loving 14-month-old Portuguese Water Dog who loves laying at her daddy's feet while he works. When she can get dad away from work, her favorite thing to do is swim, play fetch, and take long talks.",
				  "altText":"Meet-Dave-and-LucyLou"
			   }
			   
			]
    
        }
]
		};
		var cfoImagesJSON = {
             "items":[
              {
                 "childCategories":[
                        {
        				  "image":"CharlieInMeetingUpdated.jpg",
        				  "content":"Part of my role as Petmate's Chief Four Legged Officer is testing and approving new toys ... and then taking home my favorite one to add to my stash of toys!",
        				  "altText":"Charlie leading toy meeting"
        			   },
        			   {
        				  "image":"CharlieInOfficeWithBallresizedUpdated.jpg",
        				  "content":"Still don’t understand why they call this “work.” I get to boss people around all day, chew unlimited toys, receive endless belly rubs, and play fetch between my meetings (aka nap time). What’s so difficult about that?",
        				  "altText":"Charlie sitting at office desk"
        			   },
        			   
        			   {
        				  "image":"Charlie_WithFATCATFlockersToyUpdated.jpg",
        				  "content":"One of the perks of being a CFO, is being the 1st dog to play with new toys! The FATCAT Flockers sure did hype me up with their funny and weird giggles!",
        				  "altText":"Charlie with FAT CAT Dog toy"
        			   },
        			  {
        				  "image":"CharlieandSawyer_OfficeDeskUpdated.jpg",
        				  "content":"Sometimes I even get to bring my sister, Sawyer with me to work! I love having her with me at work. It makes work so much more FUN!",
        				  "altText":"Sawyer and Charlie sitting at an office desk"
        			   },{
        				  "image":"Charlie_TestingLaZBoyDogBedUpdated.jpg",
        				  "content":"The La-Z-Boy line of dog beds are my most favorite dog beds on the planet!",
        				  "altText":"charlie sitting on la-z-boy dog bed"
        			   },{
        				  "image":"Charlie_OfficeDeskUpdated.jpg",
        				  "content":"When the reading glasses come out, my employees know I mean business.",
        				  "altText":"Charlie sitting at desk with reading glasses on"
        			   },{
        				  "image":"Charlie_WithJWBallUpdated.jpg",
        				  "content":"I like to test the squeakers in all the balls in the office. Gotta make sure they are working right!",
        				  "altText":"Charlie playing with JW Squeak Ball"
        			   },{
        				  "image":"CharlieandSawyerInLazboyDogBedUpdated.jpg",
        				  "content":"At the end of the day, my favorite thing to do when I get home is cuddle with my sister on our La-Z-Boy bed! ",
        				  "altText":"Charlie cuddling with sister on dog bed"
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

            getProductDetails: function (page) {
                var widget = this;
                if(page.pageId == "ourstory"){
                     widget.updateData(brandCollectionJSON.items[0].childCategories);
                }else if(page.pageId == "cfo"){
                     widget.updateData(cfoImagesJSON.items[0].childCategories);
                }
               
                widget.getCarouselArrow();
               /* ccRestClient.authenticatedRequest("/ccstoreui/v1/collections?categoryIds=" + widget.collectionId().toString() + "&fields=childCategories.id,childCategories.displayName,childCategories.route", {}, function (e) {
                
                    
                }, function (data) {}, "GET");*/
            },

            onLoad: function (widget) {
                

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