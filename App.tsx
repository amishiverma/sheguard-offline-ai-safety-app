import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { Card } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Shield, 
  Camera, 
  Mic,
  User,
  Home,
  Settings,
  Plus,
  Square,
  Bell,
  Lock,
  Trash2,
  Edit,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'contacts', 'settings'
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Mom', phone: '555-0101' },
    { id: 2, name: 'Dad', phone: '555-0102' },
    { id: 3, name: 'Sister Emma', phone: '555-0103' },
    { id: 4, name: 'Best Friend Sarah', phone: '555-0104' }
  ]);

  // === START: NEW GEMMA-RELATED STATE AND FUNCTIONS ===
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [gemmaResponse, setGemmaResponse] = useState('');
  const [gemmaStatus, setGemmaStatus] = useState('safe'); // 'safe', 'threat', 'attention'
  const [isLoadingGemma, setIsLoadingGemma] = useState(false);

  // This function is a placeholder for your actual voice recognition
  const startVoiceRecognition = () => {
    console.log("Starting voice recognition...");
    setIsRecording(true);
    setTranscribedText("Listening...");

    // --- REPLACE THIS WITH YOUR ACTUAL VOICE RECOGNITION LOGIC ---
    // For now, we simulate a 3-second recording
    setTimeout(() => {
      const mockTranscription = "I am being followed and I am scared, please help me.";
      setTranscribedText(mockTranscription);
      setIsRecording(false);
      callGemmaAPI(mockTranscription);
    }, 3000);
    // -------------------------------------------------------------
  };

  // This function is a placeholder for your actual Ollama/Gemma API call
  const callGemmaAPI = async (prompt) => {
    console.log("Sending prompt to Gemma:", prompt);
    setIsLoadingGemma(true);
    setGemmaResponse("Analyzing your message...");

    try {
      // --- REPLACE THIS WITH YOUR ACTUAL API FETCH CALL ---
      // Example: const response = await fetch('YOUR_OLLAMA_API_ENDPOINT', { ... });
      // For now, we simulate an API call
      const response = await new Promise(resolve => setTimeout(() => {
        const mockResponse = {
          // A simple way to simulate a 'threat'
          status: prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('scared') ? 'threat' : 'safe',
          message: "Based on your message, I have classified this situation as a potential threat. Activating emergency protocol.",
        };
        resolve(mockResponse);
      }, 2000));

      setGemmaResponse(response.message);
      setGemmaStatus(response.status);

      if (response.status === 'threat') {
        handleSOSClick(); // Call your existing SOS function
      }

    } catch (error) {
      console.error('Gemma API Error:', error);
      setGemmaResponse('Error: Could not connect to Gemma AI.');
      setGemmaStatus('error');
    } finally {
      setIsLoadingGemma(false);
    }
  };
  // === END: NEW GEMMA-RELATED STATE AND FUNCTIONS ===

  // Audio context and oscillator refs (from your original code)
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Create siren sound using Web Audio API (from your original code)
  const startSiren = () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;
      oscillatorRef.current = audioContext.createOscillator();
      gainNodeRef.current = audioContext.createGain();
      const oscillator = oscillatorRef.current;
      const gainNode = gainNodeRef.current;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      const now = audioContext.currentTime;
      for (let i = 0; i < 100; i++) {
        const time = now + i * 0.5;
        const freq = i % 2 === 0 ? 800 : 1200;
        oscillator.frequency.setValueAtTime(freq, time);
      }
      oscillator.start(now);
    } catch (error) {
      console.error('Error starting siren sound:', error);
    }
  };

  const stopSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping siren sound:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSirenActive) {
      interval = setInterval(() => {
        document.body.style.backgroundColor = document.body.style.backgroundColor === 'red' ? '' : 'red';
      }, 500);
    } else {
      document.body.style.backgroundColor = '';
    }
    
    return () => {
      if (interval) clearInterval(interval);
      document.body.style.backgroundColor = '';
    };
  }, [isSirenActive]);

  useEffect(() => {
    if (isSirenActive) {
      startSiren();
    } else {
      stopSiren();
    }

    return () => {
      stopSiren();
    };
  }, [isSirenActive]);

  const handleSOSClick = () => {
    if (isSirenActive) {
      setIsSirenActive(false);
    } else {
      setIsSirenActive(true);
      console.log('🚨 EMERGENCY ALERT ACTIVATED 🚨');
      console.log('📍 Location shared with emergency contacts');
      console.log('📞 Calling emergency services...');
      console.log('🔊 Siren sound activated');
    }
  };

  const addContact = () => {
    if (contactName && phoneNumber) {
      setEmergencyContacts([
        ...emergencyContacts,
        { 
          id: Date.now(), 
          name: contactName, 
          phone: phoneNumber 
        }
      ]);
      setContactName('');
      setPhoneNumber('');
    }
  };

  const deleteContact = (id: number) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const quickActions = [
    { icon: MapPin, label: 'Location', color: isDarkMode ? 'text-blue-400' : 'text-blue-600' },
    { icon: Phone, label: 'Contact', color: isDarkMode ? 'text-green-400' : 'text-green-600' },
    { icon: Shield, label: 'Guard Mode', color: isDarkMode ? 'text-orange-400' : 'text-orange-600' },
    { icon: Camera, label: 'Open Camera', color: isDarkMode ? 'text-purple-400' : 'text-purple-600' }
  ];

  const renderHeader = () => (
    <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        {currentView !== 'home' && (
          <button 
            onClick={() => setCurrentView('home')}
            className={`p-1 rounded-full hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-foreground' : 'text-gray-600'}`} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <Switch 
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            className="ml-2"
          />
        </div>
      </div>
      <div className="text-center flex-1">
        <h1 className={`text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent`}>
          SheGuard
        </h1>
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
        }`}>
          {currentView === 'home' ? 'Stay safe. Stay protected.' :
           currentView === 'contacts' ? 'Emergency Contacts' : 'Settings'}
        </p>
      </div>
      <div className="w-16"></div>
    </div>
  );

  const renderHomeView = () => (
    <div className="p-6 space-y-8">
      {/* SOS Button */}
      <div className="flex flex-col items-center space-y-4">
        <button 
          onClick={handleSOSClick}
          className={`w-40 h-40 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 ${
            isSirenActive 
              ? 'bg-red-700 animate-pulse shadow-red-500/50' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isSirenActive ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <span className="text-white text-2xl font-bold">SOS</span>
          )}
        </button>
        
        {isSirenActive && (
          <div className="text-center">
            <p className="text-red-500 font-semibold animate-pulse">🚨 EMERGENCY ACTIVE 🚨</p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Tap to stop siren
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
              🔊 Siren sound playing
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button 
            key={index}
            className={`flex flex-col items-center p-3 rounded-lg hover:bg-opacity-80 transition-colors duration-200 ${
              isDarkMode ? 'bg-muted hover:bg-accent' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
            <span className={`text-xs text-center transition-colors duration-300 ${
              isDarkMode ? 'text-foreground' : 'text-gray-700'
            }`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Gemma AI Assistant */}
      <Card className={`p-6 border transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-800/30' 
          : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
      }`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-foreground' : 'text-gray-900'
            }`}>
              Gemma 3 AI Assistant
            </h3>
          </div>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
          }`}>
            Next-gen AI for advanced threat analysis and protection.
          </p>
          <Button
            onClick={isRecording ? () => {} : startVoiceRecognition}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${
              isRecording ? 'bg-gray-500' : (isDarkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700')
            } text-white`}
            disabled={isLoadingGemma}
          >
            {isLoadingGemma ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : isRecording ? (
              <>
                <Mic className="w-4 h-4 mr-2 animate-pulse" />
                Listening...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Talk to Gemma 3
              </>
            )}
          </Button>

          {transcribedText && (
            <div className={`mt-4 p-4 rounded-lg text-left transition-colors duration-300 ${
              isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
            }`}>
              <p className={`font-semibold ${isDarkMode ? 'text-primary' : 'text-purple-600'}`}>You said:</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-foreground' : 'text-gray-700'}`}>{transcribedText}</p>
            </div>
          )}

          {gemmaResponse && (
            <div className={`mt-4 p-4 rounded-lg text-left transition-colors duration-300 ${
              gemmaStatus === 'threat' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
            }`}>
              <p className={`font-semibold ${gemmaStatus === 'threat' ? 'text-red-700' : 'text-green-700'}`}>
                Gemma's Response ({gemmaStatus}):
              </p>
              <p className={`text-sm mt-1 ${gemmaStatus === 'threat' ? 'text-red-600' : 'text-green-800'}`}>
                {gemmaResponse}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderContactsView = () => (
    <div className="p-6 space-y-6">
      {/* Add Contact Form */}
      <Card className={`p-4 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
        <h3 className={`mb-4 font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
          Add Emergency Contact
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
            type="tel"
          />
          <Button 
            onClick={addContact}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </Card>

      {/* Contact List */}
      <div className="space-y-3">
        <h3 className={`font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
          Emergency Contacts ({emergencyContacts.length})
        </h3>
        
        {emergencyContacts.map((contact) => (
          <Card key={contact.id} className={`p-4 ${isDarkMode ? 'bg-card hover:bg-accent' : 'bg-white hover:bg-gray-50'} transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-primary/20' : 'bg-blue-100'
                }`}>
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-primary' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                    {contact.name}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                    {contact.phone}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="p-6 space-y-6">
      {/* App Settings */}
      <Card className={`p-4 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
        <h3 className={`mb-4 font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
          App Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-foreground' : 'text-gray-600'}`} />
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                  Emergency Notifications
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Auto-alert emergency contacts
                </p>
              </div>
            </div>
            <Switch checked={true} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className={`w-5 h-5 ${isDarkMode ? 'text-foreground' : 'text-gray-600'}`} />
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                  PIN Protection
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Secure app with PIN
                </p>
              </div>
            </div>
            <Switch checked={false} />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className={`p-4 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
        <h3 className={`mb-4 font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
          Privacy & Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                Location Sharing
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                Share location during emergencies
              </p>
            </div>
            <Switch checked={true} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                Auto Recording
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                Auto record during SOS activation
              </p>
            </div>
            <Switch checked={true} />
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className={`p-4 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
        <h3 className={`mb-4 font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
          About SheGuard
        </h3>
        <div className="space-y-2">
          <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
            Version 3.0.1
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
            Powered by Gemma 3 AI
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
            Advanced personal safety technology
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-background' : 'bg-gray-50'}`}>
      <div className={`max-w-sm mx-auto min-h-screen shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-card' : 'bg-white'
      }`}>
        {renderHeader()}

        {/* Main Content */}
        <div className="min-h-[calc(100vh-140px)] pb-20">
          {currentView === 'home' && renderHomeView()}
          {currentView === 'contacts' && renderContactsView()}
          {currentView === 'settings' && renderSettingsView()}
        </div>

        {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm border-t transition-colors duration-300 ${
          isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-around py-3">
            <button 
              onClick={() => setCurrentView('contacts')}
              className={`flex flex-col items-center p-2 transition-colors ${
                currentView === 'contacts' 
                  ? (isDarkMode ? 'text-primary' : 'text-purple-600')
                  : (isDarkMode ? 'text-muted-foreground' : 'text-gray-600')
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center p-2 transition-colors ${
                currentView === 'home' 
                  ? (isDarkMode ? 'text-primary' : 'text-purple-600')
                  : (isDarkMode ? 'text-muted-foreground' : 'text-gray-600')
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center p-2 transition-colors ${
                currentView === 'settings' 
                  ? (isDarkMode ? 'text-primary' : 'text-purple-600')
                  : (isDarkMode ? 'text-muted-foreground' : 'text-gray-600')
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm pointer-events-none">
          <p className={`text-xs text-center pb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-muted-foreground' : 'text-gray-400'
          }`}>
            Powered by Gemma 3 AI Technology
          </p>
        </div>
      </div>
    </div>
  );
}
