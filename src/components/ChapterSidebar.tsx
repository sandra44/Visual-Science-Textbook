import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
  X,
} from 'lucide-react';
import type { TextbookChapter, TextbookTopic } from '../types/textbook';

interface ChapterSidebarProps {
  chapters: TextbookChapter[];
  activeChapterNumber: number | null;
  activeTopicId: string | null;
  onSelectTopic: (chapter: TextbookChapter, topic: TextbookTopic) => void;
  onOpenChapterInBook: (chapter: TextbookChapter) => void;
  onClose?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Physics: 'bg-sky-50 text-sky-700 border-sky-200',
  Chemistry: 'bg-amber-50 text-amber-700 border-amber-200',
  Biology: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Earth Science': 'bg-teal-50 text-teal-700 border-teal-200',
  Foundations: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function ChapterSidebar({
  chapters,
  activeChapterNumber,
  activeTopicId,
  onSelectTopic,
  onOpenChapterInBook,
  onClose,
}: ChapterSidebarProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const filteredChapters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chapters;
    return chapters
      .map((ch) => {
        const chMatches =
          ch.title.toLowerCase().includes(q) ||
          `chapter ${ch.number}`.includes(q) ||
          ch.category.toLowerCase().includes(q);
        const matchingTopics = ch.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.number.toLowerCase().includes(q)
        );
        if (chMatches) return ch;
        if (matchingTopics.length > 0) return { ...ch, topics: matchingTopics };
        return null;
      })
      .filter(Boolean) as TextbookChapter[];
  }, [chapters, search]);

  const toggleChapter = (num: number) => {
    setExpanded((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <aside className="w-76 shrink-0 border-r border-stone-200 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-3.5 border-b border-stone-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-700">
            Chapters &amp; Topics
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close chapters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a chapter or topic..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-violet-400 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChapters.map((ch) => {
          const isOpen = !!expanded[ch.number] || search.trim().length > 0;
          const isActive = activeChapterNumber === ch.number;
          return (
            <div
              key={ch.number}
              className={`rounded-xl transition ${
                isActive ? 'bg-stone-100/80' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start gap-1.5 p-2">
                <button
                  onClick={() => toggleChapter(ch.number)}
                  className="mt-0.5 text-stone-400 hover:text-stone-700 shrink-0"
                  aria-label={`Toggle chapter ${ch.number}`}
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleChapter(ch.number)}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-stone-500">
                      Ch. {ch.number}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                        CATEGORY_COLORS[ch.category] ??
                        'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {ch.category}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-stone-800 mt-0.5 leading-snug">
                    {ch.title}
                  </div>
                </div>
                <button
                  onClick={() => onOpenChapterInBook(ch)}
                  title="Read in Textbook"
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-700 shrink-0 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>

              {isOpen && ch.topics.length > 0 && (
                <div className="pl-7 pr-2 pb-2 space-y-0.5">
                  {ch.topics.map((topic) => {
                    const selected = activeTopicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => onSelectTopic(ch, topic)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition truncate block ${
                          selected
                            ? 'bg-violet-100 text-violet-900 font-medium'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        <span className="font-semibold text-stone-400 mr-1.5">
                          {topic.number}
                        </span>
                        {topic.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
