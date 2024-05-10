const mongoose = require('mongoose');

const { Schema, model } = mongoose;
// Tạo một hàm validator riêng để kiểm tra xem mảng permissions có ít nhất một giá trị hay không
function arrayNotEmpty(arr) {
  return arr && arr.length > 0;
}
const roleSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Tên vai trò bắt buộc điền'],
      maxLength: [150, 'Tên vai trò không vượt quá 150 ký tự'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [300, 'Tên vai trò không vượt quá 300 ký tự'],
      trim: true,
    },
    permissions: {
      type: [String],
      trim: true,
      validate: [arrayNotEmpty, 'Vai trò phải có ít nhất một quyền'],
    },
    isRoot: {
      type: Boolean,
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

// Tạo bảng phân quyền dựa trên lược đồ đã khai báo
const Role = model('roles', roleSchema);
module.exports = Role;
