import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { bookVisual } from '../simulations/bookVisuals';
import { Atom, BookOpen, ChevronLeft, ChevronRight, List, Sparkles } from 'lucide-react';
import type { OrderedPage, TextbookChapter, TextbookIndex, TextbookTopic } from '../types/textbook';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type Props = {
  index: TextbookIndex;
  page: number;
  onNavigate: (page: number) => void;
  onVisualizeTopic: (chapter: TextbookChapter, topic: TextbookTopic) => void;
  onToggleChapters: () => void;
};

type LoadPdf = (url: string) => Promise<pdfjs.PDFDocumentProxy>;

function Leaf({ loadPdf, info, chapter, onVisualizeTopic }: {
  loadPdf: LoadPdf; info: OrderedPage; chapter: TextbookChapter;
} & Pick<Props, 'onVisualizeTopic'>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [ratio, setRatio] = useState(.74);
  const [error, setError] = useState('');
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    let active = true;
    let render: pdfjs.RenderTask | undefined;
    const timer = window.setTimeout(()=>setSlow(true), 8000);
    async function paint() {
      const doc = await loadPdf(chapter.pdfUrl ?? '/Science Textbook.pdf');
      if (!active) return;
      const page = await doc.getPage(chapter.pdfUrl ? info.bookPage - chapter.bookStart + 1 : info.pdfPage);
      if (!active || !canvas.current) return;
      const viewport = page.getViewport({ scale: 1.65 });
      canvas.current.width = viewport.width;
      canvas.current.height = viewport.height;
      setRatio(viewport.width / viewport.height);
      render = page.render({ canvas: canvas.current, viewport });
      await render.promise;
      if (active) setReady(true);
    }
    paint().catch(e => { if (active) setError(String(e)); });
    return () => { active = false; window.clearTimeout(timer); render?.cancel(); };
  }, [loadPdf, chapter, info]);
  return <article aria-label={`Book page ${info.bookPage}`} className="reader-leaf" style={{width:`min(100cqw, ${ratio*100}cqh)`, aspectRatio:ratio}}>
    <canvas ref={canvas} className="block h-full w-full" aria-label={`Textbook page ${info.bookPage}: ${chapter.title}`}/>
    {!ready && <p className="absolute inset-0 grid place-content-center text-sm">{error ? `Could not open this page: ${error}` : slow && chapter.pdfUrl ? 'Still loading this chapter from NCERT…' : 'Opening page…'}
      {(slow || error) && chapter.pdfUrl && <a className="underline" href={`https://ncert.nic.in/textbook/pdf/${chapter.pdfUrl.split('/').pop()}`} target="_blank" rel="noreferrer">Open chapter at NCERT</a>}</p>}
    {ready && info.topics.map(t=>{
      const visual = bookVisual(t.curatedSimId,t.number);
      if (!visual) return null;
      const [x,y,width,height] = t.bbox;
      return <button key={t.id} title={visual.label} aria-label={`${visual.label}: ${t.number} ${t.title}`}
        className="book-hotspot" style={{right:`${100*(1-x-width)}%`,top:`${100*(y+height/2)}%`,transform:'translate(100%,-50%)', ...(x+width>.85?{right:`${100*(1-x)}%`,transform:'translateY(-50%)'}:{})}}
        onClick={()=>onVisualizeTopic(chapter,t)}><Sparkles size={12}/><span className="sr-only">{visual.label}</span></button>;
    })}
  </article>;
}

