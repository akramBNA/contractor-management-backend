const company = require("../models/company.models");

class companyDao {
    async getCompanyInformations (req, res ,next) {
            try {   
                const get_conpany_query =`SELECT * FROM company WHERE active='Y'`;
    
                const get_conpany_data = await company.sequelize.query(get_conpany_query, 
                    {
                        type: company.sequelize.QueryTypes.SELECT
                    }
                );
    
            if(get_conpany_data){
                res.status(200).json({
                    success: true,
                    data: get_conpany_data,
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

module.exports = companyDao;
