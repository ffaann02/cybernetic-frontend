import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PrimeReactProvider } from "primereact/api";
import "./App.css"
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCP_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </PrimeReactProvider>
);
