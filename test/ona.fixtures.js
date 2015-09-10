var OnaFixtures = require('go-jsbox-ona').OnaFixtures;

onafixtures = new OnaFixtures({url: "http://ona.io/api/v1/"});

onafixtures.submit.add({
    data: {
        id: '1',
        submission: {
          "facility_code": "FAC123",
          "reported_by": "0123456789",
          "first_name": "FirstName",
          "id_type": "IDType",
          "last_name": "LastName",
          "locality": "Locality",
          "msisdn": "9876543210",
          "date_of_birth": "2015-09-10",
          "create_date_time": "2015-09-10",
          "abroad": "Yes",
          "sa_id_number": "1122335063082",
          "gender": "male",
        }
    },
    response: {
        data: {
            "instanceID": "uuid:4a89f4f7cc044e45a5f887487406307e",
            "encrypted": false,
            "submissionDate": "1970-01-01T02:00:01+02:00",
            "formid": "1",
            "message": "Successful submission.",
            "markedAsCompleteDate": "1970-01-01T02:00:01+02:00"
        }
    }
});

module.exports = onafixtures;
