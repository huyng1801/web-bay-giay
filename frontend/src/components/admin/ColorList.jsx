import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Select } from "antd";
import {
  EditOutlined,
  PoweroffOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ColorService from "../../services/admin/ColorService";

const ColorList = () => {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [form] = Form.useForm();
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    let result = colors;
    if (searchName) {
      result = result.filter((c) =>
        c.colorName.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (statusFilter !== null) {
      result = result.filter((c) => c.isActive === statusFilter);
    }
    setFilteredColors(result);
  }, [colors, searchName, statusFilter]);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const data = await ColorService.getAllColors();
      setColors(data);
    } catch {
      message.error("Lỗi khi tải danh sách màu sắc");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const color = colors.find((c) => c.colorId === id);
    if (!color) return;
    try {
      await ColorService.updateColor(id, {
        colorName: color.colorName,
        isActive: !color.isActive,
      });
      message.success("Cập nhật trạng thái màu sắc thành công");
      fetchColors();
    } catch (error) {
      if (error.response?.data) {
        // Nếu server trả về ErrorResponse object có message
        if (error.response.data.message) {
          message.error(error.response.data.message);
        }
        // Nếu server trả về string trực tiếp
        else if (typeof error.response.data === "string") {
          message.error(error.response.data);
        }
        // Fallback
        else {
          message.error("Không thể thay đổi trạng thái màu sắc này!");
        }
      } else {
        message.error("Không thể thay đổi trạng thái màu sắc này!");
      }
    }
  };

  const showModal = (color) => {
    setCurrentColor(color);
    form.setFieldsValue(color || { isActive: true });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoadingButton(true);

      if (currentColor) {
        await ColorService.updateColor(currentColor.colorId, values);
        message.success("Cập nhật màu sắc thành công");
      } else {
        await ColorService.createColor(values);
        message.success("Tạo màu sắc thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchColors();
    } catch (error) {
      // Kiểm tra nếu là lỗi từ API
      if (error.response?.data) {
        // Nếu server trả về ErrorResponse object có message
        if (error.response.data.message) {
          message.error(error.response.data.message);
        }
        // Nếu server trả về string trực tiếp
        else if (typeof error.response.data === "string") {
          message.error(error.response.data);
        }
        // Fallback
        else {
          //message.error("Tên màu sắc đã tồn tại!");
        }
      } else if (error.errorFields) {
        // Validation error từ form
        //message.error("Vui lòng kiểm tra lại thông tin nhập vào!");
      } else {
        //message.error("Tên màu sắc đã tồn tại!");
      }
    } finally {
      setLoadingButton(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentColor(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Mã màu sắc",
      dataIndex: "colorId",
      key: "colorId",
      width: 130,
    },
    {
      title: "Tên màu sắc",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag
          color={isActive ? "green" : "red"}
          style={{ minWidth: 90, textAlign: "center" }}
        >
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<PoweroffOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => handleToggleStatus(record.colorId)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
          />
        </span>
      ),
      width: 120,
    },
  ];

  return (
    <div
     
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={() => showModal(null)}
        >
          Thêm màu sắc
        </Button>
        <div style={{ display: "flex", gap: 12 }}>
          <Input.Search
            placeholder="Tìm kiếm tên màu sắc..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onSearch={(value) => setSearchName(value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={statusFilter === null ? null : statusFilter}
            onChange={(value) => setStatusFilter(value === null ? null : value)}
            style={{ width: 150 }}
            allowClear={false}
          >
            <Select.Option value={null}>Tất cả trạng thái</Select.Option>
            <Select.Option value={true}>Hoạt động</Select.Option>
            <Select.Option value={false}>Ngừng hoạt động</Select.Option>
          </Select>
        </div>
      </div>
      <Table
        dataSource={filteredColors}
        columns={columns}
        rowKey="colorId"
        loading={loading}
        pagination={{ pageSize: 8 }}
        title={null}
        rowClassName={() => "custom-row"}
        className="custom-ant-table"
      />
      <Modal
        okText="Lưu"
        cancelText="Hủy"
        title={currentColor ? "Chỉnh sửa màu sắc" : "Thêm màu sắc"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="colorName"
            label="Tên màu sắc"
            rules={[
              { required: true, message: "Vui lòng nhập tên màu sắc!" },
              { max: 50, message: "Tên màu sắc không được vượt quá 50 ký tự!" },
              { min: 2, message: "Tên màu sắc phải có ít nhất 2 ký tự!" },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();

                  // Kiểm tra trùng tên (không phân biệt hoa thường)
                  const existingColor = colors.find((color) => {
                    const isSameName =
                      color.colorName.toLowerCase().trim() ===
                      value.toLowerCase().trim();
                    const isDifferentColor =
                      !currentColor || color.colorId !== currentColor.colorId;
                    return isSameName && isDifferentColor;
                  });

                  if (existingColor) {
                    return Promise.reject(new Error("Tên màu sắc đã tồn tại!"));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="Nhập tên màu sắc..."
              onChange={() => {
                setTimeout(() => form.validateFields(["colorName"]), 100);
              }}
              onBlur={() => {
                form.validateFields(["colorName"]);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      
    </div>
  );
};

export default ColorList;
