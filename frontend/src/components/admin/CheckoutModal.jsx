import React from 'react';
import { Modal, Form, Input, Select, Divider } from 'antd';

const { Option } = Select;

const CheckoutModal = ({
  visible,
  form,
  customer,
  phone,
  paymentMethod,
  setPaymentMethod,
  totalAmount,
  subtotal,
  appliedVoucher,
  voucherDiscount,
  voucherCode,
  setVoucherCode,
  voucherLoading,
  onApplyVoucher,
  onRemoveVoucher,
  onCancel,
  onSubmit,
  loading,
  cart,
  currentUser
}) => {
  // Print invoice function
  const printInvoice = (orderData) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date();
    const invoiceNumber = `HD${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${Date.now().toString().slice(-4)}`;
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hóa đơn bán hàng - ${invoiceNumber}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 20px; color: #333; }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #000; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          .store-name { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 5px;
            color: #1890ff;
          }
          .invoice-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin: 10px 0;
          }
          .invoice-info { 
            display: flex; 
            justify-content: space-between; 
            margin: 15px 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
          }
          .info-section { flex: 1; }
          .info-section h4 { 
            margin: 0 0 10px 0; 
            color: #1890ff;
            font-size: 14px;
          }
          .info-section p { margin: 5px 0; font-size: 13px; }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            font-size: 13px;
          }
          .table th { 
            background-color: #f0f0f0; 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: center;
            font-weight: bold;
          }
          .table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: center;
          }
          .table td.left { text-align: left; }
          .table td.right { text-align: right; }
          .summary { 
            margin-top: 20px; 
            border-top: 2px solid #ddd; 
            padding-top: 15px;
          }
          .summary-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0;
            padding: 5px 0;
          }
          .total-row { 
            font-weight: bold; 
            font-size: 16px; 
            color: #f5222d;
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 15px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          @media print { 
            button { display: none; } 
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">Poly Shoes</div>
          <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
          <p style="margin: 5px 0; font-size: 13px;">Số: <strong>${invoiceNumber}</strong></p>
        </div>

        <div class="invoice-info">
          <div class="info-section">
            <h4>📅 THÔNG TIN HÓA ĐƠN</h4>
            <p><strong>Ngày:</strong> ${currentDate.toLocaleDateString('vi-VN')}</p>
            <p><strong>Giờ:</strong> ${currentDate.toLocaleTimeString('vi-VN')}</p>
            <p><strong>Phương thức:</strong> ${orderData.paymentMethod === 'IN_STORE' ? 'Tiền mặt' : 'Chuyển khoản QR'}</p>
          </div>
          <div class="info-section">
            <h4>👤 THÔNG TIN KHÁCH HÀNG</h4>
            <p><strong>Tên:</strong> ${orderData.customer}</p>
            <p><strong>SĐT:</strong> ${customer?.phone || phone || 'N/A'}</p>
            <p><strong>Loại:</strong> ${customer ? 'Khách hàng thành viên' : 'Khách vãng lai'}</p>
          </div>
          <div class="info-section">
            <h4>👨‍💼 NHÂN VIÊN BÁN HÀNG</h4>
            <p><strong>Tên:</strong> ${currentUser?.fullName || 'N/A'}</p>
            <p><strong>Mã NV:</strong> ${currentUser?.userId || 'N/A'}</p>
            <p><strong>Ca làm việc:</strong> ${currentDate.getHours() < 12 ? 'Sáng' : currentDate.getHours() < 18 ? 'Chiều' : 'Tối'}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 5%">STT</th>
              <th style="width: 35%">Tên sản phẩm</th>
              <th style="width: 10%">Màu</th>
              <th style="width: 10%">Size</th>
              <th style="width: 8%">SL</th>
              <th style="width: 16%">Đơn giá</th>
              <th style="width: 16%">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="left">${item.productName}</td>
                <td>${item.colorName}</td>
                <td>${item.sizeValue}</td>
                <td>${item.quantity}</td>
                <td class="right">${(item.unitPrice || 0).toLocaleString()}₫</td>
                <td class="right"><strong>${((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString()}₫</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span><strong>Tạm tính (${cart.length} sản phẩm):</strong></span>
            <span><strong>${(subtotal || 0).toLocaleString()}₫</strong></span>
          </div>
          ${appliedVoucher ? `
          <div class="summary-row">
            <span>Mã giảm giá (${appliedVoucher.code || 'N/A'}):</span>
            <span style="color: #52c41a;">-${(voucherDiscount || 0).toLocaleString()}₫</span>
          </div>
          ` : ''}
          <div class="summary-row total-row">
            <span><strong>TỔNG TIỀN THANH TOÁN:</strong></span>
            <span><strong>${(totalAmount || 0).toLocaleString()}₫</strong></span>
          </div>
          <div class="summary-row" style="margin-top: 10px; font-style: italic; color: #666;">
            <span>Bằng chữ: <em id="amount-in-words"></em></span>
          </div>
        </div>

        <div class="footer">
          <p style="font-style: italic; color: #666; margin-bottom: 15px;">
            ✨ <strong>Cảm ơn quý khách đã tin tưởng và mua hàng tại cửa hàng!</strong> ✨
          </p>
          <p style="font-size: 12px; color: #999;">
            🔄 Đổi trả trong vòng 7 ngày với hóa đơn | 🎯 Tích điểm thành viên được giảm giá lần sau
          </p>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()" style="
              background: #1890ff; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              font-size: 16px; 
              border-radius: 6px; 
              cursor: pointer;
              margin-right: 10px;
            ">🖨️ In hóa đơn</button>
            <button onclick="window.close()" style="
              background: #666; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              font-size: 16px; 
              border-radius: 6px; 
              cursor: pointer;
            ">❌ Đóng</button>
          </div>
        </div>
        
        <script>
          // Function to convert number to Vietnamese words
          function numberToVietnameseWords(num) {
            if (num === 0) return "không";
            
            const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
            const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
            
            if (num < 10) return ones[num];
            if (num < 100) {
              const ten = Math.floor(num / 10);
              const one = num % 10;
              if (ten === 1) {
                return "mười" + (one === 5 ? " lăm" : one > 0 ? " " + ones[one] : "");
              }
              return tens[ten] + (one === 1 && ten > 1 ? " mốt" : one === 5 && ten > 1 ? " lăm" : one > 0 ? " " + ones[one] : "");
            }
            
            if (num < 1000) {
              const hundred = Math.floor(num / 100);
              const remainder = num % 100;
              return ones[hundred] + " trăm" + (remainder > 0 ? " " + numberToVietnameseWords(remainder) : "");
            }
            
            if (num < 1000000) {
              const thousand = Math.floor(num / 1000);
              const remainder = num % 1000;
              return numberToVietnameseWords(thousand) + " nghìn" + (remainder > 0 ? " " + numberToVietnameseWords(remainder) : "");
            }
            
            if (num < 1000000000) {
              const million = Math.floor(num / 1000000);
              const remainder = num % 1000000;
              return numberToVietnameseWords(million) + " triệu" + (remainder > 0 ? " " + numberToVietnameseWords(remainder) : "");
            }
            
            return "số quá lớn";
          }
          
          // Set amount in words when page loads
          document.addEventListener('DOMContentLoaded', function() {
            const amountElement = document.getElementById('amount-in-words');
            if (amountElement) {
              amountElement.textContent = numberToVietnameseWords(${totalAmount}) + " đồng";
            }
          });
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  // Handle payment confirmation
  const handlePaymentConfirm = () => {
    const orderData = {
      customer: customer?.fullName || phone || 'Khách vãng lai',
      paymentMethod,
      totalAmount
    };

    if (paymentMethod === 'IN_STORE') {
      Modal.confirm({
        title: 'Xác nhận thanh toán',
        content: `Bạn có xác nhận khách hàng đã thanh toán ${(totalAmount || 0).toLocaleString()}₫ bằng tiền mặt?`,
        okText: 'Đã thanh toán',
        cancelText: 'Chưa thanh toán',
        onOk: () => {
          onSubmit();
          setTimeout(() => {
            printInvoice(orderData);
          }, 1000);
        }
      });
    } else if (paymentMethod === 'QR_CODE') {
      // Direct QR payment confirmation
      Modal.confirm({
        title: 'Xác nhận thanh toán QR',
        content: `Bạn có xác nhận khách hàng đã thanh toán ${(totalAmount || 0).toLocaleString()}₫ qua QR code?`,
        okText: 'Đã thanh toán',
        cancelText: 'Chưa thanh toán',
        onOk: () => {
          onSubmit();
          setTimeout(() => {
            printInvoice(orderData);
          }, 1000);
        }
      });
    } else {
      onSubmit();
    }
  };

  // Inline styles
  const styles = {
    modal: {
      width: 500
    },
    formItem: {
      marginBottom: '16px'
    },
    totalAmount: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#52c41a'
    }
  };

  // Format total amount
  const formattedTotal = totalAmount.toLocaleString('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  });

  // Get customer display text
  const getCustomerDisplay = () => {
    if (customer) {
      return `${customer.fullName} (${customer.phone})`;
    }
    return phone || 'Khách vãng lai';
  };

  return (
    <Modal
      title="Xác nhận thanh toán"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Xác nhận thanh toán"
      cancelText="Hủy"
      confirmLoading={loading}
      style={styles.modal}
      destroyOnClose
    >
      <Form 
        form={form} 
        onFinish={handlePaymentConfirm} 
        layout="vertical"
        initialValues={{ paymentMethod }}
      >
        <Form.Item 
          label="Khách hàng"
          style={styles.formItem}
        >
          <Input 
            value={getCustomerDisplay()} 
            disabled 
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </Form.Item>

        <Form.Item 
          name="paymentMethod"
          label="Phương thức thanh toán" 
          rules={[
            { required: true, message: 'Vui lòng chọn phương thức thanh toán!' }
          ]}
          style={styles.formItem}
        >
          <Select 
            value={paymentMethod} 
            onChange={setPaymentMethod}
            placeholder="Chọn phương thức thanh toán"
          >
            <Option value="IN_STORE">
              💵 Thanh toán tiền mặt
            </Option>
            <Option value="QR_CODE">
              📱 Thanh toán bằng mã QR
            </Option>
          </Select>
        </Form.Item>

        {/* Voucher Section removed as requested */}

        {/* Price breakdown */}
        {appliedVoucher && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Tạm tính:</span>
              <span>{(subtotal || 0).toLocaleString()}₫</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#52c41a' }}>
              <span>Giảm giá ({appliedVoucher.voucherCode}):</span>
              <span>-{(voucherDiscount || 0).toLocaleString()}₫</span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
          </div>
        )}

        <Form.Item 
          label="Tổng tiền thanh toán"
          style={styles.formItem}
        >
          <Input 
            value={formattedTotal} 
            disabled 
            style={{ 
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              ...styles.totalAmount
            }}
          />
        </Form.Item>

        {/* Payment method specific information */}
        {paymentMethod === 'IN_STORE' && (
          <div style={{ 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '6px',
            padding: '12px',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, color: '#d46b08' }}>
              💡 <strong>Lưu ý:</strong> Khách hàng sẽ thanh toán bằng tiền mặt tại quầy.
            </p>
          </div>
        )}

        {paymentMethod === 'QR_CODE' && (
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '6px',
            padding: '12px',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, color: '#389e0d' }}>
              📱 <strong>Lưu ý:</strong> Khách hàng sẽ quét mã QR để thanh toán.
            </p>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CheckoutModal;