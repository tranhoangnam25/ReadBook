import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LibrarySidebar from '../components/common/LibrarySidebar';
import { PlayCircle, CheckCircle, Clock, Plus } from 'lucide-react';


interface LibraryResponse {
  progressId: number;
  bookId: number;
  title: string;
  authorName: string;
  coverImage: string;
  status: 'reading' | 'completed' | 'to_read';
  progress: number;
}

interface Collection {
  id: number;
  name: string;
}

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  
  const { data: libraryBooks, isLoading } = useQuery<LibraryResponse[]>({
    queryKey: ["my-library", user?.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/library/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Load library failed");
      return res.json();
    },
    enabled: !!user?.id,
  });

  
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collections", user?.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/collections/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Load collections failed");
      return res.json();
    },
    enabled: !!user?.id,
  });

  
  const handleCreateCollection = async () => {
    if (!collectionName.trim()) return;

    await fetch(`http://localhost:8080/api/collections/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        name: collectionName,
      }),
    });

    setCollectionName("");
    setIsModalOpen(false);

    queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
  };

  
  const handleDeleteCollection = async (collectionId: number) => {
    if (!confirm("Xoá collection này?")) return;

    await fetch(`http://localhost:8080/api/collections/${collectionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
  };

  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F1EA]">
        <div className="animate-pulse text-primary/30 font-black uppercase tracking-widest">
          Curating your wisdom...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-12 px-6 py-12 lg:px-20 bg-[#F4F1EA] min-h-screen">

      {}
      <LibrarySidebar
        collections={collections}
        onCreateCollection={() => setIsModalOpen(true)}
        onDeleteCollection={handleDeleteCollection}
      />

      {}
      <main className="flex-1">

        {}
        <div className="mb-10">
          <h2 className="text-4xl font-black text-primary">
            Virtual Bookshelf
          </h2>
          <p className="text-primary/40">
            {libraryBooks?.length || 0} titles
          </p>
        </div>

        {}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4">

          {libraryBooks?.map((book) => (
            <div
              key={book.progressId}
              onClick={() => navigate(`/reading/${book.bookId}`)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-white shadow-lg transition group-hover:-translate-y-2 group-hover:shadow-2xl">

                <img
                  src={book.coverImage}
                  className="w-full h-full object-cover"
                />

                {}
                <div className="absolute top-3 right-3">
                  <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded text-white ${
                    book.status === 'reading'
                      ? 'bg-accent'
                      : book.status === 'completed'
                      ? 'bg-primary'
                      : 'bg-gray-400'
                  }`}>
                    {book.status === 'reading' && <PlayCircle size={10} />}
                    {book.status === 'completed' && <CheckCircle size={10} />}
                    {book.status === 'to_read' && <Clock size={10} />}
                    {book.status}
                  </span>
                </div>

                {}
                {book.status === 'reading' && (
                  <div className="absolute bottom-0 w-full h-1 bg-black/10">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <h4 className="mt-2 font-bold truncate">{book.title}</h4>
              <p className="text-xs text-gray-400 truncate">
                {book.authorName}
              </p>
            </div>
          ))}

          {}
          <div onClick={() => navigate('/shop')} className="cursor-pointer">
            <div className="aspect-[3/4.5] flex items-center justify-center border-2 border-dashed rounded-2xl hover:border-primary/30 transition">
              <Plus size={32} className="text-primary/30" />
            </div>
          </div>
        </div>
      </main>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-xl">

            <h3 className="text-lg font-bold mb-4">
              Create New Shelf
            </h3>

            <input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name..."
              className="w-full border rounded-lg px-3 py-2 mb-4 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>

              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;