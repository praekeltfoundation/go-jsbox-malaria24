go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
    var Ona = require('go-jsbox-ona').Ona;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.states.add('states:start', function(name) {
            return new ChoiceState(name, {
                question: 'Hi there! What do you want to do?',

                choices: [
                    new Choice('states:start', 'Show this menu again'),
                    new Choice('states:end', 'Exit')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });


        self.states.add('states:send-report', function(name, data) {
        // Delegation State
        // This state sends the collected information to the Snappy Bridge API,
        // and then reports the success back to the user.
            return Q()
                .then(function() {
                    // Send response to Ona
                    var ona_conf = self.im.config.ona;
                    if (typeof ona_conf == 'undefined') {
                        return self.im.log.info([
                            "No Ona API configured.",
                            "Not submitting data to Ona."
                        ].join(" "));
                    }
                    var ona = new Ona(self.im, {
                        auth: {
                            username: ona_conf.username,
                            password: ona_conf.password
                        },
                        url: ona_conf.url
                    });
                    var submission = self.create_ona_submission(data);
                    return ona.submit({
                        id: self.im.config.ona.id,
                        submission: submission,
                    });
                })
                .fail(function(err) {
                    // Check for Ona response error
                    return self.im.log.error([
                        'Error when sending data to Ona:',
                        JSON.stringify(err.response)].join(' '));
                })
                .then(function() {
                    // Return success to user
                    return notify_success(name);
                });
        });


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
