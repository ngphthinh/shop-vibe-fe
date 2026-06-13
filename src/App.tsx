import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { AppRoutes } from "./routes";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </Provider>
  );
}
export default App;
