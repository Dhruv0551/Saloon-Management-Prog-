import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { JoinScreen } from './screens/JoinScreen';
import { StatusScreen } from './screens/StatusScreen';
import { ReceptionScreen } from './screens/ReceptionScreen';
import { BarberScreen } from './screens/BarberScreen';
import { DisplayScreen } from './screens/DisplayScreen';
import { AdminScreen } from './screens/AdminScreen';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-canvas text-gray-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Screen 1: Home */}
              <Route path="/" element={<HomeScreen />} />

              {/* Screen 2: Join Queue */}
              <Route path="/join" element={<JoinScreen />} />

              {/* Screen 3: My Status */}
              <Route path="/status/:id" element={<StatusScreen />} />

              {/* Screen 4: Reception Dashboard */}
              <Route path="/reception" element={<ReceptionScreen />} />

              {/* Screen 5: Barber View */}
              <Route path="/barber/:name" element={<BarberScreen />} />
              <Route path="/barber" element={<Navigate to="/barber/ravi" replace />} />

              {/* Screen 6: Waiting Area TV */}
              <Route path="/display" element={<DisplayScreen />} />

              {/* Screen 7: Owner Settings */}
              <Route path="/admin" element={<AdminScreen />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
