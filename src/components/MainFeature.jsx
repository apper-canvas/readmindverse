import { useNavigate } from 'react-router-dom'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const navigate = useNavigate()

  const [selectedText, setSelectedText] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [vocabularyWords, setVocabularyWords] = useState([])
  const [comprehensionQuestions, setComprehensionQuestions] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentWord, setCurrentWord] = useState(null)
  const [readingStats, setReadingStats] = useState({
    wordsPerMinute: 0,
    comprehensionScore: 0,
    timeSpent: 0
  })
  
  const textRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  const sampleText = `Artificial intelligence has revolutionized the way we approach learning and comprehension. Machine learning algorithms can now analyze reading patterns, identify areas of difficulty, and provide personalized recommendations to enhance understanding. This technological advancement represents a paradigm shift in educational methodologies, offering unprecedented opportunities for individualized learning experiences.

The integration of AI in reading comprehension tools demonstrates remarkable efficacy in improving literacy rates across diverse demographics. Natural language processing enables these systems to understand context, sentiment, and complexity levels, thereby facilitating adaptive learning environments that respond to each user's unique cognitive profile.

Furthermore, the sophisticated algorithms employed in modern reading assistance platforms can generate contextual definitions, suggest supplementary materials, and create dynamic assessment frameworks that evolve with the learner's progress. This multifaceted approach ensures comprehensive skill development while maintaining engagement through interactive and responsive interfaces.`

  const vocabulary = [
    { word: 'paradigm', definition: 'A typical example or pattern of something; a model', difficulty: 'advanced' },
    { word: 'efficacy', definition: 'The ability to produce a desired or intended result', difficulty: 'intermediate' },
    { word: 'demographics', definition: 'Statistical data relating to the population and particular groups within it', difficulty: 'intermediate' },
    { word: 'multifaceted', definition: 'Having many different aspects or features', difficulty: 'advanced' },
    { word: 'unprecedented', definition: 'Never done or known before', difficulty: 'intermediate' }
  ]

  const questions = [
    {
      question: "What is the main benefit of AI in reading comprehension?",
      options: ["Faster reading", "Personalized learning", "Better graphics", "Cheaper costs"],
      correct: 1
    },
    {
      question: "How do AI systems understand text complexity?",
      options: ["Random selection", "Natural language processing", "User feedback only", "Basic counting"],
      correct: 1
    },
    {
      question: "What makes modern reading platforms effective?",
      options: ["Simple design", "Multifaceted approach", "Limited features", "Static content"],
      correct: 1
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000
      const wordsRead = Math.floor(readingProgress * sampleText.split(' ').length)
      const wpm = Math.floor((wordsRead / timeSpent) * 60)
      
      setReadingStats(prev => ({
        ...prev,
        timeSpent: Math.floor(timeSpent),
        wordsPerMinute: wpm
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [readingProgress, sampleText])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const selected = selection.toString().trim()
    
    if (selected && selected.length > 0) {
      setSelectedText(selected)
      analyzeSelection(selected)
    }
  }

  const analyzeSelection = async (text) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const words = text.toLowerCase().split(/\s+/)
    const foundVocab = vocabulary.filter(v => 
      words.some(word => word.includes(v.word) || v.word.includes(word))
    )
    
    setAiAnalysis({
      complexity: Math.floor(Math.random() * 5) + 3,
      sentiment: ['positive', 'neutral', 'analytical'][Math.floor(Math.random() * 3)],
      keyTerms: foundVocab.length > 0 ? foundVocab.slice(0, 2) : vocabulary.slice(0, 2),
      summary: `This passage discusses ${text.length > 50 ? 'advanced concepts in' : 'basic principles of'} artificial intelligence and its applications in education.`
    })
    
    setVocabularyWords(foundVocab.length > 0 ? foundVocab : vocabulary.slice(0, 3))
    setIsAnalyzing(false)
    
    toast.success("Text analysis complete!", {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const handleWordClick = (word, definition) => {
    setCurrentWord({ word, definition })
    toast.info(`Definition loaded for: ${word}`, {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const handleProgressUpdate = (e) => {
    const rect = textRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const elementTop = rect.top + scrollTop
    const elementHeight = rect.height
    const viewportHeight = window.innerHeight
    
    const visibleTop = Math.max(0, scrollTop + viewportHeight - elementTop)
    const visibleBottom = Math.min(elementHeight, scrollTop + viewportHeight - elementTop)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)
    
    const progress = Math.min(1, visibleHeight / elementHeight)
    setReadingProgress(progress)
  }

  const startComprehensionTest = () => {
    setComprehensionQuestions(questions)
    toast.info("Comprehension assessment started!", {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const handleAnswerQuestion = (questionIndex, answerIndex) => {
    const updatedQuestions = [...comprehensionQuestions]
    updatedQuestions[questionIndex].selectedAnswer = answerIndex
    setComprehensionQuestions(updatedQuestions)
    
    if (answerIndex === updatedQuestions[questionIndex].correct) {
      toast.success("Correct answer!", {
        position: "top-right",
        autoClose: 1500,
      })
    } else {
      toast.error("Try again!", {
        position: "top-right",
        autoClose: 1500,
      })
    }
    
    // Calculate comprehension score
    const answeredQuestions = updatedQuestions.filter(q => q.selectedAnswer !== undefined)
    const correctAnswers = answeredQuestions.filter(q => q.selectedAnswer === q.correct)
    const score = Math.round((correctAnswers.length / answeredQuestions.length) * 100) || 0
    
    setReadingStats(prev => ({
      ...prev,
      comprehensionScore: score
    }))
  }

  useEffect(() => {
    window.addEventListener('scroll', handleProgressUpdate)
    return () => window.removeEventListener('scroll', handleProgressUpdate)
  }, [])

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100">
          Interactive Reading Experience
        </h2>
        <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
          Select text to analyze, track your reading progress, and test your comprehension with AI-powered assistance.
        </p>
      </motion.div>

      {/* Reading Stats Dashboard */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        {[
          { icon: 'Zap', label: 'WPM', value: readingStats.wordsPerMinute, color: 'from-yellow-400 to-orange-500' },
          { icon: 'Target', label: 'Comprehension', value: `${readingStats.comprehensionScore}%`, color: 'from-green-400 to-emerald-500' },
          { icon: 'Clock', label: 'Time', value: `${readingStats.timeSpent}s`, color: 'from-blue-400 to-cyan-500' },
          { icon: 'TrendingUp', label: 'Progress', value: `${Math.round(readingProgress * 100)}%`, color: 'from-purple-400 to-pink-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 md:p-6 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <ApperIcon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-100">
              {stat.value}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-300">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Reading Interface */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Reading Text Panel */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="p-6 md:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-xl md:text-2xl font-semibold text-surface-800 dark:text-surface-100">
                AI and Reading Comprehension
              </h3>
              <motion.button
                onClick={startComprehensionTest}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-card transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Brain" className="w-4 h-4 inline mr-2" />
                Start Test
              </motion.button>
            </div>
            
            <div
              ref={textRef}
              className="prose prose-lg dark:prose-invert max-w-none text-surface-700 dark:text-surface-300 leading-relaxed cursor-pointer select-text"
              onMouseUp={handleTextSelection}
              style={{ userSelect: 'text' }}
            >
              {sampleText.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mr-1 transition-all duration-200 hover:bg-accent/20 hover:rounded px-1 ${
                    vocabulary.some(v => word.toLowerCase().includes(v.word)) 
                      ? 'bg-primary/10 text-primary-dark font-medium cursor-pointer border-b-2 border-primary/30' 
                      : ''
                  }`}
                  onClick={() => {
                    const vocabWord = vocabulary.find(v => word.toLowerCase().includes(v.word))
                    if (vocabWord) {
                      handleWordClick(vocabWord.word, vocabWord.definition)
                    }
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Reading Progress Bar */}
            <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-700 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Reading Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(readingProgress * 100)}%</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${readingProgress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* AI Analysis */}
          <div className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Brain" className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-100">AI Analysis</h4>
            </div>

            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <ApperIcon name="Loader2" className="w-8 h-8 text-primary animate-spin" />
                </motion.div>
              ) : selectedText ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-xl">
                    <div className="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">Selected Text:</div>
                    <div className="text-sm text-surface-800 dark:text-surface-100 italic">"{selectedText.substring(0, 100)}..."</div>
                  </div>
                  
                  {aiAnalysis && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-300">Complexity:</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < aiAnalysis.complexity ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-300">Sentiment: </span>
                        <span className="text-sm font-medium text-surface-800 dark:text-surface-100 capitalize">
                          {aiAnalysis.sentiment}
                        </span>
                      </div>
                      
                      <div className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
                        {aiAnalysis.summary}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-surface-500 dark:text-surface-400"
                >
                  <ApperIcon name="MousePointerClick" className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Select text to analyze</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vocabulary Panel */}
          <div className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookA" className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-100">Vocabulary</h4>
            </div>

            <div className="space-y-3">
              {vocabularyWords.slice(0, 4).map((vocab, index) => (
                <motion.div
                  key={vocab.word}
                  className="group p-3 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleWordClick(vocab.word, vocab.definition)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-surface-800 dark:text-surface-100">
                      {vocab.word}
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      vocab.difficulty === 'advanced' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {vocab.difficulty}
                    </div>
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-300 mt-1 group-hover:text-surface-700 dark:group-hover:text-surface-200">
                    {vocab.definition}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Word Definition Popup */}
          <AnimatePresence>
            {currentWord && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-lg">{currentWord.word}</h5>
                  <button
                    onClick={() => setCurrentWord(null)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm opacity-90">{currentWord.definition}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Comprehension Questions */}
      <AnimatePresence>
        {comprehensionQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-surface-700/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="HelpCircle" className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-surface-800 dark:text-surface-100">
                Comprehension Assessment
              </h3>
            </div>

            <div className="grid gap-6">
              {comprehensionQuestions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  className="p-4 md:p-6 bg-surface-50 dark:bg-surface-700 rounded-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                >
                  <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-4">
                    {qIndex + 1}. {question.question}
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {question.options.map((option, oIndex) => (
                      <motion.button
                        key={oIndex}
                        onClick={() => handleAnswerQuestion(qIndex, oIndex)}
                        className={`p-3 text-left rounded-xl border-2 transition-all duration-200 ${
                          question.selectedAnswer === oIndex
                            ? question.selectedAnswer === question.correct
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'border-surface-300 dark:border-surface-600 hover:border-primary hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-surface-700 dark:text-surface-300">{option}</span>
                        {question.selectedAnswer === oIndex && (
                          <ApperIcon 
                            name={question.selectedAnswer === question.correct ? "Check" : "X"} 
                            className="w-4 h-4 inline ml-2" 
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      {/* Floating AI Q&A Button */}
      <motion.button
        onClick={() => navigate('/ask-questions')}
        className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name="Brain" className="w-6 h-6" />
      </motion.button>

      </AnimatePresence>
    </div>
  )
}

export default MainFeature