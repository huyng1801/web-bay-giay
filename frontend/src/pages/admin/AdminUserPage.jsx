import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminUserList from '../../components/admin/AdminUserList';

const AdminUserPage = () => {
  return (
    <AdminLayout>
      <AdminUserList />
    </AdminLayout>
  );
};

export default AdminUserPage;
