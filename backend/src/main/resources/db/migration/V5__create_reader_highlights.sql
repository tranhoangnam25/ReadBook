CREATE TABLE [reader_highlights] (
  [highlight_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [cfi_range] VARCHAR(1000) NOT NULL,
  [text] NVARCHAR(MAX),
  [color] VARCHAR(30) NOT NULL DEFAULT ('#facc15'),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [fk_reader_highlights_user] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]) ON DELETE CASCADE,
  CONSTRAINT [fk_reader_highlights_book] FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id]) ON DELETE CASCADE
)
GO

CREATE INDEX [idx_reader_highlights_user_book] ON [reader_highlights] ([user_id], [book_id])
GO
