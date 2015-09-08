go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.states.add('states:start', function(name) {
            return new ChoiceState(name, {
                question: 'Welcome! To report a malaria case, please enter your facility code. For example, 543456',

                choices: [
                    new Choice('states:start', 'Show this menu again'),
                    new Choice('states:end', 'Exit')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('welcome', function(name) {};
        self.states.add('validate_facility_code', function(name) {};
        self.states.add('invalid_facility_code', function(name) {};
        self.states.add('patient_mssisdn', function(name) {};
        self.states.add('patient_firstname', function(name) {};
        self.states.add('patient_suranme', function(name) {};
        self.states.add('patient_travel_abroad', function(name) {};
        self.states.add('patient_locality', function(name) {};
        self.states.add('patient_rsaid', function(name) {};
        self.states.add('patient_noid', function(name) {};
        self.states.add('patient_dob', function(name) {};
        self.states.add('patient_sex', function(name) {};
        self.states.add('submit_case', function(name) {};




        self.states.add('states:end', function(name) {
            return new EndState(name, {
                text: 'Thanks, cheers!',
                next: 'states:start'
            });
        });
    });

    return {
        GoApp: GoApp
    };
}();
