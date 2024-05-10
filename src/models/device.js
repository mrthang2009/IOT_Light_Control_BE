/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Xác định bảng khách hàng với các trường khác nhau và quy tắc xác thực của chúng.
const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên thiết bị bắt buộc điền'],
      maxLength: [50, 'Tên thiết bị không vượt quá 50 ký tự'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [100, 'Mô tả vai trò không vượt quá 300 ký tự'],
      trim: true,
    },
    status: {
      type: Boolean,
      required: [true, 'Trạng thái thiết bị không được để trống'],
      unique: [true, 'Tên thiết bị không được trùng nhau'],
      trim: true, // loại bỏ khoảng trống không cần thiết, loại bỏ đầu và cuối
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false, // Tắt trường "__v" dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

// Tạo bảng thiết bị dựa trên lược đồ đã khai báo
const Device = model('devices', deviceSchema);
module.exports = Device;
