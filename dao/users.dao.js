const { users } = require("../models/users.models.js");
const { roles } = require("../models/roles.models.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

class usersDao {
  async getAllUsers(req, res, next) {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : null;
      const offset = parseInt(req.query.offset) || 0;

      const get_all_users_query = `
          SELECT users.user_id, users.user_name,
                 users.user_lastname, users.user_email, roles.role_type, roles.role_id
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

      const get_all_roles_query = `SELECT * FROM roles WHERE active='Y' ORDER BY role_id ASC`;
      const get_all_roles_data =await roles.sequelize.query(get_all_roles_query, {
        type: roles.sequelize.QueryTypes.SELECT,
      })

      if (get_all_users_data.length ) {
        res.status(200).json({
          success: true,
          data: get_all_users_data,
          total: get_all_users_data.length,
          roles: get_all_roles_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          total: 0,
          message: "No users found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async addUser(req, res, next) {
    try {
      const {
        user_name,
        user_lastname,
        user_email,
        user_password,
        user_role_id,
      } = req.body;

      const existingUser = await users.findOne({
        where: { user_email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(user_password, 10);

      console.log("data", {
        user_name,
        user_lastname,
        user_email,
        user_password: hashedPassword,
        user_role_id,
      });

      const newUser = await users.create({
        user_name,
        user_lastname,
        user_email,
        user_password: hashedPassword,
        user_role_id,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user_id: newUser.user_id,
          user_name: newUser.user_name,
          user_lastname: newUser.user_lastname,
          user_email: newUser.user_email,
          user_role_id: newUser.user_role_id,
        },
      });
    } catch (error) {
      console.error("Error in addUser:", error);
      return next(error);
    }
  }

  async UserLogin(req, res, next) {
    try {
      const { user_email, user_password } = req.body;

      const user = await users.findOne({
        where: {
          user_email,
          active: "Y",
        },
        include: [
          {
            model: roles,
            as: "roles",
            attributes: ["role_type"],
            where: { active: "Y" },
            required: false,
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        user_password,
        user.user_password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.user_email,
          role: user.user_role_id,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        status: true,
        message: "Login successful",
        data: {
          user_name: user.user_name,
          user_lastname: user.user_lastname,
          user_role_type: user.roles.role_type,
        },
        token,
      });
    } catch (error) {
      console.error("Error in login:", error);
      return next(error);
    }
  }

  async getUserById(req, res, next) {
    const userId = req.params.id;
    try {
      const get_user_by_id_query = `select users.user_name, 
                                    users.user_lastname,
                                    users.user_email,
                                    users.user_password,
                                    roles.role_type,
                                    roles.role_id
                                FROM users
                                LEFT JOIN roles
                                ON users.user_role_id = roles.role_id
                                WHERE users.user_id = ${userId} AND users.active='Y' AND roles.active='Y'`;
      const get_user_by_id_data = await users.sequelize.query(
        get_user_by_id_query,
        {
          type: users.sequelize.QueryTypes.SELECT,
        }
      );

           const get_all_roles_query = `SELECT * FROM roles WHERE active='Y' ORDER BY role_id ASC`;
      const get_all_roles_data =await roles.sequelize.query(get_all_roles_query, {
        type: roles.sequelize.QueryTypes.SELECT,
      });

      if (get_user_by_id_data.length === 0) {
        res.json({
          success: false,
          data: null,
          roles: get_all_roles_data,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        data: get_user_by_id_data[0],
        roles: get_all_roles_data,
        message: "Retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async getUserDataByIdAfterLogin(req, res, next) {
    const userId = req.params.id;

    try {
      const get_user_by_id_query = `select 
                                    users.user_name, 
                                    users.user_lastname,
                                    roles.role_type
                                FROM users
                                LEFT JOIN roles
                                ON users.user_role_id = roles.role_id
                                WHERE users.user_id = ${userId} AND users.active='Y' AND roles.active='Y'`;
      const get_user_by_id_data = await users.sequelize.query(
        get_user_by_id_query,
        {
          type: users.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_user_by_id_data.length === 0) {
        res.json({
          success: false,
          data: null,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        data: get_user_by_id_data,
        message: "Retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    const userId = req.params.id;
    const { user_name, user_lastname, user_email, user_role_id } = req.body;

    try {
      const updatedUser = await users.update(
        {
          user_name,
          user_lastname,
          user_email,
          user_role_id,
        },
        {
          where: { user_id: userId },
        }
      );

      if (updatedUser[0] === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = usersDao;
