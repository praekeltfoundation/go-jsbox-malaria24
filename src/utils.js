/*jshint -W083 */

var moment = require('moment');

// Shared utils lib
go.utils = {

    is_none_msisdn: function (content) {
      if (content.toLowerCase() == 'none') {
        return true;
      }
    },

    is_valid_msisdn: function (content) {
        return !isNaN(content) &&
            parseInt(content[0], 10) === 0 &&
            content.length == 10;
    },

    validate_id_sa: function(id) {
        var i, c,
            even = '',
            sum = 0,
            check = id.slice(-1);

        if (id.length != 13 || id.match(/\D/)) {
            return false;
        }
        id = id.substr(0, id.length - 1);
        for (i = 0; id.charAt(i); i += 2) {
            c = id.charAt(i);
            sum += +c;
            even += id.charAt(i + 1);
        }
        even = '' + even * 2;
        for (i = 0; even.charAt(i); i++) {
            c = even.charAt(i);
            sum += +c;
        }
        sum = 10 - ('' + sum).charAt(1);
        if(('' + sum).slice(-1) == check){
            //the id_no is valid. Then check that valid will accept the date
            var year = parseInt(id.substr(0,2));
            var month = parseInt(id.substr(2,2)); 
            var day = parseInt(id.substr(4,2)); 
            var date= moment([year, month - 1, day]).format('YY-MM-DD');
            return date.toString() !=='Invalid date' ;

        }
       return false;
    },

    parse_gender_from_id: function (id) {
        if(parseInt(id.charAt(6)) < 5) {
            return 'female';
        } else {
            return 'male';
        }
    },

    now: function () {
        return moment();
    },

    generate_case_number: function (im, facility_code) {
        return im.api_request('kv.incr', {
            key: 'facility_code:' + facility_code,
            amount: 1,
        })
        .then(function(result){
            return result.value;
        })
        .then(function(sequence_number) {
            return [
                go.utils.now().format('YYYYMMDD'),
                facility_code,
                sequence_number,
            ].join('-');
        });
    },

    get_date_of_birth: function (data) {
        var year, month, day;
        var current_year = parseInt(moment().format('YY'), 10);
        if (data.SA_ID_Entry) {
            var said = data.SA_ID_Entry;
            two_digit_year = said.substring(0, 2);
            if(parseInt(two_digit_year, 10) < current_year) {
                year = parseInt('20' + two_digit_year, 10);
            } else {
                year = parseInt('19' + two_digit_year, 10);
            }
            month = parseInt(said.substring(2, 4), 10);
            day = parseInt(said.substring(4, 6), 10);
        } else {
            year = parseInt(data.No_SA_ID_Year_Entry, 10);
            month = parseInt(data.No_SA_ID_Month_Entry, 10);
            day = parseInt(data.No_SA_ID_Day_Entry, 10);
        }
        // NOTE: Javascript months are zero based
        return moment([year, month - 1, day]).format('YYYY-MM-DD');
    },

    // Handy to leave at the bottom to ensure trailing commas in objects
    // don't become syntax errors.
    "commas": "commas"
};
