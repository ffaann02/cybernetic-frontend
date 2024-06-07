import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PrimeReactProvider } from "primereact/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);
