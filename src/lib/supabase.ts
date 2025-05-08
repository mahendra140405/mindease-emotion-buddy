
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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

// OpenAI integration
export const generateAIResponse = async (message: string) => {
  try {
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
