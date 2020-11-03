/**
 * Created by dkilty on 13/02/2017.
 */

var UiUtil = require("../../util/util-ui.js");


var MainDossier=function(){

    var uiUtil=new UiUtil();
    var _dossierTypeModelString="dos.dossierModel.dossierType";
    var _dossierTypeSelect= element(by.model(_dossierTypeModelString));
    var _companyIdText= element(by.model("dos.dossierModel.companyID"));
    var _thirdPartyModelString="dos.dossierModel.drugProduct.thirdPartySigned";
    var _thirdPartySelect= element(by.model(_thirdPartyModelString));
    var  _productNameText= element(by.model("dos.dossierModel.productName"));
    var  _commonNameText= element(by.model("dos.dossierModel.properName"));
    var  _relatedInfoText= element(by.model("dos.dossierModel.relatedInfo"));
    var _isRefProductsModelString="dos.dossierModel.isRefProducts";
    var _isRefProductsSelect= element(by.model(_isRefProductsModelString));




    /**
     * Sets up the browser and launches the form in maximized
     * Imports and binds all required functions. Since this is the top level
     * Element, should handle any dependency function calls
     * @param value
     */
    this.get = function (value) {
        browser.get(value);
        //cannot bind until you have and instance of the browser set
        browser.selectOption=uiUtil.selectOption.bind(browser);
        browser.getUISelectOption=uiUtil.pickUISelectOption.bind(browser);
        browser.UISelectSearch=uiUtil.UISelectSearch.bind(browser);

        browser.getUISelectModelValue=uiUtil.getUISelectModelValue.bind(browser);
        browser.selectTypeAheadPopupValue=uiUtil.selectTypeAheadPopupValue.bind(browser);
        browser.driver.manage().window().maximize();
    };

    this.setDossierTypeByText = function (value) {
        browser.selectOption(by.model(_dossierTypeModelString), value);
    };

    this.getDossierTypeValue = function () {
        return _dossierTypeSelect.getAttribute('value');
    };

    this.setCompanyId = function (value) {
        _companyIdText.sendKeys(value);
    };
    this.getCompanyIdValue = function () {
        return _companyIdText.getAttribute('value');
    };

    /**
     * Set the value by text value
     * @param value
     */
    this.setThirdPartyByText = function (value) {
        browser.selectOption(by.model(_thirdPartyModelString), value);
    };

    this.getThirdPartyValue = function () {
        return _thirdPartySelect.getAttribute('value');
    };

    this.setProductNameValue = function (value) {
        _productNameText.sendKeys(value);
    };
    this.getProductNameValue = function () {
        return _productNameText.getAttribute('value');
    };

    this.setCommonNameValue = function (value) {
        _commonNameText.sendKeys(value);
    };
    this.getCommonNameValue = function () {
        return _commonNameText.getAttribute('value');
    };

    this.setRelatedInfoValue = function (value) {
        _relatedInfoText.sendKeys(value);
    };
    this.getRelatedInfoValue = function () {
        return _relatedInfoText.getAttribute('value');
    };
    this.setIsRefProductByText = function (value) {
        _isRefProductsSelect.element(by.cssContainingText('option', value)).click();
       // browser.selectOption(by.model(_isRefProductsModelString), value);
    };

    this.getIsRefProductValue = function () {
        return _isRefProductsSelect.getAttribute('value');
    };



};

module.exports = MainDossier;