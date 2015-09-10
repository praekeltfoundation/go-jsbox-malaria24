# Malaria USSD State
This is the state diagram for the Malaria USSD diagram.

```
@startuml
scale 900 width


[*] --> Facility_Code_Entry : Nurse dial's USSD number

Facility_Code_Entry : *VALIDATION - lookup against facility code list
Facility_Code_Entry : Message: Welcome! To report a malaria case, please enter your facility code. For example, 543456
Facility_Code_Entry : Type: text
Facility_Code_Entry : *Error; Sorry, that code is not recognised
Facility_Code_Entry --> [*]
Facility_Code_Entry --> MSISDN_Entry : validate facility code

MSISDN_Entry : *VALIDATION - valid cellphone number
MSISDN_Entry : Message: Please enter the cell phone number of patient or next of kin.
MSISDN_Entry : Type: text
MSISDN_Entry : *Error; Sorry, that number is invalid
MSISDN_Entry --> [*]
MSISDN_Entry --> First_Name_Entry : validate MSISDN

First_Name_Entry : Message: Please enter the first name of the patient. For example Mbe
First_Name_Entry : Type: text
First_Name_Entry --> Last_Name_Entry

Last_Name_Entry : Message: Please enter the surname of the patient
Last_Name_Entry --> Patient_Abroad_Entry

Patient_Abroad_Entry : Message: Has the patient travelled outside of the country in the past 2 weeks?
Patient_Abroad_Entry: Type: choice
Patient_Abroad_Entry: 1. Yes
Patient_Abroad_Entry : 2. No
Patient_Abroad_Entry : 3. Unknown
Patient_Abroad_Entry --> Locality_Entry

Locality_Entry : lookups from supplied
Locality_Entry : Type: json lookup from config
Locality_Entry --> ID_Type_Entry

ID_Type_Entry : Message: What kind of identification does the patient have?
ID_Type_Entry : Type: choice
ID_Type_Entry : 1. South African ID
ID_Type_Entry : 2. None
ID_Type_Entry --> SA_ID_Entry : 1
ID_Type_Entry --> No_SA_ID_Year_Entry : 2

No_SA_ID_Year_Entry : *VALIDATION -
No_SA_ID_Year_Entry : Please enter the year the patient was born. For example, 1986.
No_SA_ID_Year_Entry : Type: text
No_SA_ID_Year_Entry : *Error: Sorry, that year is invalid

No_SA_ID_Year_Entry --> No_SA_ID_Month_Entry : Valid year
No_SA_ID_Month_Entry : Please select the patient’s month of birth
No_SA_ID_Month_Entry : * COMPONENT: Month selector
No_SA_ID_Month_Entry --> No_SA_ID_Day_Entry

No_SA_ID_Day_Entry : *VALIDATION: Day in month
No_SA_ID_Day_Entry : Please enter the day the patient was born. For example
No_SA_ID_Day_Entry : *Error: That day is invalid
No_SA_ID_Day_Entry --> No_SA_ID_Gender_Entry

No_SA_ID_Gender_Entry : Please select the patient’s gender
No_SA_ID_Gender_Entry : 1. Male
No_SA_ID_Gender_Entry : 2. Female
No_SA_ID_Gender_Entry --> Submit_Case : 1|2

SA_ID_Entry : *VALIDATION
SA_ID_Entry : Please enter the patient’s ID number
SA_ID_Entry: Error, Sorry, SA ID is not valid
SA_ID_Entry --> Extract_SA_ID_Info

Extract_SA_ID_Info --> Submit_Case
Extract_SA_ID_Info : Date of birth
Extract_SA_ID_Info : Age
Extract_SA_ID_Info : Gender

Submit_Case --> [*]

Submit_Case: Thank you! Your report has been submitted.
Submit_Case --> Generate_Case

@enduml
```
