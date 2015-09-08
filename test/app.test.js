var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'test_app'
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("state_welcome: start a session", function() {
            it("shows the welcome screen", function() {
                return tester
                    .start()
                    .check.interaction({
                        state: 'state_welcome',
                        reply: [
                            'Welcome! To report a malaria case, please enter your facility code. For example, 543456'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("state_welcome: fill in facility code", function() {
            it("should validate the facility", function() {
                return tester
                    .setup.user.state('state_welcome')
                    .input('1234567')
                    .check.interaction({
                        state: 'state_validate_facility_code',
                        reply: [
                            "Please enter the patient's cellphone number, eg: 01234567890"
                        ].join('\n')
                    })
                    .run();
            });
        });

        // describe("from welcome screen, fill in INVALID facility code", function() {
        //     it("should invalidate the facility", function() {
        //         return tester
        //             .setup.user.state('state_validate_facility_code')
        //             .input('')
        //             .check.interaction({
        //                 state: 'state_validate_facility_code',
        //                 reply: [
        //                     'FacilityCode invalid'
        //                 ].join('\n')
        //             })
        //             .run();
        //     });
        // });

        describe("state_patient_id_type: rsaid supplied", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('state_patient_id_type')
                    .input('1')
                    .check.interaction({
                        state: 'state_patient_rsaid',
                        reply: 'Please enter the patient’s ID number.'
                    })
                    .run();
            });
        });

        describe("state_patient_id_type: none", function() {
            it("should ask the patient's age", function() {
                return tester
                    .setup.user.state('state_patient_id_type')
                    .input('2')
                    .check.interaction({
                        state: 'state_patient_dob',
                        reply: 'Please enter the year the patient was born. For example, 1986.'
                    })
                    .run();
            });
        });

        describe("state_patient_sex: male choice", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('state_patient_sex')
                    .input('1')
                    .check.interaction({
                        state: 'state_submit_case',
                        reply: 'Thank you! Your report has been submitted.'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        describe("state_patient_sex: female choice", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('state_patient_sex')
                    .input('2')
                    .check.interaction({
                        state: 'state_submit_case',
                        reply: 'Thank you! Your report has been submitted.'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        describe("state_submit_case: when the case is submitted", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('state_patient_sex')
                    .input('1')
                    .check.interaction({
                        state: 'state_submit_case',
                        reply: 'Thank you! Your report has been submitted.'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

    });
});
