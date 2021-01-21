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
    ['knockout','spinner','CCi18n'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko,spinner,CCi18n) {

        "use strict";
        var getId;
        return {
            koPetProductDataArray: ko.observableArray([]),
            koErrorMsg: ko.observable(''),
            koShowPetData: ko.observable(),
            koBreedId: ko.observableArray([]),
            koSizeId: ko.observableArray([]),
            koAgeId: ko.observableArray([]),
            koHairId: ko.observableArray([]),
            koColorId: ko.observableArray([]),
            koDistanceId: ko.observableArray([]),
            koSexId: ko.observableArray([]),
            koAnimalBreedId: ko.observableArray([]),
            koActiveId: ko.observable(),
            ZipDog: ko.observable(null),
            ZipCat: ko.observable(null),
            ZipAnimal: ko.observable(null),
            koMainimg: ko.observable(),
            onLoad: function(widget) {


               widget.ZipDog.extend({
                  required: {
                    params: true,
                    message: widget.translate('Please enter a ZIP Code'),
                  },
                  pattern: {
                    params: /^\d{5}(?:[-\s]\d{4})?$/,
                    message: widget.translate('Please Enter A Valid ZIP Code'),
                  }
                  
                });
                widget.dogvalidationModel = ko.validatedObservable({
                    ZipDog: widget.ZipDog
                });
                
                widget.ZipCat.extend({
                  required: {
                    params: true,
                    message: widget.translate('Please enter a ZIP Code'),
                  },
                  pattern: {
                    params: /^\d{5}(?:[-\s]\d{4})?$/,
                    message: widget.translate('Please Enter A Valid ZIP Code'),
                  }
                  
                });
                widget.catvalidationModel = ko.validatedObservable({
                    ZipCat: widget.ZipCat
                });
                
                widget.ZipAnimal.extend({
                  required: {
                    params: true,
                    message: widget.translate('Please enter a ZIP Code'),
                  },
                 pattern: {
                    params: /^\d{5}(?:[-\s]\d{4})?$/,
                    message: widget.translate('Please Enter A Valid ZIP Code'),
                  }
                });
                widget.animalvalidationModel = ko.validatedObservable({
                    ZipAnimal: widget.ZipAnimal
                });
                


                $('body').on('click', '#myTab li a', function() {
                     
                    setTimeout(function() {
                        getId = $('ul#myTab').find('li.active a').attr('title').toLowerCase();
                         //$('form').trigger('reset')
                        console.log('getId', getId);
                        if(getId == "animal"){
                         getId = $('.animal').find('select[name="species"]').val();
                        }
                        widget.koActiveId(getId);
                        widget.getBreedValues(getId);
                    }, 50)
                })
                $('body').on('change', '#species', function() {
                    console.log('changed')
                    setTimeout(function() {
                        var species = $('.animal').find('select[name="species"]').val();
                        console.log(species, 'species');
                        widget.koActiveId(species);
                        widget.getBreedValues(species);
                        if(species == "rabbit"){
                          $( ".animal .one" ).addClass( "activeField" ); $( ".animal .two" ).addClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }else if(species == "bird"){
                              $( ".animal .one" ).addClass( "activeField" ); $( ".animal .two" ).removeClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }else if(species == "small_animal"){
                              $( ".animal .one" ).removeClass( "activeField" ); $( ".animal .two" ).addClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }else if(species == "horse"){
                            $( ".animal .one" ).addClass( "activeField" ); $( ".animal .two" ).addClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }else if(species == "reptile"){
                            $( ".animal .one" ).addClass( "activeField" ); $( ".animal .two" ).removeClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }else if(species == "farm_animal"){
                            $( ".animal .one" ).addClass( "activeField" ); $( ".animal .two" ).addClass( "activeField" ); $( ".animal .three" ).removeClass( "activeField" );
                        }
                    }, 50)
                    // widget.checkActiveSpecies();
                    return false;
                });
              



            },

            beforeAppear: function(page) {
                var widget = this;
                widget.koActiveId('dog');
                widget.getBreedValues('dog');
                /*widget.dogvalidationModel.errors.showAllMessages();
                widget.catvalidationModel.errors.showAllMessages();
                widget.animalvalidationModel.errors.showAllMessages();*/
            },
            getPetData: function(data) {
                var widget = this;
                widget.createSpinner();
                console.log('getPetData data', data);
                console.log('this.dogvalidationModel.isValid()',this.dogvalidationModel.isValid());
              
          
                    console.log('getPetData data', data);
                    

                    var zip = $('.' + data).find('input[name="zip"]').val();
                    var distance = $('.' + data).find('select[name="distance"]').val();
                    var breed = $('.' + data).find('select[name="breed"]').val();
                    var sex = $('.' + data).find('select[name="sex"]').val();
                    var age = $('.' + data).find('select[name="age"]').val();
                    var color = $('.' + data).find('select[name="color"]').val();
                    var size = $('.' + data).find('select[name="size"]').val();
                    var hair = $('.' + data).find('select[name="hair"]').val();
                  
                    if (!zip) {
                        zip = '';
                    }
                    if (!distance) {
                        distance = '';
                    }
                    if (!breed) {
                        breed = '';
                    }
                    if (!sex) {
                        sex = '';
                    }
                    if (!age) {
                        age = '';
                    }
                    if (!color) {
                        color = '';
                    }
                    if (!size) {
                        size = '';
                    }
                    if (!hair) {
                        hair = '';
                    }
                    var url = "https://api.adoptapet.com/search/pet_search?key=h6p37h1618d053c31d524d4z82m1f7s&geo_range=" + distance  + "&city_or_zip=" + zip + "&color_id=" + color + "&hair=" + hair + "&age=" + age + "&pet_size_range_id=" + size + 
                    "&species=" + widget.koActiveId() + "&sex=" + sex + "&breed_id=" + breed + "&output=json&v=2"
                    console.log('url', url);
                    $.ajax({
                        url: url,
                        type: "GET",
                        success: function(data) {
                            console.log(data, 'data ====>');
                            if (data.status == 'ok') {

                                if (data.returned_pets > 0) {
                                    console.log(data, 'Success Message');
                                    widget.koPetProductDataArray(data.pets);
                                    widget.koErrorMsg('');
                                        widget.destroySpinner();
                                } else {
                                    console.log(data, 'Error Message');
                                    widget.koPetProductDataArray([]);
                                    widget.koErrorMsg(data.exception.details);
                                        widget.destroySpinner();
                                }

                            } else {
                                widget.koPetProductDataArray([]);
                                widget.koErrorMsg('Please Check the fields');
                                    widget.destroySpinner();
                            }
                        },
                        error: function(xhr) {
                            console.log(xhr, 'Error Message');
                                widget.destroySpinner();
                        }
                    });
               

            },
            showPetData: function(data) {
                console.log('showPetData', data);
                var widget = this;
                 //widget.koShowPetData(data);
                 $.ajax({
                        url: data.details_url,
                        type: "GET",
                        success: function(petValue) {
                            if (petValue.status == 'ok') {
                            console.log('pet success',petValue);
                            widget.koShowPetData(petValue.pet);
                            widget.koMainimg(petValue.pet.images[0].original_url);
                             $('#petPDP').modal('show');
                            }else{
                                 widget.koPetProductDataArray([]);
                                widget.koErrorMsg('Please Try After Sometime');
                                    widget.destroySpinner();
                            }
                        },
                        error: function(xhr) {
                            console.log(xhr, 'Error Message');
                                widget.destroySpinner();
                        }
                    });
               // widget.koShowPetData(data);
            },
            getBreedValues: function(data) {
                var widget = this;
                console.log(widget.koActiveId(), 'Breed widget.koActiveId()');
                $.ajax({
                    url: "https://api.adoptapet.com/search/search_form?key=h6p37h1618d053c31d524d4z82m1f7s&output=json&species=" + data + "&v=2",
                    type: "GET",
                    success: function(breedData) {
                        widget.koBreedId(breedData.breed_id);
                        widget.koSizeId(breedData.pet_size_range_id);
                        widget.koAgeId(breedData.age);
                        widget.koHairId(breedData.hair);
                        widget.koColorId(breedData.color_id);
                        widget.koSexId(breedData.sex);
                    },
                    error: function(xhr) {
                        console.log(xhr, 'Error Message');
                    }
                });
            },
            showMainImg: function(data){
                console.log('showMainImg',data);
                var widget = this;
                widget.koMainimg(data)
            },
            checkActiveSpecies: function() {
                var widget = this;
                $('form').trigger("reset");
                var getId = $('ul#myTab').find('li.active a').text().toLowerCase();
                console.log('getId', getId);
                if (getId == 'dog' || getId == 'cat') {
                    var activeId = getId;
                } else {

                }

                return activeId;


            },
            createSpinner: function(loadingText) {
          var indicatorOptions = {
              parent: '#loadingModal',
              posTop: '0',
              posLeft: '50%'
          };
          var loadingText = CCi18n.t('ns.common:resources.loadingText');
          $('#loadingModal').removeClass('hide'); 
          $('#loadingModal').show();
          indicatorOptions.loadingText = loadingText;
          spinner.create(indicatorOptions);
          },
            destroySpinner: function() {
              $('#loadingModal').hide();
              spinner.destroy();
          }

        };
    }
);
