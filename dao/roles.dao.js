const roles = require("../models/roles.models");

class rolesDao {
  async getAllRoles(req, res, next) {
    try {
      const get_all_roles_query = "SELECT * FROM roles  WHERE active='Y' ORDER BY role_id ASC";
      const get_all_roles_data = await roles.sequelize.query(
        get_all_roles_query,
        {
          type: roles.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_roles_data) {
        res.status(200).json({
          status: true,
          data: get_all_roles_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = rolesDao;
