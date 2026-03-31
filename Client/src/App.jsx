import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/Loginpage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/Notfoundpage';
import DashboardPage from './pages/Dashboard/Dashboard';
import DocumentsetPage from './pages/Documents/DocumentsetPage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import Flashcardsetpage from './pages/flashcards/Flashcardsetpage';
import FlashcardsPage from './pages/flashcards/FlashcardsPage';
import Quizes from './pages/Quizes/Quizes';
import QuizesResult  from './pages/Quizes/QuizesResult';
import ProfilePage from './pages/Profile/Profilepage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const isAuthorized = false;
  const loading = false;
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthorized ? <Navigate to='/dashboard' replace /> : <Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        {/** Protected Routes */}
        <Route element={<ProtectedRoute />}>
           <Route path='/dashboard' element={<DashboardPage/>}/>
           <Route path='/documents' element={<DocumentsetPage/>}/>
           <Route path='/documents/:id' elements={<DocumentsPage/>}/>
           <Route path='/flashcards' element={<Flashcardsetpage/>}/>
           <Route path='/documents/:id/flashcards' element={<FlashcardsPage/>}/>
           <Route path='/quizzes/:quizeid' element={<Quizes/>}/>
           <Route path='/quizzes/:quizeid/results' element={<QuizesResult/>}/>
           <Route path='/profile' elements={<ProfilePage/>}/>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
