var OnaFixtures = require('go-jsbox-ona').OnaFixtures;
var moment = require('moment');

onafixtures = new OnaFixtures({url: "http://ona.io/api/v1/"});
onafixtures.submit.add({
    data: {
        id: "1",
        submission: {
            "facility_code": "111111",
            "reported_by": "+27123456789",
            "first_name": "First_Name_Entry",
            "id_type": "said",
            "last_name": "Last_Name_Entry",
            "locality": "Locality_Entry",
            "locality_other": "Locality_Entry_Other",
            "msisdn": "MSISDN_Entry",
            "date_of_birth": "1989-05-10",
            "create_date_time": '2015-01-01T00:00:00Z',
            "abroad": "Patient_Abroad_Entry",
            "sa_id_number": "8905100273087",
            "gender": "female",
            "landmark": "Landmark_Entry",
            "landmark_description": "Landmark_Entry_Description",
            "case_number": "20150101-111111-1"
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

onafixtures.submit.add({
    data: {
        id: "1",
        submission: {
            "facility_code": "111111",
            "reported_by": "+27123456789",
            "first_name": "First_Name_Entry",
            "id_type": "none",
            "last_name": "Last_Name_Entry",
            "locality": "Locality_Entry",
            "locality_other": "Locality_Entry_Other",
            "msisdn": "MSISDN_Entry",
            "date_of_birth": "1980-02-02",
            "create_date_time": "2015-01-01T00:00:00Z",
            "abroad": "Patient_Abroad_Entry",
            "sa_id_number": null,
            "gender": "female",
            "landmark": "Landmark_Entry",
            "landmark_description": "Landmark_Entry_Description",
            "case_number": "20150101-111111-1" }
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
