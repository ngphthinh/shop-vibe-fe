const ShippingPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Chính sách vận chuyển</h1>

      <div className="rounded-xl border bg-white p-6">
        <p className="leading-7 text-gray-600">
          Shop Vibe là dự án phục vụ mục đích học tập và nghiên cứu.
        </p>

        <p className="mt-4 leading-7 text-gray-600">
          Website không thực hiện vận chuyển hàng hóa thực tế. Mọi dữ liệu về
          địa chỉ giao hàng, phí vận chuyển và trạng thái giao hàng chỉ được sử
          dụng để mô phỏng quy trình của một hệ thống thương mại điện tử.
        </p>

        <p className="mt-4 leading-7 text-gray-600">
          Không có bất kỳ đơn hàng thực tế nào được giao nhận thông qua nền tảng
          này.
        </p>
      </div>
    </div>
  );
};

export default ShippingPage;
