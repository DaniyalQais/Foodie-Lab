import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { APP_BUILD_ID } from './buildVersion.ts';
import MotionProvider from './providers/MotionProvider.tsx';
import DevBuildBanner from './components/DevBuildBanner.tsx';
import './index.css';

console.info(`[Foodie Lab] build ${APP_BUILD_ID} — use http://localhost:3000 (not AI Studio) to test order flow`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <App />
      <DevBuildBanner />
    </MotionProvider>
  </StrictMode>
);
