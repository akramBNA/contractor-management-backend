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
                    data: get_company_data[0],
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

    async addCompanyInformations(req, res, next) {
        try {
            const {
                company_name,
                company_activity_field,
                company_representative_id,
                company_tax_id,
                company_ss_id,
                company_establishment_year,
                active
            } = req.body;

            if (
                !company_name ||
                !company_activity_field ||
                !company_representative_id ||
                !company_tax_id ||
                !company_ss_id ||
                !company_establishment_year
            ) {
                return res.json({
                    success: false,
                    data: [],
                    message: "All required fields must be provided",
                });
            }

            const newCompany = await company.create({
                company_name,
                company_activity_field,
                company_representative_id,
                company_tax_id,
                company_ss_id,
                company_establishment_year,
            });

            res.status(201).json({
                success: true,
                data: newCompany,
                message: "Company added successfully",
            });

        } catch (error) {
            console.error("Error adding company:", error);
            return next(error);
        }
    };

    async updateCompanyInformations(req, res, next) {
        try {
            const {company_id, company_name, company_activity_field, company_representative_id, company_tax_id, company_ss_id, company_establishment_year } = req.body;

            if ( !company_id || !company_name || !company_activity_field || !company_representative_id || !company_tax_id || !company_ss_id || !company_establishment_year) {
                return res.json({
                    success: false,
                    data: [],
                    message: "All required fields must be provided",
                });
            }

            const [updated] = await company.update(
                {
                    company_name,
                    company_activity_field,
                    company_representative_id,
                    company_tax_id,
                    company_ss_id,
                    company_establishment_year,
                },
                {
                    where: { company_id: company_id }
                }
            );

            if (updated)    {
                const updatedCompany = await company.findOne({ where: { company_id: company_id } });
                res.status(200).json({
                    success: true,
                    data: updatedCompany,
                    message: "Company updated successfully",
                });
            } else {
                res.json({
                    success: false,
                    data: [],
                    message: "Company not found",
                });
            }

        } catch (error) {
            console.error("Error updating company:", error);
            return next(error);
        }
    };

}

module.exports = companyDao;
