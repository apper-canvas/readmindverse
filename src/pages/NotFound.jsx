import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center">
            <ApperIcon name="BookX" className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gradient">404</h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-800 dark:text-surface-100">
            Page Not Found
          </h2>
          
          <p className="text-surface-600 dark:text-surface-300">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-card transition-all duration-300"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound