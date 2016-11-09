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
        ,'scheduleAModule',
        'dossierDataLists',
        'filterLists',
        'fileIO',
        'contactModule25',
        'contactModule26',
        'applicationInfoService',
        'applicationInfo',
        'ui.bootstrap',
        'filterLists',
       'numberFormat',
        'ngMessages',
        'ngAria',
        'theraClass',
        'animalSourcedSection',
        'tissuesFluidsList'
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
                formType: '@'
                // selectedCountryChanged: '&'
            }
        });

    dossierCtrl.$inject = ['$scope', 'hpfbFileProcessing', 'ApplicationInfoService', 'DossierService'];


    function dossierCtrl($scope, hpfbFileProcessing, ApplicationInfoService, DossierService) {

        var self = this;
        self.showContent = _loadFileContent; //binds the component to the function
        self.formUserType = 'EXT'; //set default to external type
        self.applicationInfoService = new ApplicationInfoService();
        self.userType = "EXT";
        self.saveXMLLabel = "SAVE_DRAFT";

        //config for applicationInfoCompoenent
        self.configField = {
            "label": "DOSSIER_ID",
            "fieldLength": "7",
            "tagName": "dossierId",
            "errorMsg": "MSG_LENGTH_7"
        };
        self.isIncomplete = true;
        self.formAmend = false;
        self.showAllErrors = false;
        self.errorAppendix = [];
        self.extraAppendix = [];
        self.noThera="";
        self.$onInit = function () {

            self.dossierService = new DossierService();

            self.dossierModel = self.dossierService.getDefaultObject();
        }
        /**
         * @ngdoc captures any change events from variable bindings
         * @param changes
         */
        self.$onChanges = function (changes) {

            if (changes.formType) {
                self.userType = changes.formType.currentValue;
                self.userType='EXT';
                if (self.userType == 'INT') {
                    self.saveXMLLabel = "APPROVE_FINAL"
                } else {
                    self.saveXMLLabel = "SAVE_DRAFT"
                }
            }
        };

        self.appendixMissingError = function () {
            return (self.errorAppendix && self.errorAppendix.length > 0);

        };
        self.appendixExtraError = function () {
            return (self.extraAppendix && self.extraAppendix.length > 0);

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
            getAppendix4Errors();
            self.showAllErrors = true;
            disableXMLSave();
        }

        self.recordsChanged=function(){
            getAppendix4Errors();
        }

        self.setApplicationType = function (value) {
            self.dossierModel.applicationType = value;
            self.formAmend = self.dossierModel.applicationType === self.applicationInfoService.getAmendType();
            disableXMLSave();
        };

        function getAppendix4Errors() {
            var appendixCheck = self.dossierService.getMissingAppendix4(self.dossierModel);
            self.errorAppendix = appendixCheck.missing;
            self.extraAppendix = appendixCheck.extra;
        }

        /**
         * @ngdoc Used to determine if the form is incomplete
         *
         * @private
         * @return true if the form is incomplete
         */
        function _setComplete() {
            self.isIncomplete = !self.activityRoot.dossierID;
        }

        $scope.$watch("dos.dossierForm.$invalid", function () {
            disableXMLSave()
        }, true);

        /**
         * @ngdoc disables the XML save button
         */
        function disableXMLSave() {
           var formInvalid=true; //TODO hack
            if(self.dossierForm){
                formInvalid=self.dossierForm.$invalid;
            }
            self.disableXML = (formInvalid || (self.dossierModel.applicationType == self.applicationInfoService.getApprovedType() && self.isExtern()));

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
        self.showErrors = function () {
            return (self.showAllErrors);
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
            if (self.dossierModel.drugProduct.isScheduleA) {

                return true;
            } else {
                self.dossierModel.drugProduct.scheduleAGroup = self.dossierService.getDefaultScheduleA();
            }
            return false;
        }

        /**
         * Save as a json file. Convert interal model to external model for output
         */
        self.saveJson = function () {
            var writeResult = _transformFile();
           hpfbFileProcessing.writeAsJson(writeResult, _createFilename(), self.dossierService.getRootTagName());
            self.showAllErrors = true;
            //_setComplete()
        };

        self.saveXML=function(){
            var writeResult = _transformFile();
            hpfbFileProcessing.writeAsXml(writeResult, _createFilename(), self.dossierService.getRootTagName());
            self.showAllErrors = false;
        }


        /**
         * Takes the internal model and transforms to a json object compatible with the output
         * @returns {*}
         * @private
         */
        function _transformFile() {
            updateDate();
            if (!self.isExtern()) {
                self.dossierModel.enrolmentVersion = self.applicationInfoService.incrementMajorVersion(self.dossierModel.enrolmentVersion);
                self.dossierModel.applicationType = ApplicationInfoService.prototype.getApprovedType();
               // updateModelOnApproval(); //updates all the amend
            } else {
                console.log(self.dossierModel.enrolmentVersion);
                self.dossierModel.enrolmentVersion = self.applicationInfoService.incrementMinorVersion(self.dossierModel.enrolmentVersion);
            }
            return  self.dossierService.dossierToOutput(self.dossierModel);
        };

        /**
         * @ngdoc -creates a filename for dossier file. If it exists,adds control number
         * @returns {string}
         * @private
         */
        function _createFilename() {
            var filename = "HC_DO_Enrolment";
            return filename;
        }

        /**
         * @ngdoc method -updates the date field to the current date
         */
        function updateDate() {
            if (self.dossierModel) {
                self.dossierModel.dateSaved = self.applicationInfoService.getTodayDate();
            }
        }


        /**
         * Manages errors for no Thera
         * @returns {boolean}
         */
        self.noTheraRecs=function() {

            if (!self.dossierModel ||! self.dossierModel.drugProduct) {
                self.noThera = "";
                return false;
            }
            if (!self.dossierModel.drugProduct.therapeutic || self.dossierModel.drugProduct.therapeutic.length === 0) {
                self.noThera = "";
                return true;
            }
            self.noThera =self.dossierModel.drugProduct.therapeutic.length;
            return false;
        }

    }

})();


