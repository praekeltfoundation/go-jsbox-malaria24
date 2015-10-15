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
        return ('' + sum).slice(-1) == check;
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

    // Handy to leave at the bottom to ensure trailing commas in objects
    // don't become syntax errors.
    "commas": "commas"
};
