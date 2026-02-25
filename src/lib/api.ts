// API service layer — mock functions ready to swap with real FastAPI endpoints

export interface VideoDetails {
  title: string;
  channel: string;
  thumbnail: string;
  views: string;
  duration: string;
  publishedAt: string;
}

export interface TranscriptEntry {
  timestamp: string;
  text: string;
}

export interface ExtractResponse {
  video: VideoDetails;
  transcript: TranscriptEntry[];
}

export interface AnalyzeResponse {
  summaries: {
    executive: string;
    bullets: string[];
    actionItems: string[];
  };
  mindMap: string;
  flowChart: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_VIDEO: VideoDetails = {
  title: "How Large Language Models Work — A Visual Introduction",
  channel: "3Blue1Brown",
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  views: "2.4M views",
  duration: "26:14",
  publishedAt: "Jan 15, 2025",
};

const MOCK_TRANSCRIPT: TranscriptEntry[] = [
  { timestamp: "0:00", text: "Welcome back everyone. Today we're going to explore one of the most fascinating developments in modern computing." },
  { timestamp: "0:15", text: "Large language models have fundamentally changed how we interact with technology." },
  { timestamp: "0:32", text: "But how do they actually work under the hood? Let's break it down step by step." },
  { timestamp: "0:48", text: "At the core, these models are built on something called the Transformer architecture." },
  { timestamp: "1:05", text: "The key innovation is the attention mechanism — it allows the model to focus on relevant parts of the input." },
  { timestamp: "1:22", text: "Think of it like reading a sentence and knowing which words relate to each other." },
  { timestamp: "1:38", text: "The training process involves showing the model billions of text examples from the internet." },
  { timestamp: "1:55", text: "Through this process, it learns patterns, grammar, facts, and even reasoning abilities." },
  { timestamp: "2:12", text: "But it's important to understand that it doesn't truly 'understand' — it predicts the next token." },
  { timestamp: "2:30", text: "Each prediction is based on probability distributions learned during training." },
  { timestamp: "2:48", text: "The model uses embeddings to convert words into numerical representations." },
  { timestamp: "3:05", text: "These embeddings capture semantic relationships between words in a high-dimensional space." },
  { timestamp: "3:22", text: "For example, the vector for 'king' minus 'man' plus 'woman' approximates 'queen'." },
  { timestamp: "3:40", text: "This mathematical representation of meaning is what makes these models so powerful." },
  { timestamp: "3:58", text: "Now let's talk about fine-tuning and how models are adapted for specific tasks." },
  { timestamp: "4:15", text: "Reinforcement learning from human feedback, or RLHF, is used to align the model with human preferences." },
  { timestamp: "4:33", text: "This is what makes chatbots helpful rather than just generating random text continuations." },
  { timestamp: "4:50", text: "The scale of these models is truly staggering — billions of parameters working together." },
  { timestamp: "5:08", text: "And that's just the beginning. The field is evolving rapidly with new architectures emerging." },
  { timestamp: "5:25", text: "Thanks for watching. In the next video, we'll dive deeper into attention mechanisms." },
];

const MOCK_SUMMARIES = {
  executive:
    "This video provides a comprehensive visual introduction to Large Language Models (LLMs). It covers the Transformer architecture, attention mechanisms, training processes using billions of text examples, and how embeddings convert words into mathematical representations. The video explains that LLMs predict the next token based on learned probability distributions rather than truly \"understanding\" language. It also touches on fine-tuning techniques like RLHF that align models with human preferences, making them useful as conversational AI assistants.",
  bullets: [
    "LLMs are built on the Transformer architecture with attention mechanisms at their core",
    "The attention mechanism allows models to focus on relevant parts of the input text",
    "Training involves processing billions of text examples from the internet",
    "Models learn patterns, grammar, facts, and reasoning through next-token prediction",
    "Word embeddings capture semantic relationships in high-dimensional vector spaces",
    "Classic example: king − man + woman ≈ queen demonstrates embedding relationships",
    "RLHF (Reinforcement Learning from Human Feedback) aligns models with human preferences",
    "Modern LLMs contain billions of parameters working in concert",
    "The field continues to evolve rapidly with new architectures emerging",
  ],
  actionItems: [
    "Study the Transformer architecture paper ('Attention Is All You Need') for deeper understanding",
    "Experiment with word embeddings using libraries like Word2Vec or GloVe",
    "Explore fine-tuning techniques for adapting pre-trained models to specific use cases",
    "Watch the follow-up video on attention mechanisms for more technical depth",
    "Consider the limitations of next-token prediction when deploying LLMs in production",
  ],
};

const MOCK_MINDMAP = `mindmap
  root((LLMs))
    Architecture
      Transformer
      Attention Mechanism
      Embeddings
    Training
      Billions of examples
      Next-token prediction
      Probability distributions
    Concepts
      Semantic relationships
      Vector spaces
      Word representations
    Fine-tuning
      RLHF
      Human preferences
      Task adaptation
    Scale
      Billions of parameters
      Rapid evolution
      New architectures`;

const MOCK_FLOWCHART = `flowchart TD
    A[Raw Text Data] --> B[Tokenization]
    B --> C[Word Embeddings]
    C --> D[Transformer Layers]
    D --> E{Attention Mechanism}
    E --> F[Self-Attention]
    E --> G[Cross-Attention]
    F --> H[Feed-Forward Network]
    G --> H
    H --> I[Next Token Prediction]
    I --> J[Output Generation]
    J --> K{Fine-tuning?}
    K -->|Yes| L[RLHF Training]
    K -->|No| M[Base Model]
    L --> N[Aligned Chatbot]
    M --> O[Text Completion]`;

export async function extractTranscript(_url: string): Promise<ExtractResponse> {
  await delay(2000);
  return { video: MOCK_VIDEO, transcript: MOCK_TRANSCRIPT };
}

export async function analyzeTranscript(_transcript: TranscriptEntry[]): Promise<AnalyzeResponse> {
  await delay(3000);
  return {
    summaries: MOCK_SUMMARIES,
    mindMap: MOCK_MINDMAP,
    flowChart: MOCK_FLOWCHART,
  };
}
