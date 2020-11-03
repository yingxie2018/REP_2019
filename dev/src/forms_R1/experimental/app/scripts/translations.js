angular.module("translations", []).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en", {
  "DOSSIER_ENROL":"Dossier Enrol Form",
    "job_title":"Job Title",
    "language_correspondance":"Language of Correspondence",
    "en":"English",
    "fr":"French",
    "contact_record": "Contact Record",
    "E":"Edited",
    "A": "Record Added",
    "N": "New / Added",
    "D":"Deleted",
    "company_id":"Company ID",
    "formulation_details":"Formulation Record",
    "enrolment_version": "Enrolment Version",
    "appendix4_group": "Animal/ human sourced record",
    "COMPANY_ENROL":"REP Company Form",
    "contact_record":"Contact Record",
    "address_record":"Address Record",
    "given_name":"Given Name",
    "initials": "Initials",
    "__text": "Save Value",
    "_label_en":"English Caption",
    "_label_fr":"French Caption"
});

}]);
