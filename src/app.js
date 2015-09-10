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
