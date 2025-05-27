import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import ApperIcon from '../components/ApperIcon'

const Library = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [isImporting, setIsImporting] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importMethod, setImportMethod] = useState('file')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [editingDocument, setEditingDocument] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Configure PDF.js worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`


  // Sample documents for demonstration
  const sampleDocuments = [
    {
      id: '1',
      title: 'The Future of Machine Learning',
      author: 'Dr. Alex Chen',
      category: 'Technology',
      type: 'PDF',
      dateAdded: new Date('2024-01-15'),
      wordCount: 3500,
      readingTime: 14,
      isRead: false,
      tags: ['AI', 'Machine Learning', 'Technology'],
      content: `Machine learning continues to evolve at an unprecedented pace, with new breakthroughs emerging regularly. This comprehensive analysis explores the current state of ML technology and its future trajectory.\n\nThe field has seen remarkable progress in areas such as natural language processing, computer vision, and reinforcement learning. These advances are driving innovation across industries and reshaping how we approach complex problems.\n\nLooking ahead, we can expect to see more sophisticated models that require less data, improved interpretability, and better integration with human decision-making processes. The democratization of ML tools will also make these technologies more accessible to a broader range of users.`,
      summary: 'An in-depth exploration of machine learning advancements and future trends in AI technology.'
    },
    {
      id: '2',
      title: 'Sustainable Energy Solutions',
      author: 'Environmental Research Institute',
      category: 'Science',
      type: 'Article',
      dateAdded: new Date('2024-01-12'),
      wordCount: 2800,
      readingTime: 11,
      isRead: true,
      tags: ['Environment', 'Energy', 'Sustainability'],
      content: `The transition to sustainable energy sources represents one of the most critical challenges of our time. This article examines various renewable energy technologies and their potential for widespread adoption.\n\nSolar and wind power have seen dramatic cost reductions and efficiency improvements over the past decade. These technologies are now competitive with traditional fossil fuels in many markets, driving accelerated adoption worldwide.\n\nEmerging technologies such as advanced battery storage, hydrogen fuel cells, and next-generation nuclear reactors promise to address current limitations and provide reliable, clean energy solutions for the future.`,
      summary: 'A comprehensive overview of renewable energy technologies and their role in addressing climate change.'
    }
  ]

  useEffect(() => {
    // Initialize with sample documents
    setDocuments(sampleDocuments)
    setFilteredDocuments(sampleDocuments)
  }, [])

  useEffect(() => {
    // Filter and sort documents
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = filterCategory === 'all' || doc.category.toLowerCase() === filterCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    })

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.dateAdded) - new Date(a.dateAdded)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return a.author.localeCompare(b.author)
        case 'unread':
          return a.isRead - b.isRead
        default:
          return 0
      }
    })

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, filterCategory, sortBy])

  const handleFileUpload = async (files) => {
    setIsImporting(true)
    
    try {
      for (const file of files) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Unsupported file type: ${file.name}`, {
            position: "top-right",
            autoClose: 3000,
          })
          continue
        }

        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        let content = ''
        let wordCount = 0
        
        if (file.type === 'text/plain') {
          content = await file.text()
          wordCount = content.split(/\s+/).length
        } else if (file.type === 'application/pdf') {
          // Process PDF file using react-pdf
          try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfText = await extractTextFromPDF(arrayBuffer)
            
            if (!pdfText || pdfText.trim().length === 0) {
              toast.error(`No readable text found in PDF: ${file.name}`, {
                position: "top-right",
                autoClose: 4000,
              })
              continue
            }
            
            content = pdfText
            wordCount = content.split(/\s+/).filter(word => word.length > 0).length
            
            toast.success(`Successfully extracted ${wordCount} words from PDF`, {
              position: "top-right",
              autoClose: 3000,
            })
          } catch (pdfError) {
            toast.error(`Failed to process PDF: ${file.name}. ${pdfError.message}`, {
              position: "top-right",
              autoClose: 4000,
            })
            continue
          }
        }


        
        const newDocument = {
          id: Date.now().toString() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: 'Unknown Author',
          category: 'Imported',
          type: file.type === 'application/pdf' ? 'PDF' : file.type === 'text/plain' ? 'Text' : 'Document',
          dateAdded: new Date(),
          wordCount,
          readingTime: Math.ceil(wordCount / 250),
          isRead: false,
          tags: ['Imported'],
          content,
          summary: `Imported document: ${file.name}`
        }
        
        setDocuments(prev => [newDocument, ...prev])
        
        toast.success(`Successfully imported: ${file.name}`, {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.error('Failed to import files. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsImporting(false)
      setShowImportModal(false)
    }
  }

  // PDF text extraction function
  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      let fullText = ''
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .filter(item => item.str && item.str.trim().length > 0)
            .map(item => item.str)
            .join(' ')
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n'
          }
        } catch (pageError) {
          console.warn(`Error processing page ${pageNum}:`, pageError)
          // Continue with other pages even if one fails
        }
      }
      
      return fullText.trim()
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`)
    }
  }


  const handleUrlImport = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL', {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsImporting(true)
    
    try {
      // Simulate article fetching and processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      // Simulate extracted article content
      const articleContent = `This is simulated article content extracted from the URL: ${urlInput}. In a real implementation, this would use web scraping or article extraction APIs to fetch and parse the actual content from the provided URL. The extracted content would include the article text, metadata, and other relevant information.`
      
      const wordCount = articleContent.split(/\s+/).length
      
      const newDocument = {
        id: Date.now().toString() + Math.random(),
        title: `Article from ${new URL(urlInput).hostname}`,
        author: 'Web Article',
        category: 'Article',
        type: 'Web Article',
        dateAdded: new Date(),
        wordCount,
        readingTime: Math.ceil(wordCount / 250),
        isRead: false,
        tags: ['Web', 'Article'],
        content: articleContent,
        summary: `Web article imported from ${urlInput}`,
        sourceUrl: urlInput
      }
      
      setDocuments(prev => [newDocument, ...prev])
      setUrlInput('')
      
      toast.success('Article imported successfully!', {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error('Failed to import article. Please check the URL and try again.', {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsImporting(false)
      setShowImportModal(false)
    }
  }

  const handleTextImport = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text content', {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsImporting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const wordCount = textInput.split(/\s+/).length
      
      const newDocument = {
        id: Date.now().toString() + Math.random(),
        title: `Text Note - ${new Date().toLocaleDateString()}`,
        author: 'User Input',
        category: 'Note',
        type: 'Text',
        dateAdded: new Date(),
        wordCount,
        readingTime: Math.ceil(wordCount / 250),
        isRead: false,
        tags: ['Note', 'Text'],
        content: textInput,
        summary: `Text note created on ${new Date().toLocaleDateString()}`
      }
      
      setDocuments(prev => [newDocument, ...prev])
      setTextInput('')
      
      toast.success('Text imported successfully!', {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error('Failed to import text. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsImporting(false)
      setShowImportModal(false)
    }
  }

  const handleDocumentClick = (document) => {
    // Navigate to text reader with the document
    navigate('/text-reader', { state: { document } })
  }

  const handleEditDocument = (document) => {
    setEditingDocument({
      ...document,
      originalTitle: document.title,
      originalAuthor: document.author,
      originalCategory: document.category,
      originalTags: document.tags.join(', ')
    })
  }

  const saveDocumentEdit = () => {
    if (!editingDocument.title.trim()) {
      toast.error('Title cannot be empty', {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    const updatedDocument = {
      ...editingDocument,
      tags: editingDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }
    
    setDocuments(prev => prev.map(doc => 
      doc.id === editingDocument.id ? updatedDocument : doc
    ))
    
    setEditingDocument(null)
    
    toast.success('Document updated successfully!', {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const deleteDocument = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    setShowDeleteConfirm(null)
    
    toast.success('Document deleted successfully!', {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const toggleReadStatus = (documentId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, isRead: !doc.isRead } : doc
    ))
    
    const document = documents.find(doc => doc.id === documentId)
    toast.info(`Marked as ${document?.isRead ? 'unread' : 'read'}`, {
      position: "top-right",
      autoClose: 1500,
    })
  }

  const categories = ['all', ...new Set(documents.map(doc => doc.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
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
                <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                  My Library
                </h1>
                <p className="text-surface-600 dark:text-surface-300">
                  Import and manage your reading collection
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowImportModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span className="font-medium">Import Content</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="unread">Unread First</option>
            </select>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDocuments.map((document) => (
              <motion.div
                key={document.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      document.type === 'PDF' ? 'bg-red-100 text-red-600' :
                      document.type === 'Article' || document.type === 'Web Article' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <ApperIcon 
                        name={document.type === 'PDF' ? 'FileText' : document.type.includes('Article') ? 'Globe' : 'FileText'} 
                        className="w-5 h-5" 
                      />
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        document.isRead 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {document.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={() => toggleReadStatus(document.id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ApperIcon 
                        name={document.isRead ? 'BookOpen' : 'Book'} 
                        className="w-4 h-4 text-surface-600 dark:text-surface-300" 
                      />
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditDocument(document)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ApperIcon name="Edit3" className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                    </motion.button>
                    <motion.button
                      onClick={() => setShowDeleteConfirm(document.id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
                
                <motion.div
                  className="cursor-pointer"
                  onClick={() => handleDocumentClick(document)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-2 line-clamp-2">
                    {document.title}
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-3">
                    by {document.author}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-3 mb-4">
                    {document.summary}
                  </p>
                </motion.div>
                
                <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 mb-3">
                  <span>{document.wordCount} words</span>
                  <span>{document.readingTime} min read</span>
                  <span>{document.dateAdded.toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs rounded-lg">
                      +{document.tags.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="BookOpen" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-300 mb-2">
              {searchQuery || filterCategory !== 'all' ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Import your first document to get started'
              }
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <motion.button
                onClick={() => setShowImportModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Import Content
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                  Import Content
                </h2>
                <motion.button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                </motion.button>
              </div>
              
              {/* Import Method Tabs */}
              <div className="flex space-x-1 mb-6 bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                <motion.button
                  onClick={() => setImportMethod('file')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    importMethod === 'file'
                      ? 'bg-white dark:bg-surface-600 text-surface-800 dark:text-surface-100 shadow'
                      : 'text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-surface-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload File
                </motion.button>
                <motion.button
                  onClick={() => setImportMethod('url')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    importMethod === 'url'
                      ? 'bg-white dark:bg-surface-600 text-surface-800 dark:text-surface-100 shadow'
                      : 'text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-surface-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  From URL
                </motion.button>
                <motion.button
                  onClick={() => setImportMethod('text')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    importMethod === 'text'
                      ? 'bg-white dark:bg-surface-600 text-surface-800 dark:text-surface-100 shadow'
                      : 'text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-surface-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Paste Text
                </motion.button>
              </div>
              
              {/* Import Content */}
              <AnimatePresence mode="wait">
                {importMethod === 'file' && (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.txt,.docx"
                      onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                      className="hidden"
                    />
                    
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
                    >
                      <ApperIcon name="Upload" className="w-8 h-8 text-surface-400 mx-auto mb-3" />
                      <p className="text-surface-600 dark:text-surface-300 mb-2">
                        Click to upload files
                      </p>
                      <p className="text-sm text-surface-500">
                        Supports PDF, TXT, and DOCX files
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {importMethod === 'url' && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Article URL
                      </label>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <motion.button
                      onClick={handleUrlImport}
                      disabled={isImporting || !urlInput.trim()}
                      className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      whileHover={{ scale: !isImporting ? 1.02 : 1 }}
                      whileTap={{ scale: !isImporting ? 0.98 : 1 }}
                    >
                      {isImporting ? (
                        <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                      ) : (
                        <ApperIcon name="Download" className="w-5 h-5" />
                      )}
                      <span>{isImporting ? 'Importing...' : 'Import Article'}</span>
                    </motion.button>
                  </motion.div>
                )}
                
                {importMethod === 'text' && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Text Content
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste your text content here..."
                        rows={6}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    
                    <motion.button
                      onClick={handleTextImport}
                      disabled={isImporting || !textInput.trim()}
                      className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      whileHover={{ scale: !isImporting ? 1.02 : 1 }}
                      whileTap={{ scale: !isImporting ? 0.98 : 1 }}
                    >
                      {isImporting ? (
                        <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                      ) : (
                        <ApperIcon name="Save" className="w-5 h-5" />
                      )}
                      <span>{isImporting ? 'Saving...' : 'Save Text'}</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                  Edit Document
                </h2>
                <motion.button
                  onClick={() => setEditingDocument(null)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingDocument.title}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editingDocument.author}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingDocument.category}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingDocument.tags}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => setEditingDocument(null)}
                    className="flex-1 py-3 px-4 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={saveDocumentEdit}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Trash2" className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-2">
                  Delete Document
                </h3>
                <p className="text-surface-600 dark:text-surface-300 mb-6">
                  Are you sure you want to delete this document? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 px-4 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => deleteDocument(showDeleteConfirm)}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Library