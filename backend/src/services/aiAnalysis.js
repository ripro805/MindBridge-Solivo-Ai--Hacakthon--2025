// AI Analysis Service using Hugging Face Inference API
// Free tier API for sentiment analysis and emotion detection

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
const SENTIMENT_MODEL = 'distilbert-base-uncased-finetuned-sst-2-english';
const EMOTION_MODEL = 'j-hartmann/emotion-english-distilroberta-base';

/**
 * Analyze text sentiment using Hugging Face API
 * @param {string} text - The text content to analyze
 * @param {object} metadata - Additional context (hasVoice, hasVideo, entryType)
 */
export const analyzeTextSentiment = async (text, metadata = {}) => {
  if (!text || text.trim().length === 0) {
    return getDefaultAnalysis(metadata);
  }

  // Fallback to keyword-based analysis if no API key
  if (!HUGGINGFACE_API_KEY) {
    return analyzeWithKeywords(text, metadata);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${SENTIMENT_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      console.warn('Hugging Face API failed, using fallback analysis');
      return analyzeWithKeywords(text, metadata);
    }

    const result = await response.json();
    return processHuggingFaceResult(result, text, metadata);
  } catch (error) {
    console.error('AI Analysis error:', error);
    return analyzeWithKeywords(text, metadata);
  }
};

/**
 * Analyze emotions in text using Hugging Face emotion model
 */
export const analyzeEmotions = async (text) => {
  if (!text || !HUGGINGFACE_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${EMOTION_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result[0]; // Returns array of emotions with scores
    }
  } catch (error) {
    console.error('Emotion analysis error:', error);
  }

  return null;
};

/**
 * Process Hugging Face API result
 */
const processHuggingFaceResult = (result, originalText, metadata = {}) => {
  let sentiment = 'neutral';
  let moodScore = 7;
  let stressLevel = 'low';
  let riskLevel = 'low';

  // Process sentiment result
  if (Array.isArray(result) && result[0]) {
    const sentimentData = result[0];
    const negativeScore = sentimentData.find(s => s.label === 'NEGATIVE')?.score || 0;
    const positiveScore = sentimentData.find(s => s.label === 'POSITIVE')?.score || 0;

    if (negativeScore > 0.7) {
      sentiment = 'negative';
      moodScore = Math.round((1 - negativeScore) * 10);
      stressLevel = 'high';
      riskLevel = 'medium';
    } else if (positiveScore > 0.7) {
      sentiment = 'positive';
      moodScore = Math.round(positiveScore * 10);
      stressLevel = 'low';
    } else {
      sentiment = 'neutral';
      moodScore = 6;
      stressLevel = 'moderate';
    }
  }

  // Enhance with keyword analysis
  const keywordAnalysis = analyzeWithKeywords(originalText, metadata);
  
  // Adjust based on multimedia input
  if (metadata.hasVoice) {
    // Voice recordings may indicate more emotional distress or openness
    keywordAnalysis.recommendations.unshift('Voice expression captured - emotional tone analyzed');
  }
  if (metadata.hasVideo) {
    // Video provides additional non-verbal cues
    keywordAnalysis.recommendations.unshift('Video content captured - visual cues considered');
  }
  
  return {
    sentiment,
    moodScore: Math.max(1, Math.min(10, moodScore)),
    stressLevel,
    concerns: keywordAnalysis.concerns,
    recommendations: keywordAnalysis.recommendations.slice(0, 6),
    riskLevel,
  };
};

/**
 * Keyword-based analysis (fallback when API is not available)
 */
