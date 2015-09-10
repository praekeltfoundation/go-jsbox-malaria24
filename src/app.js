go.app = function() {
  var vumigo = require('vumigo_v02');
  var App = vumigo.App;
  var Choice = vumigo.states.Choice;
  var ChoiceState = vumigo.states.ChoiceState;
  var FreeText = vumigo.states.FreeText;
  var EndState = vumigo.states.EndState;
  // var Ona = require('go-jsbox-ona').Ona;

  var GoApp = App.extend(function(self) {
    App.call(self, 'Facility_Code_Entry');
    var $ = self.$;
    // var interrupt = true;

    // NEW STEPS
    self.states.add('Extract_SA_ID_Info', function(name) {

    });

    self.states.add('Facility_Code_Entry', function(name) {
      var question = $("Welcome! To report a malaria case, please enter your " +
        "facility code. For example, 543456");
      var error = $("The facility code is invalid. Please enter again.");
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (isNaN(content)) {
            return error;
          }
        },
        next: 'MSISDN_Entry'
      });
    });

    self.states.add('MSISDN_Entry', function(name) {
      var question = $("Please enter the cell phone number of patient or next of kin.");
      var error = $('Sorry, that number is not valid');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'First_Name_Entry'
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
    self.states.add('Last_Name_Entry', function(name) {
      var question = $("Please enter the last name of the patient. For example: Ngu");
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
        next: 'No_SA_ID_Gender_Entry'
      });

    });
    self.states.add('No_SA_ID_Year_Entry', function(name) {
      var question = $("Please enter the year the patient was born. For example: 1982");
      var error = $('Sorry, that year is invalid');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (true) {
            return null; // vumi expects null or undefined if check passes
          } else {
            return error;
          }
        },
        next: 'No_SA_ID_Month_Entry'
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
      var error = $('Sorry, that SA ID is not valid');
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
    self.states.add('Submit_Case', function(name) {
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
            JSON.stringify(err.response)
          ].join(' '));
        })
        .then(function() {
          return new EndState(name, {
            text: "Thank you! Your report has been submitted.",
            next_state: 'Facility_Code_Entry'
          });
        });

    });
    // END NEW STEPS

    self.create_ona_submission = function(data) {
      var submission = {
        facility_code: data.Facility_Code_Entry,
        reported_by: self.im.user.addr,
        first_name: data.First_Name_Entry,
        id_type: data.ID_Type_Entry,
        last_name: data.Last_Name_Entry,
        locality: data.Locality_Entry,
        msisdn: data.MSISDN_Entry,
        date_of_birth: data.dob,
        create_date_time: self.now(),
        abroad: data.Patient_Abroad_Entry,
        sa_id_number: data.SA_ID_Entry,
        gender: data.No_SA_ID_Gender_Entry,

      };

      // if ((typeof data.toilet.code === 'string') &&
      //     (typeof data.toilet.lat === 'number') &&
      //     (typeof data.toilet.lon === 'number')) {
      //     var offsets = self.calculate_gps_offsets(data.toilet.code);
      //     submission.toilet_location = [
      //         data.toilet.lat + offsets.lat,
      //         data.toilet.lon + offsets.lon,
      //     ].join(' ');
      // }
      submission = _.defaults(submission, {
        toilet_code: data.query,
        toilet_section: "None",
        toilet_cluster: "None",
        issue: data.issue,
        // toilet_location is omitted if there is no valid
        // value.
      });
      return submission;
    };


  });

  return {
    GoApp: GoApp
  };
}();
