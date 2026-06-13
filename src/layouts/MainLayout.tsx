import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {/* flex-1 giúp phần nội dung chính tự co giãn đẩy Footer xuống đáy */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
