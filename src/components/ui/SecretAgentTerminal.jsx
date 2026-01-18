'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import React from 'react'
export default function SecretAgentTerminal({ onAccessGranted }) {
  const [history, setHistory] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [gameState, setGameState] = useState('intro') // intro, ls_shown, rm_progress, error_choice, bluepill_end, success
  const [progress, setProgress] = useState(0)
  const [accentColor, setAccentColor] = useState('red') // red or green
  const [helperText, setHelperText] = useState('You are a top secret agent. Break through the system to access top secret files. Use ls to see what the system is composed of, don\'t give the --help command. GGs agent! 👀')

  // ASCII art for CODESAPIENS
  const asciiArt = `
 ██████╗ ██████╗ ██████╗ ███████╗███████╗ █████╗ ██████╗ ██╗███████╗███╗   ██╗███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║██╔════╝████╗  ██║██╔════╝
██║     ██║   ██║██║  ██║█████╗  ███████╗███████║██████╔╝██║█████╗  ██╔██╗ ██║███████╗
██║     ██║   ██║██║  ██║██╔══╝  ╚════██║██╔══██║██╔═══╝ ██║██╔══╝  ██║╚██╗██║╚════██║
╚██████╗╚██████╔╝██████╔╝███████╗███████║██║  ██║██║     ██║███████╗██║ ╚████║███████║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝
  `

  const bottomRef = useRef(null)
  const terminalRef = useRef(null)
  const inputRef = useRef(null)
  const errorShownRef = useRef(false)
  const successShownRef = useRef(false)

  const accentColors = {
    red: {
      border: 'border-red-500',
      text: 'text-red-400',
      bg: 'bg-red-500',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      prompt: 'text-red-400',
      header: 'bg-red-900/30'
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-400',
      bg: 'bg-green-500',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      prompt: 'text-green-400',
      header: 'bg-green-900/30'
    }
  }

  const colors = accentColors[accentColor]

  // Simulate progress bar
  useEffect(() => {
    if (gameState === 'rm_progress') {
      errorShownRef.current = false // Reset flag when starting
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(interval)
            // Show error after reaching 30% - only once
            if (!errorShownRef.current) {
              errorShownRef.current = true
              setTimeout(() => {
                setHistory(prev => [...prev,
                  {
                    type: 'error',
                    content: 'Error: I am an intelligent AI terminal you enemy, muhahahahhaha'
                  },
                  {
                    type: 'choice',
                    content: 'Choose your fate:\n[1] Red pill (Shout: Try again)\n[2] Blue pill (Shout: You are the worst terminal I have ever seen)'
                  }
                ])
                setGameState('error_choice')
                setHelperText('Type: chmod redpill  OR  chmod bluepill')
              }, 500)
            }
            return 30
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }

    if (gameState === 'redpill_progress') {
      successShownRef.current = false // Reset flag when starting
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Success! - only once
            if (!successShownRef.current) {
              successShownRef.current = true
              setTimeout(() => {
                setAccentColor('green')
                setHistory(prev => [...prev,
                  {
                    type: 'success',
                    content: '✓ ACCESS GRANTED'
                  },
                  {
                    type: 'success',
                    content: 'You were persistent. You have opened the files and now you are worthy to join CodeSapiens too!'
                  }
                ])
                setGameState('success')
                setHelperText('Welcome, Agent. Redirecting to main system...')

                // Call the callback after 3 seconds
                setTimeout(() => {
                  if (onAccessGranted) onAccessGranted()
                }, 3000)
              }, 500)
            }
            return 100
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [gameState, onAccessGranted])

  const handleCommand = () => {
    const cmd = currentCommand.trim().toLowerCase()

    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      content: currentCommand
    }])

    // Easter egg commands - common Linux commands with quirky responses
    if (cmd === 'clear' || cmd === 'cls') {
      setHistory([])
      setCurrentCommand('')
      return
    }

    if (cmd === 'cd system32') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Yaan therinjukutu enna panna pora? '
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'cd top_secret') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Adhuku dhana da poraatamae! '
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'rm -rf top_secret' || cmd === 'rm top_secret') {
      setHistory(prev => [...prev, {
        type: 'error',
        content: 'Haan aprom, onna ketaen la enna sollanum! '
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'help' || cmd === '--help' || cmd === 'man') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Available commands are: ls, rm, cd, chmod, pwd, whoami, exit, cat, reboot \n Secret Agent Tip: Read the helper bubble at the bottom right! 👀'
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'sudo rm -rf system32' || cmd.startsWith('sudo ')) {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Edhae sudo-va? '
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'pwd') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: '/home/agent/classified/extremely_secret/no_entry/'
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'whoami') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'You are: TOP_SECRET_AGENT_007 (but cooler than James Bond 😎)'
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'exit' || cmd === 'quit') {
      setHistory(prev => [...prev, {
        type: 'error',
        content: 'Kelambae Kaathu varatum! '
      }])
      setCurrentCommand('')
      return
    }

    if (cmd.startsWith('cat ') || cmd.startsWith('vim ') || cmd.startsWith('nano ')) {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'File encrypted with military-grade encryption. Focus on the mission! 🔒'
      }])
      setCurrentCommand('')
      return
    }

    if (cmd === 'reboot' || cmd === 'shutdown') {
      setHistory(prev => [...prev, {
        type: 'error',
        content: 'Areyy yaar!'
      }])
      setCurrentCommand('')
      return
    }

    // Process based on game state
    if (gameState === 'intro' && cmd === 'ls') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'top_secret/    system32/'
      }])
      setGameState('ls_shown')
      setHelperText('Great! We have system32. Delete it using: rm -rf system32')
    } else if (gameState === 'ls_shown' && cmd === 'rm -rf system32') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Deleting system32...'
      }])
      setGameState('rm_progress')
      setProgress(0)
      setHelperText('Deleting system files...')
    } else if (gameState === 'error_choice' && cmd === 'chmod redpill') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Red pill selected. Resuming deletion...'
      }])
      setGameState('redpill_progress')
      setHelperText('Breaking through the firewall...')
    } else if (gameState === 'error_choice' && cmd === 'chmod bluepill') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'Yaa good luck shouting at the system, go sleep dear.'
      }])
      setGameState('bluepill_end')
      setHelperText('Mission failed. Refresh the page to try again.')
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Command not recognized: ${cmd}`
      }])

      // Give hints based on state
      if (gameState === 'intro') {
        setHelperText('Hint: Try typing "ls" to list files')
      } else if (gameState === 'ls_shown') {
        setHelperText('Hint: Use "rm -rf system32" to delete the system files')
      } else if (gameState === 'error_choice') {
        setHelperText('Hint: Type "chmod redpill" or "chmod bluepill"')
      }
    }

    setCurrentCommand('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus()
    }

    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick)
    }

    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [])

  // Disable input for certain game states
  const isInputDisabled = gameState === 'bluepill_end' || gameState === 'success' || gameState === 'rm_progress' || gameState === 'redpill_progress'

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-mono relative">
      {/* Pixelated Helper Chat Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-4 md:right-8 z-50"
      >
        <div className="relative">
          {/* Pixel-style speech bubble tail */}
          <div className="absolute -bottom-2 right-6 md:right-10 w-4 h-4 md:w-6 md:h-6 bg-white transform rotate-45"></div>

          {/* Main bubble */}
          <div className="bg-white text-black p-3 md:p-6 lg:p-7 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border-4 md:border-[5px] border-black max-w-xs md:max-w-lg lg:max-w-xl">
            <p className="font-pixel text-[9px] md:text-[12px] lg:text-[13px] leading-relaxed">
              {helperText}
            </p>
          </div>
        </div>
      </motion.div>

      <div className={`w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl border ${colors.border} ${colors.glow} transition-all duration-1000`}>
        {/* Terminal Header */}
        <div className={`flex items-center gap-2 p-3 ${colors.header} text-xs text-gray-400 border-b ${colors.border} transition-all duration-1000`}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <div className={`flex-1 text-center font-semibold ${colors.text} transition-all duration-1000`}>
            CLASSIFIED SYSTEM ACCESS | SECURITY LEVEL: TOP SECRET
          </div>
          <div className="text-xs">
            <span className={`${accentColor === 'red' ? 'text-red-400' : 'text-green-400'} transition-all duration-1000`}>●</span> {accentColor === 'red' ? 'HOSTILE' : 'AUTHORIZED'}
          </div>
        </div>

        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="h-[65vh] overflow-y-auto p-4 space-y-3 bg-black cursor-text"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${accentColor === 'red' ? '#ef4444' : '#22c55e'} #1f2937`
          }}
        >
          {/* ASCII Art Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${colors.text} font-bold text-xs md:text-sm mb-6 transition-all duration-1000 whitespace-pre font-mono leading-tight`}
          >
            {asciiArt}
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${colors.text} font-bold text-base mb-2 transition-all duration-1000`}
          >
            [SYSTEM INITIALIZED] - Security Terminal v1.0
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mb-6"
          >
            ssh'ed into classified system... Type your commands below to proceed. 
          </motion.div>

          {/* Command History */}
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              {entry.type === 'command' && (
                <div className="flex gap-2">
                  <span className={`${colors.prompt} font-semibold transition-all duration-1000`}>agent@classified:~$</span>
                  <span className="text-white">{entry.content}</span>
                </div>
              )}

              {entry.type === 'output' && (
                <div className="text-gray-300 pl-6 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </div>
              )}

              {entry.type === 'error' && (
                <div className="text-red-400 pl-6 leading-relaxed whitespace-pre-wrap font-bold animate-pulse">
                  {entry.content}
                </div>
              )}

              {entry.type === 'choice' && (
                <div className="text-yellow-400 pl-6 leading-relaxed whitespace-pre-wrap border-l-2 border-yellow-400 py-2">
                  {entry.content}
                </div>
              )}

              {entry.type === 'success' && (
                <div className="text-green-400 pl-6 leading-relaxed whitespace-pre-wrap font-bold text-lg">
                  {entry.content}
                </div>
              )}
            </motion.div>
          ))}

          {/* Progress Bar */}
          {(gameState === 'rm_progress' || gameState === 'redpill_progress') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pl-6 space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors.bg} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={`${colors.text} font-bold transition-all duration-1000`}>{progress}%</span>
              </div>
            </motion.div>
          )}

          {/* Current Command Input */}
          {!isInputDisabled && (
            <div className="flex gap-2 items-center">
              <span className={`${colors.prompt} font-semibold transition-all duration-1000`}>agent@classified:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={e => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white caret-white"
                autoFocus
                spellCheck="false"
                disabled={isInputDisabled}
              />
              <span className={`${colors.text} animate-pulse transition-all duration-1000`}>█</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer */}
        <div className={`${colors.header} px-4 py-3 text-xs border-t ${colors.border} transition-all duration-1000`}>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">SYSTEM v1.0.0</span>
            <span className="text-gray-500">Press ENTER to execute</span>
          </div>
        </div>
      </div>
    </div>
  )
}
