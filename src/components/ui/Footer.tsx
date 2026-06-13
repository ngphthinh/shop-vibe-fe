import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Cấu trúc mảng quản lý các cột links của Footer
const FOOTER_SECTIONS = [
  {
    titleKey: "categories",
    links: [
      { key: "clothing", path: "/categories/clothing" },
      { key: "shoes", path: "/categories/shoes" },
      { key: "accessories", path: "/categories/accessories" },
    ],
  },
  {
    titleKey: "support",
    links: [
      { key: "faq", path: "/faq" },
      { key: "shipping", path: "/shipping" },
      { key: "returns", path: "/returns" },
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation("", { keyPrefix: "footer" });
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Phần nội dung chính chia cột */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Giới thiệu thương hiệu */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            Shop Vibe
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            {t("about_text")}
          </p>
        </div>

        {/* Các cột Links (Danh mục & Hỗ trợ) */}
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.titleKey} className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t(section.titleKey)}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {section.links.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-400 transition-colors duration-200">
                    {t(`links.${link.key}`)}{" "}
                    {/* Gọi sub-key: footer.links.clothing */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Đường gạch ngang phân cách và Bản quyền dòng dưới */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} Shop Vibe. {t("rights")}
          </p>

          {/* Một vài icon mạng xã hội tĩnh */}
          <div className="flex space-x-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