export function FlipbookView({index,page,onNavigate,onToggleChapters,...actions}:Props) {
  const [documents] = useState(()=>new Map<string, pdfjs.PDFDocumentLoadingTask>());
  const [loadPdf] = useState<LoadPdf>(()=>(url: string)=>{
    let task=documents.get(url);
    if (!task) {
      task=pdfjs.getDocument(url.startsWith('/book/')
        ? {url, disableStream:true, disableAutoFetch:true, rangeChunkSize:262144}
        : url);
      documents.set(url,task);
    }
    return task.promise;
  });
  const [entry,setEntry] = useState(String(page || 1));
  const [singlePage,setSinglePage] = useState(()=>window.matchMedia('(max-width:800px)').matches);
  useEffect(()=>{
    const layout=window.matchMedia('(max-width:800px)');
    const sync=()=>setSinglePage(layout.matches);
    sync();
    layout.addEventListener('change',sync);
    return ()=>layout.removeEventListener('change',sync);
  },[]);
  useEffect(()=>setEntry(String(page || 1)),[page]);
  useEffect(()=>()=>{for (const task of documents.values()) void task.destroy(); documents.clear();},[documents]);
  const info=index.orderedPages[page-1];
  const first=singlePage || page===0 ? page : page-(page-1)%2;
  const visiblePages=singlePage ? [page] : [first,first+1].filter(n=>n<=index.totalPages);
  const step=singlePage ? 1 : 2;
  useEffect(()=>{
    const urls = new Set((singlePage ? [first] : [first,first+1]).filter(n=>first>0 && n<=index.totalPages).map(n=>{
      const leaf=index.orderedPages[n-1];
      return index.chapters.find(c=>c.number===leaf.chapterNumber)?.pdfUrl ?? '/Science Textbook.pdf';
    }));
    for (const [url,task] of documents) if (!urls.has(url)) { documents.delete(url); void task.destroy(); }
  },[first,index,singlePage,documents]);
  return <main className="book-desk flex-1 min-w-0 flex flex-col items-center">
    <div className="flex-1 w-full min-h-0 p-3 sm:p-5 flex items-center justify-center">
      {page===0 ? <button className="book-cover" aria-label="Open science textbook" onClick={()=>onNavigate(1)}>
        <small>THE INTERACTIVE TEXTBOOK</small><Atom size={80} strokeWidth={.8}/><h1>Science</h1><p>Grade 9</p>
        <span><BookOpen size={16}/> Open book</span>
      </button> :
      <div key={first} className="reader-spread">{visiblePages.map(n=>{
        const leaf=index.orderedPages[n-1];
        return <div key={n} className={`leaf-slot ${page===n?'selected-leaf':''}`}><Leaf info={leaf} loadPdf={loadPdf} chapter={index.chapters.find(c=>c.number===leaf.chapterNumber)!} {...actions}/></div>;
      })}</div>}
    </div>
    <nav aria-label="Book navigation" className="mb-3 mx-2 flex max-w-full flex-wrap justify-center items-center gap-2 rounded-2xl border border-stone-300 bg-white px-3 py-2 text-xs shadow">
      <button onClick={onToggleChapters} className="flex items-center gap-1"><List size={15}/>Contents</button>
      <select aria-label="Go to chapter" value={info?.chapterNumber??''} onChange={e=>onNavigate(index.chapters.find(c=>c.number===Number(e.target.value))!.bookStart)} className="max-w-40">
        <option value="" disabled>Jump to chapter</option>{index.chapters.map(c=><option key={c.number} value={c.number}>Ch. {c.number} · {c.title}</option>)}</select>
      <button aria-label="Previous page" disabled={!page} onClick={()=>onNavigate(Math.max(0,first-step))}><ChevronLeft size={18}/></button>
      <form className="flex items-center gap-1" onSubmit={e=>{e.preventDefault();onNavigate(Number(entry));}}>
        <label>Page <input aria-label="Go to page" type="number" required min={1} max={index.totalPages} value={entry} onChange={e=>setEntry(e.target.value)} className="w-14 rounded border px-1"/></label>
        / {index.totalPages}<button className="rounded bg-stone-100 px-2 py-1">Go</button></form>
      <button aria-label="Next page" disabled={first+step>index.totalPages && page!==0} onClick={()=>onNavigate(page===0?1:first+step)}><ChevronRight size={18}/></button>
      {!!page && <button onClick={()=>onNavigate(0)}>Cover</button>}
    </nav>
  </main>;
}
