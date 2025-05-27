import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import Chart from 'react-apexcharts'

const ReadingGoals = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Read 52 Books This Year',
      description: 'Challenge myself to read one book per week',
      targetValue: 52,
      currentValue: 18,
      unit: 'books',
      deadline: '2024-12-31',
      category: 'yearly',
      isActive: true
    },
    {
      id: 2,
      title: 'Daily Reading Habit',
      description: 'Read for 30 minutes every day',
      targetValue: 30,
      currentValue: 22,
      unit: 'minutes',
      deadline: '2024-12-31',
      category: 'daily',
      isActive: true
    },
    {
      id: 3,
      title: 'Learn Sci-Fi Genre',
      description: 'Read 10 science fiction books',
      targetValue: 10,
      currentValue: 4,
      unit: 'books',
      deadline: '2024-06-30',
      category: 'genre',
      isActive: true
    }
  ])
  
  const [readingSessions, setReadingSessions] = useState([
    { date: '2024-01-15', minutes: 45, pages: 23, book: 'The Martian' },
    { date: '2024-01-14', minutes: 30, pages: 15, book: 'Dune' },
    { date: '2024-01-13', minutes: 60, pages: 28, book: 'The Martian' },
    { date: '2024-01-12', minutes: 25, pages: 12, book: 'Neuromancer' },
    { date: '2024-01-11', minutes: 40, pages: 20, book: 'Dune' },
    { date: '2024-01-10', minutes: 35, pages: 18, book: 'The Martian' },
    { date: '2024-01-09', minutes: 50, pages: 25, book: 'Foundation' },
    { date: '2024-01-08', minutes: 20, pages: 10, book: 'Neuromancer' },
    { date: '2024-01-07', minutes: 45, pages: 22, book: 'Dune' },
    { date: '2024-01-06', minutes: 55, pages: 27, book: 'The Martian' }
  ])
  
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetValue: '',
    unit: 'books',
    deadline: '',
    category: 'personal'
  })

  const [dailyProgress, setDailyProgress] = useState({
    minutes: 0,
    pages: 0,
    book: '',
    notes: ''
  })

  const [showProgressModal, setShowProgressModal] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getCurrentStreak = () => {
    const today = new Date()
    let streak = 0
    let checkDate = new Date(today)
    
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd')
      const hasSession = readingSessions.some(session => session.date === dateStr)
      
      if (hasSession) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const getDayActivity = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return readingSessions.filter(session => session.date === dateStr)
  }

  const getTotalMinutesForDate = (date) => {
    const sessions = getDayActivity(date)
    return sessions.reduce((total, session) => total + session.minutes, 0)
  }

  const handleGoalSubmit = (e) => {
    e.preventDefault()
    
    if (!goalForm.title.trim() || !goalForm.targetValue || !goalForm.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id 
          ? { ...goal, ...goalForm, targetValue: parseInt(goalForm.targetValue) }
          : goal
      ))
      toast.success('Goal updated successfully!')
      setEditingGoal(null)
    } else {
      const newGoal = {
        id: Date.now(),
        ...goalForm,
        targetValue: parseInt(goalForm.targetValue),
        currentValue: 0,
        isActive: true
      }
      setGoals(prev => [...prev, newGoal])
      toast.success('Goal created successfully!')
    }
    
    setGoalForm({ title: '', description: '', targetValue: '', unit: 'books', deadline: '', category: 'personal' })
    setShowGoalModal(false)
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setGoalForm({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue.toString(),
      unit: goal.unit,
      deadline: goal.deadline,
      category: goal.category
    })
    setShowGoalModal(true)
  }

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId))
      toast.success('Goal deleted successfully!')
    }
  }

  const handleProgressSubmit = (e) => {
    e.preventDefault()
    
    if (!dailyProgress.minutes || !dailyProgress.pages || !dailyProgress.book.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const today = format(new Date(), 'yyyy-MM-dd')
    const newSession = {
      date: today,
      minutes: parseInt(dailyProgress.minutes),
      pages: parseInt(dailyProgress.pages),
      book: dailyProgress.book,
      notes: dailyProgress.notes
    }

    setReadingSessions(prev => {
      const filtered = prev.filter(session => session.date !== today)
      return [newSession, ...filtered]
    })

    // Update goals progress
    setGoals(prev => prev.map(goal => {
      if (goal.unit === 'minutes' && goal.category === 'daily') {
        return { ...goal, currentValue: goal.currentValue + 1 }
      }
      return goal
    }))

    setDailyProgress({ minutes: 0, pages: 0, book: '', notes: '' })
    setShowProgressModal(false)
    toast.success('Daily progress logged successfully!')
  }

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent'
    },
    theme: {
      mode: darkMode ? 'dark' : 'light'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#6366f1'],
    xaxis: {
      categories: readingSessions.slice(0, 7).reverse().map(session => 
        format(new Date(session.date), 'MMM dd')
      )
    },
    yaxis: {
      title: { text: 'Minutes Read' }
    },
    grid: {
      borderColor: darkMode ? '#334155' : '#e2e8f0'
    }
  }

  const chartSeries = [{
    name: 'Reading Time',
    data: readingSessions.slice(0, 7).reverse().map(session => session.minutes)
  }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gradient">ReadMind</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">
                Profile
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 md:p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5 md:w-6 md:h-6 text-surface-700 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100 mb-2">
                Reading Goals & Progress
              </h1>
              <p className="text-surface-600 dark:text-surface-300">
                Track your reading journey and achieve your goals
              </p>
            </div>
            
            <div className="flex gap-4 mt-4 sm:mt-0">
              <motion.button
                onClick={() => setShowProgressModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
                Log Progress
              </motion.button>
              
              <motion.button
                onClick={() => setShowGoalModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="Target" className="w-5 h-5 inline mr-2" />
                New Goal
              </motion.button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Current Streak', value: `${getCurrentStreak()} days`, icon: 'Flame', color: 'from-orange-500 to-red-500' },
              { label: 'Active Goals', value: goals.filter(g => g.isActive).length, icon: 'Target', color: 'from-blue-500 to-indigo-500' },
              { label: 'This Month', value: `${readingSessions.filter(s => new Date(s.date).getMonth() === new Date().getMonth()).reduce((sum, s) => sum + s.minutes, 0)} min`, icon: 'Clock', color: 'from-green-500 to-emerald-500' },
              { label: 'Books Read', value: '18', icon: 'BookOpen', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Goals List */}
            <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">
                Active Goals
              </h2>
              
              <div className="space-y-4">
                {goals.filter(goal => goal.isActive).map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    className="p-4 bg-white/30 dark:bg-surface-700/30 rounded-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-800 dark:text-surface-100 mb-1">
                          {goal.title}
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                          {goal.description}
                        </p>
                        <div className="text-xs text-surface-500 dark:text-surface-500">
                          Due: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">
                          Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="font-medium text-primary">
                          {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reading Calendar */}
            <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                  Reading Calendar
                </h2>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                  </button>
                  
                  <span className="text-lg font-medium text-surface-700 dark:text-surface-300 px-4">
                    {format(currentDate, 'MMMM yyyy')}
                  </span>
                  
                  <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-surface-600 dark:text-surface-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isToday = isSameDay(day, new Date())
                  const totalMinutes = getTotalMinutesForDate(day)
                  const hasReading = totalMinutes > 0
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 text-sm rounded-lg transition-all duration-200 relative ${
                        isCurrentMonth
                          ? 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                          : 'text-surface-400 dark:text-surface-600'
                      } ${
                        isToday
                          ? 'bg-primary text-white font-bold'
                          : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {format(day, 'd')}
                      {hasReading && (
                        <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          totalMinutes >= 30 ? 'bg-green-500' :
                          totalMinutes >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-surface-600 dark:text-surface-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>30+ min</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>15-29 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>1-14 min</span>
                </div>
              </div>
              
              {/* Selected Date Info */}
              {selectedDate && (
                <div className="mt-4 p-4 bg-white/30 dark:bg-surface-700/30 rounded-xl">
                  <h3 className="font-medium text-surface-800 dark:text-surface-100 mb-2">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  
                  {getDayActivity(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getDayActivity(selectedDate).map((session, idx) => (
                        <div key={idx} className="text-sm text-surface-600 dark:text-surface-400">
                          📖 {session.book} - {session.minutes} min ({session.pages} pages)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-surface-500 dark:text-surface-500">
                      No reading recorded for this day
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="mt-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">
              Reading Progress (Last 7 Days)
            </h2>
            
            <div className="h-64">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height="100%"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-3xl p-6 md:p-8 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Read 52 books this year"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Describe your reading goal..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Target Value *
                    </label>
                    <input
                      type="number"
                      value={goalForm.targetValue}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="52"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Unit
                    </label>
                    <select
                      value={goalForm.unit}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="books">Books</option>
                      <option value="pages">Pages</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="personal">Personal</option>
                      <option value="daily">Daily Habit</option>
                      <option value="yearly">Yearly Challenge</option>
                      <option value="genre">Genre Exploration</option>
                      <option value="skill">Skill Development</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowGoalModal(false)
                      setEditingGoal(null)
                      setGoalForm({ title: '', description: '', targetValue: '', unit: 'books', deadline: '', category: 'personal' })
                    }}
                    className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgressModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProgressModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-3xl p-6 md:p-8 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">
                Log Today's Progress
              </h2>
              
              <form onSubmit={handleProgressSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Minutes Read *
                    </label>
                    <input
                      type="number"
                      value={dailyProgress.minutes}
                      onChange={(e) => setDailyProgress(prev => ({ ...prev, minutes: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Pages Read *
                    </label>
                    <input
                      type="number"
                      value={dailyProgress.pages}
                      onChange={(e) => setDailyProgress(prev => ({ ...prev, pages: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="15"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={dailyProgress.book}
                    onChange={(e) => setDailyProgress(prev => ({ ...prev, book: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter book title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={dailyProgress.notes}
                    onChange={(e) => setDailyProgress(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about your reading session..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Log Progress
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowProgressModal(false)
                      setDailyProgress({ minutes: 0, pages: 0, book: '', notes: '' })
                    }}
                    className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReadingGoals
