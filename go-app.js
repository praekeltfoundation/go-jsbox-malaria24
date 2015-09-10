// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

/*jshint -W083 */
var Q = require('q');
var moment = require('moment');
var vumigo = require('vumigo_v02');
var Choice = vumigo.states.Choice;
var JsonApi = vumigo.http.api.JsonApi;


// Shared utils lib
go.utils = {

    timed_out: function(im) {
        var no_redirects = [
            'state_start',
            'state_end_thank_you',
            'state_end_thank_translate'
        ];
        return im.msg.session_event === 'new'
            && im.user.state.name
            && no_redirects.indexOf(im.user.state.name) === -1;
    },

    validate_personnel_code: function(im, content) {
        return Q()
            .then(function(q_response) {
                return content === '12345';
            });
    },

    check_valid_number: function(input) {
        // an attempt to solve the insanity of JavaScript numbers
        var numbers_only = new RegExp('^\\d+$');
        return input !== '' && numbers_only.test(input) && !Number.isNaN(Number(input));
    },

    is_valid_msisdn: function(input) {
        // check that it is a number, starts with 0, and has at least 10 digits
        return go.utils.check_valid_number(input) && input[0] === '0' && input.length >= 10;
    },

    check_valid_alpha: function(input) {
        var alpha_only = new RegExp('^[A-Za-z]+$');
        return input !== '' && alpha_only.test(input);
    },

    is_valid_name: function(input) {
        // check that all chars are alphabetical
        return go.utils.check_valid_alpha(input);
    },

    is_valid_day_of_month: function(input) {
        // check that it is a number and between 1 and 31
        return go.utils.check_valid_number(input)
            && parseInt(input, 10) >= 1
            && parseInt(input, 10) <= 31;
    },

    is_valid_year: function(input) {
        // check that it is a number and has four digits
        return input.length === 4 && go.utils.check_valid_number(input);
    },

    get_today: function(config) {
        var today;
        if (config.testing_today) {
            today = new moment(config.testing_today);
        } else {
            today = new moment();
        }
        return today;
    },

    make_month_choices: function($, start, limit, increment) {
        var choices = [
            new Choice('072015', $('July 15')),
            new Choice('062015', $('June 15')),
            new Choice('052015', $('May 15')),
            new Choice('042015', $('Apr 15')),
            new Choice('032015', $('Mar 15')),
            new Choice('022015', $('Feb 15')),
            new Choice('012015', $('Jan 15')),
            new Choice('122014', $('Dec 14')),
            new Choice('112014', $('Nov 14')),
        ];
        return choices;
    },

    track_redials: function(contact, im, decision) {
        var status = contact.extra.status || 'unregistered';
        return Q.all([
            im.metrics.fire.inc(['total', 'redials', 'choice_made', 'last'].join('.')),
            im.metrics.fire.sum(['total', 'redials', 'choice_made', 'sum'].join('.'), 1),
            im.metrics.fire.inc(['total', 'redials', status, 'last'].join('.')),
            im.metrics.fire.sum(['total', 'redials', status, 'sum'].join('.'), 1),
            im.metrics.fire.inc(['total', 'redials', decision, 'last'].join('.')),
            im.metrics.fire.sum(['total', 'redials', decision, 'sum'].join('.'), 1),
            im.metrics.fire.inc(['total', 'redials', status, decision, 'last'].join('.')),
            im.metrics.fire.sum(['total', 'redials', status, decision, 'sum'].join('.'), 1),
        ]);
    },

    get_clean_first_word: function(user_message) {
        return user_message
            .split(" ")[0]          // split off first word
            .replace(/\W/g, '')     // remove non letters
            .toUpperCase();         // capitalise
    },

    control_api_call: function (method, params, payload, endpoint, im) {
        var http = new JsonApi(im, {
            headers: {
                'Authorization': ['Token ' + im.config.control.api_key]
            }
        });
        switch (method) {
            case "post":
                return http.post(im.config.control.url + endpoint, {
                    data: payload
                });
            case "get":
                return http.get(im.config.control.url + endpoint, {
                    params: params
                });
            case "patch":
                return http.patch(im.config.control.url + endpoint, {
                    data: payload
                });
            case "put":
                return http.put(im.config.control.url + endpoint, {
                    params: params,
                  data: payload
                });
            case "delete":
                return http.delete(im.config.control.url + endpoint);
            }
    },

    subscription_unsubscribe_all: function(contact, im) {
        var params = {
            to_addr: contact.msisdn
        };
        return go.utils
        .control_api_call("get", params, null, 'subscription/', im)
        .then(function(json_result) {
            // make all subscriptions inactive
            var subscriptions = json_result.data;
            var clean = true;  // clean tracks if api call is unnecessary
            var patch_calls = [];
            for (i=0; i<subscriptions.length; i++) {
                if (subscriptions[i].active === true) {
                    var updated_subscription = subscriptions[i];
                    var endpoint = 'subscription/' + updated_subscription.id + '/';
                    updated_subscription.active = false;
                    // store the patch calls to be made
                    patch_calls.push(function() {
                        return go.utils.control_api_call("patch", {}, updated_subscription, endpoint, im);
                    });
                    clean = false;
                }
            }
            if (!clean) {
                return Q
                .all(patch_calls.map(Q.try))
                .then(function(results) {
                    var unsubscribe_successes = 0;
                    var unsubscribe_failures = 0;
                    for (var index in results) {
                        (results[index].code >= 200 && results[index].code < 300)
                            ? unsubscribe_successes += 1
                            : unsubscribe_failures += 1;
                    }

                    if (unsubscribe_successes > 0 && unsubscribe_failures > 0) {
                        return Q.all([
                            im.metrics.fire.inc(["total", "subscription_unsubscribe_success", "last"].join('.'), {amount: unsubscribe_successes}),
                            im.metrics.fire.sum(["total", "subscription_unsubscribe_success", "sum"].join('.'), unsubscribe_successes),
                            im.metrics.fire.inc(["total", "subscription_unsubscribe_fail", "last"].join('.'), {amount: unsubscribe_failures}),
                            im.metrics.fire.sum(["total", "subscription_unsubscribe_fail", "sum"].join('.'), unsubscribe_failures)
                        ]);
                    } else if (unsubscribe_successes > 0) {
                        return Q.all([
                            im.metrics.fire.inc(["total", "subscription_unsubscribe_success", "last"].join('.'), {amount: unsubscribe_successes}),
                            im.metrics.fire.sum(["total", "subscription_unsubscribe_success", "sum"].join('.'), unsubscribe_successes)
                        ]);
                    } else if (unsubscribe_failures > 0) {
                        return Q.all([
                            im.metrics.fire.inc(["total", "subscription_unsubscribe_fail", "last"].join('.'), {amount: unsubscribe_failures}),
                            im.metrics.fire.sum(["total", "subscription_unsubscribe_fail", "sum"].join('.'), unsubscribe_failures)
                        ]);
                    } else {
                        return Q();
                    }
                });
            } else {
                return Q();
            }
        });
    },

    opt_out: function(im, contact) {
        contact.extra.optout_last_attempt = go.utils.get_today(im.config)
            .format('YYYY-MM-DD hh:mm:ss.SSS');

        return Q.all([
            im.contacts.save(contact),
            go.utils.subscription_unsubscribe_all(contact, im),
            im.api_request('optout.optout', {
                address_type: "msisdn",
                address_value: contact.msisdn,
                message_id: im.msg.message_id
            })
        ]);
    },

    opt_in: function(im, contact) {
        contact.extra.optin_last_attempt = go.utils.get_today(im.config)
            .format('YYYY-MM-DD hh:mm:ss.SSS');
        return Q.all([
            im.contacts.save(contact),
            im.api_request('optout.cancel_optout', {
                address_type: "msisdn",
                address_value: contact.msisdn
            }),
        ]);
    },

    "commas": "commas"
};

