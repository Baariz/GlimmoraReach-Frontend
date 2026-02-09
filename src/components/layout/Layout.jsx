import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Onboarding from '../Onboarding';
import ChatBot from '../ChatBot';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { isFirstLogin, completeOnboarding } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-64 mt-16 p-8">
        <Outlet />
      </main>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 gradient-primary text-white rounded-full shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center z-[90] cursor-pointer animate-fade-in group"
          title="Creative AI Assistant"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Onboarding Tour */}
      {isFirstLogin && <Onboarding onComplete={completeOnboarding} />}
    </div>
  );
}
