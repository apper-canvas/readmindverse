import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextReader from './pages/TextReader'

import Home from './pages/Home'
import Profile from './pages/Profile'
import ReadingGoals from './pages/ReadingGoals'

import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/text-reader" element={<TextReader />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/reading-goals" element={<ReadingGoals />} />

        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </Router>
  )
}

export default App