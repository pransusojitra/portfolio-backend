import React from 'react';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/Loader/Loader';
import AIChatbot from './ai-bot/components/AIChatbot';

function App() {
  return (
    <>
      <Loader />
      <MainLayout>
        <AppRoutes />
      </MainLayout>
      <AIChatbot />
    </>
  );
}

export default App;
