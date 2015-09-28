go.app = function() {
  var vumigo = require('vumigo_v02');
  var Q = require('q');
  var _ = require('lodash');
  var Ona = require('go-jsbox-ona').Ona;
  var App = vumigo.App;
  var Choice = vumigo.states.Choice;
  var ChoiceState = vumigo.states.ChoiceState;
  var FreeText = vumigo.states.FreeText;
  var EndState = vumigo.states.EndState;

  var GoApp = App.extend(function(self) {
    App.call(self, 'Facility_Code_Entry');
    var $ = self.$;

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
          var facility = _.result(_.find(self.im.config.facilities, {'FacCode': content}), 'Facility');
          if (!facility) {
            return error;
          }
        },
        next: 'Facility_Code_Confirm'
      });
    });

    self.states.add('Facility_Code_Confirm', function(name) {
      return Q()
        .then(function () {
          var facName = _.result(_.find(self.im.config.facilities, {'FacCode': self.im.user.answers.Facility_Code_Entry}), 'Facility');
          var question = $("Please confirm that you are reporting from '" + facName + "'");
          return new ChoiceState(name, {
            question: question,
            choices: [
              new Choice('MSISDN_Entry', "Confirm"),
              new Choice('Facility_Code_Entry', "Not my facility")
            ],
            next: function(choice) {
              return choice.value;
            }
          });
        });

    });

    self.states.add('MSISDN_Entry', function(name) {
      var question = $("Please enter the South African cell phone number of patient or next of kin. E.g. 0794784022. 'none' for no number.");
      var error = $('Sorry, that number is not valid');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (!go.utils.is_none_msisdn(content) && !go.utils.is_valid_msisdn(content)) {
            return error;
          }
        },
        next: 'First_Name_Entry'
      });
    });

    self.states.add('First_Name_Entry', function(name) {
      var question = $("Please enter the first name of the patient. For example: Mbe");
      return new FreeText(name, {
        question: question,
        next: 'Last_Name_Entry'
      });
    });

    self.states.add('Last_Name_Entry', function(name) {
      var question = $("Please enter the last name of the patient. For example: Ngu");
      return new FreeText(name, {
        question: question,
        next: 'Patient_Abroad_Entry'
      });
    });

    self.states.add('Patient_Abroad_Entry', function(name) {
      return new ChoiceState(name, {
        question: $("Has the patient travelled outside of the country in the past 2 weeks:"),
        choices: [
          new Choice('1', $("Yes")),
          new Choice('2', $("No")),
          new Choice('3', $("Unknown"))
        ],
        next: 'Locality_Entry'
      });
    });

    self.states.add('Locality_Entry', function(name) {
      var question = $("Please select the locality where the patient is currently staying:");
      return Q()
        .then(function() {
          // Resolve a code to a district
          var district = _.result(_.find(self.im.config.facilities, {'FacCode': self.im.user.answers.Facility_Code_Entry}), 'District');
          var localities = _.unique(_.pluck(_.filter(self.im.config.facilities, {
            'District': district
          }), 'Sub-District (Locality)'));

          return localities;

        })
        .then(function(localities) {
          return new ChoiceState(name, {
            question: question,
            choices: localities.map(function(locality) {
              return new Choice(locality, locality);
            }),
            next: 'Landmark_Entry'
          });
        });

    });

    self.states.add('Landmark_Entry', function(name) {
      var question = $("What is the closest landmark for the patient?");
      return new ChoiceState(name, {
        question: question,
        choices: self.im.config.landmarks.map(function(landmark) {
          return new Choice(landmark, landmark);
        }),
        next: 'ID_Type_Entry'
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

    self.states.add('SA_ID_Entry', function(name) {
      var question = $("Please enter the patient's ID number");
      var error = $('Sorry, that SA ID is not valid');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (!go.utils.validate_id_sa(content)) {
            return error;
          }
        },
        next: 'Submit_Case'
      });

    });

    self.states.add('No_SA_ID_Year_Entry', function(name) {
      var question = $("Please enter the year the patient was born. For example: 1982");
      var error = $('Sorry, that year is invalid');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (content.length != 4 || isNaN(content)) {
            return error;
          }
        },
        next: 'No_SA_ID_Month_Entry'
      });
    });

    self.states.add('No_SA_ID_Month_Entry', function(name) {
      var question = $("Please enter the month the patient was born. For example: 12");
      var error = $('Sorry, that month is invalid.');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (isNaN(content) || (parseInt(content, 10) > 12 || parseInt(content, 10) < 1)) {
            return error;
          }
        },
        next: 'No_SA_ID_Day_Entry'
      });
    });

    self.states.add('No_SA_ID_Day_Entry', function(name) {
      var question = $("Please enter the day the patient was born. For example: 12");
      var error = $('Sorry, that day is invalid.');
      return new FreeText(name, {
        question: question,
        check: function(content) {
          if (isNaN(content) || (parseInt(content, 10) > 31 || parseInt(content, 10) < 1)) {
            return error;
          }
        },
        next: 'No_SA_ID_Gender_Entry'
      });

    });
    self.states.add('No_SA_ID_Gender_Entry', function(name) {
      return new ChoiceState(name, {
        question: $("Please select the patient's gender:"),
        choices: [
          new Choice('1', $("Male")),
          new Choice('2', $("Female"))
        ],

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
          var data = self.im.user.answers;
          data.create_date_time = new Date();
          data.reported_by = self.im.user.addr;
          data.gender = (self.im.user.answers.No_SA_ID_Gender_Entry == 1) ? "male" : "female";
          said = data.SA_ID_Entry;
          if (data.SA_ID_Entry) {
            data.No_SA_ID_Year_Entry = said.substring(0, 2);
            data.No_SA_ID_Month_Entry = said.substring(2, 4);
            data.No_SA_ID_Day_Entry = said.substring(4, 6);
          }

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
            next: 'Facility_Code_Entry'
          });
        });

    });
    // END NEW STEPS

    self.create_ona_submission = function(data) {
      var submission = {
        facility_code: data.Facility_Code_Entry,
        reported_by: data.reported_by,
        first_name: data.First_Name_Entry,
        id_type: data.ID_Type_Entry,
        last_name: data.Last_Name_Entry,
        locality: data.Locality_Entry,
        msisdn: data.MSISDN_Entry,
        date_of_birth: String(data.No_SA_ID_Year_Entry) + String(data.No_SA_ID_Month_Entry) + String(data.No_SA_ID_Day_Entry),
        create_date_time: data.create_date_time,
        abroad: data.Patient_Abroad_Entry,
        sa_id_number: data.SA_ID_Entry,
        gender: data.gender,
        landmark: data.Landmark_Entry,

      };

      return submission;
    };

  });

  return {
    GoApp: GoApp
  };
}();
