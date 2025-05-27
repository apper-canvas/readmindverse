import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const AskQuestions = () => {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFavorites, setFilterFavorites] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const messagesEndRef = useRef(null)
  const questionInputRef = useRef(null)

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'MessageSquare' },
    { id: 'comprehension', name: 'Comprehension', icon: 'Brain' },
    { id: 'vocabulary', name: 'Vocabulary', icon: 'BookA' },
    { id: 'analysis', name: 'Analysis', icon: 'Search' },
    { id: 'general', name: 'General', icon: 'HelpCircle' }
  ]

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation])

  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('readmind_conversations')
      if (saved) {
        setConversations(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Failed to load conversation history')
    }
  }

  const saveConversations = (newConversations) => {
    try {
      localStorage.setItem('readmind_conversations', JSON.stringify(newConversations))
      setConversations(newConversations)
    } catch (error) {
      console.error('Error saving conversations:', error)
      toast.error('Failed to save conversation')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const categorizeQuestion = (questionText) => {
    const text = questionText.toLowerCase()
    if (text.includes('what') || text.includes('explain') || text.includes('how') || text.includes('why')) {
      return 'comprehension'
    }
    if (text.includes('meaning') || text.includes('define') || text.includes('definition')) {
      return 'vocabulary'
    }
    if (text.includes('analyze') || text.includes('compare') || text.includes('evaluate')) {
      return 'analysis'
    }
    return 'general'
  }

  const generateAIResponse = async (userQuestion, conversationHistory = []) => {
    // Simulate AI processing with realistic delays and responses
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))
    
    const responses = {
      comprehension: [
        "Based on the text, this concept relates to how information is processed and understood. The key idea is that comprehension involves multiple cognitive processes working together to create meaning from written content.",
        "This question touches on fundamental reading comprehension principles. The answer involves understanding both literal and inferential meaning, where readers must connect explicit information with their prior knowledge.",
        "To understand this fully, consider the relationship between the main idea and supporting details. The author presents evidence that builds toward a central argument about how we process information."
      ],
      vocabulary: [
        "This term originates from academic discourse and refers to a specific concept within the field. In this context, it means the systematic approach to understanding complex ideas through structured analysis.",
        "The word you're asking about has multiple layers of meaning. In its primary sense, it describes a process or method, while in broader usage, it represents a fundamental principle of learning.",
        "This vocabulary term is essential for understanding the text's deeper meaning. It combines elements of analysis, synthesis, and evaluation to describe a comprehensive approach to knowledge."
      ],
      analysis: [
        "When analyzing this passage, we can identify several key patterns. The author uses comparative reasoning to highlight differences between traditional and modern approaches, while also establishing connections between seemingly separate concepts.",
        "A critical analysis reveals that the argument follows a logical progression from premise to conclusion. The evidence presented supports the main thesis while acknowledging potential counterarguments.",
        "From an analytical perspective, this text demonstrates sophisticated reasoning. The author employs multiple rhetorical strategies to persuade readers while maintaining objectivity in presentation."
      ],
      general: [
        "That's an excellent question! This topic is quite complex and has multiple dimensions to consider. Let me break it down into key components that will help clarify the concept.",
        "Your question highlights an important aspect of the material. The answer involves understanding both the immediate context and the broader implications for the field of study.",
        "This is a thoughtful inquiry that gets to the heart of the matter. The response requires us to consider multiple perspectives and examine the evidence carefully."
      ]
    }

    const category = categorizeQuestion(userQuestion)
    const categoryResponses = responses[category] || responses.general
    const baseResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
    
    // Add follow-up suggestions
    const followUps = [
      "Would you like me to elaborate on any specific aspect?",
      "Do you have questions about related concepts?",
      "Would you like to explore this topic from a different angle?",
      "Are there particular examples you'd like me to discuss?"
    ]
    
    const followUp = followUps[Math.floor(Math.random() * followUps.length)]
    
    return `${baseResponse}\n\n${followUp}`
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.warning('Please enter a question')
      return
    }

    setIsLoading(true)
    
    try {
      const newMessage = {
        id: Date.now(),
        type: 'question',
        content: question.trim(),
        timestamp: new Date().toISOString(),
        category: categorizeQuestion(question)
      }

      let conversation
      if (currentConversation) {
        conversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage],
          updatedAt: new Date().toISOString()
        }
      } else {
        conversation = {
          id: Date.now(),
          title: question.trim().substring(0, 50) + (question.length > 50 ? '...' : ''),
          messages: [newMessage],
          category: categorizeQuestion(question),
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      // Generate AI response
      const aiResponseContent = await generateAIResponse(question, conversation.messages)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'answer',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        helpful: null
      }

      conversation.messages.push(aiMessage)
      conversation.updatedAt = new Date().toISOString()

      // Update conversations list
      const updatedConversations = currentConversation 
        ? conversations.map(c => c.id === conversation.id ? conversation : c)
        : [conversation, ...conversations]
      
      saveConversations(updatedConversations)
      setCurrentConversation(conversation)
      setQuestion('')
      
      toast.success('Question answered successfully!')
      
    } catch (error) {
      console.error('Error processing question:', error)
      toast.error('Failed to process question. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAskQuestion()
    }
  }

  const startNewConversation = () => {
    setCurrentConversation(null)
    setQuestion('')
    questionInputRef.current?.focus()
    toast.info('Started new conversation')
  }

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation)
    setQuestion('')
  }

  const deleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(c => c.id !== conversationId)
    saveConversations(updatedConversations)
    
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null)
    }
    
    toast.success('Conversation deleted')
  }

  const toggleFavorite = (conversationId) => {
    const updatedConversations = conversations.map(c => 
      c.id === conversationId ? { ...c, isFavorite: !c.isFavorite } : c
    )
    saveConversations(updatedConversations)
    
    if (currentConversation?.id === conversationId) {
      setCurrentConversation({ ...currentConversation, isFavorite: !currentConversation.isFavorite })
    }
  }

  const markHelpful = (messageId, helpful) => {
    if (currentConversation) {
      const updatedMessages = currentConversation.messages.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
      
      const updatedConversation = { ...currentConversation, messages: updatedMessages }
      const updatedConversations = conversations.map(c => 
        c.id === currentConversation.id ? updatedConversation : c
      )
      
      saveConversations(updatedConversations)
      setCurrentConversation(updatedConversation)
      
      toast.success(helpful ? 'Marked as helpful' : 'Feedback recorded')
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFavorite = !filterFavorites || conv.isFavorite
    const matchesCategory = selectedCategory === 'all' || conv.category === selectedCategory
    
    return matchesSearch && matchesFavorite && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">
                  Ask Questions / AI Q&A
                </h1>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  Get instant answers to your reading questions
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={startNewConversation}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-card transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Question</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Sidebar - Conversation History */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <div className="p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20">
              <div className="space-y-3">
                <div className="relative">
                  <ApperIcon name="Search" className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => setFilterFavorites(!filterFavorites)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                      filterFavorites 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApperIcon name="Heart" className="w-3 h-3" />
                    <span>Favorites</span>
                  </motion.button>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2 py-1 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-xs"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Conversations List */}
            <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20 overflow-hidden">
              <div className="p-4 border-b border-surface-200 dark:border-surface-600">
                <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                  Conversations ({filteredConversations.length})
                </h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto scrollbar-hide">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      className={`p-3 border-b border-surface-100 dark:border-surface-700 cursor-pointer transition-colors ${
                        currentConversation?.id === conv.id
                          ? 'bg-primary/10 border-primary/20'
                          : 'hover:bg-surface-50 dark:hover:bg-surface-700'
                      }`}
                      onClick={() => selectConversation(conv)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <ApperIcon 
                              name={categories.find(c => c.id === conv.category)?.icon || 'MessageSquare'} 
                              className="w-3 h-3 text-surface-400 flex-shrink-0" 
                            />
                            <h4 className="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">
                              {conv.title}
                            </h4>
                          </div>
                          <p className="text-xs text-surface-500 truncate">
                            {conv.messages[conv.messages.length - 1]?.content.substring(0, 50)}...
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-surface-400">
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              {conv.isFavorite && (
                                <ApperIcon name="Heart" className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-xs text-surface-400">
                                {conv.messages.filter(m => m.type === 'question').length}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1 ml-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(conv.id)
                            }}
                            className="p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon 
                              name={conv.isFavorite ? "Heart" : "HeartOff"} 
                              className={`w-3 h-3 ${conv.isFavorite ? 'text-red-500' : 'text-surface-400'}`} 
                            />
                          </motion.button>
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conv.id)
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-surface-500 dark:text-surface-400">
                    <ApperIcon name="MessageSquare" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No conversations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex-1 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-surface-700/20 flex flex-col">
              
              {/* Chat Header */}
              {currentConversation && (
                <div className="p-4 border-b border-surface-200 dark:border-surface-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                        {currentConversation.title}
                      </h3>
                      <p className="text-sm text-surface-500">
                        {currentConversation.messages.filter(m => m.type === 'question').length} questions • 
                        Started {new Date(currentConversation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <motion.button
                      onClick={() => toggleFavorite(currentConversation.id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon 
                        name={currentConversation.isFavorite ? "Heart" : "HeartOff"} 
                        className={`w-5 h-5 ${currentConversation.isFavorite ? 'text-red-500' : 'text-surface-400'}`} 
                      />
                    </motion.button>
                  </div>
                </div>
              )}
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {currentConversation ? (
                  <AnimatePresence>
                    {currentConversation.messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'question'
                            ? 'bg-gradient-to-r from-primary to-secondary text-white'
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
                        }`}>
                          <div className="flex items-start space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'question'
                                ? 'bg-white/20'
                                : 'bg-gradient-to-r from-primary to-secondary'
                            }`}>
                              <ApperIcon 
                                name={message.type === 'question' ? 'User' : 'Brain'} 
                                className={`w-4 h-4 ${
                                  message.type === 'question' ? 'text-white' : 'text-white'
                                }`} 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                              
                              <div className={`flex items-center justify-between mt-2 text-xs ${
                                message.type === 'question' ? 'text-white/70' : 'text-surface-500'
                              }`}>
                                <span>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                
                                {message.type === 'answer' && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs">Helpful?</span>
                                    <motion.button
                                      onClick={() => markHelpful(message.id, true)}
                                      className={`p-1 rounded transition-colors ${
                                        message.helpful === true
                                          ? 'bg-green-500 text-white'
                                          : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600'
                                      }`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <ApperIcon name="ThumbsUp" className="w-3 h-3" />
                                    </motion.button>
                                    
                                    <motion.button
                                      onClick={() => markHelpful(message.id, false)}
                                      className={`p-1 rounded transition-colors ${
                                        message.helpful === false
                                          ? 'bg-red-500 text-white'
                                          : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600'
                                      }`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <ApperIcon name="ThumbsDown" className="w-3 h-3" />
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] p-4 bg-surface-100 dark:bg-surface-700 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                              <ApperIcon name="Brain" className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <ApperIcon name="MessageSquarePlus" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-2">
                        Ask Your First Question
                      </h3>
                      <p className="text-surface-500 dark:text-surface-400 max-w-md">
                        Get instant, intelligent answers to your questions about reading materials, vocabulary, and comprehension.
                      </p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-surface-200 dark:border-surface-600">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={questionInputRef}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question about your reading..."
                      className="w-full px-4 py-3 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      rows={3}
                      disabled={isLoading}
                    />
                    
                    <div className="absolute bottom-2 right-2 text-xs text-surface-400">
                      {question.length}/500
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-card transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                    ) : (
                      <ApperIcon name="Send" className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-xs text-surface-500">
                  <p>Press Enter to send, Shift+Enter for new line</p>
                  <p>Powered by AI • Responses are generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskQuestions