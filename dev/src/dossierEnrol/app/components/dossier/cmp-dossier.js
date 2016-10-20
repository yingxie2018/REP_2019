/**
 * Created by Abdessamad on 6/29/2016.
 */


(function () {
    'use strict';

    var dependencies = [
        'expandingTable'
        ,'tabsModule'
        ,'refProductListModule'
        ,'drugUseModule'
        ,'therapeuticClassModule'
        ,'scheduleAModule',
        'dossierDataLists',
        'filterLists',
        'fileIO',
        'contactModule25',
        'contactModule26',
        'applicationInfoService',
        'applicationInfo',
        'ui.bootstrap',
        'hpfbConstants'
       // 'numberFormatModule'
    ];

    angular
        .module('dossierModule', dependencies);
})();

(function () {
    'use strict';
    angular
        .module('dossierModule')
        .component('cmpDossier', {
        templateUrl: './components/dossier/tpl-dossier.html',
        controller: dossierCtrl,
        controllerAs: 'dos',
        bindings: {
            dossierRecordInput: '<',
            onUpdateDossier: '&',
            onDeleteDossier: '&',
            formType:'@'
            // selectedCountryChanged: '&'
        }
    });

    dossierCtrl.$inject = ['$scope','hpfbFileProcessing', 'ApplicationInfoService','DossierService'];


    function dossierCtrl($scope, hpfbFileProcessing,ApplicationInfoService,DossierService) {

        var self = this;
        self.showContent = _loadFileContent; //binds the component to the function
        self.formUserType='EXT'; //set default to external type
        self.applicationInfoService = new ApplicationInfoService();
        //config for applicationInfoCompoenent
        self.configField = {
            "label": "DOSSIER_ID",
            "fieldLength": "7",
            "tagName": "dossierID",
            "errorMsg": "MSG_LENGTH_7"
        };
        self.isIncomplete=true;
        self.formAmend=false;
        self.showAllErrors = false;
        self.errorAppendix=[];

        /*

         "company_id": "A",
         "enrolment_version": "1.23",
         "date_saved": "1999-01-21",
         "application_type": "APPROVED",
         "software_version": "string",
         "data_checksum": "string",

         */

        self.$onInit = function(){

            self.dossierService = new DossierService();

            self.dossierModel = self.dossierService.getDefaultObject();
        }
        /**
         * @ngdoc captures any change events from variable bindings
         * @param changes
         */
        self.$onChanges=function(changes){
            if(changes.formType){
                self.userFormType=changes.formType.currentValue;
            }
        };

        self.appendixMissingError=function(){
            return(self.errorAppendix &&self.errorAppendix.length>0);

        };

        function _loadFileContent(fileContent) {
            if (!fileContent)return;
            var resultJson = fileContent.jsonResult;
            if (resultJson) {

                   // console.info('file loaded ... ' + JSON.stringify(resultJson));
                    self.dossierModel = self.dossierService.loadFromFile(resultJson);



             //process file load results
                //load into data model as result json is not null
            }
            //if content is attempted to be loaded show all the errors
            self.showAllErrors=true;
            disableXMLSave();
        }

        self.setApplicationType = function (value) {
            self.dossierModel.applicationType = value;
            self.formAmend= self.dossierModel.applicationType === self.applicationInfoService.getAmendType();
            disableXMLSave();
        };

        /**
         * @ngdoc Used to determine if the form is incomplete
         *
         * @private
         * @return true if the form is incomplete
         */
        function _setComplete() {
            self.isIncomplete = !self.activityRoot.dossierID;
        }


        /**
         * @ngdoc disables the XML save button
         */
        function disableXMLSave(){
            self.disableXML = self.dossierForm.$invalid || (self.dossierModel.applicationType== self.applicationInfoService.getApprovedType() && self.isExtern());

        }

        /**
         * @ngdoc - determines if the form is the internal or the external version
         * @returns {boolean}
         */
        self.isExtern = function () {
            return self.userType == "EXT";

        };


        /**
         * Used to show all the fields in an error state. Can be activated by a parent component
         * @returns {boolean}
         */
        self.showErrors=function(){
            return(self.showAllErrors);
        }
        /**
         * For individual controls, whether to show the error for a fiedl
         * @param isInvalid - control $invalid flag
         * @param isTouched -control $touched flag
         * @returns {*|dossierCtrl.showErrors}
         */
        self.showError = function (isInvalid, isTouched) {
            return ((isInvalid && isTouched) || (self.showErrors() && isInvalid))
        }

        /***
         * Manages the schedule A details since the fields are always in the model
         */
        self.isSchedA = function () {
            if (!self.dossierModel || !self.dossierModel.drugProduct || !self.dossierService) return false; //never happen case;
            if(self.dossierModel.drugProduct.isScheduleA){

                return true;
            }else{
                self.dossierModel.drugProduct.scheduleAGroup = self.dossierService.getDefaultScheduleA();
            }
            return false;
        }

    }

})();


