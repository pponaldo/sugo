import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Navigation from './components/Navigation';
import MiniPlayer from './components/MiniPlayer';
import DiaryInputPage from './pages/DiaryInputPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<DiaryInputPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <MiniPlayer />
      </PlayerProvider>
    </BrowserRouter>
  );
}
