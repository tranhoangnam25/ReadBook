CREATE TABLE [reader_bookmarks] (
  [bookmark_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [cfi_location] VARCHAR(500) NOT NULL,
  [progress_percentage] DECIMAL(5,2),
  [label] NVARCHAR(255),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [fk_reader_bookmarks_user] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]) ON DELETE CASCADE,
  CONSTRAINT [fk_reader_bookmarks_book] FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id]) ON DELETE CASCADE
)
GO

CREATE INDEX [idx_reader_bookmarks_user_book] ON [reader_bookmarks] ([user_id], [book_id])
GO
