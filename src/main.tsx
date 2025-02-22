import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App.tsx";
import "./index.css";

// Add this line to your index.css or create it if it doesn't exist
document.documentElement.classList.add("light");

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider attribute="class" defaultTheme="dark" storageKey="drive-theme">
			<App />
		</ThemeProvider>
	</StrictMode>
);
