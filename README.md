# MindBridge - AI-Powered Mental Health Support

A privacy-first, bilingual (Bangla + English) Progressive Web App (PWA) for early mental health detection and support, designed specifically for Bangladesh.

## 🌟 Features

### Core Functionality
- **Bilingual Support**: Full interface in Bangla and English with instant language switching
- **Daily Check-ins**: 
  - Text journaling (short/long modes)
  - Voice recording (up to 90 seconds) with transcript
  - Optional 30-second video expression analysis
- **Mood Dashboard**: 
  - 7/30-day trend visualization
  - Current wellness score with risk level indicator
  - Timeline of recent check-ins
- **Support Resources**:
  - Breathing exercises and guided mindfulness
  - Local helpline directory
  - Teleconsultation scheduling
- **Admin Dashboard**: Aggregated anonymous metrics for pilot programs

### Privacy & Security
- ✅ Explicit consent flow on signup
- ✅ On-device processing option
- ✅ Video recordings never stored on servers
- ✅ Data export and deletion controls
- ✅ Optional anonymous data sharing for model improvement

### Technical Highlights
- Progressive Web App (PWA) - installable on mobile devices
- Responsive design for all screen sizes
- Simulated AI analysis endpoints ready for integration
- Beautiful, calming design with accessibility focus

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui with custom variants
- **Charts**: Recharts for data visualization
- **Routing**: React Router v6
- **PWA**: vite-plugin-pwa

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables (Production Setup)

Create a `.env.example` file with the following:

```env
# AI API Keys (for production)
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here

# Storage & Backend
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: On-device model paths
TENSORFLOW_MODEL_PATH=/models/sentiment
WHISPER_MODEL_PATH=/models/whisper-tiny
```

## 🤖 AI Integration Guide

### Current State
The app currently uses **simulated AI responses** for demo purposes. All check-ins return mock analysis results.

### Converting to Production

#### 1. Text Analysis (Sentiment Detection)
```typescript
// Replace simulated endpoint in CheckIn.tsx
const response = await fetch('/api/analyze-text', {
  method: 'POST',
  body: JSON.stringify({ text: textEntry }),
  headers: { 'Content-Type': 'application/json' }
});

// Production endpoint should call:
// - OpenAI GPT-4 for advanced analysis
// - Hugging Face sentiment models (e.g., "distilbert-base-uncased-finetuned-sst-2-english")
```

#### 2. Voice Analysis (Whisper + Prosody)
```typescript
// Use OpenAI Whisper API for transcription
const formData = new FormData();
formData.append('file', audioBlob);
formData.append('model', 'whisper-1');

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  },
  body: formData
});

// Then analyze transcript + audio features (tone, pace) for mental health indicators
```

#### 3. Video Analysis (Expression Recognition)
```typescript
// Use TensorFlow.js or MediaPipe for facial expression analysis
// Run on-device to maintain privacy
import * as facemesh from '@tensorflow-models/face-landmarks-detection';

const model = await facemesh.load();
const predictions = await model.estimateFaces(videoElement);
// Analyze expressions for emotional state
```

#### 4. On-Device Processing
For privacy-critical deployments, use:
- **TensorFlow Lite** for mobile on-device inference
- **ONNX Runtime** for web-based models
- **Hugging Face Transformers.js** for client-side NLP

```typescript
// Example: On-device sentiment analysis
import { pipeline } from '@xenova/transformers';

const classifier = await pipeline('sentiment-analysis');
const result = await classifier(textEntry);
```

## 🔐 Federated Learning Setup (Advanced)

For privacy-preserving model improvement:

```python
# Server-side (TensorFlow Federated)
import tensorflow_federated as tff

# Define federated averaging strategy
iterative_process = tff.learning.build_federated_averaging_process(
    model_fn=model_fn,
    client_optimizer_fn=lambda: tf.keras.optimizers.SGD(learning_rate=0.02)
)

# Or use Flower (https://flower.dev)
import flwr as fl

class MindBridgeClient(fl.client.NumPyClient):
    def get_parameters(self):
        return model.get_weights()
    
    def fit(self, parameters, config):
        model.set_weights(parameters)
        # Train on local data
        return model.get_weights(), len(train_data), {}

fl.client.start_numpy_client(server_address="[::]:8080", client=MindBridgeClient())
```

## 📱 PWA Installation

### Desktop
1. Visit the app URL
2. Click the install icon in the address bar
3. App will be added to your desktop

### Mobile (Android)
1. Open in Chrome/Edge
2. Tap the menu (⋮)
3. Select "Add to Home screen"

### Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🎨 Design System

The app uses a custom design system defined in `src/index.css`:

- **Primary**: Calming teal (`hsl(180 45% 42%)`)
- **Accent**: Warm coral (`hsl(15 75% 65%)`)
- **Success**: Green (`hsl(145 60% 48%)`)
- **Warning**: Amber (`hsl(40 85% 58%)`)

All colors use semantic tokens - never hardcode colors in components.

## 🌐 Localization

Add new translations in `src/contexts/LanguageContext.tsx`:

```typescript
const translations = {
  en: {
    'your.key': 'English text',
  },
  bn: {
    'your.key': 'বাংলা পাঠ্য',
  }
};
```

## 📊 Sample Data Structure

### Check-in Submission
```json
{
  "timestamp": "2025-11-06T10:30:00Z",
  "text": "Feeling good today...",
  "voiceTranscript": "I had a great morning...",
  "videoAnalysis": {
    "expressions": ["neutral", "happy"],
    "confidence": 0.87
  },
  "onDeviceProcessing": true
}
```

### AI Response
```json
{
  "score": 85,
  "category": "low",
  "reasons": [
    "text: positive sentiment detected",
    "voice: calm and steady tone",
    "video: genuine smile observed"
  ],
  "suggestions": [
    "Continue your current wellness practices",
    "Consider daily journaling"
  ]
}
```

## 🔒 Privacy Compliance

- ✅ GDPR-ready data export/deletion
- ✅ Informed consent before data collection
- ✅ Minimal data retention
- ✅ Anonymous aggregation for analytics
- ✅ Clear privacy disclaimers

## 🚨 Important Disclaimers

**This app is NOT a substitute for professional medical advice, diagnosis, or treatment.**

- Always include prominent disclaimers
- Provide emergency contact information (999 in Bangladesh)
- Link to qualified mental health professionals
- Regular safety audits for AI-generated advice

## 📞 Support Resources

Local helplines integrated in the app:
- **National Mental Health Helpline**: 16263 (24/7)
- **Kaan Pete Roi**: 01779-554391 (10 AM - 6 PM)
- **Shuni.org**: 09678-222666 (24/7)

## 🤝 Contributing

When contributing to this project:
1. Follow the existing design system
2. Maintain bilingual support for all new features
3. Prioritize privacy and security
4. Add appropriate disclaimers for mental health content
5. Test on both desktop and mobile

## 📄 License

This is a prototype for demonstration purposes. For production deployment, ensure compliance with local healthcare regulations and data protection laws in Bangladesh.

## 🙏 Acknowledgments

Designed for culturally sensitive mental health support in Bangladesh. Built with privacy and accessibility as core principles.
