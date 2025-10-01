# 02. Realtime Patterns Rules

## 2.1 Database Change Patterns

### Rule 2.1.1: React to table changes in UI
```javascript
// React component example
const useInstrumentsRealtime = () => {
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    // Initial data fetch
    const fetchInstruments = async () => {
      const { data } = await supabase.from('instruments').select('*')
      setInstruments(data || [])
    }
    fetchInstruments()

    // Subscribe to changes
    const channel = supabase
      .channel('instruments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'instruments' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setInstruments(prev => [...prev, payload.new])
              break
            case 'UPDATE':
              setInstruments(prev => 
                prev.map(item => 
                  item.id === payload.new.id ? payload.new : item
                )
              )
              break
            case 'DELETE':
              setInstruments(prev => 
                prev.filter(item => item.id !== payload.old.id)
              )
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return instruments
}
```

### Rule 2.1.2: Optimistic updates with realtime sync
```javascript
const useOptimisticInstruments = () => {
  const [instruments, setInstruments] = useState([])
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Map())

  const addInstrument = async (newInstrument) => {
    const tempId = `temp-${Date.now()}`
    const optimisticItem = { ...newInstrument, id: tempId }
    
    // Optimistic update
    setOptimisticUpdates(prev => new Map(prev).set(tempId, optimisticItem))
    
    try {
      const { data, error } = await supabase
        .from('instruments')
        .insert(newInstrument)
        .select()
        .single()
      
      if (error) throw error
      
      // Remove optimistic update (realtime will handle actual update)
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev)
        newMap.delete(tempId)
        return newMap
      })
    } catch (error) {
      // Remove failed optimistic update
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev)
        newMap.delete(tempId)
        return newMap
      })
      throw error
    }
  }

  // Combine real data with optimistic updates
  const displayInstruments = useMemo(() => {
    return [...instruments, ...Array.from(optimisticUpdates.values())]
  }, [instruments, optimisticUpdates])

  return { instruments: displayInstruments, addInstrument }
}
```

## 2.2 Chat and Messaging Patterns

### Rule 2.2.1: Real-time chat implementation
```javascript
const useChatRoom = (roomId) => {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${roomId}`)
      // Listen for new messages
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload])
      })
      // Track user presence
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const currentUsers = Object.values(presenceState).flat()
        setUsers(currentUsers)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New users:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Users left:', leftPresences)
      })
      .subscribe()

    // Join the room
    channel.track({
      user_id: 'current-user-id',
      username: 'current-username',
      joined_at: new Date().toISOString()
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const sendMessage = async (message) => {
    const messagePayload = {
      id: `msg-${Date.now()}`,
      user_id: 'current-user-id',
      username: 'current-username',
      message,
      timestamp: new Date().toISOString()
    }

    // Broadcast message to room
    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: messagePayload
    })
  }

  return { messages, users, sendMessage }
}
```

### Rule 2.2.2: Typing indicators
```javascript
const useTypingIndicators = (channelId) => {
  const [typingUsers, setTypingUsers] = useState(new Set())

  useEffect(() => {
    const channel = supabase
      .channel(`typing-${channelId}`)
      .on('broadcast', { event: 'typing-start' }, ({ payload }) => {
        setTypingUsers(prev => new Set(prev).add(payload.user_id))
      })
      .on('broadcast', { event: 'typing-stop' }, ({ payload }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(payload.user_id)
          return newSet
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId])

  const startTyping = (userId) => {
    channel.send({
      type: 'broadcast',
      event: 'typing-start',
      payload: { user_id: userId }
    })
  }

  const stopTyping = (userId) => {
    channel.send({
      type: 'broadcast',
      event: 'typing-stop',
      payload: { user_id: userId }
    })
  }

  return { typingUsers: Array.from(typingUsers), startTyping, stopTyping }
}
```

## 2.3 Collaborative Features

### Rule 2.3.1: Real-time cursor sharing
```javascript
const useCursorSharing = (documentId) => {
  const [cursors, setCursors] = useState(new Map())

  useEffect(() => {
    const channel = supabase
      .channel(`cursors-${documentId}`)
      .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
        setCursors(prev => new Map(prev).set(payload.user_id, payload))
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach(presence => {
          setCursors(prev => {
            const newMap = new Map(prev)
            newMap.delete(presence.user_id)
            return newMap
          })
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])

  const updateCursor = (x, y, userId) => {
    channel.send({
      type: 'broadcast',
      event: 'cursor-move',
      payload: {
        user_id: userId,
        x,
        y,
        timestamp: Date.now()
      }
    })
  }

  return { cursors, updateCursor }
}
```

### Rule 2.3.2: Live document editing
```javascript
const useCollaborativeDocument = (documentId) => {
  const [document, setDocument] = useState({ content: '', version: 0 })
  const [collaborators, setCollaborators] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel(`document-${documentId}`)
      // Document changes
      .on('broadcast', { event: 'document-change' }, ({ payload }) => {
        if (payload.version > document.version) {
          setDocument(payload.document)
        }
      })
      // User presence
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        setCollaborators(Object.values(presenceState).flat())
      })
      .subscribe()

    // Join as collaborator
    channel.track({
      user_id: 'current-user-id',
      username: 'current-username',
      color: '#random-color'
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])

  const updateDocument = async (newContent) => {
    const updatedDocument = {
      content: newContent,
      version: document.version + 1,
      updated_by: 'current-user-id',
      updated_at: new Date().toISOString()
    }

    // Broadcast change
    await channel.send({
      type: 'broadcast',
      event: 'document-change',
      payload: { document: updatedDocument }
    })

    // Persist to database
    await supabase
      .from('documents')
      .update(updatedDocument)
      .eq('id', documentId)
  }

  return { document, collaborators, updateDocument }
}
```

## 2.4 Live Data Visualization

### Rule 2.4.1: Real-time dashboard updates
```javascript
const useLiveDashboard = () => {
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-metrics')
      .on('broadcast', { event: 'metric-update' }, ({ payload }) => {
        setMetrics(prev => ({
          ...prev,
          [payload.metric_name]: payload.value
        }))
      })
      .subscribe()

    // Also subscribe to database changes for data integrity
    const dbChannel = supabase
      .channel('metrics-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'metrics' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setMetrics(prev => ({
              ...prev,
              [payload.new.name]: payload.new.value
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(dbChannel)
    }
  }, [])

  return metrics
}
```

## 2.5 Gaming and Interactive Features

### Rule 2.5.1: Multiplayer game state
```javascript
const useGameRoom = (gameId) => {
  const [gameState, setGameState] = useState(null)
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel(`game-${gameId}`)
      // Game state updates
      .on('broadcast', { event: 'game-update' }, ({ payload }) => {
        setGameState(payload.gameState)
      })
      // Player actions
      .on('broadcast', { event: 'player-action' }, ({ payload }) => {
        console.log('Player action:', payload)
      })
      // Player presence
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        setPlayers(Object.values(presenceState).flat())
      })
      .subscribe()

    // Join game
    channel.track({
      player_id: 'current-player-id',
      username: 'player-name',
      joined_at: Date.now()
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId])

  const sendPlayerAction = (action) => {
    channel.send({
      type: 'broadcast',
      event: 'player-action',
      payload: {
        player_id: 'current-player-id',
        action,
        timestamp: Date.now()
      }
    })
  }

  return { gameState, players, sendPlayerAction }
}
```