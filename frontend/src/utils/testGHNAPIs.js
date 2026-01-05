// Test GHN API endpoints
// Chạy trong browser console để kiểm tra

const BASE_URL = 'http://localhost:8080/home';

// Test các GHN API functions
const testGHNAPIs = async () => {
    try {
        console.log('🏁 Bắt đầu test GHN APIs...');
        
        // Test 1: Get provinces
        console.log('\n📍 Test 1: Lấy danh sách tỉnh/thành phố...');
        const provincesResponse = await fetch(`${BASE_URL}/shippings/provinces`);
        const provinces = await provincesResponse.json();
        console.log('Provinces:', provinces.data?.slice(0, 3)); // Show first 3
        
        if (!provinces.data || provinces.data.length === 0) {
            throw new Error('Không có tỉnh/thành phố nào');
        }
        
        // Test 2: Get districts for first province
        const firstProvince = provinces.data[0];
        console.log(`\n🏘️  Test 2: Lấy quận/huyện cho tỉnh ${firstProvince.ProvinceName}...`);
        const districtsResponse = await fetch(`${BASE_URL}/shippings/districts?provinceId=${firstProvince.ProvinceID}`);
        const districts = await districtsResponse.json();
        console.log('Districts:', districts.data?.slice(0, 3)); // Show first 3
        
        if (!districts.data || districts.data.length === 0) {
            console.log('⚠️  Không có quận/huyện nào cho tỉnh này');
            return;
        }
        
        // Test 3: Get wards for first district
        const firstDistrict = districts.data[0];
        console.log(`\n🏠 Test 3: Lấy phường/xã cho quận ${firstDistrict.DistrictName}...`);
        const wardsResponse = await fetch(`${BASE_URL}/shippings/wards?districtId=${firstDistrict.DistrictID}`);
        const wards = await wardsResponse.json();
        console.log('Wards:', wards.data?.slice(0, 3)); // Show first 3
        
        if (!wards.data || wards.data.length === 0) {
            console.log('⚠️  Không có phường/xã nào cho quận này');
            return;
        }
        
        // Test 4: Get available services
        console.log(`\n🚚 Test 4: Lấy dịch vụ vận chuyển cho quận ${firstDistrict.DistrictName}...`);
        const servicesResponse = await fetch(`${BASE_URL}/shippings/services?toDistrictId=${firstDistrict.DistrictID}`);
        const services = await servicesResponse.json();
        console.log('Services:', services.data);
        
        if (!services.data || services.data.length === 0) {
            console.log('⚠️  Không có dịch vụ vận chuyển nào cho quận này');
            return;
        }
        
        // Test 5: Calculate shipping fee
        const firstService = services.data[0];
        const firstWard = wards.data[0];
        
        console.log(`\n💰 Test 5: Tính phí vận chuyển...`);
        const feeParams = new URLSearchParams({
            ghnServiceId: firstService.service_id,
            toDistrictId: firstDistrict.DistrictID,
            toWardCode: firstWard.WardCode,
            orderValue: 500000,
            weight: 500,
            length: 20,
            width: 15,
            height: 10
        });
        
        const feeResponse = await fetch(`${BASE_URL}/shippings/calculate-fee?${feeParams}`, {
            method: 'POST'
        });
        const feeResult = await feeResponse.json();
        console.log('Shipping fee result:', feeResult);
        
        console.log('\n✅ Tất cả GHN APIs hoạt động bình thường!');
        
        return {
            provinces: provinces.data,
            districts: districts.data,
            wards: wards.data,
            services: services.data,
            shippingFee: feeResult
        };
        
    } catch (error) {
        console.error('❌ Lỗi khi test GHN APIs:', error);
        return null;
    }
};

// Chạy test
// testGHNAPIs();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testGHNAPIs };
}