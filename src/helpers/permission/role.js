module.exports = {
  groupName: 'Phân quyền',
  permissions: [
    {
      path: '/api/v1.0/roles/create',
      method: 'post',
      name: 'CREATE_ROLE',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/roles/list',
      method: 'get',
      name: 'VIEW_LIST_ROLES',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/roles/all',
      method: 'get',
      name: 'VIEW_ALL_ROLES',
      label: 'Xem tất cả',
    },
    {
      path: '/api/v1.0/roles/detail/*',
      method: 'get',
      name: 'VIEW_ROLE_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/roles/detail/*',
      method: 'patch',
      name: 'DELETE_SINGLE_ROLE',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/roles/delete',
      method: 'patch',
      name: 'DELETE_MULTIPLE_ROLE',
      label: 'Xóa nhiều',
    },
    {
      path: '/api/v1.0/roles/update/*',
      method: 'patch',
      name: 'UPDATE_ROLE',
      label: 'Cập nhật',
    },
  ],
};
