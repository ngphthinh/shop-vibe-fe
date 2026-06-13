import { v4 as uuidv4 } from "uuid";
export const getTitleOfButtonByValue = (value: string) => {
  return value.split("/")[1] || "home";
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string) => {
  // Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
) => {
  return password === confirmPassword;
};
export const validateFullName = (fullName: string) => {
  // Họ tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái và khoảng trắng , tiếng việt
  const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]{2,}$/;
  return fullNameRegex.test(fullName);
};

// Định dạng giá tiền (Giả định là USD theo dữ liệu mẫu, bạn có thể đổi sang VND nếu cần)

export const formatPrice = (price: number, locale: string) => {
  if (locale === "vi") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any, defaultMessage: string) => {
  return (
    error?.error ||
    error?.message ||
    error?.data?.error ||
    error?.response?.data?.error ||
    defaultMessage
  );
};

// Format date form "2026-06-11T06:27:03.251542"  to "DD/MM/YYYY"
export const formatDate = (dateString: string) => {
  if (!dateString) return "n/a";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return date.toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "COD":
      return "checkout.payment.cod";
    case "BANK_TRANSFER":
      return "checkout.payment.bankTransfer";
    case "MOMO":
      return "checkout.payment.momo";
    default:
      return method;
  }
};

export const getColor = (label: string) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};
const COLORS = [
  "bg-blue-50 border-blue-200",
  "bg-green-50 border-green-200",
  "bg-yellow-50 border-yellow-200",
  "bg-purple-50 border-purple-200",
  "bg-pink-50 border-pink-200",
  "bg-orange-50 border-orange-200",
];

export const randomUUID = (): string => uuidv4();
