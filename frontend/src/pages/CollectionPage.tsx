import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, PlayCircle, CheckCircle, Clock } from 'lucide-react';
import LibrarySidebar from '../components/common/LibrarySidebar';


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

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const collectionId = Number(id);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBooks, setSelectedBooks] = React.useState<number[]>([]);

  
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

  
  const { data: books, isLoading } = useQuery<LibraryResponse[]>({
    queryKey: ["collection-books", collectionId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/collections/${collectionId}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Load collection books failed");
      return res.json();
    },
    enabled: !!collectionId,
  });

  
  const { data: allBooks } = useQuery<LibraryResponse[]>({
    queryKey: ["my-library", user?.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/library/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Load library failed");
      return res.json();
    },
    enabled: isModalOpen,
  });

  
  const availableBooks = (allBooks || []).filter(
    (b) => !books?.some((c) => c.bookId === b.bookId)
  );

  
  const toggleSelect = (bookId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleAddBooks = async () => {
    await Promise.all(
      selectedBooks.map((bookId) =>
        fetch(`http://localhost:8080/api/collections/add-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ collectionId, bookId }),
        })
      )
    );

    closeModal();

    queryClient.invalidateQueries({
      queryKey: ["collection-books", collectionId],
    });
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Xoá collection này?")) return;

    await fetch(`http://localhost:8080/api/collections/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    queryClient.invalidateQueries({
      queryKey: ["collections", user?.id],
    });

    if (id === collectionId) navigate("/library");
  };

  const handleCreateCollection = async () => {
    const name = prompt("Tên collection?");
    if (!name) return;

    await fetch(`http://localhost:8080/api/collections/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user.id, name }),
    });

    queryClient.invalidateQueries({
      queryKey: ["collections", user?.id],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooks([]);
  };

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F1EA]">
        <div className="animate-pulse text-primary/30 font-black uppercase tracking-widest">
          Loading collection...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-12 px-6 py-12 lg:px-20 bg-[#F4F1EA] min-h-screen">

      {}
      <LibrarySidebar
        collections={collections}
        activeCollectionId={collectionId}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      {}
      <main className="flex-1">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-primary">Collection</h2>
          <p className="text-primary/40">
            {books?.length || 0} books
          </p>
        </div>

        {}
        {books?.length === 0 && (
          <div className="text-center py-20 text-primary/30 font-bold">
            This collection is empty.
          </div>
        )}

        {}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4">
          {books?.map((book) => (
            <div
              key={book.progressId}
              onClick={() => navigate(`/reading/${book.bookId}`)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-white shadow-lg group-hover:-translate-y-2 group-hover:shadow-2xl transition">

                <img
                  src={book.coverImage}
                  className="w-full h-full object-cover"
                />

                {}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 text-xs text-white bg-black/70 px-2 py-1 rounded">
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
                      className="h-full bg-red-400"
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
          <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <div className="aspect-[3/4.5] flex items-center justify-center border-2 border-dashed rounded-2xl hover:border-primary/30 transition">
              <Plus size={32} className="text-primary/30" />
            </div>
          </div>
        </div>
      </main>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[800px] max-h-[80vh] p-6 rounded-2xl overflow-y-auto">

            <h3 className="text-xl font-bold mb-4">Add Books</h3>

            {!allBooks ? (
              <div className="text-center py-10">Loading...</div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {availableBooks.map((book) => {
                  const isSelected = selectedBooks.includes(book.bookId);

                  return (
                    <div
                      key={book.bookId}
                      onClick={() => toggleSelect(book.bookId)}
                      className={`cursor-pointer relative border-2 rounded-lg ${
                        isSelected ? 'border-green-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={book.coverImage}
                        className="rounded-lg w-full h-[180px] object-cover"
                      />

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeModal}>Cancel</button>

              <button
                onClick={handleAddBooks}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Add ({selectedBooks.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;