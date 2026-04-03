
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { AppDataProvider } from "./app/data/AppDataContext.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <AppDataProvider>
      <App />
    </AppDataProvider>
  );
  
