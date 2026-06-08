import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { EmergencyPage } from "./pages/EmergencyPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HealthToolsPage } from "./pages/HealthToolsPage";
import { HomePage } from "./pages/HomePage";
import { HospitalPage } from "./pages/HospitalPage";
import { PharmacyFinderPage } from "./pages/PharmacyFinderPage";
import { SupabaseTodosPage } from "./pages/SupabaseTodosPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/hospitals" element={<DirectoryPage />} />
          <Route path="/hospitals/:hospitalId" element={<HospitalPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/health-tools" element={<HealthToolsPage />} />
          <Route path="/pharmacies" element={<PharmacyFinderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/supabase-todos" element={<SupabaseTodosPage />} />
        </Routes>
      </main>
    </div>
  );
}
