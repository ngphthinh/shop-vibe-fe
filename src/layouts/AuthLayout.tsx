import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    // Lớp nền slate-50 sáng mịn, tạo cảm giác không gian rộng rãi và cao cấp
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Khung điều hướng Logo phía trên Form */}
      <div className="mb-8 text-center">
        <Link
          to="/"
          className="text-2xl font-black text-slate-900 tracking-widest uppercase hover:opacity-80 transition-opacity">
          Shop Vibe<span className="text-blue-600">.</span>
        </Link>
        {/* Đường gạch ngang mảnh trang trí tinh tế đặc trưng của phong cách minimalist */}
        <div className="w-8 h-[2px] bg-slate-900 mx-auto mt-2"></div>
      </div>

      {/* Khung chứa Form (Card): 
        - Nền trắng tinh khiết (bg-white)
        - Viền ngoài cực mảnh (border-slate-200/60)
        - Đổ bóng nhẹ, mềm mại chống thô cứng (shadow-sm)
      */}
      <div className="bg-white w-full max-w-md p-8 rounded-xl border border-slate-200/60 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
