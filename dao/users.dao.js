const  {users}  = require("../models/users.models.js");

class usersDao {
  async getAllUsers(req, res, next) {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : null;
      const offset = parseInt(req.query.offset) || 0;

      const get_all_users_query = `
          SELECT users.user_id, users.user_name,
                 users.user_lastname, users.user_email, roles.role_type
          FROM users 
          LEFT JOIN roles ON roles.role_id = users.user_role_id
          WHERE users.active = 'Y' AND roles.active = 'Y'
          ORDER BY user_id ASC
          ${limit ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;

      const get_all_users_data = await users.sequelize.query(
        get_all_users_query,
        {
          type: users.sequelize.QueryTypes.SELECT,
        }
      );

      const totalCountQuery = `SELECT COUNT(*) as total FROM users WHERE active = 'Y'`;
      const totalCountResult = await users.sequelize.query(totalCountQuery, {
        type: users.sequelize.QueryTypes.SELECT,
      });

      const total = totalCountResult[0]?.total || 0;

      res.status(200).json({
        status: true,
        data: get_all_users_data,
        total: total,
        message: "Retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = usersDao;
