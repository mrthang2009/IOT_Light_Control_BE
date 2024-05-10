const { User } = require('../../../../models');
const {
  apiResponse,
  fuzzySearch,
  isMongoId,
  asyncForEach,
} = require('../../../../helpers');
const { DEFAULT_PAGINATION } = require('../../../../constants');

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        firstName, lastName, email, password, avatarId, roleId,
      } = req.body;

      const foundEmail = await User.findOne({ email });

      if (foundEmail) {
        return res.status(400).json({
          message: 'Email đã tồn tại',
          error: 'Email đã tồn tại',
        });
      }

      const newUser = {
        firstName,
        lastName,
        email,
        password,
        avatarId: avatarId || null,
        roleId: roleId || null,
      };

      const user = await User.create(newUser);

      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  all: async (req, res, next) => {
    try {
      const users = await User.find({ deletedAt: null }).select(
        '-password -createdAt -updatedAt ',
      );

      const totalUsers = users.length;

      return res.json(
        apiResponse({ payload: users, total: totalUsers }),
      );
    } catch (error) {
      next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || DEFAULT_PAGINATION.LIMIT;
      const skip = limit * (page - 1) || DEFAULT_PAGINATION.SKIP;

      const conditionFind = { deletedAt: null };

      if (keyword) {
        conditionFind.$or = [
          { firstName: { $regex: fuzzySearch(keyword) } },
          { lastName: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
        ];
      }
      const list = await User.find(conditionFind)
        .select('-password -createdAt -updatedAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments(conditionFind);
      const totalUsersPerPage = list.length;

      return res.json(
        apiResponse({
          payload: list,
          total: totalUsers,
          totalPerPage: totalUsersPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  detail: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const user = await User.findOne({
        _id: id,
        deletedAt: null,
      }).select('-password -createdAt -updatedAt ');

      if (!user) return next();
      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  updateInformation: async (req, res, next) => {
    try {
      const {
        firstName, lastName, email,
      } = req.body;

      const { id } = req.params;

      const user = await User.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          firstName,
          lastName,
          email,
        },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      if (!user) return next();
      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const find = await User.findOne({
        _id: id,
        deletedAt: null,
      });

      const errors = [];

      const isCorrectPassOld = await find.isValidPass(oldPassword);
      const isCorrectPassNew = await find.isValidPass(newPassword);

      if (!isCorrectPassOld) {
        errors.push('Mật khẩu cũ không đúng');
      }

      if (isCorrectPassNew) {
        errors.push('Mật khẩu mới không được trùng với mật khẩu cũ');
      }

      if (newPassword !== confirmPassword) {
        errors.push('Xác thực mật khẩu mới không khớp');
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Thay đổi mật khẩu thất bại',
          error: `${errors}`,
        });
      }

      const user = await User.findOneAndUpdate(
        { _id: id },
        { password: newPassword },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  deleteSigle: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await User.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      if (!user) return next();

      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  deleteMultiple: async (req, res, next) => {
    try {
      const { ids } = req.body;

      // Kiểm tra xem ids có phải là một mảng và tất cả các phần tử trong mảng có phải là id không
      const areAllIdsValid = Array.isArray(ids) && ids.every(id => isMongoId(id));
      if (!areAllIdsValid) {
        return res.status(400).json({
          message: 'Ids phải là một mảng các id hợp lệ',
          error: 'Ids không hợp lệ',
        });
      }

      const errors = [];
      const results = [];
      await asyncForEach(ids, async (id) => {
        const deleteMultiple = await User.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (!deleteMultiple) {
          errors.push(`${deleteMultiple.fullName}`);
        } else {
          results.push(deleteMultiple);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa người dùng ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
