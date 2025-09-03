const company_configsDao = require("../dao/company_configs.dao");

const company_configs_instance = new company_configsDao();

module.exports = {

    getCompanyConfigs: function (req, res, next){
        company_configs_instance.getCompanyConfigs(req, res, next);
    },
};
