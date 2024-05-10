const { Device } = require("../../../../models");
const {
  fuzzySearch,
  apiResponse,
  isMongoId,
  asyncForEach,
} = require("../../../../helpers");
const { DEFAULT_PAGINATION } = require("../../../../constants");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      // Tạo category với coverImageId từ media._id
      const newDevice = new Device({
        name,
        description,
      });
      await newDevice.save();

      return res.json(
        apiResponse({
          payload: newDevice,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  all: async (req, res, next) => {
    try {
      const devices = await Device.find({ deletedAt: null })
        .sort({ createdAt: -1 });

      const totalDevices = devices.length;

      return res.json(apiResponse({ payload: devices, total: totalDevices }));
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
        conditionFind.name = { $regex: fuzzySearch(keyword) };
      }
      const listDevices = await Device.find(conditionFind)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalDevices = await Device.countDocuments(conditionFind);
      const totalDevicesPerPage = listDevices.length;

      return res.json(
        apiResponse({
          payload: listDevices,
          total: totalDevices,
          totalPerPage: totalDevicesPerPage,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  detail: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const device = await Device.findOne({
        _id: id,
        deletedAt: null,
      }).select("-createdAt -updatedAt ");

      if (!device) return next();
      return res.json(apiResponse({ payload: device }));
    } catch (error) {
      next(error);
    }
  },

  updateInformation: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const { id } = req.params;

      const device = await Device.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          name,
          description,
        },
        { new: true }
      ).select("-createdAt -updatedAt");

      if (!device) return next();
      return res.json(apiResponse({ payload: device }));
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;

      const device = await Device.findOne({ _id: id, deletedAt: null });

      if (!device) return next();
      // Chuyển đổi trực tiếp giá trị boolean của device.status
      device.status = !device.status;
      await device.save();

      return res.json(apiResponse({ payload: device }));
    } catch (error) {
      next(error);
    }
  },

  deleteSingle: async (req, res, next) => {
    try {
      const { id } = req.params;

      const device = await Device.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true }
      ).select("-createdAt -updatedAt");

      if (!device) return next();

      return res.json(apiResponse({ payload: device }));
    } catch (error) {
      next(error);
    }
  },

  deleteMultiple: async (req, res, next) => {
    try {
      const { ids } = req.body;

      // Kiểm tra xem ids có phải là một mảng và tất cả các phần tử trong mảng có phải là id không
      const areAllIdsValid =
        Array.isArray(ids) && ids.every((id) => isMongoId(id));
      if (!areAllIdsValid) {
        return res.status(400).json({
          message: "Ids phải là một mảng các id hợp lệ",
          error: "Ids không hợp lệ",
        });
      }

      const errors = [];
      const results = [];
      await asyncForEach(ids, async (id) => {
        const deleteMultiple = await Device.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true }
        );

        if (!deleteMultiple) {
          errors.push(`${deleteMultiple.name}`);
        } else {
          results.push(deleteMultiple);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa thiết bị ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
