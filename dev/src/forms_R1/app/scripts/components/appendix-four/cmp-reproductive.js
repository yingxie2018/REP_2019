/**
 * Created by dkilty on 17/11/2016.
 */

(function () {
    'use strict';

    angular
        .module('reprodModule', ['errorMessageModule', 'drugProductService'])
})();


(function () {
    'use strict';

    angular
        .module('reprodModule')
        .component('cmpReproductiveSystem', {
            templateUrl: 'app/scripts/components/appendix-four/tpl-reproductive.html',
            controllerAs: 'sysCtrl',
            controller: reproductiveSystemController,
            bindings: {
                record: '<',
                isFileLoaded: '<',
                updateRecord: '<',
                otherUpdate: '&',
                concatUpdate: '&',
                showErrors:'&',
                addBtn: '<'
            }

        });

    reproductiveSystemController.$inject=['$scope', 'DrugProductService']
    function reproductiveSystemController($scope, DrugProductService) {
        var vm = this;
        vm.model = {};
        vm.isSelected = "";
        vm.requiredOnly = [{type: "required", displayAlias: "MSG_ERR_MAND"}];

        vm.$onInit = function () {
            vm.drugProductService = new DrugProductService();
            vm.isSelected = vm.isFileLoaded == true && vm.drugProductService.checkSelectedValues(vm.model, 'Reproductive') ? "selected" : "";
            _setIdNames();
        };
        vm.$onChanges = function (changes) {
            if (changes.record) {
                vm.model = (changes.record.currentValue);
                vm.updateErrorState();
            }
            if (changes.addBtn && changes.addBtn.currentValue > 1){
                vm.isSelected = 'selected';
            }
            if(changes.updateRecord){
                vm.updateErrorState();
            }
        };

        vm.detailsChanged = function (alias, value) {

            vm.concatUpdate({'alias': alias, 'value': value});
            // vm.updateErrorState();
        };


        vm.updateErrorState = function () {
            var keys = Object.keys(vm.model);
            for (var i = 0; i < keys.length; i++) {
                var val = vm.model[keys[i]];
                if (val) {
                    if (keys[i] === 'otherReproductive') {
                        if (!vm.model.otherDetails) {
                            vm.isSelected = "";
                            return
                        }
                        vm.isSelected = "selected";
                        return;
                    } else {
                        vm.isSelected = "selected";
                        return;
                    }
                }
            }
            vm.isSelected = ""
        };


        vm.otherChanged = function () {
            var state = false;
            if (vm.model.otherReproductive) {
                state = true;
            } else {
                state = false;
                vm.model.otherDetails = "";
            }
            vm.otherUpdate();
            // vm.updateErrorState();
            return state;
        };
        function _setIdNames() {
            var scopeId = "_" + $scope.$id;
            vm.roleMissingId = "roleMissing" + scopeId;
            vm.systemRoleId = "reproductive_legend" + scopeId;
            vm.otherDetailsId = "reproductive_details" + scopeId;
        }
    }
})();
