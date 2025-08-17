const companyDao = require("../dao/company.dao.js");

const company_instance = new companyDao();

module.exports = {
    getCompanyInformations: function (req, res, next) {
        company_instance.getCompanyInformations(req, res, next);
    },
};
