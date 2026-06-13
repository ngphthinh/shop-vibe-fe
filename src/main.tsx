import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./app/i18n"; // Import cấu hình i18n
import { store } from "./app/store.ts";
import { hydrate } from "./features/auth/store/authSlice.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient.ts";

store.dispatch(hydrate());
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  // </StrictMode>,
);
