export interface TextbookTopic {
  id: string;
  number: string;
  title: string;
  kind: 'section' | 'activity';
  pdfPage: number;
  bookPage: number;
  bbox: [number, number, number, number];
  curatedSimId: string | null;
}

export interface TextbookChapter {
  pdfUrl?: string;
  number: number;
  title: string;
  category: string;
  pdfStart: number;
  pdfEnd: number;
  bookStart: number;
  bookEnd: number;
  curatedSimId: string | null;
  topics: TextbookTopic[];
}

export interface OrderedPage {
  bookPage: number;
  pdfPage: number;
  chapterNumber: number;
  chapterTitle: string;
  topics: TextbookTopic[];
}

export interface TextbookIndex {
  totalPages: number;
  chapters: TextbookChapter[];
  orderedPages: OrderedPage[];
}

export interface TextbookPageText {
  pdfPage: number;
  bookPage: number;
  chapterNumber: number;
  chapterTitle: string;
  text: string;
}
