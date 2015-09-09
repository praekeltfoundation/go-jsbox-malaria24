# Malaria USSD State
This is the state diagram for the Malaria USSD diagram.

```
@startuml
scale 900 width


[*] --> FacilityCodeEntry : Nurse dial's USSD number
FacilityCodeEntry : Welcome! To report a malaria case, please enter your facility code. For example, 543456

FacilityCodeEntry --> ValidateFacilityCode : validate facility code
ValidateFacilityCode --> InvalidFacilityCodeEntry : facility code invalid
InvalidFacilityCodeEntry: Sorry, that code is not recognised.
InvalidFacilityCodeEntry: 1. try again
InvalidFacilityCodeEntry: 2. exit
InvalidFacilityCodeEntry --> [*] : 2
InvalidFacilityCodeEntry --> FacilityCodeEntry : 1
ValidateFacilityCode --> MSSISDNEntry : facility code valid
MSSISDNEntry : Please enter the cell phone number of patient or next of kin.



MSSISDNEntry --> InvalidMSSISDNEntry : MSSISDN invalid
InvalidMSSISDNEntry : Sorry, that number is invalid:
InvalidMSSISDNEntry: 1. try again
InvalidMSSISDNEntry: 2. exit

InvalidMSSISDNEntry --> [*] : 2

MSSISDNEntry --> FirstNameEntry : MSSISDN valid
FirstNameEntry : Please enter the first name of the patient. For example Mbe
FirstNameEntry --> LastNameEntry
LastNameEntry : Please enter the surname of the patient

LastNameEntry --> PatientAbroadEntry
PatientAbroadEntry : Has the patient travelled outside of the country in the past 2 weeks?
PatientAbroadEntry: 1. Yes
PatientAbroadEntry : 2. No
PatientAbroadEntry : 3. Unknown
PatientAbroadEntry --> LocalityEntry
LocalityEntry : lookups from supplied
LocalityEntry --> IDTypeEntry
IDTypeEntry --> SAIDEntry : 1
IDTypeEntry : 1. South African ID
IDTypeEntry : 2. None

IDTypeEntry --> NoSAIDYearEntry : 2
NoSAIDYearEntry : Please enter the year the patient was born. For example, 1986.
NoSAIDYearEntry --> InvalidNoSAIDYearEntry : Invalid year
InvalidNoSAIDYearEntry: Sorry, that year is not valid
InvalidNoSAIDYearEntry : 1. try again
InvalidNoSAIDYearEntry : 2. exit

InvalidNoSAIDYearEntry --> [*] : 2
InvalidNoSAIDYearEntry --> NoSAIDYearEntry : 1


NoSAIDYearEntry --> NoSAIDMonthEntry : Valid year
NoSAIDMonthEntry : Please select the patient’s month of birth
NoSAIDMonthEntry --> NoSAIDDayEntry
NoSAIDDayEntry : Please enter the day the patient was born. For example
NoSAIDDayEntry --> NoSAAIDGenderEntry
NoSAAIDGenderEntry : Please select the patient’s gender
NoSAAIDGenderEntry : 1. Male
NoSAAIDGenderEntry : 2. Female

NoSAAIDGenderEntry --> SubmitCase : 1|2
SAIDEntry : Please enter the patient’s ID number
SAIDEntry --> InvalidSAIDEntry : invalid SA ID

InvalidSAIDEntry : Sorry, SA ID is not valid
InvalidSAIDEntry : 1. try again
InvalidSAIDEntry : 2. exit

InvalidSAIDEntry --> SAIDEntry : 1
InvalidSAIDEntry --> [*] : 2

SAIDEntry --> ExtractSAIDInfo
ExtractSAIDInfo --> SubmitCase
ExtractSAIDInfo : Date of birth
ExtractSAIDInfo : Age
ExtractSAIDInfo : Gender

SubmitCase --> [*]

SubmitCase: Thank you! Your report has been submitted.

SubmitCase --> GenerateCase

@enduml
```
