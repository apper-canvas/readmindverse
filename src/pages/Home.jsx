import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'


const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const features = [
    {
      icon: 'Brain',
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your reading patterns and provides personalized insights to improve comprehension.'
    },
    {
      icon: 'BookOpen',
      title: 'Interactive Reading',
      description: 'Highlight, annotate, and interact with text while AI provides real-time vocabulary assistance.'
    },
    {
      icon: 'TrendingUp',
      title: 'Progress Tracking',
      description: 'Monitor your reading speed, comprehension scores, and vocabulary growth over time.'
    },
    {
      icon: 'Target',
      title: 'Personalized Goals',
      description: 'Set and achieve reading goals with AI-powered recommendations tailored to your level.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ReadMind</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/reading-goals" className="text-surface-700 dark:text-surface-300 hover:text-primary transition-colors duration-200">
                Reading Goals
              </Link>
              <Link to="/profile" className="text-surface-700 dark:text-surface-300 hover:text-primary transition-colors duration-200">
                Profile
              </Link>
              <Link to="/text-reader" className="text-surface-700 dark:text-surface-300 hover:text-primary transition-colors duration-200">
                AI Reader
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <ApperIcon 
                  name={darkMode ? 'Sun' : 'Moon'} 
                  className="w-5 h-5 text-surface-700 dark:text-surface-300" 
                />
              </button>
            </div>
            
            <div className="md:hidden">
              <button className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <ApperIcon name="Menu" className="w-6 h-6 text-surface-700 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

            {/* Import & Save Articles */}
            <motion.div
              className="group p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/library')}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="FileText" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-2">
                Import & Save
              </h3>
              <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">
                Import articles, PDFs, and documents to build your personal reading library.
              </p>
            </motion.div>


      {/* Quick Access Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100 mb-4">
              Quick Access
            </h2>
            <p className="text-surface-600 dark:text-surface-300">
              Jump into your reading journey with these powerful tools
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'BookOpen', title: 'Reading Goals', desc: 'Set and track reading targets', href: '/reading-goals' },
              { icon: 'User', title: 'Profile', desc: 'Manage your reading profile', href: '/profile' },
              { icon: 'Brain', title: 'AI Text Reader', desc: 'Interactive reading with AI summaries', href: '/text-reader' },
              { icon: 'Target', title: 'Comprehension', desc: 'Test your understanding', href: '#' },
              { icon: 'BookA', title: 'Vocabulary', desc: 'Build your word knowledge', href: '#' },
              { icon: 'TrendingUp', title: 'Progress', desc: 'Track your improvements', href: '#' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 hover:shadow-card transition-all duration-300"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={feature.href}
                  className="block"
                  onClick={() => {
                    if (feature.href !== '#') {
                      toast.success(`Opening ${feature.title}...`, {
                        position: "top-right",
                        autoClose: 1500,
                      })
                    } else {
                      toast.info(`${feature.title} coming soon!`, {
                        position: "top-right",
                        autoClose: 2000,
                      })
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-300">
                    {feature.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">AI-Powered</span>
                <br />
                <span className="text-surface-800 dark:text-surface-100">Reading</span>
                <br />
                <span className="text-surface-700 dark:text-surface-200">Companion</span>
              </h1>
              
              <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl">
                Transform your reading experience with intelligent assistance, personalized learning, and real-time comprehension analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Reading Smarter
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-surface-700 dark:text-surface-300 font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&crop=center"
                  alt="AI Reading Interface"
                  className="relative w-full h-auto rounded-3xl shadow-neu-light dark:shadow-neu-dark"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-4">
              Intelligent Reading Features
            </h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
              Experience the future of reading with AI-driven insights and personalized learning paths.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 md:p-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20 hover:bg-white/80 dark:hover:bg-surface-800/80 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                
                <h3 className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-100 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interactive Feature */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white/30 dark:bg-surface-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: '10K+', label: 'Active Readers' },
              { number: '500K+', label: 'Books Analyzed' },
              { number: '95%', label: 'Comprehension Improvement' },
              { number: '2.5x', label: 'Faster Learning' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-surface-600 dark:text-surface-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ReadMind</span>
            </div>
            
            <p className="text-surface-600 dark:text-surface-300 text-center md:text-left">
              © 2024 ReadMind. Empowering readers with AI intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home