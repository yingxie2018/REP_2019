/**
 * Created by Abdessamad on 7/5/2016.
 */

(function () {
    'use strict';

    angular
        .module('contactModule', [
            'dataLists',
            'hpfbConstants',
            'errorMessageModule'
        ])
})();

(function () {
    'use strict';

    angular
        .module('contactModule')
        .component('cmpContactDetails',{
            templateUrl: 'app/scripts/components/contactDetails/tpl-contact-details.html',
            controller: contactCtrl,
            controllerAs: 'contCtrl',
            bindings: {
                contactRecord: '<',
                onUpdate: '&', //should be removed not used, deprecated
                isAmend: '<',
                showErrors: '&',
                faxMandatory:'@',
                updateErrorSummary:'&',
                fieldSuffix:'<',
                routingIdIndex:'<',
                showRoutingId: '&',
                showAddrImpCompanyName: '&',
                addrImpCompanyName:'<',
                isContact:'<'
            }
    });

    contactCtrl.$inject = ['getContactLists','ENGLISH','FRENCH','$scope'];
    function contactCtrl( getContactLists,ENGLISH,FRENCH,$scope) {
        var vm = this;
        vm.isEditable = true;
        vm.ngModelOptSetting = {updateOn: 'blur'};
     //   vm.salutationList = getContactLists.getSalutationList();
        vm.langCorresppond=[ENGLISH,FRENCH];
        vm.faxRequired=false; //default to false for backwards compatibility
       vm.phoneReg=/^([0-9]*$)/;
        vm.emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        vm.contactModel = {
            givenName: "",
            surname: "",
            initials: "",
            title: "",
            language: "",
            phone: "",
            phoneExt: "",
            fax: "",
            email: "",
            routingId: "",
            impCompanyName:""
        };
        vm.inputModelOptions={updateOn: 'blur'};
        vm.fldId=""; //used to dynamically distinguish fields default to empty for backwards compat
        vm.requiredOnly = [{type: "required", displayAlias: "MSG_ERR_MAND"}];
        vm.emailError=[{type: "required", displayAlias: "MSG_ERR_MAND"},{type: "pattern", displayAlias: "MSG_ERR_EMAIL_FORMAT"}];
        vm.phoneError=[{type: "required", displayAlias: "MSG_ERR_MAND"},{type: "pattern", displayAlias: "MSG_ERR_PHONE_FORMAT"}];
        vm.faxError=[{type: "required", displayAlias: "MSG_ERR_MAND"},{type: "pattern", displayAlias: "MSG_ERR_FAX_FORMAT"}];
        vm.routingIdError=[{type: "required", displayAlias: "MSG_ERR_MAND"}, {type: "pattern", displayAlias: "TYPE_PATTERN"}];
        vm.addrImpCompanyNameError=[{typs: "required", displayAlias: "MSG_ERR_MAND"}];
        vm.$onInit = function () {
           vm.langList=[ENGLISH,FRENCH];
            _setIdNames();
        };

        vm.$onChanges=function(changes){
            if(changes.contactRecord){
                vm.contactModel = changes.contactRecord.currentValue;

            }
            if (changes.isAmend) {
                vm.isEditable = changes.isAmend.currentValue;
            }
            if(changes.faxMandatory){
               vm.faxRequired=changes.faxMandatory.currentValue;
            }
            if(changes.fieldSuffix){
                vm.fldId=changes.fieldSuffix.currentValue;
                if(!vm.fldId){
                    vm.fldId="";
                }
            }

        };
        vm.showError=function(ctrl){
            if(!ctrl){
                return false;
            }
            if((ctrl.$invalid && ctrl.$touched) || (vm.showErrors()&&ctrl.$invalid )){
                return true
            }
            return false
        }
        vm.showRoutingIdErr = function () {
            return  vm.contactForm[vm.routingIdentifierId].$invalid;
        }

        vm.hasAddrImpCompany = function () {
            if (vm.addrImpCompanyName.length > 0){
                return true;
            }
            return false;
        };

        function _setIdNames() {
            var scopeId = vm.fldId+ "_" + $scope.$id;
            vm.firstNameId="firstName" + scopeId;
            vm.lastNameId="lastName" + scopeId;
            vm.langCorrespondId="langCorrespond" + scopeId;
            vm.jobTitleId="jobTitle" + scopeId;
            vm.faxId="fax_number" + scopeId;
            vm.phoneNumberId="phoneNumber" + scopeId;
            vm.phoneExtId="phoneExt" + scopeId;
            vm.contactEmailId="contactEmail" + scopeId;
            vm.routingIdentifierId="routing_id" + scopeId;
            vm.impCompanyNameId="imp_company_name" + scopeId;
        }
        $scope.$watch('contCtrl.contactForm.$error', function () {
            vm.updateErrorSummary();
        }, true);
    }

})();

