import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupList from './components/GroupList';
import GroupDetails from './components/GroupDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <header className="glass-card sticky top-0 z-50 border-b border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">Team Collaboration Hub</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<GroupList />} />
            <Route path="/groups/:groupId" element={<GroupDetails />} />
          </Routes>
        </main>
        <footer className="glass-card mt-16 border-t border-white/20">
          <div className="container mx-auto px-6 py-6 text-center">
            <p className="text-white/60 text-sm">© 2024 TaskFlow - Empowering Team Collaboration</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
