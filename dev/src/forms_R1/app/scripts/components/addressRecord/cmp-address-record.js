/**
 * Created by dkilty on 8/5/2016.
 */
(function () {
    'use strict';

    angular
        .module('addressRecord', [
            'addressModule',
            'addressRole',
            'filterLists',
            //'importerProducts',
            'hpfbConstants',
            'errorSummaryModule',
            'errorMessageModule',
            'dataLists'
        ])
})();

(function () {
    'use strict';

    angular
        .module('addressRecord')
        .component('cmpAddressRecord', {
            templateUrl: 'app/scripts/components/addressRecord/tpl-address-record.html',
            controller: addressRecCtrl,
            controllerAs: 'addressRec',

            bindings: {
                addressRecord: '<',
                onUpdate: '&',
                updateValid: '&',
                checkRoles: '&',
                onDelete: '&',
                isAmend: '<',
                isDetailValid: '&',
                isRoleSelected: '&',
                recordIndex: '<',
                htIndxList: '<',
                errorSummaryUpdate: '&', /* used to message that errorSummary needs updating */
                showErrorSummary:'<',
                updateErrorSummary:'&', //update the parent error summary
                isIn:'<',
                isFocus: '<',
                cancelFocus: '&',
                inUseFlag:'<'
            }
        });
    addressRecCtrl.$inject = ['$scope', 'CANADA', '$filter', 'getCountryAndProvinces','$translate', 'INTERNAL_TYPE', 'EXTERNAL_TYPE'];

    function addressRecCtrl($scope, CANADA,$filter, getCountryAndProvinces, $translate, INTERNAL_TYPE, EXTERNAL_TYPE) {
        var vm = this;
        vm.des = false;
        vm.lang = $translate.proposedLanguage() || $translate.use();
        vm.isContact = false;
        vm.isEditable = true;
        vm.formAmend = false;
        vm.isImporter = false;
        vm.updateCountry = 0;
        vm.updateSummary=0; //triggers and error summary update
        vm.setSummaryFocus=0; //sets the summary focus
        vm.addressRecForm = "";
        vm.showSummary=false;
        vm.isInternal = false;
        //TODO get  model from a servide
        vm.addressModel = {
            addressID: 1,
            companyName: "",
            businessNumber: "",
            importerID:"",
            amendRecord: false,
            addressRole: {
                manufacturer: false,
                mailing: false,
                billing: false,
                importer: false
            },
            street: "",
            city: "",
            provLov: "",
            stateList: "",
            stateText: "",
            country: "",
            countryHtml: "",
            postalCode: ""
            /**importerProducts: {
                selectedProducts: "",
                dossierIdList: []
            }*/
        };
        vm.alias = {
            "roleMissing": {
                "type": "fieldset",
                "parent": "fs_roleMissing"
            },
            "postal": {
                "type": "pattern",
                "errorType": "POSTAL_FORMAT"
            }
        };
        vm.requiredOnly = [{type: "required", displayAlias: "MSG_ERR_MAND"}];
        vm.length6Error = [{type: "required", displayAlias: "MSG_ERR_MAND"},
            {type: "minlength", displayAlias: "MSG_LENGTH_MIN5"}
            ];


        /*
         * Sends the message up to determine if a role has already been selected.
         *
         */
        vm.isOneSelected = function (type) {
            return (vm.isRoleSelected({roleName: type, id: vm.addressModel.addressID}));
        };
        vm.$onInit = function () {
            _setIdNames();
            vm.updateErrorSummaryState();
            vm.importerProductState(vm.addressModel.addressRole.importer);
        };
        //TODO move to service
        function _getRolesConcat() {
            var addressRoles = vm.addressModel.addressRole;
            var result = "";

            if (addressRoles.manufacturer) {
                result = result + " MFR,"
            }
            if (addressRoles.billing) {
                result = result + " BILL,"
            }
            if (addressRoles.mailing) {
                result = result + " MAIL,"
            }
            if (addressRoles.importer) {
                result = result + " IMP,"
            }
            result = result.substring(0, result.length - 1);
            return result
        }

        /**
         * Determines if a canadian importer role has been selected
         * @returns {boolean} true -if importer
         */
        vm.notCanadianManufact = function () {
            if (!vm.addressModel) return false;
            return (vm.addressModel.addressRole.manufacturer === true && vm.addressModel.country.id !== CANADA);

        };
        vm.focusOnSummary = function () {
            vm.setSummaryFocus = vm.setSummaryFocus + 1;
        };
        vm.updateErrorSummaryState=function(){
            vm.updateSummary= vm.updateSummary+1;
        };


        /**
         * Due to binding with table expander this method does not get called
         * @param changes
         */
        vm.$onChanges = function (changes) {
            //how this is currently wired, this will never fire!
            if (changes.addressRecord) {
                vm.addressModel = angular.copy(changes.addressRecord.currentValue);
                vm.addressModel.roleConcat = _getRolesConcat();
                vm.setEditable();
                //vm.importerProductState(vm.addressModel.addressRole.importer);
                //angular.element(saveAddress).trigger('focus');
            }
            if (changes.isAmend) {
                vm.formAmend = changes.isAmend.currentValue;
                vm.addressModel.amendRecord = changes.isAmend.currentValue;
                vm.setEditable();
            }
            if(changes.showErrorSummary){
                vm.showSummary=changes.showErrorSummary.currentValue;
                vm.updateErrorSummaryState();
            }
            if(changes.isIn){
                    if(changes.isIn.currentValue===INTERNAL_TYPE){
                        vm.isInternal=true;
                    }
                    else {
                        vm.isInternal=false;
                    }
            }
        };

        /**
         *  calls the delete function on the parent
         */
        vm.delete = function () {
            vm.onDelete({addressId: vm.addressModel.addressID});
            vm.updateErrorSummary();
            var ele = document.getElementById("addAddressBtn");
            console.log("tab element: " + ele);
            if( ele !== null ) ele.focus();
        };
        /* @ngdoc method -discards the changes and reverts to the model
         *
         */
        vm.discardChanges = function () {
            if (vm.addressRecForm.$pristine) return;
            var currRecord = vm.addressRecord;
            vm.addressModel = angular.copy(currRecord);
            vm.setEditable(); //case of amend
            vm.addressRecForm.$setPristine();
            vm.isDetailValid({state: vm.addressRecForm.$valid});
            if (vm.addressModel) {
                vm.onUpdate({rec: vm.addressModel});
            }
            vm.errorSummaryUpdate();
            vm.importerProductState(vm.addressModel.addressRole.importer)
        };
        //TODO obsolete?
        vm.onAddressRoleUpdate = function (newRole) {
            var aRole = {};
            angular.extend(aRole, newRole);
            vm.addressModel.addressRole = aRole;
            vm.updateAddressModel2();
        };
        vm.importerProductState = function (state) {
            var isImporterPre = vm.isImporter;
            vm.isImporter = state;
            if (vm.isImporter) {
                vm.addressModel.addressRole.manufacturer = false;
                // vm.addressModel.addressRole.mailing = false;
                // vm.addressModel.addressRole.billing = false;
                vm.addressModel.country=$filter('filter')(getCountryAndProvinces.getCountries(),{id: CANADA})[0];
                vm.addressModel.countryHtml = vm.addressModel.country[vm.lang];
                vm.updateCountry++;

            }
            if (!vm.isImporter) {
                /**vm.addressModel.importerProducts = {
                    "selectedProducts": "",
                    "dossierIdLislamt": []
                };*/
                vm.addressModel.importerID = "";
            }
            if(isImporterPre && ! vm.isImporter){
                vm.deselectImporter(!vm.isImporter);
            }
            /**else if (vm.addressModel.importerProducts.dossierIdList.length === 0) {
                vm.addressModel.importerProducts.dossierIdList.push({dossierId: ""})
            }*/
        };

        vm.deselectImporter = function (state){
          vm.des = state;
          if(vm.des){
              vm.addressModel.addressRole.importer = false;
              vm.addressModel.importerID = "";
          }
          if(vm.isImporter && vm.des){
              vm.isImporter = false;
              vm.addressModel.country = '';
              vm.addressModel.countryHtml = '';
              vm.updateCountry++;
          }


        };

        /**
         * @ngdoc method -Updates the parent on whether this record is valid or not
         */
        vm.updateValid = function () {
            vm.isDetailValid({state: (vm.addressRecForm.$valid && !vm.addressRecForm.$dirty)});
        };

        $scope.$watch('addressRec.addressRecForm.$dirty', function () {
            if (vm.addressRecForm.$dirty) {
                vm.isDetailValid({state: false})
            }
        }, true);

        $scope.$watch('addressRec.addressRecForm.$error', function () {
            vm.updateErrorSummaryState();
            vm.updateErrorSummary();
        }, true);



        /**
         * Updates the contact model used by the save button
         */
        vm.updateAddressModel2 = function () {
            vm.addressModel.roleConcat = _getRolesConcat();
            if (vm.addressRecForm.$valid) {
                vm.isDetailValid({state: true});
                vm.addressRecForm.$setPristine();
                vm.addressModel.focusCompanyName = false;
                vm.onUpdate({rec: vm.addressModel});
                vm.showSummary=false;
                vm.errorSummaryUpdate(); //updating parent
                vm.cancelFocus();
            } else {
                vm.showSummary = true;
                vm.updateErrorSummaryState(); //updating current
                vm.focusOnSummary()
            }
        };
        vm.getInvalid = function(){
            return vm.addressRecForm.$valid;
        }
        /**
         * @ngdoc method toggles error state to make errors visible
         * @returns {boolean}
         */
        vm.showErrors = function () {
            return((vm.showSummary));
        };


        /**
         * @ngdoc method used to determine if record should be editable. Used for amend
         * @returns {boolean}
         */
        vm.setEditable = function () {
            vm.isEditable = !(vm.formAmend && !vm.addressModel.amendRecord);
        };

        function _setIdNames() {
            var scopeId="_"+  $scope.$id;
            vm.companyNameId = "COMPANYNAME" +scopeId;
            vm.importerID = "importerID" + scopeId;
            vm.formNameId="company-address-record-form"+scopeId;
            vm.businessNumberId = "businessNumberId" + scopeId;
        }

    }


})();