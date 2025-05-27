import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

import ApperIcon from '../components/ApperIcon'

const TextReader = () => {
  const location = useLocation()

  const [selectedBook, setSelectedBook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [chapterSummaries, setChapterSummaries] = useState({})
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 16,
    theme: 'light',
    readingSpeed: 250
  })
  const [readingProgress, setReadingProgress] = useState(0)
  const [showSummaryPanel, setShowSummaryPanel] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const textRef = useRef(null)
  const summaryRef = useRef(null)

  // Sample book data with chapters
  const sampleBooks = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      author: "Dr. Sarah Chen",
      chapters: [
        {
          title: "Introduction to AI",
          content: `Artificial Intelligence has emerged as one of the most transformative technologies of the 21st century. From its humble beginnings in academic research laboratories to its current widespread adoption across industries, AI has fundamentally changed how we approach problem-solving and decision-making.

The field of AI encompasses various subdomains including machine learning, natural language processing, computer vision, and robotics. Each of these areas has contributed to the development of intelligent systems that can perform tasks traditionally requiring human intelligence.

As we stand at the threshold of an AI-driven future, it becomes crucial to understand not just the technical aspects of these systems, but also their societal implications, ethical considerations, and potential impact on human civilization. This book aims to provide a comprehensive exploration of these topics while maintaining accessibility for readers from diverse backgrounds.

The journey of AI development has been marked by periods of rapid advancement and periods of slower progress, often referred to as "AI winters." However, recent breakthroughs in deep learning, computational power, and data availability have ushered in a new era of AI capabilities that seemed like science fiction just a decade ago.`
        },
        {
          title: "Machine Learning Fundamentals",
          content: `Machine Learning represents the cornerstone of modern artificial intelligence systems. Unlike traditional programming where explicit instructions are provided for every scenario, machine learning enables systems to learn patterns from data and make predictions or decisions based on that learning.

The three primary paradigms of machine learning are supervised learning, unsupervised learning, and reinforcement learning. Supervised learning involves training models on labeled datasets, where the desired output is known for each input. This approach is widely used in applications such as image recognition, spam detection, and medical diagnosis.

Unsupervised learning, on the other hand, deals with finding patterns in data without explicit labels. This includes clustering algorithms that group similar data points together and dimensionality reduction techniques that simplify complex datasets while preserving important information.

Reinforcement learning takes inspiration from behavioral psychology, where an agent learns to make decisions by receiving rewards or penalties based on its actions. This approach has achieved remarkable success in game-playing AI systems and is increasingly being applied to real-world scenarios such as autonomous driving and resource optimization.

The success of machine learning heavily depends on the quality and quantity of training data, the choice of appropriate algorithms, and careful evaluation of model performance. Understanding these fundamentals is essential for anyone looking to work with AI systems or understand their capabilities and limitations.`
        },
        {
          title: "Neural Networks and Deep Learning",
          content: `Neural networks form the backbone of many modern AI systems, inspired by the structure and function of biological neural networks in the human brain. These computational models consist of interconnected nodes or "neurons" that process and transmit information through weighted connections.

Deep learning, a subset of machine learning that uses neural networks with multiple hidden layers, has revolutionized the field of AI in recent years. The "deep" in deep learning refers to the multiple layers that allow these networks to learn increasingly complex and abstract representations of data.

Convolutional Neural Networks (CNNs) have proven particularly effective for image processing tasks, achieving superhuman performance in image classification and object detection. These networks use specialized layers that can detect features such as edges, textures, and shapes, building up to recognize complex objects and scenes.

Recurrent Neural Networks (RNNs) and their advanced variants like Long Short-Term Memory (LSTM) networks are designed to handle sequential data such as text, speech, and time series. These networks have memory capabilities that allow them to maintain information across time steps, making them ideal for language processing and prediction tasks.

Transformer architectures, introduced more recently, have become the foundation for large language models that power modern AI assistants and text generation systems. These models use attention mechanisms to process all parts of an input sequence simultaneously, leading to more efficient training and better performance on language tasks.

The training of deep neural networks requires significant computational resources and carefully designed optimization algorithms. Techniques such as backpropagation, gradient descent, and various regularization methods are essential for building effective deep learning systems.`
        },
        {
          title: "AI Applications and Impact",
          content: `The practical applications of artificial intelligence span virtually every sector of the economy and society. In healthcare, AI systems assist in medical imaging analysis, drug discovery, and personalized treatment recommendations. These applications have the potential to improve diagnostic accuracy, reduce costs, and make healthcare more accessible globally.

In the financial sector, AI powers algorithmic trading, fraud detection, credit scoring, and risk assessment. These systems can process vast amounts of financial data in real-time, identifying patterns and anomalies that would be impossible for human analysts to detect manually.

The transportation industry is being transformed by autonomous vehicles, which rely on a combination of computer vision, sensor fusion, and decision-making algorithms. While fully autonomous vehicles are still being developed, AI-assisted driving features are already improving road safety and efficiency.

E-commerce and digital marketing leverage AI for recommendation systems, price optimization, and customer service automation. These applications have fundamentally changed how businesses interact with customers and optimize their operations.

In education, AI-powered adaptive learning systems provide personalized instruction that adjusts to each student's learning pace and style. These systems can identify knowledge gaps and provide targeted interventions to improve learning outcomes.

The environmental impact of AI is also significant, with applications in climate modeling, energy optimization, and environmental monitoring. AI systems can help optimize renewable energy distribution, predict weather patterns, and monitor deforestation and pollution levels.

However, the widespread adoption of AI also raises important questions about job displacement, privacy, bias, and the concentration of technological power. Understanding these challenges is crucial for developing responsible AI systems that benefit society as a whole.`
        },
        {
          title: "Ethics and Future Considerations",
          content: `As artificial intelligence becomes increasingly integrated into our daily lives, the ethical implications of these technologies become paramount. The development and deployment of AI systems must consider fairness, transparency, accountability, and the potential for both positive and negative societal impacts.

One of the most pressing concerns is algorithmic bias, where AI systems perpetuate or amplify existing societal biases present in training data. This can lead to discriminatory outcomes in hiring, lending, criminal justice, and other critical areas. Addressing bias requires diverse development teams, careful data curation, and ongoing monitoring of AI system outputs.

Privacy concerns arise as AI systems often require large amounts of personal data to function effectively. The challenge lies in balancing the benefits of personalized AI services with individuals' rights to privacy and data protection. Techniques such as federated learning and differential privacy are being developed to address these concerns.

The question of AI transparency and explainability is particularly important in high-stakes applications such as healthcare and criminal justice. Stakeholders need to understand how AI systems make decisions, especially when those decisions significantly impact human lives.

Looking toward the future, the development of artificial general intelligence (AGI) – AI systems that match or exceed human cognitive abilities across all domains – represents both tremendous opportunity and significant risk. While AGI could help solve many of humanity's greatest challenges, it also raises questions about human agency, economic disruption, and existential safety.

The governance of AI development requires international cooperation and the establishment of ethical guidelines and regulatory frameworks. Organizations and governments worldwide are working to develop standards and policies that promote beneficial AI development while mitigating potential risks.

As we continue to advance AI technologies, it is essential that we maintain human values at the center of development efforts. The goal should be to create AI systems that augment human capabilities, enhance human welfare, and preserve human autonomy and dignity. This requires ongoing dialogue between technologists, ethicists, policymakers, and society at large.`
        }
      ]
    }
  ]


  useEffect(() => {
    // Check if a document was passed from Library
    if (location.state?.document) {
      const document = location.state.document
      
      // Convert document content to chapters if it's a single document
      const documentChapters = [
        {
          title: document.title,
          content: document.content
        }
      ]
      
      const documentBook = {
        id: document.id,
        title: document.title,
        author: document.author,
        chapters: documentChapters
      }
      
      setSelectedBook(documentBook)
      setChapters(documentChapters)
      setCurrentChapter(0)
      
      toast.success(`Opened: ${document.title}`, {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }, [location.state])

  useEffect(() => {
    // Initialize with first book
    if (sampleBooks.length > 0) {
      setSelectedBook(sampleBooks[0])
      setChapters(sampleBooks[0].chapters)
    }
  }, [])

  useEffect(() => {
    // Generate summary for current chapter if not already generated
    if (chapters.length > 0 && !chapterSummaries[currentChapter]) {
      generateChapterSummary(currentChapter)
    }
  }, [currentChapter, chapters])

  useEffect(() => {
    const handleScroll = () => {
      if (textRef.current) {
        const element = textRef.current
        const scrollTop = element.scrollTop
        const scrollHeight = element.scrollHeight - element.clientHeight
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
        setScrollProgress(progress)
        
        // Update overall reading progress
        const chapterProgress = progress / 100
        const totalProgress = (currentChapter + chapterProgress) / chapters.length
        setReadingProgress(totalProgress * 100)
      }
    }

    const textElement = textRef.current
    if (textElement) {
      textElement.addEventListener('scroll', handleScroll)
      return () => textElement.removeEventListener('scroll', handleScroll)
    }
  }, [currentChapter, chapters.length])

  const generateChapterSummary = async (chapterIndex) => {
    if (!chapters[chapterIndex]) return
    
    setIsGeneratingSummary(true)
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      const chapter = chapters[chapterIndex]
      const wordCount = chapter.content.split(' ').length
      const estimatedReadTime = Math.ceil(wordCount / readingSettings.readingSpeed)
      
      // Generate AI summary based on chapter content
      const summaries = {
        0: {
          keyPoints: [
            "AI has emerged as a transformative 21st-century technology",
            "The field encompasses machine learning, NLP, computer vision, and robotics",
            "Understanding both technical and societal implications is crucial",
            "Recent breakthroughs have ended previous 'AI winters'"
          ],
          summary: "This introductory chapter establishes AI as a revolutionary technology that has evolved from academic research to widespread industrial adoption. It emphasizes the importance of understanding AI's technical aspects alongside its ethical and societal implications.",
          themes: ["Technology Evolution", "Societal Impact", "Historical Context"],
          difficulty: "Beginner",
          readingTime: estimatedReadTime
        },
        1: {
          keyPoints: [
            "Machine learning enables systems to learn from data patterns",
            "Three main paradigms: supervised, unsupervised, and reinforcement learning",
            "Each paradigm serves different types of problems and applications",
            "Success depends on data quality, algorithms, and proper evaluation"
          ],
          summary: "This chapter explores the fundamental concepts of machine learning, detailing the three primary learning paradigms and their applications. It emphasizes the critical role of data quality and algorithm selection in developing effective ML systems.",
          themes: ["Learning Paradigms", "Data Science", "Algorithm Selection"],
          difficulty: "Intermediate",
          readingTime: estimatedReadTime
        },
        2: {
          keyPoints: [
            "Neural networks are inspired by biological brain structures",
            "Deep learning uses multiple layers for complex pattern recognition",
            "CNNs excel at image processing, RNNs handle sequential data",
            "Transformers have revolutionized language processing tasks"
          ],
          summary: "This chapter delves into neural network architectures and deep learning methodologies. It covers specialized networks like CNNs for vision tasks and transformers for language processing, highlighting their computational requirements.",
          themes: ["Neural Architecture", "Deep Learning", "Computational Models"],
          difficulty: "Advanced",
          readingTime: estimatedReadTime
        },
        3: {
          keyPoints: [
            "AI applications span healthcare, finance, transportation, and education",
            "Each sector benefits from AI's pattern recognition and automation capabilities",
            "Real-world implementations are improving efficiency and outcomes",
            "Adoption raises questions about job displacement and societal impact"
          ],
          summary: "This chapter examines practical AI applications across various industries, demonstrating how AI technologies are being implemented to solve real-world problems and improve operational efficiency while acknowledging associated challenges.",
          themes: ["Industry Applications", "Real-world Impact", "Technological Adoption"],
          difficulty: "Intermediate",
          readingTime: estimatedReadTime
        },
        4: {
          keyPoints: [
            "Ethical considerations include bias, privacy, and transparency",
            "AGI development presents both opportunities and existential risks",
            "International cooperation is needed for responsible AI governance",
            "Human values must remain central to AI development"
          ],
          summary: "The final chapter addresses critical ethical considerations in AI development, discussing bias mitigation, privacy protection, and the future implications of artificial general intelligence while emphasizing the need for human-centered design.",
          themes: ["AI Ethics", "Future Governance", "Human Values"],
          difficulty: "Advanced",
          readingTime: estimatedReadTime
        }
      }
      
      const newSummary = summaries[chapterIndex] || {
        keyPoints: ["Chapter summary being generated..."],
        summary: "AI analysis in progress for this chapter.",
        themes: ["Analysis Pending"],
        difficulty: "Unknown",
        readingTime: estimatedReadTime
      }
      
      setChapterSummaries(prev => ({
        ...prev,
        [chapterIndex]: newSummary
      }))
      
      toast.success(`Chapter ${chapterIndex + 1} summary generated!`, {
        position: "top-right",
        autoClose: 2000,
      })
      
    } catch (error) {
      toast.error("Failed to generate summary. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const navigateToChapter = (chapterIndex) => {
    if (chapterIndex >= 0 && chapterIndex < chapters.length) {
      setCurrentChapter(chapterIndex)
      toast.info(`Navigated to Chapter ${chapterIndex + 1}`, {
        position: "top-right",
        autoClose: 1500,
      })
    }
  }

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      chapterIndex: currentChapter,
      chapterTitle: chapters[currentChapter]?.title,
      scrollPosition: textRef.current?.scrollTop || 0,
      timestamp: new Date().toLocaleString()
    }
    
    setBookmarks(prev => [...prev, bookmark])
    toast.success("Bookmark added!", {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const goToBookmark = (bookmark) => {
    setCurrentChapter(bookmark.chapterIndex)
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.scrollTop = bookmark.scrollPosition
      }
    }, 100)
    
    toast.info(`Jumped to bookmark: ${bookmark.chapterTitle}`, {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const removeBookmark = (bookmarkId) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
    toast.success("Bookmark removed!", {
      position: "top-right",
      autoClose: 1500,
    })
  }

  const updateReadingSettings = (setting, value) => {
    setReadingSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    
    toast.info(`${setting.charAt(0).toUpperCase() + setting.slice(1)} updated!`, {
      position: "top-right",
      autoClose: 1500,
    })
  }

  const regenerateSummary = async () => {
    // Clear existing summary
    setChapterSummaries(prev => {
      const newSummaries = { ...prev }
      delete newSummaries[currentChapter]
      return newSummaries
    })
    
    // Generate new summary
    await generateChapterSummary(currentChapter)
  }

  if (!selectedBook || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="BookOpen" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
          <p className="text-surface-600 dark:text-surface-300">Loading text reader...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">
                  {selectedBook.title}
                </h1>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  by {selectedBook.author}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={addBookmark}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Bookmark" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowSummaryPanel(!showSummaryPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showSummaryPanel 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="PanelRightOpen" className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-surface-600 dark:text-surface-300">
                Chapter {currentChapter + 1} of {chapters.length}
              </span>
              <span className="text-sm text-surface-600 dark:text-surface-300">
                {Math.round(readingProgress)}% Complete
              </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${readingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className={`grid gap-6 ${showSummaryPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} transition-all duration-300`}>
          
          {/* Text Reading Panel */}
          <div className={`${showSummaryPanel ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-4`}>
            {/* Chapter Navigation */}
            <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
              <motion.button
                onClick={() => navigateToChapter(currentChapter - 1)}
                disabled={currentChapter === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: currentChapter > 0 ? 1.02 : 1 }}
                whileTap={{ scale: currentChapter > 0 ? 0.98 : 1 }}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                <span className="text-sm font-medium">Previous</span>
              </motion.button>
              
              <div className="text-center">
                <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                  {chapters[currentChapter]?.title}
                </h2>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  Chapter {currentChapter + 1}
                </p>
              </div>
              
              <motion.button
                onClick={() => navigateToChapter(currentChapter + 1)}
                disabled={currentChapter === chapters.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: currentChapter < chapters.length - 1 ? 1.02 : 1 }}
                whileTap={{ scale: currentChapter < chapters.length - 1 ? 0.98 : 1 }}
              >
                <span className="text-sm font-medium">Next</span>
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Reading Settings */}
            <div className="p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={readingSettings.fontSize}
                    onChange={(e) => updateReadingSettings('fontSize', parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <span className="text-xs text-surface-500">{readingSettings.fontSize}px</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={readingSettings.theme}
                    onChange={(e) => updateReadingSettings('theme', e.target.value)}
                    className="w-full px-3 py-1 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="sepia">Sepia</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Reading Speed (WPM)
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    step="25"
                    value={readingSettings.readingSpeed}
                    onChange={(e) => updateReadingSettings('readingSpeed', parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <span className="text-xs text-surface-500">{readingSettings.readingSpeed}</span>
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20 overflow-hidden">
              <div 
                ref={textRef}
                className="h-96 overflow-y-auto p-6 scrollbar-hide"
                style={{
                  fontSize: `${readingSettings.fontSize}px`,
                  backgroundColor: readingSettings.theme === 'sepia' ? '#f4f1e8' : undefined,
                  color: readingSettings.theme === 'sepia' ? '#5c4b37' : undefined
                }}
              >
                <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
                  {chapters[currentChapter]?.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Chapter Scroll Progress */}
              <div className="px-6 pb-4">
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Summary Panel */}
          <AnimatePresence>
            {showSummaryPanel && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Summary Content */}
                <div className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Brain" className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                        AI Summary
                      </h3>
                    </div>
                    
                    <motion.button
                      onClick={regenerateSummary}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name="RefreshCw" className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                    </motion.button>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isGeneratingSummary ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-12"
                      >
                        <div className="text-center">
                          <ApperIcon name="Loader2" className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                          <p className="text-sm text-surface-600 dark:text-surface-300">
                            Generating AI summary...
                          </p>
                        </div>
                      </motion.div>
                    ) : chapterSummaries[currentChapter] ? (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Summary Text */}
                        <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                          <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                            {chapterSummaries[currentChapter].summary}
                          </p>
                        </div>
                        
                        {/* Key Points */}
                        <div>
                          <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-2">
                            Key Points
                          </h4>
                          <ul className="space-y-2">
                            {chapterSummaries[currentChapter].keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-surface-600 dark:text-surface-300">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Themes */}
                        <div>
                          <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-2">
                            Main Themes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {chapterSummaries[currentChapter].themes.map((theme, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Reading Stats */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-200 dark:border-surface-600">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                              {chapterSummaries[currentChapter].readingTime}m
                            </div>
                            <div className="text-xs text-surface-500">Est. Reading Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                              {chapterSummaries[currentChapter].difficulty}
                            </div>
                            <div className="text-xs text-surface-500">Difficulty</div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-surface-500 dark:text-surface-400"
                      >
                        <ApperIcon name="Sparkles" className="w-8 h-8 mx-auto mb-3" />
                        <p className="text-sm">AI summary will appear here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Chapter Navigation List */}
                <div className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-4">
                    Chapters
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                    {chapters.map((chapter, index) => (
                      <motion.button
                        key={index}
                        onClick={() => navigateToChapter(index)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          index === currentChapter
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">
                              {chapter.title}
                            </div>
                            <div className={`text-xs ${
                              index === currentChapter ? 'text-white/80' : 'text-surface-500'
                            }`}>
                              Chapter {index + 1}
                            </div>
                          </div>
                          {chapterSummaries[index] && (
                            <ApperIcon 
                              name="Check" 
                              className={`w-4 h-4 ${
                                index === currentChapter ? 'text-white' : 'text-green-500'
                              }`} 
                            />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Bookmarks */}
                {bookmarks.length > 0 && (
                  <div className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
                    <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-4">
                      Bookmarks
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                      {bookmarks.slice(-5).map((bookmark) => (
                        <div
                          key={bookmark.id}
                          className="flex items-center justify-between p-2 bg-surface-100 dark:bg-surface-700 rounded-lg"
                        >
                          <motion.button
                            onClick={() => goToBookmark(bookmark)}
                            className="flex-1 text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="text-sm font-medium text-surface-800 dark:text-surface-100">
                              {bookmark.chapterTitle}
                            </div>
                            <div className="text-xs text-surface-500">
                              {bookmark.timestamp}
                            </div>
                          </motion.button>
                          <motion.button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="X" className="w-3 h-3 text-surface-500" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default TextReader