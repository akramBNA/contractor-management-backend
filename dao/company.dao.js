const company  = require("../models/company.models");

class companyDao {
    async getCompanyInformations(req, res, next) {
        try {
            const get_company_data = await company.findAll({
                where: { active: "Y" }
            });

            if (get_company_data && get_company_data.length > 0) {
                res.status(200).json({
                    success: true,
                    data: get_company_data,
                    message: "Data retrieved successfully",
                });
            } else {
                res.json({
                    success: false,
                    data: [],
                    message: "No data found",
                });
            }
        } catch (error) {
            return next(error);
        }
    };

    async addCompanyInformations(req, res, next) {};
}

module.exports = companyDao;
