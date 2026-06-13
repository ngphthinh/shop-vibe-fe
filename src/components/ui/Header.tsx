import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { logout, selectCurrentUser } from "../../features/auth/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../features/auth/services/authService";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { Button } from "../common/Button";
import { getTitleOfButtonByValue } from "../../utils/constants";

const NAV_KEYS_PUBLIC = [
  { key: "home", path: "/" },
  { key: "orders", path: "/orders" },
  { key: "cart", path: "/cart" },
];

const NAV_KEYS_AUTH = {
  LOGIN: "/login",
  REGISTER: "/register",
};

const ADMIN_MENU = [
  { key: "admin", path: "/admin" },
  { key: "productManager", path: "/admin/products" },
  { key: "userManager", path: "/admin/users" },
  { key: "orderManager", path: "/admin/orders" },
];

const listLanguages = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

const ROLES = {
  ROLE_ADMIN: "ROLE_ADMIN",
  ROLE_USER: "ROLE_USER",
};

const Header = () => {
  const { t, i18n } = useTranslation("", { keyPrefix: "nav" });
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const adminDropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(e.target as Node)
      ) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delay đóng menu để router kịp navigate trước
  const closeMenus = () => {
    setTimeout(() => {
      setIsOpen(false);
      setAdminOpen(false);
    }, 100);
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout({
        accessToken: user?.accessToken || "",
        refreshToken: user?.refreshToken || "",
      });
      toast.success("Logged out successfully");
      dispatch(logout());
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during logout";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === ROLES.ROLE_ADMIN;
  const isAdminActive = ADMIN_MENU.some(
    (item) => location.pathname === item.path,
  );

  const getLinkClass = (
    item: { key: string; path: string },
    isMobile = false,
  ) => {
    const isActive = location.pathname === item.path;
    const baseClass = isMobile
      ? "block py-1 font-medium transition-colors"
      : "font-medium transition-colors";
    return `${baseClass} ${
      isActive
        ? "text-black font-bold underline"
        : "text-gray-600 hover:text-black"
    }`;
  };

  return (
    <>
      {loading && <Loading />}
      <header className="bg-white shadow-sm md:shadow p-4 relative select-none z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            Shop Vibe
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {NAV_KEYS_PUBLIC.map((item) => (
                <li key={item.key}>
                  <Link to={item.path} className={getLinkClass(item)}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}

              {isAdmin && (
                <li ref={adminDropdownRef} className="relative">
                  <button
                    onClick={() => setAdminOpen((v) => !v)}
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      isAdminActive
                        ? "text-black font-bold"
                        : "text-gray-600 hover:text-black"
                    }`}>
                    {t("admin")}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${adminOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {adminOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                      {ADMIN_MENU.map((item) => (
                        <Link
                          key={item.key}
                          to={item.path}
                          onClick={() => setAdminOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location.pathname === item.path
                              ? "text-black font-semibold bg-gray-50"
                              : "text-gray-600 hover:text-black hover:bg-gray-50"
                          }`}>
                          {t(item.key)}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </ul>

            {/* Auth + Language */}
            <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
              {user?.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Hi,{" "}
                    <span className="text-blue-600">
                      {user.fullName?.split("@")[0]}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-3 py-1 rounded font-medium transition-colors">
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div>
                  <Link to={NAV_KEYS_AUTH.LOGIN}>
                    <Button size="sm" className="w-auto px-4 py-1.5 mr-2">
                      {t(`${getTitleOfButtonByValue(NAV_KEYS_AUTH.LOGIN)}`)}
                    </Button>
                  </Link>
                  <Link to={NAV_KEYS_AUTH.REGISTER}>
                    <Button size="sm" className="w-auto px-4 py-1.5">
                      {t(`${[getTitleOfButtonByValue(NAV_KEYS_AUTH.REGISTER)]}`)}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center space-x-1 pl-2 border-l border-gray-100">
                {listLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
                      i18n.language.startsWith(lang.code)
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* MOBILE NAV */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}>
          <nav className="flex flex-col p-4 space-y-4">
            {user?.isAuthenticated && (
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-400">Tài khoản đăng nhập</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user.email}
                </p>
              </div>
            )}

            <ul className="flex flex-col space-y-3">
              {NAV_KEYS_PUBLIC.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    onClick={closeMenus} 
                    className={getLinkClass(item, true)}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}

              {isAdmin && (
                <li>
                  <button
                    onClick={() => setAdminOpen((v) => !v)}
                    className={`flex items-center gap-1 w-full py-1 font-medium transition-colors ${
                      isAdminActive ? "text-black font-bold" : "text-gray-600"
                    }`}>
                    {t("admin")}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${adminOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {adminOpen && (
                    <ul className="mt-1 ml-3 flex flex-col space-y-2 border-l-2 border-gray-100 pl-3">
                      {ADMIN_MENU.map((item) => (
                        <li key={item.key}>
                          <Link
                            to={item.path}
                            onClick={closeMenus} 
                            className={`block py-0.5 text-sm transition-colors ${
                              location.pathname === item.path
                                ? "text-black font-semibold"
                                : "text-gray-500 hover:text-black"
                            }`}>
                            {t(item.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </ul>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user?.isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[15px] text-gray-700 font-medium tracking-wide">
                    {"Hi, "}
                    <span className="text-blue-600 font-semibold">
                      {user.fullName}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-semibold px-3.5 py-1.5 rounded-md transition-all duration-200 border border-transparent hover:border-red-100 active:scale-95">
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div>
                  <Link to={NAV_KEYS_AUTH.LOGIN}>
                    <Button size="sm" className="w-auto px-5 py-2 mr-2">
                      {t(getTitleOfButtonByValue(NAV_KEYS_AUTH.LOGIN))}
                    </Button>
                  </Link>
                  <Link to={NAV_KEYS_AUTH.REGISTER}>
                    <Button size="sm" className="w-auto px-5 py-2">
                      {t(getTitleOfButtonByValue(NAV_KEYS_AUTH.REGISTER))}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                {listLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex-1 py-1.5 text-center text-sm font-semibold rounded ${
                      i18n.language.startsWith(lang.code)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;