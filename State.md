# Malaria USSD State
This is the state diagram for the Malaria USSD diagram.

```
@startuml
scale 900 width


[*] --> Facility_Code_Entry : Nurse dial's USSD number
Facility_Code_Entry : Welcome! To report a malaria case, please enter your facility code. For example, 543456

Facility_Code_Entry --> Validate_Facility_Code : validate facility code
Validate_Facility_Code --> Invalid_Facility_Code_Entry : facility code invalid
Invalid_Facility_Code_Entry: Sorry, that code is not recognised.
Invalid_Facility_Code_Entry: 1. try again
Invalid_Facility_Code_Entry: 2. exit
Invalid_Facility_Code_Entry --> [*] : 2
Invalid_Facility_Code_Entry --> Facility_Code_Entry : 1
Validate_Facility_Code --> MSISDN_Entry : facility code valid
MSISDN_Entry : Please enter the cell phone number of patient or next of kin.

MSISDN_Entry --> Validate_MSISDN : validate MSISDN
Validate_MSISDN --> First_Name_Entry : valid MSISDN
Validate_MSISDN --> Invalid_MSISDN_Entry : invalid MSISDN

Invalid_MSISDN_Entry : Sorry, that number is invalid:
Invalid_MSISDN_Entry: 1. try again
Invalid_MSISDN_Entry: 2. exit

Invalid_MSISDN_Entry --> MSISDN_Entry : 1
Invalid_MSISDN_Entry --> [*] : 2


First_Name_Entry : Please enter the first name of the patient. For example Mbe
First_Name_Entry --> Last_Name_Entry
Last_Name_Entry : Please enter the surname of the patient

Last_Name_Entry --> Patient_Abroad_Entry
Patient_Abroad_Entry : Has the patient travelled outside of the country in the past 2 weeks?
Patient_Abroad_Entry: 1. Yes
Patient_Abroad_Entry : 2. No
Patient_Abroad_Entry : 3. Unknown
Patient_Abroad_Entry --> Locality_Entry
Locality_Entry : lookups from supplied
Locality_Entry --> ID_Type_Entry
ID_Type_Entry --> SA_ID_Entry : 1
ID_Type_Entry : 1. South African ID
ID_Type_Entry : 2. None

ID_Type_Entry --> No_SA_ID_Year_Entry : 2
No_SA_ID_Year_Entry : Please enter the year the patient was born. For example, 1986.
No_SA_ID_Year_Entry --> Invalid_No_SA_ID_Year_Entry : Invalid year
Invalid_No_SA_ID_Year_Entry: Sorry, that year is not valid
Invalid_No_SA_ID_Year_Entry : 1. try again
Invalid_No_SA_ID_Year_Entry : 2. exit

Invalid_No_SA_ID_Year_Entry --> [*] : 2
Invalid_No_SA_ID_Year_Entry --> No_SA_ID_Year_Entry : 1


No_SA_ID_Year_Entry --> No_SA_ID_Month_Entry : Valid year
No_SA_ID_Month_Entry : Please select the patient’s month of birth
No_SA_ID_Month_Entry --> No_SA_ID_Day_Entry

No_SA_ID_Day_Entry : Please enter the day the patient was born. For example
No_SA_ID_Day_Entry --> No_SA_ID_Gender_Entry

No_SA_ID_Gender_Entry : Please select the patient’s gender
No_SA_ID_Gender_Entry : 1. Male
No_SA_ID_Gender_Entry : 2. Female
No_SA_ID_Gender_Entry --> Submit_Case : 1|2

SA_ID_Entry : Please enter the patient’s ID number
SA_ID_Entry --> Validate_SA_ID

Validate_SA_ID --> Extract_SA_ID_Info : valid SAID
Validate_SA_ID --> Invalid_SA_ID_Entry : invalid SAID


Invalid_SA_ID_Entry : Sorry, SA ID is not valid
Invalid_SA_ID_Entry : 1. try again
Invalid_SA_ID_Entry : 2. exit
Invalid_SA_ID_Entry --> SA_ID_Entry : 1
Invalid_SA_ID_Entry --> [*] : 2

Extract_SA_ID_Info --> Submit_Case
Extract_SA_ID_Info : Date of birth
Extract_SA_ID_Info : Age
Extract_SA_ID_Info : Gender

Submit_Case --> [*]

Submit_Case: Thank you! Your report has been submitted.

Submit_Case --> GenerateCase

@enduml
```
