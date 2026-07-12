export interface Tool {
  id: string;
  name: string;
  title: string; // SEO Optimized Title
  description: string; // SEO Meta Description
  keywords: string[];
  category: ToolCategory;
  icon: string; // Lucide icon name
  searchRankScore: number; // Simulated search frequency
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  schema: string; // Structured JSON-LD representation
  faq: { question: string; answer: string }[];
}

export type ToolCategory = 'All' | 'Images' | 'PDF' | 'Text' | 'Finance' | 'Utility' | 'Health';

export interface AdSlot {
  id: string;
  name: string;
  type: 'leaderboard' | 'rectangle' | 'sticky' | 'native';
  estimatedEarnings: number;
  rpm: number;
}
