import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ColorList from '../../components/admin/ColorList';

const ColorPage = () => {
  return (
    <AdminLayout>
        <ColorList />
    </AdminLayout>
  );
};

export default ColorPage;