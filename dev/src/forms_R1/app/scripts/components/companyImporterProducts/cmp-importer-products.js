/**
 * Created by dkilty on 25/01/2017.
 */

(function () {
    'use strict';

    angular
        .module('importerProducts', ['dossierIdDetails'])
})();

(function () {
    'use strict';
///test das asdsadsa
    angular
        .module('importerProducts')
        .component('cmpImporterProducts', {
            templateUrl: 'app/scripts/components/companyImporterProducts/tpl-importer-products.html',
            controller: importerProductsCtrl,
            controllerAs: 'impProdCtrl',
            bindings: {
                updateValid: '&',
                onDelete: '&',
                isAmend: '<',
                isDetailValid: '&',
                importerRecord: '<',
                onUpdate: '&'

            }
        });
    //importerProductsCtrl.$inject = [];

    function importerProductsCtrl() {
        var vm = this;
        vm.savePressed = false;
        vm.formAmend = false;
        vm.someProducts=false;
        vm.recordReadOnly = false; //needed for din
        vm.productTypeList=['ALL_PRODUCTS','SELECTED_PRODUCTS'];
        //vm.isNotEditable = false;

        vm.model = {
            selectedProducts: "",
            dossierIdList: []
        };

        vm.$onInit = function () {
            vm.productTypeChanged();
        };

        /**
         * Due to binding with table expander this method does not get called
         * @param changes
         */
        vm.$onChanges = function (changes) {
            if (changes.importerRecord && changes.importerRecord.currentValue) {
                vm.model = (changes.importerRecord.currentValue);
                console.log("there was a change")
            }
        };

        vm.addDossierId = function () {
            if (!(vm.model.dossierIdList instanceof Array)) {
                vm.model.dossierIdList = [];
            }
            vm.model.dossierIdList.push({dossierId: ""});
            ///form is invalid if adding a din
            vm.isDetailValid({state: false});

        };

        vm.deleteId = function (index) {
            //using index in
            if (index >  vm.model.dossierIdList.length - 1) {
                return;
            }
            vm.model.dossierIdList.splice(index, 1);
            vm.isDetailValid({state: true});
        };


        /**
         * @ngdoc method toggles error state to make errors visible
         * @returns {boolean}
         */
        vm.showErrors = function () {

            return (vm.savePressed)
        };
        vm.isIdInvalid = function (index) {
            return !( vm.model.dossierIdList[index].dossierId &&  vm.model.dossierIdList[index].dossierId.length === 7);
        };

        vm.productTypeChanged=function(){

            if(vm.model.selectedProducts==="ALL_PRODUCTS"){
                //clear out the dossier list
                vm.model.dossierIdList=[];
                vm.someProducts=false;
            }else{
                vm.someProducts=true;
                if(vm.model.dossierIdList.length===0){
                    vm.model.dossierIdList.push({dossierId:""});
                }
            }

        }

        /**
         * Controls errors state of an individual UI control. Since cannot pass the control for some reason
         * pass the needed state variables... very annoying
         * @param isTouched
         * @param isInvalid
         * @returns {boolean}
         */
        vm.showError = function (isTouched, isInvalid) {

            return (isInvalid && isTouched) || (vm.showErrors() && isInvalid );
        };


        /**
         * @ngdoc method used to determine if record should be editable. Used for amend
         * @returns {boolean}
         */
        vm.setNotEditable = function () {
           // vm.recordReadOnly = vm.formAmend && !vm.activityModel.amendRecord;
           /// return (vm.recordReadOnly);
            return false;
        }

    }


})();