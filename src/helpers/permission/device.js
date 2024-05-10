module.exports = {
  groupName: 'Thiết bị',
  permissions: [
    {
      path: '/api/v1.0/devices/create',
      method: 'post',
      name: 'ADD_DEVICE',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/devices/all',
      method: 'get',
      name: 'VIEW_ALL_DEVICES',
      label: 'Xem tất cả',
    },
    {
      path: '/api/v1.0/devices/list',
      method: 'get',
      name: 'VIEW_LIST_DEVICES',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/devices/delete',
      method: 'patch',
      name: 'DELETE_MULTIPLE_DEVICES',
      label: 'Xóa nhiều',
    },
    {
      path: '/api/v1.0/devices/detail/*',
      method: 'get',
      name: 'VIEW_DETAIL_DEVICE',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/devices/*',
      method: 'patch',
      name: 'DELETE_SINGLE_DEVICE',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/devices/update-information/*',
      method: 'patch',
      name: 'UPDATE_INFORMATION_DEVICE',
      label: 'Cập nhật thông tin',
    },
    {
      path: '/api/v1.0/devices/update-status/*',
      method: 'patch',
      name: 'UPDATE_STATUS_DEVICE',
      label: 'Cập nhật trạng thái',
    },
  ],
};
