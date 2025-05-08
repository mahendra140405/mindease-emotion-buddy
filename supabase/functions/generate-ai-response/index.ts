
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(configuration);

// Mental health response generation function
const getMentalHealthResponse = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  
  // Check for anxiety
  if (lowercaseMsg.includes("anxious") || lowercaseMsg.includes("anxiety") || lowercaseMsg.includes("worry") || lowercaseMsg.includes("panic")) {
    return {
      text: "It sounds like you might be experiencing anxiety. Remember that anxiety is a normal emotion that everyone feels at times. Try taking some deep breaths - inhale for 4 counts, hold for 2, and exhale for 6. Would you like to try one of our guided breathing exercises?",
      emotion: "anxious",
    };
  }
  
  // Check for sadness/depression
  if (
    lowercaseMsg.includes("sad") || 
    lowercaseMsg.includes("depress") || 
    lowercaseMsg.includes("down") ||
    lowercaseMsg.includes("hopeless") ||
    lowercaseMsg.includes("empty")
  ) {
    return {
      text: "I'm sorry to hear you're feeling down. Depression and sadness are common experiences, but you don't have to face them alone. Have you spoken to someone you trust about how you're feeling? Sometimes sharing our feelings can help lighten the load. Remember that professional help is also available if needed.",
      emotion: "sad",
    };
  }
  
  // Remaining logic for different states
  // ... (fallback to AI for more complex responses)
  
  return null; // Will use OpenAI fallback
};

// Simple word-based sentiment analysis (fallback if OpenAI is unavailable)
const analyzeSentiment = (text: string): { sentiment: string; polarity: number } => {
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'love', 'like', 'enjoy', 'positive', 'joy', 'grateful', 'thankful', 'excited'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'negative', 'anxious', 'worry', 'depressed', 'angry', 'upset', 'frustrated'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  const polarity = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
  
  let sentiment;
  if (polarity > 0.5) sentiment = "Very Positive";
  else if (polarity > 0.1) sentiment = "Positive";
  else if (polarity >= -0.1 && polarity <= 0.1) sentiment = "Neutral";
  else if (polarity >= -0.5) sentiment = "Negative";
  else sentiment = "Very Negative";
  
  return { sentiment, polarity };
};

serve(async (req) => {
  try {
    // Get message from request
    const { message } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Try to generate a specific mental health response first
    const specificResponse = getMentalHealthResponse(message);
    
    if (specificResponse) {
      // If we have a specific response, return it
      return new Response(
        JSON.stringify(specificResponse),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Fallback to OpenAI for more complex queries
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: `You are a mental health support assistant. 
                     Provide empathetic, supportive responses without diagnosing. 
                     Keep responses concise (max 4 sentences). 
                     Always suggest seeking professional help for serious concerns.
                     Analyze the emotional state of the user message and include an 'emotion' tag.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const aiResponse = completion.data.choices[0].message?.content || "I'm sorry, I'm having trouble understanding. Could you rephrase that?";
      const emotionAnalysis = analyzeSentiment(message);
      
      // Determine emotion based on sentiment
      let emotion = "neutral";
      if (emotionAnalysis.sentiment.includes("Negative")) emotion = "sad";
      if (emotionAnalysis.sentiment.includes("Very Negative")) emotion = "anxious";
      
      return new Response(
        JSON.stringify({ text: aiResponse, emotion }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Fallback to basic response if OpenAI fails
      const { sentiment } = analyzeSentiment(message);
      let response = "I'm here to listen and support you. Would you like to talk more about how you're feeling?";
      let emotion = "neutral";
      
      return new Response(
        JSON.stringify({ text: response, emotion }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
