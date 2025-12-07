import React, { useState, useEffect } from 'react';
import {
    Form,
    message
} from 'antd';
import AdminLayout from '../../layouts/AdminLayout';
import VoucherHeader from '../../components/admin/voucher/VoucherHeader';
import VoucherTable from '../../components/admin/voucher/VoucherTable';
import VoucherForm from '../../components/admin/voucher/VoucherForm';
import VoucherStats from '../../components/admin/voucher/VoucherStats';
import { getConditionTypeText, getDiscountText, getVoucherStatus } from '../../utils/voucherUtils';
import { getAllVouchers, createVoucher, updateVoucher } from '../../services/admin/VoucherService';
import dayjs from 'dayjs';

// Function to generate voucher code automatically
const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};



const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await getAllVouchers();
            setVouchers(data);
            setFilteredVouchers(data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            message.error('Không thể tải danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    // Filter vouchers based on search text and filters
    useEffect(() => {
        let filtered = vouchers;

        // Search by voucher code, name, description
        if (searchText) {
            filtered = filtered.filter(voucher =>
                voucher.code?.toLowerCase().includes(searchText.toLowerCase()) ||
                voucher.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                voucher.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(voucher => getVoucherStatus(voucher) === statusFilter);
        }

        // Filter by discount type
        if (typeFilter) {
            filtered = filtered.filter(voucher => voucher.discountType === typeFilter);
        }

        setFilteredVouchers(filtered);
    }, [vouchers, searchText, statusFilter, typeFilter]);

    const handleAddVoucher = () => {
        setEditingVoucher(null);
        form.resetFields();
        // Automatically generate voucher code
        const autoCode = generateVoucherCode();
        form.setFieldsValue({ code: autoCode });
        setModalVisible(true);
    };

    const handleEditVoucher = (voucher) => {
        const voucherStatus = getVoucherStatus(voucher);
        if (voucherStatus === 'EXPIRED') {
            message.warning('Không thể sửa voucher đã hết hạn!');
            return;
        }
        
        setEditingVoucher(voucher);
        form.setFieldsValue({
            ...voucher,
            discountType: voucher.discountType?.toLowerCase(),
            conditionType: voucher.conditionType?.toLowerCase(),
            dateRange: [dayjs(voucher.startDate), dayjs(voucher.endDate)],
        });
        setModalVisible(true);
    };

    // Toggle status functionality removed - using dynamic status computation

    const handleSubmit = async (values) => {
        try {
            // Validate duplicate code and name
            const isDuplicateCode = vouchers.some(voucher => 
                voucher.code === values.code && (!editingVoucher || voucher.voucherId !== editingVoucher.voucherId)
            );
            
            const isDuplicateName = vouchers.some(voucher => 
                voucher.name === values.name && (!editingVoucher || voucher.voucherId !== editingVoucher.voucherId)
            );

            if (isDuplicateCode) {
                form.setFields([{
                    name: 'code',
                    errors: ['Mã voucher đã tồn tại, vui lòng chọn mã khác!']
                }]);
                return;
            }

            if (isDuplicateName) {
                form.setFields([{
                    name: 'name',
                    errors: ['Tên voucher đã tồn tại, vui lòng chọn tên khác!']
                }]);
                return;
            }

            const voucherData = {
                ...values,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
                discountType: values.discountType?.toUpperCase(),
                conditionType: values.conditionType?.toUpperCase(),
            };
            delete voucherData.dateRange;

            if (editingVoucher) {
                await updateVoucher(editingVoucher.voucherId, voucherData);
                message.success('Cập nhật voucher thành công');
            } else {
                await createVoucher(voucherData);
                message.success('Tạo voucher thành công');
            }

            setModalVisible(false);
            fetchVouchers();
        } catch (error) {
            console.error('Error saving voucher:', error);
            message.error('Có lỗi xảy ra khi lưu voucher');
        }
    };

    return (
        <AdminLayout>
            <VoucherStats vouchers={vouchers} />
            
            <VoucherHeader 
                onAddVoucher={handleAddVoucher}
                searchText={searchText}
                onSearchChange={setSearchText}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
            />
            
            <VoucherTable
                    vouchers={filteredVouchers}
                    loading={loading}
                    onEditVoucher={handleEditVoucher}
                    getConditionTypeText={getConditionTypeText}
                    getDiscountText={getDiscountText}
                />

                <VoucherForm
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onSubmit={handleSubmit}
                    editingVoucher={editingVoucher}
                    form={form}
                />
   
        </AdminLayout>
    );
};

export default VoucherPage;
