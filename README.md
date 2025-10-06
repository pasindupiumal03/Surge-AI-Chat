# Surge Chat - AI Trading Assistant

A modern, AI-powered trading chatbot interface built with Next.js, TypeScript, and Tailwind CSS. Designed to match the Surge Trade website aesthetic with dark themes, gradients, and professional trading UI components.

## 🚀 Features

- **AI-Powered Chatbot**: Intelligent trading assistant with OpenAI integration
- **Trading Dashboard**: Live trading signals and market analysis
- **Educational Quizzes**: AI-generated trading knowledge tests
- **Dark Theme Design**: Matches Surge Trade website styling
- **Real-time Data**: Live market insights and portfolio analysis
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4o
- **Runtime**: Node.js

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- OpenAI API key (optional, for AI features)

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_AI_API=your_openai_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Main Features

1. **Home Page**: Landing page with feature overview and direct access to AI chat
2. **Trading Dashboard**: Live trading signals and market analysis at `/trading`
3. **AI Chatbot**: Click "Open AI Chat" to start conversations with the trading assistant

### AI Chatbot Capabilities

- **Portfolio Analysis**: Get insights about your trading performance
- **Market Analysis**: Real-time market data interpretation
- **Trading Advice**: Personalized recommendations and strategies
- **Educational Quizzes**: Test your trading knowledge
- **General Chat**: Casual conversations about crypto and trading

## 🔌 API Endpoints

### `/api/ai-chat` (POST)
- **Purpose**: Main AI chat endpoint
- **Payload**: `{ question, positions, positionHistory, chartData }`
- **Response**: `{ answer }` or `{ error }`

### `/api/ai-quiz` (POST)
- **Purpose**: Generate trading quiz questions
- **Response**: `{ question, options, correct, explanation }` or `{ error }`

## 🚀 Deployment

The development server is running at [http://localhost:3000](http://localhost:3000)

For production deployment:
```bash
npm run build
npm start
```
