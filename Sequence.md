# Malaria USSD Sequence
This is the sequence for the Malaria USSD diagram.

```
@startuml
Nurse -> Malaria24Response: call USSD
Malaria24Response -> Nurse: welcome screen
Nurse -> Malaria24Response: facility code (text)
Malaria24Response -> Malaria24Response: validate code
Malaria24Response -> Nurse: Validated facility code
Malaria24Response -> Nurse: What's the patient's cell number?
Nurse -> Malaria24Response: patient's cell (text)
Malaria24Response -> Nurse: What's the patient's first name?
Nurse -> Malaria24Response: patient's first name (text)
Malaria24Response -> Nurse: What's the patient's surname?
Nurse -> Malaria24Response: patient's surname (text)
Malaria24Response -> Nurse: Has the patient traveled out the country?
Nurse -> Malaria24Response: 1. Yes 2. No 3. Uncertain (choice)
Malaria24Response -> Nurse: What's the patient's locality?
Nurse -> Malaria24Response: 1. Result 2. Result 3. Result. (choice)
Malaria24Response -> Nurse: What kind of identification does the patient have?
Nurse -> Malaria24Response: 1. RSA ID 2. None (choice)

@enduml
```
