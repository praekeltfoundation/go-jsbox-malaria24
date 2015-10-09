module.exports = function() {
    return [{
        "request": {
            "method": "GET",
            "url": "http://www.example.org/api/v1/facility/111111.json"
        },
        "response": {
            "code": 200,
            "data": {
                "facility_name": "A Facility"
            }
        }
    }, {
        "request": {
            "method": "GET",
            "url": "http://www.example.org/api/v1/localities/111111.json"
        },
        "response": {
            "code": 200,
            "data": [
                "Locality 1",
                "Locality 2",
                "Locality 3",
            ]
        }
    }];
};
