CREATE TABLE [Users] (
  [user_id] INT PRIMARY KEY IDENTITY(1, 1),
  [username] NVARCHAR(100) NOT NULL,
  [avatar_url] NVARCHAR(255),
  [email] NVARCHAR(100) NOT NULL,
  [phone] NVARCHAR(20),
  [password_hash] NVARCHAR(255) NOT NULL,
  [role] NVARCHAR(3) NOT NULL,
  [status] NVARCHAR(10) NOT NULL DEFAULT 'active',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_users_role] CHECK ([role]   IN ('USR', 'ADM')),
  CONSTRAINT [ck_users_status] CHECK ([status] IN ('active', 'locked'))
)
GO

CREATE TABLE [Authors] (
  [author_id] INT PRIMARY KEY IDENTITY(1, 1),
  [name] NVARCHAR(150) NOT NULL,
  [biography] NVARCHAR(MAX),
  [avatar_url] NVARCHAR(255) NOT NULL,
  [awards] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Categories] (
  [category_id] INT PRIMARY KEY IDENTITY(1, 1),
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Books] (
  [book_id] INT PRIMARY KEY IDENTITY(1, 1),
  [title] NVARCHAR(255) NOT NULL,
  [description] NVARCHAR(MAX),
  [price] DECIMAL(10,2) NOT NULL DEFAULT (0),
  [preview_percentage] INT NOT NULL DEFAULT (0),
  [file_url] NVARCHAR(255),
  [cover_image] NVARCHAR(255),
  [author_id] INT NOT NULL,
  [category_id] INT NOT NULL,
  [publish_year] SMALLINT,
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Reviews] (
  [review_id] INT PRIMARY KEY IDENTITY(1, 1),
  [user_id] INT NOT NULL,
  [book_id] INT NOT NULL,
  [rating] INT NOT NULL,
  [comment] NVARCHAR(MAX),
  [status] NVARCHAR(10) NOT NULL DEFAULT 'visible',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_reviews_rating] CHECK ([rating] BETWEEN 1 AND 5),
  CONSTRAINT [ck_reviews_status] CHECK ([status] IN ('visible', 'hidden'))
)
GO

CREATE TABLE [Orders] (
  [order_id] INT PRIMARY KEY IDENTITY(1, 1),
  [user_id] INT NOT NULL,
  [book_id] INT NOT NULL,
  [price] DECIMAL(10,2) NOT NULL,
  [status] NVARCHAR(10) NOT NULL DEFAULT 'pending',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_orders_status] CHECK ([status] IN ('pending', 'paid', 'cancelled'))
)
GO

CREATE TABLE [Payments] (
  [payment_id] INT PRIMARY KEY IDENTITY(1, 1),
  [order_id] INT NOT NULL,
  [payment_method] NVARCHAR(50) NOT NULL,
  [qr_code] NVARCHAR(255),
  [status] NVARCHAR(10) NOT NULL DEFAULT 'pending',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_payments_status] CHECK ([status] IN ('pending', 'success', 'failed'))
)
GO

CREATE TABLE [Collections] (
  [collection_id] INT PRIMARY KEY IDENTITY(1, 1),
  [user_id] INT NOT NULL,
  [name] NVARCHAR(150) NOT NULL,
  [description] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Collection_Items] (
  [collection_item_id] INT PRIMARY KEY IDENTITY(1, 1),
  [collection_id] INT NOT NULL,
  [book_id] INT NOT NULL,
  [added_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [Reading_Progress] (
  [progress_id] INT PRIMARY KEY IDENTITY(1, 1),
  [user_id] INT NOT NULL,
  [book_id] INT NOT NULL,
  [fi_location] VARCHAR(255) NOT NULL,
  [progress_percentage] DECIMAL(5,2),
  [status] NVARCHAR(20) DEFAULT 'reading',
  [updated_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [Reader_Setting] (
  [reader_setting_id] INT PRIMARY KEY IDENTITY(1, 1),
  [user_id] INT UNIQUE NOT NULL,
  [font_family] VARCHAR(50) DEFAULT 'Roboto',
  [font_size] INT DEFAULT (16),
  [line_height] FLOAT DEFAULT (1.5),
  [background_color] VARCHAR(20) DEFAULT 'Light',
  [updated_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE UNIQUE INDEX [uq_users_email] ON [Users] ("email")
GO

CREATE UNIQUE INDEX [uq_categories_name] ON [Categories] ("name")
GO

CREATE UNIQUE INDEX [uq_payments_order_id] ON [Payments] ("order_id")
GO

CREATE UNIQUE INDEX [uk_collection_book] ON [Collection_Items] ("collection_id", "book_id")
GO

ALTER TABLE [Reading_Progress] ADD FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Reading_Progress] ADD FOREIGN KEY ([book_id]) REFERENCES [Books] ([book_id])
GO

ALTER TABLE [Reader_Setting] ADD CONSTRAINT [FK_ReaderSetting_Users] FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id]) ON DELETE CASCADE
GO

ALTER TABLE [Books] ADD CONSTRAINT [fk_books_author] FOREIGN KEY ([author_id]) REFERENCES [Authors] ([author_id])
GO

ALTER TABLE [Books] ADD CONSTRAINT [fk_books_category] FOREIGN KEY ([category_id]) REFERENCES [Categories] ([category_id])
GO

ALTER TABLE [Reviews] ADD CONSTRAINT [fk_reviews_user] FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Reviews] ADD CONSTRAINT [fk_reviews_book] FOREIGN KEY ([book_id]) REFERENCES [Books] ([book_id])
GO

ALTER TABLE [Orders] ADD CONSTRAINT [fk_orders_user] FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Orders] ADD CONSTRAINT [fk_orders_book] FOREIGN KEY ([book_id]) REFERENCES [Books] ([book_id])
GO

ALTER TABLE [Payments] ADD CONSTRAINT [fk_payments_order] FOREIGN KEY ([order_id]) REFERENCES [Orders] ([order_id])
GO

ALTER TABLE [Collections] ADD CONSTRAINT [fk_collections_user] FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Collection_Items] ADD CONSTRAINT [fk_col_items_collection] FOREIGN KEY ([collection_id]) REFERENCES [Collections] ([collection_id]) ON DELETE CASCADE
GO

ALTER TABLE [Collection_Items] ADD CONSTRAINT [fk_col_items_book] FOREIGN KEY ([book_id]) REFERENCES [Books] ([book_id])
GO
