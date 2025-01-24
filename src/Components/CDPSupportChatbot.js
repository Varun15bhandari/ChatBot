import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Bot, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/styles.css';

const CDPSupportChatbot = () => {
  
  interface Message {
    id: number;
    type: 'user' | 'bot';
    content: string;
    status?: 'sending' | 'sent' | 'delivered' | 'error';
  }

  
  const styles = {
    container: "flex flex-col h-screen max-w-2xl mx-auto shadow-2xl rounded-xl overflow-hidden",
    header: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center gap-3 shadow-md",
    messageArea: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80 backdrop-blur-sm",
    inputContainer: "border-t bg-white/90 backdrop-blur-sm p-4 shadow-inner",
    userMessage: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none transition-all duration-300 hover:scale-[1.02]",
    botMessage: "bg-white border border-gray-200 rounded-bl-none shadow-sm transition-all duration-300 hover:shadow-md",
    input: "flex-1 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
    sendButton: "p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
  };

  
  const animationVariants = {
    container: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    message: {
      initial: { opacity: 0, scale: 0.9, x: -20 },
      animate: { opacity: 1, scale: 1, x: 0 },
      exit: { opacity: 0, scale: 0.8, x: 20 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    thinkingDots: {
      container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { 
          delayChildren: 0.2,
          staggerChildren: 0.1
        }
      },
      dot: {
        initial: { y: 0, scale: 0.8 },
        animate: { 
          y: [-10, 0, 10, 0],
          scale: [0.8, 1.2, 0.8]
        },
        transition: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut"
        }
      }
    }
  };

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const matchIntent = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    const cdps = {
      segment: lowercaseInput.includes('segment'),
      mparticle: lowercaseInput.includes('mparticle'),
      lytics: lowercaseInput.includes('lytics'),
      zeotap: lowercaseInput.includes('zeotap')
    };
    
    let bestMatch = {
      platform: null,
      topic: null,
      confidence: 0
    };
    
    Object.entries(cdpDocs).forEach(([platform, topics]) => {
      Object.entries(topics).forEach(([topic, data]) => {
        const matchCount = data.keywords.filter(keyword => 
          lowercaseInput.includes(keyword)
        ).length;
        
        if (matchCount > bestMatch.confidence || 
            (matchCount === bestMatch.confidence && cdps[platform])) {
          bestMatch = {
            platform,
            topic,
            confidence: matchCount
          };
        }
      });
    });
    
    return bestMatch.confidence > 0 ? cdpDocs[bestMatch.platform][bestMatch.topic].response : null;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your CDP Support Assistant. I can help you with questions about Segment, mParticle, Lytics, and Zeotap. What would you like to know?",
      status: 'delivered'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);


  const cdpDocs = {
    segment: {
      tracking: {
        keywords: ['track', 'event', 'analytics', 'tracking'],
        response: "To track events in Segment:\n1. Initialize the analytics object\n2. Use analytics.track('Event Name', properties)\n3. Verify in the Segment debugger"
      },
      identity: {
        keywords: ['identify', 'user', 'traits', 'customer'],
        response: "To identify users in Segment:\n1. Call analytics.identify(userId, traits)\n2. Include relevant user traits\n3. User profiles will be created automatically"
      }
    },
    mparticle: {
      setup: {
        keywords: ['setup', 'initialize', 'configuration'],
        response: "To set up mParticle:\n1. Get your API credentials\n2. Initialize the mParticle SDK\n3. Configure your data points"
      },
      audiences: {
        keywords: ['audience', 'segment', 'users'],
        response: "To create audiences in mParticle:\n1. Go to Audience Builder\n2. Define audience criteria\n3. Set update frequency"
      }
    },
    lytics: {
      collection: {
        keywords: ['collect', 'data', 'stream'],
        response: "To collect data in Lytics:\n1. Set up data streams\n2. Configure collection rules\n3. Validate incoming data"
      }
    },
    zeotap: {
      integration: {
        keywords: ['integrate', 'connect', 'source'],
        response: "To integrate data sources in Zeotap:\n1. Navigate to Sources\n2. Select your data source\n3. Configure connection settings"
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      status: 'sending'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    setTimeout(() => {
      const response = matchIntent(input) || 
        "I'm not sure about that specific question. Could you please rephrase or ask about a specific CDP feature?";
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsThinking(false);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div 
      initial={animationVariants.container.initial}
      animate={animationVariants.container.animate}
      transition={animationVariants.container.transition}
      className={`${styles.container} font-sans`}
    >
      <div className={styles.header}>
        <MessageCircle className="text-white" />
        <h1 className="text-xl font-semibold " >CDP Support Assistant</h1>
      </div>

      <div className={styles.messageArea}>
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={animationVariants.message.initial}
              animate={animationVariants.message.animate}
              exit={animationVariants.message.exit}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`p-2 rounded-lg relative ${
                  message.type === 'user' 
                    ? styles.userMessage
                    : styles.botMessage
                }`}>
                  {message.type === 'user' ? (
                    <User size={24} className="text-white" />
                  ) : (
                    <Bot size={24} className="text-blue-500" />
                  )}
                  {message.status === 'sent' && (
                    <Check 
                      size={16} 
                      className="absolute bottom-0 right-0 text-green-500" 
                    />
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-white border'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div 
            variants={animationVariants.thinkingDots.container}
            initial="initial"
            animate="animate"
            className="flex justify-start ml-4 mb-2"
          >
            <div className="bg-white/80 backdrop-blur-sm border rounded-full px-4 py-2">
              <div className="flex gap-2">
                {[1, 2, 3].map(dot => (
                  <motion.span 
                    key={dot}
                    variants={animationVariants.thinkingDots.dot}
                    className="w-3 h-3 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={styles.inputContainer}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about CDP platforms..."
            className={styles.input}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className={styles.sendButton}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CDPSupportChatbot;
