var _ = require('lodash');
var assert = require('assert');
var vumigo = require('vumigo_v02');
var moment = require('moment');
var make_im = vumigo.test_utils.make_im;
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var fs = require('fs');
var onafixtures = require('./ona.fixtures');


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;
        var now;
        var completed_answers = {
            Facility_Code_Entry: '111111',
            First_Name_Entry: 'First_Name_Entry',
            ID_Type_Entry: 'SA_ID_Entry', // so we parse the gender from the ID
            Last_Name_Entry: 'Last_Name_Entry',
            Locality_Entry: 'Locality_Entry',
            Locality_Entry_Other: 'Locality_Entry_Other',
            MSISDN_Entry: 'MSISDN_Entry',
            date_of_birth: '1980-01-02',
            Patient_Abroad_Entry: 'Patient_Abroad_Entry',
            SA_ID_Entry: '8905100273087',
            No_SA_ID_Gender_Entry: 'gender',
            Landmark_Entry: 'Landmark_Entry',
            Landmark_Entry_Description: 'Landmark_Entry_Description'
        };

        var completed_answers_non_sa_id = {
            Facility_Code_Entry: '111111',
            First_Name_Entry: 'First_Name_Entry',
            ID_Type_Entry: null, // no SA ID
            No_SA_ID_Year_Entry: '1980',
            No_SA_ID_Month_Entry: '02',
            No_SA_ID_Day_Entry: '02',
            Last_Name_Entry: 'Last_Name_Entry',
            Locality_Entry: 'Locality_Entry',
            Locality_Entry_Other: 'Locality_Entry_Other',
            MSISDN_Entry: 'MSISDN_Entry',
            date_of_birth: '1980-01-02',
            Patient_Abroad_Entry: 'Patient_Abroad_Entry',
            SA_ID_Entry: '1980',
            No_SA_ID_Gender_Entry: 'female',
            Landmark_Entry: 'Landmark_Entry',
            Landmark_Entry_Description: 'Landmark_Entry_Description'
        };

        beforeEach(function() {
            return make_im()
                .then(function(im) {
                    now = moment();
                    go.utils.now = function () {
                        return moment("2015-01-01T00:00:00+00:00");
                    };
                    app = new go.app.GoApp();
                    tester = new AppTester(app);

                    tester
                        .setup.config.app({
                            name: 'test_app',
                            ona: {
                                id: '1',
                                username: 'root',
                                password: 'root',
                                url: 'http://ona.io/api/v1/'
                            },
                            api_endpoint: 'http://www.example.org/api/v1/',
                            landmarks: JSON.parse(
                                fs.readFileSync(
                                    "src/lookups/landmarks.json", "utf8"))
                        })
                        .setup(function(api) {
                            fixtures().forEach(api.http.fixtures.add);
                            onafixtures.store.forEach(function (fixture) {
                                api.http.fixtures.add(fixture);
                            });
                        });
                });
        });

        describe("Extract_SA_ID_Info: extract the SA ID out of the SA ID", function() {
            it("this still needs to be fleshed out", function() {
                true;
            });
        });

        describe("Facility_Code_Entry:", function() {
          it("should show the welcome screen", function() {
              return tester
                  .start()
                  .check.interaction({
                      state: 'Facility_Code_Entry',
                      reply: [
                          'Welcome! To report a malaria case, please enter your facility code. For example, 543456'
                      ].join('\n')
                  })
                  .run();
          });

          it('should show the welcome screen for badly formatted error values', function () {
              return tester
                  .setup.user.state({
                      name:"Facility_Code_Entry",
                      metadata:{},
                      creator_opts:{
                          error: {"args":["Sorry, that code is not recognised. To report a malaria case, please enter your faclity code. For example 543456."],"ctx":{},"method":"gettext"}
                      }
                  })
                  .input()
                  .check.interaction({
                      state: 'Facility_Code_Entry',
                      reply: [
                          'Welcome! To report a malaria case, please enter your facility code. For example, 543456'
                      ].join('\n')
                  })
                  .run();
          });

          it('should validate the input', function () {
              return tester
                  .setup.user.state('Facility_Code_Entry')
                  .input('123') // invalid, not in fixtures
                  .check.interaction({
                      state: 'Facility_Code_Entry',
                      reply: /Sorry, that code is not recognised\./
                  })
                  .run();
          });

          it('should continue with valid input', function () {
              return tester
                  .setup.user.state('Facility_Code_Entry')
                  .input('111111')
                  .check.reply.content(/Please confirm that you are reporting from 'A Facility'/)
                  .run();
          });

        });

        describe('Facility_Code_Confirm', function () {
            it('should got to MSISDN entry', function () {
                    return tester
                        .setup.user.state('Facility_Code_Confirm')
                        .input('1')
                        .check.interaction({
                            state: 'MSISDN_Entry',
                            reply: /Please enter the South African cell phone number/
                        })
                        .run();
            });
        });

        describe('MSISDN_Entry', function() {
            it('should block bad phone numbers', function () {
                return tester
                    .setup.user.state('MSISDN_Entry')
                    .input('12345')
                    .check.reply.content(/Sorry, that number is not valid/)
                    .run();
            });

            it('should accept none', function () {
                return tester
                    .setup.user.state('MSISDN_Entry')
                    .input('none')
                    .check.reply.content(/Please enter the first name of the patient/)
                    .run();
            });

            it('should accept reasonable phone numbers', function () {
                return tester
                    .setup.user.state('MSISDN_Entry')
                    .input('0123456789')
                    .check.reply.content(/Please enter the first name of the patient/)
                    .run();
            });
        });

        describe('First_Name_Entry', function () {
            it('should accept any string input', function () {
                return tester
                    .setup.user.state('First_Name_Entry')
                    .input('Mbe')
                    .check.reply.content(/Please enter the surname of the patient./)
                    .run();
            });

            it('should block on null input', function () {
                return tester
                    .setup.user.state('First_Name_Entry')
                    .input(null)
                    .check.reply.content(/Please enter the first name of the patient/)
                    .run();
            });
        });

        describe('Last_Name_Entry', function () {
            it('should accept any string input', function () {
                return tester
                    .setup.user.state('Last_Name_Entry')
                    .input('Ngu')
                    .check.reply.content(/Has the patient travelled abroad in the past 21 days/)
                    .run();
            });

            it('should block on null input', function () {
                return tester
                    .setup.user.state('Last_Name_Entry')
                    .input(null)
                    .check.reply.content(/Please enter the surname of the patient/)
                    .run();
            });
        });

        describe('Patient_Abroad_Entry', function () {
            it('should not accept invalid inputs', function () {
                return tester
                    .setup.user.state('Patient_Abroad_Entry')
                    .input('-1')
                    .check.reply.content(/Has the patient travelled abroad in the past 21 days/)
                    .run();
            });

            it('should accept one of the valid inputs', function () {
                return tester
                    .setup.user.state('Patient_Abroad_Entry')
                    .setup.user.answers({
                        'Facility_Code_Entry': '111111'
                    })
                    .input('1')
                    .check.reply.content(/Please select the locality/)
                    .run();
            });
        });

        describe('Locality_Entry', function () {

            it('should not accept everything', function () {
                return tester
                    .setup.user.state('Locality_Entry')
                    .setup.user.answers({
                        'Facility_Code_Entry': '111111'
                    })
                    .input('fooo')
                    .check.reply.content(/Please select the locality/)
                    .run();
            });

            it('should accept something valid', function () {
                return tester
                    .setup.user.state('Locality_Entry')
                    .setup.user.answers({
                        'Facility_Code_Entry': '111111'
                    })
                    .input('1')
                    .check.reply.content(/What is the closest landmark/)
                    .run();
            });

            it('should ask for other input when told to do so', function () {
                return tester
                    .setup.user.state('Locality_Entry')
                    .setup.user.answers({
                        'Facility_Code_Entry': '111111'
                    })
                    .input('4')
                    .check.interaction({
                        state: 'Locality_Entry_Other',
                        reply: /Please write the locality where the patient/
                    })
                    .run();
            });
        });

        describe('Locality_Entry_Other', function () {
            it('should continue to the landmark', function () {
                return tester
                    .setup.user.state('Locality_Entry_Other')
                    .input('foo')
                    .check.interaction({
                        state: 'Landmark_Entry',
                        reply: /What is the closest landmark for the patient?/
                    })
                    .run();
            });
        });

        describe('Landmark_Entry', function () {
            it('should not accept blanks', function () {
                return tester
                    .setup.user.state('Landmark_Entry')
                    .input('')
                    .check.reply.content(/What is the closest landmark for the patient?/)
                    .run();
            });

            it('should accept something valid', function () {
                return tester
                    .setup.user.state('Landmark_Entry')
                    .input('1')
                    .check.interaction({
                        state: 'Landmark_Entry_Description',
                        reply: /Please describe the landmark and what it is next to. For example: Sitheku High School next to Tugela River./
                    })
                    .run();
            });
        });

        describe("Landmark_Entry_Description", function () {
            it('should continue to the ID_Type_Entry', function () {
                return tester
                    .setup.user.state('Landmark_Entry_Description')
                    .input('pretty')
                    .check.interaction({
                        state: 'ID_Type_Entry',
                        reply: /What kind of identification does the patient have?/
                    })
                    .run();
            });
        });

        describe('ID_Type_Entry', function () {
            it('should go to the patient ID number', function () {
                return tester
                    .setup.user.state('ID_Type_Entry')
                    .input('1')
                    .check.reply.content(/Please enter the patient's ID number/)
                    .run();
            });

            it('should go to the patient\'s year of birth', function () {
                return tester
                    .setup.user.state('ID_Type_Entry')
                    .input('2')
                    .check.reply.content(/Please enter the year the patient was born/)
                    .run();
            });

            it('should accept errors from previous states via creator opts', function () {
                return tester
                    .setup.user.state('ID_Type_Entry', {
                        creator_opts: {
                            error: 'This is the error'
                        }
                    })
                    .input('foo')
                    .check.interaction({
                        state: 'ID_Type_Entry',
                        reply: /This is the error/
                    })
                    .run();
            });
        });

        describe('SA_ID_Entry', function () {
            it('should not accept invalid SA ID numbers', function () {
                return tester
                    .setup.user.state('SA_ID_Entry')
                    .input('foo')
                    .check.interaction({
                        state: 'ID_Type_Entry',
                        reply: /The format of the ID number was incorrect/
                    })
                    .run();
            });
              it('should not accept SA ID numbers with invalid dates', function () {
                return tester
                    .setup.user.state('SA_ID_Entry')
                    .input('9502294800087')
                    .check.interaction({
                        state: 'ID_Type_Entry',
                        reply: /The format of the ID number was incorrect/
                    })
                    .run();
            });


           
            it('should accept valid SA ID numbers', function () {
                return tester
                    .setup.user.state('SA_ID_Entry')
                    .setup.user.answers({
                        'Facility_Code_Entry': '111111'
                    })
                    .input('8905100273087')
                    .check.reply.content(/Thank you! Your report has been submitted./)
                    .run();
            });

        });

        describe('No_SA_ID_Year_Entry', function () {
            it('should not accept an invalid year', function () {
                return tester
                    .setup.user.state('No_SA_ID_Year_Entry')
                    .input('pooh')
                    .check.reply.content(/Sorry, that year is invalid/)
                    .run();
            });

            it('should accept a valid year', function () {
                return tester
                    .setup.user.state('No_SA_ID_Year_Entry')
                    .input('2000')
                    .check.reply.content(/Please enter the month the patient was born/)
                    .run();
            });
        });

        describe('No_SA_ID_Month_Entry', function () {
            it('should not accept an invalid month', function () {
                return tester
                    .setup.user.state('No_SA_ID_Month_Entry')
                    .input('13')
                    .check.reply.content(/Sorry, that month is invalid/)
                    .run();
            });

            it('should accept a valid month', function () {
                return tester
                    .setup.user.state('No_SA_ID_Month_Entry')
                    .input('5')
                    .check.reply.content(/Please enter the day the patient was born./)
                    .run();
            });
        });

        describe('No_SA_ID_Day_Entry', function () {
            it('should not accept an invalid day', function () {
                return tester
                    .setup.user.state('No_SA_ID_Day_Entry')
                    .input('32')
                    .check.reply.content(/Sorry, that day is invalid./)
                    .run();
            });

            it('should accept a valid day', function () {
                return tester
                    .setup.user.state('No_SA_ID_Day_Entry')
                    .input('12')
                    .check.reply.content(/Please select the patient's gender/)
                    .run();
            });
        });

        describe('No_SA_ID_Gender_Entry', function () {
            it('should not accept invalid options', function () {
                return tester
                    .setup.user.state('No_SA_ID_Gender_Entry')
                    .input('3')
                    .check.reply.content(/Please select the patient's gender/)
                    .run();
            });

            it('should accept valid options', function () {
                return tester
                    .setup.user.state('No_SA_ID_Gender_Entry')
                    .setup.user.answers(completed_answers)
                    .input('1')
                    .check.reply.content(/Thank you! Your report has been submitted/)
                    .run();
            });
        });

        describe('Submit_Case', function () {
            it('should make a valid Ona API call', function () {
                return tester
                    .setup.user.state('Submit_Case')
                    .setup.user.answers(completed_answers)
                    .input('1')
                    .check.interaction({
                        state: 'End',
                        reply: /Thank you! Your report has been submitted\./
                    })
                    .check(function (api) {
                        var http_sent = _.where(api.http.requests, {
                            url: 'http://ona.io/api/v1/submissions'
                        })[0];
                        assert.deepEqual(http_sent.data, {
                            id: '1',
                            submission: {
                                facility_code: '111111',
                                reported_by: '+27123456789',
                                first_name: 'First_Name_Entry',
                                id_type: 'said',
                                last_name: 'Last_Name_Entry',
                                locality: 'Locality_Entry',
                                locality_other: 'Locality_Entry_Other',
                                msisdn: 'MSISDN_Entry',
                                date_of_birth: '1989-05-10',
                                create_date_time: '2015-01-01T00:00:00+00:00',
                                abroad: 'Patient_Abroad_Entry',
                                sa_id_number: '8905100273087',
                                gender: 'female',
                                landmark: 'Landmark_Entry',
                                landmark_description: 'Landmark_Entry_Description',
                                case_number: '20150101-111111-1'
                            }
                        });
                    })
                    .run();
            });

            it('should make a valid Ona API call with null ID', function () {
                return tester
                    .setup.user.state('Submit_Case')
                    .setup.user.answers(completed_answers_non_sa_id)
                    .input('1')
                    .check.interaction({
                        state: 'End',
                        reply: /Thank you! Your report has been submitted\./
                    })
                    .check(function (api) {
                        var http_sent = _.where(api.http.requests, {
                            url: 'http://ona.io/api/v1/submissions'
                        })[0];
                        assert.deepEqual(http_sent.data, {
                            id: '1',
                            submission: {
                                facility_code: '111111',
                                reported_by: '+27123456789',
                                first_name: 'First_Name_Entry',
                                id_type: 'none',
                                last_name: 'Last_Name_Entry',
                                locality: 'Locality_Entry',
                                locality_other: 'Locality_Entry_Other',
                                msisdn: 'MSISDN_Entry',
                                date_of_birth: '1980-02-02',
                                create_date_time: '2015-01-01T00:00:00+00:00',
                                abroad: 'Patient_Abroad_Entry',
                                sa_id_number: null,
                                gender: 'female',
                                landmark: 'Landmark_Entry',
                                landmark_description: 'Landmark_Entry_Description',
                                case_number: '20150101-111111-1'
                            }
                          });
                      })
                      .run();
            });
        });

    });
});
