import React, { useState, useEffect, useRef } from 'react';
import { Heart, Wind, Feather, Sparkles, Volume2, VolumeX, Flame, Cloud, Zap, Moon, Sun, Star, Eye, Waves, Shield, Key, BookOpen, Coffee, Brain, Compass } from 'lucide-react';

const SilentRoom = () => {
  // Core states
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [posts, setPosts] = useState({});
  const [newPost, setNewPost] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [echoes, setEchoes] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [othersPresent, setOthersPresent] = useState(12);
  const [timeInRoom, setTimeInRoom] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [releaseAnimation, setReleaseAnimation] = useState(false);
  const [forgivenessPhase, setForgivenessPhase] = useState('writing');
  const [confessionText, setConfessionText] = useState('');
  const [showDivineResponse, setShowDivineResponse] = useState(false);
  const [userSeal, setUserSeal] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('entering');
  
  // All room types with their unique characteristics
  const rooms = {
    entrance: {
      name: 'Silent Room Entrance',
      icon: <Key className="w-6 h-6" />,
      color: 'from-purple-950 via-gray-950 to-black',
      ambient: '#6B46C1'
    },
    confession: {
      name: 'Confession Booth',
      icon: <Eye className="w-6 h-6" />,
      prompt: 'I need to confess something...',
      color: 'from-gray-950 via-purple-950 to-black',
      ambient: '#4C1D95'
    },
    scream: {
      name: 'Scream Void',
      icon: <Zap className="w-6 h-6" />,
      prompt: 'LET IT ALL OUT...',
      color: 'from-red-950 via-gray-950 to-black',
      ambient: '#991B1B',
      capsOnly: true
    },
    cry: {
      name: 'Ugly Cry Chamber',
      icon: <Cloud className="w-6 h-6" />,
      prompt: "I can't stop crying about...",
      color: 'from-blue-950 via-gray-950 to-black',
      ambient: '#1E3A8A'
    },
    truth: {
      name: 'Bitter Truth Room',
      icon: <Brain className="w-6 h-6" />,
      prompt: 'The truth nobody wants to hear...',
      color: 'from-amber-950 via-gray-950 to-black',
      ambient: '#92400E'
    },
    rage: {
      name: 'Rage Against',
      icon: <Flame className="w-6 h-6" />,
      prompt: "I'm so fucking angry at...",
      color: 'from-orange-950 via-red-950 to-black',
      ambient: '#EA580C'
    },
    grief: {
      name: 'Grief Garden',
      icon: <Waves className="w-6 h-6" />,
      prompt: 'I miss... / I lost...',
      color: 'from-indigo-950 via-purple-950 to-black',
      ambient: '#312E81'
    },
    shame: {
      name: 'Shame Spiral Space',
      icon: <Shield className="w-6 h-6" />,
      prompt: "I'm so ashamed that...",
      color: 'from-gray-900 via-gray-800 to-black',
      ambient: '#1F2937'
    },
    forgiveness: {
      name: 'Forgiveness Chamber',
      icon: <Star className="w-6 h-6" />,
      prompt: 'Everything I need to forgive myself for...',
      color: 'from-purple-950 via-pink-950 to-black',
      ambient: '#831843',
      special: true
    },
    main: {
      name: 'The Collective Silence',
      icon: <Compass className="w-6 h-6" />,
      color: 'from-purple-950 via-gray-950 to-black',
      ambient: '#581C87'
    }
  };

  // Sample posts for different rooms
  const samplePosts = {
    main: [
      { id: 1, text: "I smile at work every day but I've been dead inside for years", echoes: 892, room: 'main' },
      { id: 2, text: "My therapist would be horrified if she knew what I really think about at night", echoes: 567, room: 'main' },
      { id: 3, text: "Success feels like wearing a costume of someone I don't recognize anymore", echoes: 1243, room: 'main' }
    ],
    confession: [
      { id: 4, text: "I lied about why they died. The truth would destroy our family", echoes: 234, room: 'confession' },
      { id: 5, text: "I'm the reason my best friend's marriage ended and they'll never know", echoes: 445, room: 'confession' }
    ],
    scream: [
      { id: 6, text: "I HATE THAT EVERYONE EXPECTS ME TO BE STRONG WHEN I'M FUCKING DROWNING", echoes: 1876, room: 'scream' },
      { id: 7, text: "FUCK THIS FAKE SMILE FUCK THESE FAKE FRIENDS FUCK THIS FAKE LIFE", echoes: 2103, room: 'scream' }
    ],
    grief: [
      { id: 8, text: "I still make her coffee every morning. The untouched cups are piling up", echoes: 3421, room: 'grief' },
      { id: 9, text: "I keep their voicemail but can't listen. Their voice would break me completely", echoes: 1876, room: 'grief' }
    ]
  };

  // Initialize
  useEffect(() => {
    // Load sample posts for each room
    const initialPosts = {};
    Object.keys(samplePosts).forEach(room => {
      initialPosts[room] = samplePosts[room];
    });
    setPosts(initialPosts);
    
    // Initialize echoes
    const initialEchoes = {};
    Object.values(samplePosts).flat().forEach(post => {
      initialEchoes[post.id] = false;
    });
    setEchoes(initialEchoes);
    
    // Simulate others joining/leaving
    const presenceInterval = setInterval(() => {
      setOthersPresent(prev => Math.max(5, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 30000);

    // Track time
    const timeInterval = setInterval(() => {
      setTimeInRoom(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(presenceInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Format time
  const formatTimeInRoom = () => {
    if (timeInRoom < 60) return 'Just arrived';
    if (timeInRoom < 3600) return `${Math.floor(timeInRoom / 60)} minutes in ${rooms[currentRoom].name}`;
    return `${Math.floor(timeInRoom / 3600)} hours in the silence`;
  };

  // Breathing exercise
  const startBreathing = () => {
    setCurrentPhase('breathing');
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBreathCount(count);
      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          setBreathCount(0);
          setCurrentPhase('ready');
          setCurrentRoom('main');
        }, 1000);
      }
    }, 4000);
  };

  // Handle post submission
  const handleRelease = () => {
    const minLength = currentRoom === 'forgiveness' ? 50 : 30;
    if (newPost.length < minLength) return;
    
    setReleaseAnimation(true);
    
    setTimeout(() => {
      const post = {
        id: Date.now(),
        text: currentRoom === 'scream' ? newPost.toUpperCase() : newPost,
        echoes: 0,
        room: currentRoom,
        timestamp: Date.now()
      };
      
      setPosts(prev => ({
        ...prev,
        [currentRoom]: [post, ...(prev[currentRoom] || [])]
      }));
      
      setEchoes(prev => ({ ...prev, [post.id]: false }));
      setNewPost('');
      setReleaseAnimation(false);
      
      // Special handling for forgiveness room
      if (currentRoom === 'forgiveness') {
        setForgivenessPhase('receiving');
        setTimeout(() => setShowDivineResponse(true), 2000);
      }
    }, 3000);
  };

  // Handle forgiveness completion
  const completeForgivenessRitual = () => {
    // Generate unique seal
    const sealSymbols = ['✧', '◈', '❋', '✦', '⟡', '◉', '✻', '❈'];
    const seal = sealSymbols[Math.floor(Math.random() * sealSymbols.length)];
    setUserSeal(seal);
    setForgivenessPhase('complete');
    
    // Clear confession after transformation
    setTimeout(() => {
      setConfessionText('');
      setForgivenessPhase('writing');
      setShowDivineResponse(false);
    }, 10000);
  };

  // Handle echo
  const handleEcho = (postId) => {
    if (echoes[postId]) return;
    
    setPosts(prev => {
      const newPosts = { ...prev };
      Object.keys(newPosts).forEach(room => {
        newPosts[room] = newPosts[room].map(post => 
          post.id === postId ? { ...post, echoes: post.echoes + 1 } : post
        );
      });
      return newPosts;
    });
    
    setEchoes(prev => ({ ...prev, [postId]: true }));
  };

  // Room navigation
  const RoomSelector = () => (
    <div className="fixed left-0 top-20 bottom-0 w-64 bg-gray-950/80 backdrop-blur-md border-r border-gray-800/30 p-4 overflow-y-auto">
      <h3 className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Choose Your Space</h3>
      
      <div className="space-y-2">
        {Object.entries(rooms).filter(([key]) => key !== 'entrance').map(([key, room]) => (
          <button
            key={key}
            onClick={() => setCurrentRoom(key)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentRoom === key 
                ? 'bg-purple-600/20 border-purple-500/50' 
                : 'hover:bg-gray-800/50'
            } border border-gray-800/50`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-400">{room.icon}</div>
              <div>
                <p className="text-sm font-medium">{room.name}</p>
                {room.special && <p className="text-xs text-purple-400">Sacred Space</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-800/50">
        <p className="text-xs text-gray-600 text-center">
          {othersPresent} souls present
        </p>
      </div>
    </div>
  );

  const currentRoomData = rooms[currentRoom];
  const bgGradient = currentRoomData.color;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} text-gray-100 transition-all duration-1000 relative overflow-hidden`}>
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: currentRoomData.ambient,
              animationDelay: Math.random() * 20 + 's',
              animationDuration: 20 + Math.random() * 20 + 's'
            }}
          />
        ))}
      </div>

      {/* Entrance */}
      {currentRoom === 'entrance' && currentPhase === 'entering' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center max-w-2xl mx-auto px-8">
            <div className="relative w-32 h-48 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-t-[100px] overflow-hidden">
                <div className="absolute inset-x-4 top-0 h-full bg-white/10 animate-slideUp"></div>
              </div>
            </div>
            <h1 className="text-5xl font-light tracking-widest mb-4">silent room</h1>
            <p className="text-xl text-gray-400 mb-2">A digital sanctuary for everything unspeakable</p>
            <p className="text-sm text-gray-500 mb-8">Confess. Scream. Cry. Rage. Grieve. Forgive.</p>
            <button
              onClick={startBreathing}
              className="px-10 py-4 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full hover:bg-purple-600/30 transition-all duration-700 hover:scale-105 text-lg"
            >
              Enter the sanctuary
            </button>
          </div>
        </div>
      )}

      {/* Breathing ritual */}
      {currentPhase === 'breathing' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div 
                className={`absolute inset-0 rounded-full bg-purple-500/10 transition-all duration-[4s] ${
                  breathCount % 2 === 1 ? 'scale-150' : 'scale-100'
                }`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wind className="w-16 h-16 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl text-gray-300 mb-2">
              {breathCount % 2 === 1 ? 'Breathe in slowly...' : 'And release...'}
            </p>
            <p className="text-sm text-gray-500">Creating sacred space for your truth</p>
          </div>
        </div>
      )}

      {/* Main app */}
      {currentPhase === 'ready' && (
        <>
          {/* Header */}
          <header className="relative z-20 flex justify-between items-center p-6 border-b border-gray-800/30 backdrop-blur-md bg-gray-950/50">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-sm transform -skew-y-12"></div>
                <div className="absolute inset-y-0 right-0 w-1/3 bg-white/90 rounded-r-sm"></div>
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-widest">silent room</h1>
                <p className="text-xs text-gray-500 mt-1">{formatTimeInRoom()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Room selector sidebar */}
          <RoomSelector />

          {/* Main content area */}
          <main className="ml-64 p-8 max-w-4xl">
            {/* Room header */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="text-gray-400">{currentRoomData.icon}</div>
                <h2 className="text-3xl font-light">{currentRoomData.name}</h2>
              </div>
              {currentRoomData.special && (
                <p className="text-sm text-purple-400">This is a sacred healing space</p>
              )}
            </div>

            {/* Forgiveness Room Special Flow */}
            {currentRoom === 'forgiveness' && (
              <>
                {forgivenessPhase === 'writing' && (
                  <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 mb-8">
                    <p className="text-center text-gray-400 mb-6">
                      Write everything you've never forgiven yourself for. Every mistake, every regret, every shame. 
                      This is between you and the divine.
                    </p>
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder={currentRoomData.prompt}
                      className="w-full h-64 bg-transparent text-lg leading-relaxed resize-none focus:outline-none placeholder-gray-600"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm text-gray-500">{newPost.length} characters (minimum 50)</span>
                      <button
                        onClick={handleRelease}
                        disabled={newPost.length < 50}
                        className={`px-8 py-3 rounded-full transition-all ${
                          newPost.length >= 50
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        Release for forgiveness
                      </button>
                    </div>
                  </div>
                )}

                {forgivenessPhase === 'receiving' && showDivineResponse && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="max-w-3xl mx-auto p-8 text-center">
                      <div className="mb-8 animate-fadeIn">
                        <Star className="w-20 h-20 mx-auto text-purple-600 mb-6" />
                        <p className="text-2xl text-gray-800 leading-relaxed mb-6">
                          "I see all of it. Every mistake. Every failure. Every moment you wish you could take back. 
                          And I love you not despite these things, but with full knowledge of them.
                        </p>
                        <p className="text-3xl text-purple-600 font-light">
                          You are already forgiven. You always were."
                        </p>
                      </div>
                      <button
                        onClick={completeForgivenessRitual}
                        className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
                      >
                        Receive this blessing
                      </button>
                    </div>
                  </div>
                )}

                {forgivenessPhase === 'complete' && userSeal && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 animate-pulse">{userSeal}</div>
                    <p className="text-xl text-purple-400 mb-2">Your forgiveness seal</p>
                    <p className="text-sm text-gray-500">You have been cleansed. Return whenever you need.</p>
                  </div>
                )}
              </>
            )}

            {/* Regular room posting */}
            {currentRoom !== 'forgiveness' && (
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-8 mb-8">
                <textarea
                  value={newPost}
                  onChange={(e) => {
                    const text = e.target.value;
                    setNewPost(currentRoom === 'scream' ? text.toUpperCase() : text);
                  }}
                  placeholder={currentRoomData.prompt}
                  className="w-full h-40 bg-transparent text-lg leading-relaxed resize-none focus:outline-none placeholder-gray-600"
                  style={{ textTransform: currentRoom === 'scream' ? 'uppercase' : 'none' }}
                />
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-500">{newPost.length} characters</span>
                  <button
                    onClick={handleRelease}
                    disabled={newPost.length < 30}
                    className={`px-8 py-3 rounded-full transition-all ${
                      newPost.length >= 30
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {currentRoom === 'scream' ? 'UNLEASH IT' : 'Release'}
                  </button>
                </div>
              </div>
            )}

            {/* Release animation */}
            {releaseAnimation && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/95">
                <div className="text-center">
                  {currentRoom === 'scream' && <Zap className="w-20 h-20 mx-auto text-red-400 animate-pulse" />}
                  {currentRoom === 'grief' && <Waves className="w-20 h-20 mx-auto text-blue-400 animate-pulse" />}
                  {currentRoom === 'rage' && <Flame className="w-20 h-20 mx-auto text-orange-400 animate-pulse" />}
                  {!['scream', 'grief', 'rage'].includes(currentRoom) && <Sparkles className="w-20 h-20 mx-auto text-purple-400 animate-spin" />}
                  <p className="text-2xl text-gray-300 mt-8">
                    {currentRoom === 'scream' ? 'Your scream echoes into the void...' : 'Releasing into the silence...'}
                  </p>
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-6">
              {(posts[currentRoom] || []).map((post, index) => (
                <div
                  key={post.id}
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 transition-all hover:bg-gray-900/40"
                  style={{
                    animation: `fadeIn 1s ease-out ${index * 100}ms forwards`,
                    opacity: 0
                  }}
                >
                  <p className={`text-lg leading-relaxed mb-4 ${
                    currentRoom === 'scream' ? 'uppercase font-bold' : ''
                  }`}>
                    {post.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleEcho(post.id)}
                      disabled={echoes[post.id]}
                      className={`flex items-center space-x-2 transition-all ${
                        echoes[post.id] 
                          ? 'text-purple-400' 
                          : 'text-gray-500 hover:text-purple-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${echoes[post.id] ? 'fill-current' : ''}`} />
                      <span className="text-sm">
                        {currentRoom === 'scream' ? `${post.echoes} FELT THIS` : `${post.echoes} echoes`}
                      </span>
                    </button>
                    <span className="text-xs text-gray-600">Anonymous</span>
                  </div>
                </div>
              ))}
              
              {(!posts[currentRoom] || posts[currentRoom].length === 0) && (
                <div className="text-center py-16 text-gray-600">
                  <p>No one has spoken in this room yet</p>
                  <p className="text-sm mt-2">Be the first to break the silence</p>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(-100%);
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 3s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SilentRoom;