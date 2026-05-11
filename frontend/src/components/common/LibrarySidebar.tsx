import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, PlusCircle } from 'lucide-react';

interface Collection {
  id: number;
  name: string;
}

interface Props {
  collections?: Collection[];
  activeCollectionId?: number;
  onCreateCollection: () => void;
  onDeleteCollection: (id: number) => void;
}

const LibrarySidebar: React.FC<Props> = ({
  collections,
  activeCollectionId,
  onCreateCollection,
  onDeleteCollection,
}) => {
  const navigate = useNavigate();

  return (
    <aside className="sticky top-32 hidden w-64 flex-col gap-10 lg:flex">
      <div>
        <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-primary/30">
          My Shelves
        </h3>

        <nav className="flex flex-col gap-2">

          {}
          <button
            onClick={() => navigate("/library")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
              !activeCollectionId
                ? 'bg-primary text-white font-black shadow-xl'
                : 'font-bold text-primary/50 hover:bg-primary/5'
            }`}
          >
            <Inbox size={18} /> All Books
          </button>

          {}
          {collections?.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                activeCollectionId === c.id
                  ? 'bg-primary text-white font-black shadow-xl'
                  : 'font-bold text-primary/50 hover:bg-primary/5'
              }`}
            >
              <span
                onClick={() => navigate(`/collection/${c.id}`)}
                className="flex-1 cursor-pointer"
              >
                {c.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCollection(c.id);
                }}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </nav>
      </div>

      {}
      <button
        onClick={onCreateCollection}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/10 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-primary/30 hover:border-accent hover:text-accent transition-all"
      >
        <PlusCircle size={16} /> New Shelf
      </button>
    </aside>
  );
};

export default LibrarySidebar;