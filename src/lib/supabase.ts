import { createClient } from '@supabase/supabase-js';

// Try to get environment variables or use placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

// Check if using placeholders
const isUsingPlaceholders = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isUsingPlaceholders) {
  console.warn(
    'Using placeholder Supabase credentials. The app will function in demo mode with mocked data. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.'
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table types based on the MindMate schema
export type ChatMessage = {
  id?: string;
  user_id?: string;
  text: string;
  sender: 'user' | 'bot';
  emotion?: string;
  sentiment?: string;
  polarity?: number;
  created_at?: string;
};

export type MoodEntry = {
  id?: string;
  user_id?: string;
  message: string;
  sentiment: string;
  polarity: number;
  created_at?: string;
};

// Helper functions for chat operations
export const saveChatMessage = async (message: ChatMessage) => {
  if (isUsingPlaceholders) {
    console.log('Mock: Saving chat message', message);
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      { 
        ...message,
        created_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      }
    ]);
  
  if (error) {
    console.error('Error saving chat message:', error);
  }
  
  return { data, error };
};

export const getChatHistory = async () => {
  if (isUsingPlaceholders) {
    console.log('Mock: Getting chat history');
    return [
      { 
        id: '1', 
        text: 'Hello! How can I help you today?', 
        sender: 'bot', 
        emotion: 'friendly',
        created_at: new Date(Date.now() - 60000).toISOString() 
      },
      {
        id: '2',
        text: 'I\'m feeling a bit anxious today.',
        sender: 'user',
        emotion: 'anxious',
        created_at: new Date(Date.now() - 30000).toISOString()
      },
      {
        id: '3',
        text: 'I understand that feeling anxious can be difficult. Would you like to talk about what\'s causing your anxiety?',
        sender: 'bot',
        emotion: 'empathetic',
        created_at: new Date(Date.now() - 15000).toISOString()
      }
    ] as ChatMessage[];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
  
  return data;
};

// Helper functions for mood tracking
export const saveMoodEntry = async (entry: MoodEntry) => {
  if (isUsingPlaceholders) {
    console.log('Mock: Saving mood entry', entry);
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .insert([
      { 
        ...entry,
        created_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      }
    ]);
  
  if (error) {
    console.error('Error saving mood entry:', error);
  }
  
  return { data, error };
};

export const getMoodHistory = async () => {
  if (isUsingPlaceholders) {
    console.log('Mock: Getting mood history');
    return [
      {
        id: '1',
        message: 'Had a great day at work',
        sentiment: 'positive',
        polarity: 0.8,
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        message: 'Feeling a bit stressed about the upcoming deadline',
        sentiment: 'negative',
        polarity: -0.3,
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: '3',
        message: 'Finally got some exercise in today',
        sentiment: 'positive',
        polarity: 0.6,
        created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      }
    ] as MoodEntry[];
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error getting mood history:', error);
    return [];
  }
  
  return data;
};

// OpenAI integration for enhanced responses
export const generateAIResponse = async (message: string) => {
  if (isUsingPlaceholders) {
    console.log('Mock: Generating AI response for', message);
    
    // Enhanced mock responses based on message content
    const lowercaseMsg = message.toLowerCase();
    
    // Check for anxiety
    if (lowercaseMsg.includes("anxious") || lowercaseMsg.includes("anxiety") || lowercaseMsg.includes("worry") || lowercaseMsg.includes("panic")) {
      return {
        text: "I understand that anxiety can be overwhelming. Many people experience similar feelings. Try taking a few deep breaths - inhale for 4 counts, hold for 2, and exhale for 6. Would you like me to guide you through a quick breathing exercise?",
        emotion: "anxious",
      };
    }
    
    // Check for sadness/depression
    if (lowercaseMsg.includes("sad") || lowercaseMsg.includes("depress") || lowercaseMsg.includes("hopeless")) {
      return {
        text: "I'm sorry you're feeling this way. Depression and sadness can be difficult to cope with. Remember that your feelings are valid, and seeking support is a sign of strength. Would it help to talk more about what's been happening lately?",
        emotion: "sad",
      };
    }
    
    // Check for stress
    if (lowercaseMsg.includes("stress") || lowercaseMsg.includes("overwhelm") || lowercaseMsg.includes("too much")) {
      return {
        text: "Feeling overwhelmed is a common response to stress. Consider breaking down what's causing your stress into smaller, manageable parts. What's one small thing you could address today?",
        emotion: "stressed",
      };
    }
    
    // Sleep issues
    if (lowercaseMsg.includes("sleep") || lowercaseMsg.includes("tired") || lowercaseMsg.includes("insomnia")) {
      return {
        text: "Sleep problems can significantly impact mental wellbeing. Have you tried establishing a consistent bedtime routine? I can suggest some relaxation techniques that many find helpful before bed.",
        emotion: "tired",
      };
    }
    
    // Generic responses for other topics
    const responses = [
      {
        text: "Thank you for sharing that with me. How have you been coping with these feelings recently?",
        emotion: "empathetic"
      },
      {
        text: "I appreciate you opening up. Many people experience similar challenges. What support systems do you currently have in place?",
        emotion: "supportive"
      },
      {
        text: "That sounds difficult. Would it help to explore some strategies that others have found helpful in similar situations?",
        emotion: "helpful"
      },
      {
        text: "I'm here to listen without judgment. Would you like to tell me more about what's been on your mind?",
        emotion: "neutral"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // With real API connection:
  try {
    // For production, we would call our OpenAI-powered Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: { message }
    });
    
    if (error) {
      console.error('Error generating AI response:', error);
      return {
        text: "I'm having trouble connecting to my AI system. Please try again later.",
        emotion: "neutral"
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error calling OpenAI function:', error);
    return {
      text: "I'm having trouble connecting to my AI system. Please try again later.",
      emotion: "neutral"
    };
  }
};
