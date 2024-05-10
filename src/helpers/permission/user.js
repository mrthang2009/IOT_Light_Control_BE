module.exports = {
  groupName: 'Người dùng',
  permissions: [
    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_CUSTOMERS',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_CUSTOMER',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_CUSTOMER_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/employees/*',
      method: 'put',
      name: 'EDIT_CUSTOMER',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_CUSTOMER',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'SEARCH_CUSTOMER',
      label: 'Tìm kiếm',
    },
  ],
};
