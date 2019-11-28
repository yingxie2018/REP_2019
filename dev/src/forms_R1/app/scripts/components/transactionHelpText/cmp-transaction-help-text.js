(function () {
    'use strict';
    angular
        .module('transactionHelpText', [
            'services',
            'filterLists'
        ])

})();


(function () {
    'use strict';
    angular
        .module('transactionHelpText')
        .component('cmpTransactionHelpText', {
            templateUrl: 'app/scripts/components/transactionHelpText/tpl-transaction-help-text.html',
            controller: TransactionHelpTextCtrl,
            controllerAs: 'help',
            bindings: {
                htIndxList: '<'
            }
        });

    TransactionHelpTextCtrl.$inject = [
        '$translate',
        '$scope'];

    function TransactionHelpTextCtrl( $translate, $scope) {

        var vm = this;
        var asdf = 'sdfsdfdsf';
        // vm.transactionService = new TransactionService();
        // vm.indxList = vm.transactionService.helpTextSequences;
        vm.lang = $translate.proposedLanguage() || $translate.use();

        vm.$onInit = function () {
            //vm.updateSummary=vm.updateSummary+1;
            // console.log('indx list: ' + vm.htIndxList);
        };

    }
})();

