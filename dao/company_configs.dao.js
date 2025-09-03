const company_configs = require("../models/company_configs.models");

class company_configsDao {
    async getCompanyConfigs (req, res ,next) {
        try {   
            const get_conpany_configs_query =`SELECT * FROM company_configs WHERE active='Y'`;

            const get_conpany_configs_data = await company_configs.sequelize.query(get_conpany_configs_query, 
                {
                    type: company_configs.sequelize.QueryTypes.SELECT
                }
            );

        if(get_conpany_configs_data){
            res.status(200).json({
                success: true,
                data: get_conpany_configs_data,
                message: 'Data retrieved successfully'
            })
        } else {
            res.json({
                success: false,
                data: [],
                message: 'Failed to retrieve data'
            })
        }
            
        } catch(error) {
            return next (error);
        }
    }
}

module.exports = company_configsDao;
