go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var _ = require('underscore');
    var fs = require('fs');
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var PaginatedChoiceState = vumigo.states.PaginatedChoiceState;
    var EndState = vumigo.states.EndState;


    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');
        var $ = self.$;

        self.states.add('states:lookup', function(name) {
            var provinces = self.im.sandbox_config.get("locations.json", {json: true});
            provinces = JSON.parse(fs.readFileSync("src/lookups/provinces.json", "utf8"));
            console.log("app.js");
            console.log(provinces);
            console.log("/app.js");
            province_array = [];
            _.each(provinces, function(val) {
                province_array.push(val.Province);
            });

            return new PaginatedChoiceState(name, {
                question: 'What province do you belong to?' + provinces,
                choices: province_array,
                next: function(choice) {
                    return choice.value;
                }
            });
        });

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
