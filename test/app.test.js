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

        describe("when the user starts a session", function() {
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

        describe("from welcome screen, fill in facility code", function() {
            it("should validate the facility", function() {
                return tester
                    .setup.user.state('state_welcome')
                    .input('1234567')
                    .check.interaction({
                        state: 'state_validate_facility_code',
                        reply: [
                            'FacilityCode validated!'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("from welcome screen, fill in INVALID facility code", function() {
            it("should invalidate the facility", function() {
                return tester
                    .setup.user.state('state_validate_facility_code')
                    .input('')
                    .check.interaction({
                        state: 'state_validate_facility_code',
                        reply: [
                            'FacilityCode invalid'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user asks to exit", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('state_welcome')
                    .input('2')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });
    });
});