go.app = function() {
  var vumigo = require('vumigo_v02');
  var App = vumigo.App;
  var Choice = vumigo.states.Choice;
  var ChoiceState = vumigo.states.ChoiceState;
  var FreeText = vumigo.states.FreeText;
  var EndState = vumigo.states.EndState;

  var GoApp = App.extend(function(self) {
    App.call(self, 'Facility_Code_Entry');
    var $ = self.$;
    // var interrupt = true;



    self.states.add('Extract_SA_ID_Info', function(name) {
      var question = $("");
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Submit_Case'
      });

    });
    self.states.add('Facility_Code_Entry', function(name) {
      var question = $("Welcome! To report a malaria case, please enter your facility code. For example, 543456");
      var error = $("The facility code is invalid. Please enter again.");
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (1 == 1) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'MSISDN_Entry'
      });
    });
    self.states.add('First_Name_Entry', function(name) {
      var question = $("Please enter the first name of the patient. For example: Mbe");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Last_Name_Entry'
      });
    });
    self.states.add('ID_Type_Entry', function(name) {
      var question = $("What kind of identification does the patient have?");
      return new ChoiceState(name, {
        question: question,
        choices: [
          new Choice('SA_ID_Entry', $("South African ID")),
          new Choice('No_SA_ID_Year_Entry', $("None"))
        ],

        next: function(choice) {
          return choice.value;
        }

      });
    });
    self.states.add('Invalid_Facility_Code_Entry', function(name) {
      var question = $("Sorry, that code is not recognised.");
      return new ChoiceState(name, {
        question: question,
        choices: [
          new Choice('Facility_Code_Entry', $("Try again")),
          new Choice('end', $("Exit"))
        ],

        next: function(choice) {
          return choice.value;
        }

      });
    });
    self.states.add('Invalid_MSISDN_Entry', function(name) {
      var question = $("Sorry, that is an invalid cellphone number.");
      return new ChoiceState(name, {
        question: question,
        choices: [
          new Choice('MSISDN_Entry', $("Try again")),
          new Choice('end', $("Exit"))
        ],

        next: function(choice) {
          return choice.value;
        }

      });
    });
    self.states.add('Invalid_No_SA_ID_Year_Entry', function(name) {
      var question = $("Sorry, that year is invalid.");
      return new ChoiceState(name, {
        question: question,
        choices: [
          new Choice('No_SA_ID_Year_Entry', $("Try again")),
          new Choice('end', $("Exit"))
        ],

        next: function(choice) {
          return choice.value;
        }

      });
    });
    self.states.add('Invalid_SA_ID_Entry', function(name) {
      var question = $("Sorry, that SA ID is not invalid.");
      return new ChoiceState(name, {
        question: question,
        choices: [
          new Choice('SA_ID_Entry', $("Try again")),
          new Choice('end', $("Exit"))
        ],

        next: function(choice) {
          return choice.value;
        }

      });
    });
    self.states.add('Last_Name_Entry', function(name) {
      var question = $("Please enter the first name of the patient. For example: Mbe");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Patient_Abroad_Entry'
      });
    });
    self.states.add('Locality_Entry', function(name) {
      var question = $("Please select the locality where the patient is currently staying:");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'ID_Type_Entry'
      });

    });
    self.states.add('MSISDN_Entry', function(name) {
      var question = $("Please enter the cell phone number of patient or next of kin.");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Validate_MSISDN'
      });
    });
    self.states.add('No_SA_ID_Day_Entry', function(name) {
      var question = $("Please enter the day the patient was born. For example: 12");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'No_SA_ID_Gender_Entry'
      });
    });
    self.states.add('No_SA_ID_Gender_Entry', function(name) {
      return new ChoiceState(name, {
        question: $("Please select the patient’s gender:"),
        choices: [
          new Choice('1', $("Male")),
          new Choice('2', $("Female"))
        ],

        next: 'state_submit_case'
      });
    });
    self.states.add('No_SA_ID_Month_Entry', function(name) {
      var question = $("Please enter the month the patient was born. For example: 12");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'No_SA_ID_Day_Entry'
      });
    });
    self.states.add('No_SA_ID_Year_Entry', function(name) {
      var question = $("Please enter the day the patient was born. For example: 12");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Invalid_No_SA_ID_Year_Entry'
      });
    });
    self.states.add('Patient_Abroad_Entry', function(name) {
      return new ChoiceState(name, {
        question: $("Has the patient travelled outside of the country in the past 2 weeks:"),
        choices: [
          new Choice('1', $("Yes")),
          new Choice('2', $("No")),
          new Choice('2', $("Unknown"))
        ],

        next: 'Locality_Entry'
      });
    });
    self.states.add('SA_ID_Entry', function(name) {
      var question = $("Please enter the patient's ID number");
      var error = $('');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'Validate_SA_ID'
      });
    });
    self.states.add('Submit_Case', function(name) {
      return new EndState(name, {
        text: "Thank you! Your report has been submitted.",
        next_state: 'Facility_Code_Entry'
      });
    });
    self.states.add('Validate_Facility_Code', function(name) {});
    self.states.add('Validate_MSISDN', function(name) {});
    self.states.add('Validate_SA_ID', function(name) {});





  });

  return {
    GoApp: GoApp
  };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoApp = go.app.GoApp;


    return {
        im: new InteractionMachine(api, new GoApp())
    };
}();
