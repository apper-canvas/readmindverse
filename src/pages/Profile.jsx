import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Alex Reader',
    email: 'alex@readmind.com',
    readingLevel: 'intermediate',
    dailyGoal: 30,
    preferredGenres: ['fiction', 'science'],
    notifications: true,
    autoTrack: true
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre]
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    if (formData.dailyGoal < 5 || formData.dailyGoal > 300) {
      toast.error('Daily goal must be between 5 and 300 minutes')
      return
    }
    setProfile(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const genres = ['fiction', 'non-fiction', 'science', 'history', 'biography', 'mystery', 'romance', 'fantasy']
  const readingLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5+ years)' },
    { value: 'expert', label: 'Expert (Professional)' }
  ]

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
              <Link to="/reading-goals" className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">
                Reading Goals
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

      {/* Profile Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 p-6 md:p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100">
                  User Profile
                </h1>
                {!isEditing && (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApperIcon name="Edit" className="w-5 h-5 inline mr-2" />
                    Edit Profile
                  </motion.button>
                )}
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-surface-700/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-surface-700/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Reading Level
                    </label>
                    <select
                      name="readingLevel"
                      value={formData.readingLevel}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-surface-700/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {readingLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Daily Reading Goal (minutes)
                    </label>
                    <input
                      type="number"
                      name="dailyGoal"
                      value={formData.dailyGoal}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="5"
                      max="300"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-surface-700/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Preferred Genres */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    Preferred Genres
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {genres.map(genre => (
                      <motion.button
                        key={genre}
                        type="button"
                        onClick={() => isEditing && handleGenreChange(genre)}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                          formData.preferredGenres.includes(genre)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white/50 dark:bg-surface-700/50 border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        whileHover={isEditing ? { scale: 1.05 } : {}}
                        whileTap={isEditing ? { scale: 0.95 } : {}}
                      >
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                    Preferences
                  </h3>
                  
                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-700 dark:text-surface-300">Email Notifications</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Receive reading reminders and progress updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-surface-700 dark:text-surface-300">Auto-track Reading</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Automatically track reading sessions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="autoTrack"
                        checked={formData.autoTrack}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <motion.button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon name="Save" className="w-5 h-5 inline mr-2" />
                      Save Changes
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon name="X" className="w-5 h-5 inline mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                )}
              </form>
            </div>

            {/* Reading Statistics */}
            <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">
                Reading Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Books Read', value: '24', icon: 'BookOpen' },
                  { label: 'Current Streak', value: '12 days', icon: 'Flame' },
                  { label: 'Total Minutes', value: '2,340', icon: 'Clock' },
                  { label: 'Average Speed', value: '250 WPM', icon: 'Zap' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 bg-white/30 dark:bg-surface-700/30 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
