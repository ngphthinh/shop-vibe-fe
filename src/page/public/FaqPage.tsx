const FaqPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">FAQ</h1>

      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Shop Vibe là gì?</h2>
          <p className="text-gray-600">
            Shop Vibe là dự án thương mại điện tử được xây dựng nhằm mục đích
            học tập, nghiên cứu và thực hành phát triển phần mềm.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">
            Tôi có thể mua hàng thật không?
          </h2>
          <p className="text-gray-600">
            Không. Đây là hệ thống mô phỏng phục vụ học tập và trình diễn kỹ
            năng phát triển ứng dụng web.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">
            Thông tin thanh toán có được xử lý thật không?
          </h2>
          <p className="text-gray-600">
            Không. Mọi chức năng thanh toán chỉ mang tính minh họa cho quy trình
            nghiệp vụ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
