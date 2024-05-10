/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');
const { REGEX } = require('../constants');

// Xác định bảng người dùng với các trường khác nhau và quy tắc xác thực của chúng.
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Tên người dùng bắt buộc điền'],
      maxLength: [50, 'Tên người dùng không vượt quá 50 ký tự'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Họ người dùng bắt buộc điền'],
      maxLength: [50, 'Họ người dùng không vượt quá 50 ký tự'],
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator(value) {
          // xác thực địa chỉ email.
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        },
        message: 'Email không hợp lệ',
      },
      required: [true, 'Email bắt buộc điền'],
      maxLength: [50, 'Email không vượt quá 50 ký tự'],
      unique: [true, 'Email là duy nhất'],
    },
    password: {
      type: String,
      validate: {
        validator(value) {
          // xác thực địa chỉ email.
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        },
        message: 'Mật khẩu không hợp lệ',
      },
      required: true,
      minLength: [8, 'Mật khẩu ít nhất 8 ký tự'],
      maxLength: [20, 'Mật khẩu không vượt quá 20 ký tự'],
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'medias',
      default: null,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
      require: [true, 'Phân quyền bắt buộc điền'],
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false, // Tắt trường "__v" dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

// Tạo trường ảo fullName
userSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`;
});
// Virtual with Populate
userSchema.virtual('avatar', {
  ref: 'medias',
  localField: 'avatarId',
  foreignField: '_id',
  justOne: true,
});

// Virtual with Populate
userSchema.virtual('role', {
  ref: 'roles',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

// hash mật khẩu trước khi lưu vào cơ sở dữ liệu.
async function hashPassword(value) {
  if (value) {
    const salt = await bcrypt.genSalt(10); // 10 kí tự: ABCDEFGHIK + 123456
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
  }
}
// Build mã hóa field
userSchema.pre('save', async function (next) {
  // Lưu hashPass thay cho việc lưu password
  this.password = await hashPassword(this.password);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  // Lưu hashPass thay cho việc lưu password
  if (this._update.password) {
    this._update.password = await hashPassword(this._update.password);
  }
  next();
});

// Kiểm tra mật khẩu có hợp lệ hay không
userSchema.methods.isValidPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Cấu hình để trường ảo được bao gồm trong kết quả JSON và đối tượng JavaScript thông thường
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Tạo bảng khách hàng dựa trên lược đồ đã khai báo
const User = model('user', userSchema);
module.exports = User;
