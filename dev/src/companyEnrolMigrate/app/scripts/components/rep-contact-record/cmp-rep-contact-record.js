/**
 * Created by dkilty on 8/5/2016.
 */

(function () {
    'use strict';

    angular
        .module('contactModule2', [])
})();

(function () {
    'use strict';

    angular
        .module('contactModule2')
        .component('cmpRepContactRecord', {
            templateUrl: 'app/scripts/components/rep-contact-record/tpl-rep-contact-record.html',
            controller: contactRecCtrl,
            controllerAs: 'contactRec',
            bindings: {
                contactRecord: '<',
                onUpdate: '&',
                updateValid: '&',
                checkRoles: '&',
                onDelete: '&',
                isDetailValid: '&',
                isRoleSelected: '&'
            }
        });
    contactRecCtrl.$inject = ['$scope']
    function contactRecCtrl($scope) {
        var vm = this;
        vm.savePressed = false;
        vm.isContact = true; //used to set the state of the role
        vm.isNotEditable = false;

        //TODO get role model from a servide

        vm.contactModel = {};
        vm.isOneSelected = function (type) {
            return (vm.isRoleSelected({roleName: type, id: vm.contactModel.contactId}));
        }
        vm.$onInit = function () {
            //after init do not initialise variables here onchanges is called first

        }


        /**
         * Due to binding with table expander this method does not get called
         * @param changes
         */
        vm.$onChanges = function (changes) {
            //how this is currently wired, this will never fire!
            if (changes.contactRecord) {
                vm.contactModel = angular.copy(changes.contactRecord.currentValue);

            }
        }

        /**
         *  calls the delete function on the parent
         */
        vm.delete = function () {
            vm.onDelete({contactId: vm.contactModel.contactId});
        }
        /* @ngdoc method -discards the changes and reverts to the model
         *
         */
        vm.discardChanges = function () {
            if (vm.contactRecForm.$pristine) return;
            var currRecord = vm.trackRecordCtrl.trackRecord()
            vm.contactModel = angular.copy(currRecord);
            vm.setNotEditable()
            //since we are reverting back to the last save should be pristine
            vm.contactRecForm.$setPristine();
            vm.isDetailValid({state: vm.contactRecForm.$valid});
            vm.savePressed = false;
        }

        /**
         * @ngdoc method -Updates the parent on whether this record is valid or not
         */
        vm.updateValid = function () {
            vm.isDetailValid({state: (vm.contactRecForm.$valid && !vm.contactRecForm.$dirty)});
        }
        /**
         * If the form is dirty always set that it is not valid
         */
        /* $scope.$watch('contactRec.contactRecForm.$dirty', function() {
         //if statement redundant?
         if(vm.contactRecForm.$dirty) {
         vm.isDetailValid({state:false})
         }
         }, true);*/

        /**
         * Updates the contact model used by the save button
         */
        vm.updateContactModel = function () {
            vm.contactModel.roleConcat = _getRolesConcat();
            if (vm.contactRecForm.$valid) {
                // vm.contactModel.isDetailValid=true;
                vm.isDetailValid({state: true})
                vm.contactRecForm.$setPristine();
                vm.onUpdate({contact: vm.contactModel});
            }
            vm.savePressed = true;
        }
        /**
         * @ngdoc method toggles error state to make errors visible
         * @returns {boolean}
         */
        vm.showErrors = function () {

            return (vm.savePressed)
        }

    }


})();