export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  telegramId?: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'group' | 'private';
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  members?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isImportant?: boolean;
  isFakeNews?: boolean;
  hasEvent?: boolean;
  eventDetails?: EventDetails;
  aiSuggestions?: string[];
}

export interface EventDetails {
  title: string;
  date: Date;
  time?: string;
  description?: string;
  type: 'meeting' | 'call' | 'task' | 'event';
}

export interface FilterOptions {
  dateFrom?: Date;
  dateTo?: Date;
  importance?: 'all' | 'important' | 'normal';
  keywords?: string[];
}

export interface SummaryOptions {
  dateFrom: Date;
  dateTo: Date;
  chatId?: string;
}