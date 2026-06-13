import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center select-none">
      {/* Con số 404 lớn, thanh mảnh, sử dụng tông màu Slate đậm nét */}
      <h1 className="text-8xl font-black text-slate-200 tracking-widest">
        404
      </h1>

      {/* Đường gạch ngang minimalist đặc trưng thương hiệu ngphthinh */}
      <div className="w-12 h-[2px] bg-slate-900 my-6"></div>

      {/* Thông báo lỗi bằng tiếng Anh (hoặc bạn có thể bọc qua thẻ t("not_found") của i18n) */}
      <div className="space-y-2 mb-8">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Nút quay về trang chủ gọn gàng */}
      <Link to="/" className="w-full max-w-[200px]">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
