const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Chính sách bảo mật</h1>

      <div className="rounded-xl border bg-white p-6 space-y-4">
        <p className="leading-7 text-gray-600">
          Shop Vibe là dự án được phát triển nhằm mục đích học tập, nghiên cứu
          và thực hành phát triển phần mềm.
        </p>

        <p className="leading-7 text-gray-600">
          Chúng tôi tôn trọng quyền riêng tư của người dùng và không bán, chia
          sẻ hoặc sử dụng thông tin cá nhân cho bất kỳ mục đích thương mại nào.
        </p>

        <p className="leading-7 text-gray-600">
          Dữ liệu được nhập vào hệ thống chỉ phục vụ việc mô phỏng chức năng của
          ứng dụng và không đại diện cho hoạt động kinh doanh thực tế.
        </p>

        <p className="leading-7 text-gray-600">
          Người dùng không nên cung cấp thông tin nhạy cảm như mật khẩu ngân
          hàng, số thẻ tín dụng hoặc các dữ liệu cá nhân quan trọng trên hệ
          thống này.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
