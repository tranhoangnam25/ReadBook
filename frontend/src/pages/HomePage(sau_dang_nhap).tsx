export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#243447]">

      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b">

        <div className="flex items-center gap-10">

          <h1 className="text-xl font-bold flex items-center gap-2">
            📖 Lumina Books
          </h1>

          <nav className="flex gap-6 text-sm font-medium">
            <a className="hover:text-[#e78f8f] cursor-pointer">Feed</a>
            <a className="hover:text-[#e78f8f] cursor-pointer">Library</a>
            <a className="hover:text-[#e78f8f] cursor-pointer">Collections</a>
          </nav>

        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3">

          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-[300px]">
            🔍
            <input
              className="bg-transparent outline-none ml-2 w-full text-sm"
              placeholder="Find books, authors..."
            />
          </div>

          <button className="border px-4 py-2 rounded-lg text-sm">
            Advanced Search
          </button>

        </div>

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 rounded-full"
          />

        </div>

      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-10 py-10">

        {/* TITLE */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Welcome back, <span className="text-[#e78f8f]">Reader</span>.
          </h1>

          <p className="text-gray-500">
            Pick up exactly where you left off.
          </p>

        </div>

        <div className="grid grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="col-span-5 space-y-8">

            {/* CURRENTLY READING */}
            <div className="bg-white p-6 rounded-2xl shadow">

              <div className="flex justify-between text-xs text-gray-400 font-bold mb-4">
                <span>CURRENTLY READING</span>
                <span className="text-[#e78f8f]">Active Now</span>
              </div>

              <img
                src="https://picsum.photos/300/400"
                className="rounded-xl mb-4"
              />

              <h2 className="text-xl font-bold">
                The Silent Echo
              </h2>

              <p className="text-gray-500 mb-4">
                Eleanor Vance
              </p>

              <div className="flex justify-between text-sm mb-2">
                <span>64% Completed</span>
                <span className="text-[#e78f8f]">128 / 200 pages</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded mb-4">
                <div className="bg-[#e78f8f] h-2 rounded w-[64%]"></div>
              </div>

              <button className="w-full bg-[#2e4156] text-white py-3 rounded-lg">
                Continue Reading
              </button>

            </div>

            {/* HISTORY */}
            <div className="bg-gray-100 p-6 rounded-2xl">

              <h3 className="text-xs text-gray-400 font-bold mb-4">
                READING HISTORY
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <img src="https://picsum.photos/50/70" className="rounded" />
                <div>
                  <p className="text-sm font-semibold">Midnight in Venice</p>
                  <p className="text-xs text-gray-500">Finished 2 days ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/50/71" className="rounded" />
                <div>
                  <p className="text-sm font-semibold">Beyond the Horizon</p>
                  <p className="text-xs text-gray-500">Finished last week</p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-7">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Recommended <span className="text-[#e78f8f]">For You</span>
              </h2>

              <button className="text-sm text-[#e78f8f]">
                Customize Feed
              </button>

            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* BOOK 1 */}
              <div className="bg-white p-4 rounded-xl shadow">

                <img
                  src="https://picsum.photos/220/300"
                  className="rounded-lg mb-3"
                />

                <p className="text-xs text-[#e78f8f] font-bold">
                  BASED ON HISTORY
                </p>

                <h3 className="font-bold">
                  Beyond the Horizon
                </h3>

                <p className="text-sm text-gray-500">
                  Sarah Jenkins
                </p>

              </div>

              {/* BOOK 2 */}
              <div className="bg-white p-4 rounded-xl shadow">

                <img
                  src="https://picsum.photos/221/300"
                  className="rounded-lg mb-3"
                />

                <p className="text-xs text-[#e78f8f] font-bold">
                  TRENDING
                </p>

                <h3 className="font-bold">
                  The Last Alchemist
                </h3>

                <p className="text-sm text-gray-500">
                  Marcus Thorne
                </p>

              </div>

              {/* BOOK 3 */}
              <div className="bg-white p-4 rounded-xl shadow">

                <img
                  src="https://picsum.photos/222/300"
                  className="rounded-lg mb-3"
                />

                <p className="text-xs text-[#e78f8f] font-bold">
                  MYSTERY
                </p>

                <h3 className="font-bold">
                  Midnight in Venice
                </h3>

                <p className="text-sm text-gray-500">
                  Julian Barnes
                </p>

              </div>

              {/* DISCOVER */}
              <div className="bg-[#2e4156] text-white p-6 rounded-xl flex flex-col items-center justify-center text-center">

                <h3 className="text-lg font-bold mb-3">
                  Explore more titles in Fiction
                </h3>

                <button className="bg-[#e78f8f] px-4 py-2 rounded-lg">
                  Browse Genre
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t mt-16 px-10 py-6 flex justify-between text-sm text-gray-500 bg-white">

        <div>📖 Lumina Books</div>

        <div className="flex gap-6">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
          <span>Settings</span>
        </div>

      </footer>

    </div>
  )
}