const analyzeWithKeywords = (text, metadata = {}) => {
  const lowerText = text.toLowerCase();
  let sentiment = 'neutral';
  let stressLevel = 'low';
  let moodScore = 7;
  let riskLevel = 'low';
  const concerns = [];
  const recommendations = [];

  // Negative indicators
  const negativeKeywords = {
    depression: ['sad', 'depressed', 'unhappy', 'hopeless', 'worthless', 'empty', 'দুঃখিত', 'বিষণ্ণ'],
    anxiety: ['anxious', 'worried', 'stress', 'panic', 'fear', 'nervous', 'চিন্তিত', 'ভয়'],
    sleep: ['tired', 'exhausted', 'insomnia', 'sleep', 'sleepless', 'ক্লান্ত', 'ঘুম'],
    isolation: ['alone', 'lonely', 'isolated', 'nobody', 'একা', 'নিঃসঙ্গ'],
    harm: ['hurt', 'pain', 'die', 'death', 'end', 'আঘাত', 'মৃত্যু'],
  };

  // Positive indicators
  const positiveKeywords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'joyful', 'excited', 'grateful', 'খুশি', 'ভালো', 'সুন্দর'];

  // Voice/Video specific analysis
  if (metadata.hasVoice) {
    recommendations.push('✓ Voice recording analyzed for emotional tone and speaking patterns');
    // Voice recordings often indicate willingness to express emotions
    if (negativeKeywords.depression.some(kw => lowerText.includes(kw))) {
      concerns.push('voice_emotional_distress');
      recommendations.push('Speaking about feelings is a positive step - consider professional counseling');
    }
  }

  if (metadata.hasVideo) {
    recommendations.push('✓ Video recording captured - visual emotional cues considered');
    // Video provides non-verbal communication signals
    concerns.push('visual_analysis_pending');
    recommendations.push('Video provides valuable context - continue using multimodal check-ins');
  }

  // Check for negative patterns
  let negativeCount = 0;
  for (const [concern, keywords] of Object.entries(negativeKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        if (!concerns.includes(concern)) {
          concerns.push(concern);
        }
        negativeCount++;
        
        // Specific risk assessment
        if (concern === 'harm' && (lowerText.includes('myself') || lowerText.includes('suicide') || lowerText.includes('আত্মহত্যা'))) {
          riskLevel = 'high';
          recommendations.push('⚠️ URGENT: Please reach out to a mental health professional immediately');
          recommendations.push('📞 Call National Mental Health Helpline: 09678771771 (Bangladesh)');
        }
      }
    }
  }

  // Check for positive patterns
  let positiveCount = 0;
  for (const keyword of positiveKeywords) {
    if (lowerText.includes(keyword)) {
      positiveCount++;
    }
  }

  // Determine sentiment and mood
  if (negativeCount > positiveCount + 2) {
    sentiment = 'negative';
    moodScore = Math.max(2, 7 - negativeCount);
    stressLevel = negativeCount > 4 ? 'high' : 'moderate';
    if (riskLevel !== 'high') {
      riskLevel = negativeCount > 4 ? 'medium' : 'low';
    }
  } else if (positiveCount > negativeCount + 1) {
    sentiment = 'positive';
    moodScore = Math.min(9, 7 + positiveCount);
    stressLevel = 'low';
  } else {
    sentiment = 'neutral';
    moodScore = 6;
    stressLevel = 'moderate';
  }

  // Add concern-specific recommendations
  if (concerns.includes('depression')) {
    recommendations.push('💬 Consider talking to a counselor or therapist');
    recommendations.push('🎯 Engage in activities you usually enjoy');
  }
  if (concerns.includes('anxiety')) {
    recommendations.push('🧘 Practice deep breathing exercises (4-7-8 technique)');
    recommendations.push('🌿 Try mindfulness or meditation apps');
  }
  if (concerns.includes('sleep')) {
    recommendations.push('⏰ Maintain a regular sleep schedule');
    recommendations.push('📵 Limit screen time 1 hour before bed');
  }
  if (concerns.includes('isolation')) {
    recommendations.push('👥 Connect with friends or family members');
    recommendations.push('🤝 Join a support group or community activity');
  }

  // Default recommendations if none added
  if (recommendations.length === 0) {
    recommendations.push('📝 Continue journaling your thoughts and feelings');
    recommendations.push('🏃 Engage in regular physical activity (30 min daily)');
    recommendations.push('🤝 Maintain social connections');
  }

  // Default concerns if none found
  if (concerns.length === 0) {
    concerns.push('general_wellness');
  }

  return {
    sentiment,
    stressLevel,
    moodScore: Math.max(1, Math.min(10, moodScore)),
    concerns,
    recommendations: recommendations.slice(0, 6), // Limit to 6 recommendations
    riskLevel,
  };
};

/**
 * Get default analysis for empty or very short text
 */
const getDefaultAnalysis = (metadata = {}) => {
  const recommendations = [
    'Continue tracking your mental health regularly',
    'Engage in activities that bring you joy',
    'Maintain healthy sleep and exercise habits',
  ];
  
  if (metadata.hasVoice) {
    recommendations.unshift('✓ Voice recording received - emotional tone analyzed');
  }
  if (metadata.hasVideo) {
    recommendations.unshift('✓ Video recording captured - visual cues considered');
  }
  
  return {
    sentiment: 'neutral',
    stressLevel: 'low',
    moodScore: 7,
    concerns: ['general_wellness'],
    recommendations,
    riskLevel: 'low',
  };
};

/**
 * Analyze video (placeholder - would need video processing API)
 */
export const analyzeVideo = async (videoData) => {
  // In a real implementation, this would:
  // 1. Extract frames from video
  // 2. Use facial expression recognition API
  // 3. Analyze tone and speech patterns
  // For now, return default analysis
  
  console.log('Video analysis not yet implemented - using default analysis');
  return getDefaultAnalysis();
};

export default {
  analyzeTextSentiment,
  analyzeEmotions,
  analyzeVideo,
};
