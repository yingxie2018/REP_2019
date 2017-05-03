/**
 * Created by dkilty on 27/04/2017.
 */


var CspTimelySub = function () {

    var _subStatement_modelString="timelySubCtrl.model.submissionStatement";
    var _approvalDate_modelString="timelySubCtrl.model.approvalDate";
    var _country_modelString="timelySubCtrl.model.country";
    var _otherCountry_modelString="timelySubCtrl.model.otherCountry";
    /**
     *
     * @constructor
     */
    this.CspTimelySub = function () {

    };

    this.setSubStatementValue = function (parent, value) {
        parent.element(by.model(_subStatement_modelString)).sendKeys(value);
    };

    this.getSubStatementValue = function (parent) {
        return parent.element(by.model(_subStatement_modelString)).getAttribute('value');
    };


    this.setCountryValue = function (parent, value) {
        browser.selectOption(by.model(_country_modelString), value,parent);
    };

    this.getCountryValue = function (parent) {
        return parent.element(by.model(_country_modelString)).getAttribute('value');
    };

    this.setApprovalDateValue = function (parent, value) {
        parent.element(by.model(_approvalDate_modelString)).sendKeys(value);
    };

    this.getApprovalDateValue = function (parent) {
        return parent.element(by.model(_approvalDate_modelString)).getAttribute('value');
    };
    this.setOtherCountryValue = function (parent, value) {
        parent.element(by.model(_otherCountry_modelString)).sendKeys(value);
    };

    this.setOtherCountryValue = function (parent) {
        return parent.element(by.model(_otherCountry_modelString)).getAttribute('value');
    };


};

module.exports = CspTimelySub;