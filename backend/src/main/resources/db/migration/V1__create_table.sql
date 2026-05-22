CREATE TABLE [roles] (
  [name] NVARCHAR(100) PRIMARY KEY,
  [description] NVARCHAR(100) NOT NULL
)
GO

CREATE TABLE [permissions] (
  [name] NVARCHAR(100) PRIMARY KEY,
  [description] NVARCHAR(100) NOT NULL
)
GO

CREATE TABLE [users] (
  [user_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [username] NVARCHAR(100) NOT NULL,
  [avatar_url] NVARCHAR(255),
  [email] NVARCHAR(100) NOT NULL,
  [phone] NVARCHAR(20),
  [password_hash] NVARCHAR(255) NOT NULL,
  [status] NVARCHAR(10) NOT NULL DEFAULT 'active',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_users_status] CHECK ([status] IN ('active', 'locked'))
)
GO

CREATE TABLE [users_roles] (
  [user_user_id] BIGINT NOT NULL,
  [roles_name] NVARCHAR(100) NOT NULL,
  PRIMARY KEY ([user_user_id], [roles_name]),
  FOREIGN KEY ([user_user_id]) REFERENCES [users] ([user_id]),
  FOREIGN KEY ([roles_name]) REFERENCES [roles] ([name])
)
GO

CREATE TABLE [roles_permissions] (
  [role_name] NVARCHAR(100) NOT NULL,
  [permissions_name] NVARCHAR(100) NOT NULL,
  PRIMARY KEY ([role_name], [permissions_name]),
  FOREIGN KEY ([role_name]) REFERENCES [roles] ([name]),
  FOREIGN KEY ([permissions_name]) REFERENCES [permissions] ([name])
)
GO

CREATE TABLE [authors] (
  [author_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [name] NVARCHAR(150) NOT NULL,
  [biography] NVARCHAR(MAX),
  [avatar_url] NVARCHAR(255) NOT NULL,
  [awards] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [categories] (
  [category_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [books] (
  [book_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [title] NVARCHAR(255) NOT NULL,
  [description] NVARCHAR(MAX),
  [price] DECIMAL(10,2) NOT NULL DEFAULT (0),
  [preview_percentage] DECIMAL(5,2) NOT NULL DEFAULT (0),
  [file_url] NVARCHAR(255),
  [cover_image] NVARCHAR(255),
  [author_id] BIGINT NOT NULL,
  [category_id] BIGINT NOT NULL,
  [publish_year] INT,
  [embedding] VARBINARY(MAX),
  [summary_content] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [reviews] (
  [review_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [rating] DECIMAL(3,2) NOT NULL,
  [comment] NVARCHAR(MAX),
  [status] NVARCHAR(10) NOT NULL DEFAULT 'visible',
  [admin_reply] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_reviews_rating] CHECK ([rating] BETWEEN 1 AND 5),
  CONSTRAINT [ck_reviews_status] CHECK ([status] IN ('visible', 'hidden'))
)
GO

CREATE TABLE [orders] (
  [order_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [price] DECIMAL(10,2) NOT NULL,
  [status] NVARCHAR(10) NOT NULL DEFAULT 'pending',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_orders_status] CHECK ([status] IN ('pending', 'paid', 'cancelled'))
)
GO

CREATE TABLE [payments] (
  [payment_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [order_id] BIGINT NOT NULL,
  [payment_method] NVARCHAR(50) NOT NULL,
  [qr_code] NVARCHAR(255),
  [status] NVARCHAR(10) NOT NULL DEFAULT 'pending',
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  CONSTRAINT [ck_payments_status] CHECK ([status] IN ('pending', 'success', 'failed'))
)
GO

CREATE TABLE [collections] (
  [collection_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [name] NVARCHAR(150) NOT NULL,
  [description] NVARCHAR(MAX),
  [created_at] DATETIME NOT NULL DEFAULT (GETDATE()),
  [updated_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [collection_items] (
  [collection_item_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [collection_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [added_at] DATETIME NOT NULL DEFAULT (GETDATE())
)
GO

CREATE TABLE [reading_progress] (
  [progress_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT NOT NULL,
  [book_id] BIGINT NOT NULL,
  [fi_location] VARCHAR(500) NOT NULL,
  [progress_percentage] DECIMAL(5,2),
  [status] NVARCHAR(20) DEFAULT 'reading',
  [updated_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [reader_setting] (
  [reader_setting_id] BIGINT PRIMARY KEY IDENTITY(1, 1),
  [user_id] BIGINT UNIQUE NOT NULL,
  [font_family] VARCHAR(50) DEFAULT 'Roboto',
  [font_size] INT DEFAULT (16),
  [line_height] FLOAT DEFAULT (1.5),
  [background_color] VARCHAR(20) DEFAULT 'Light',
  [updated_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [chat_cache] (
    [id] BIGINT PRIMARY KEY IDENTITY(1, 1),
    [user_query] NVARCHAR(MAX),
    [embedding] VARBINARY(MAX),
    [ai_response] NVARCHAR(MAX),
    [book_ids] NVARCHAR(255),
    [created_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE UNIQUE INDEX [uq_users_email] ON [users] ("email")
GO

CREATE UNIQUE INDEX [uq_categories_name] ON [categories] ("name")
GO

CREATE UNIQUE INDEX [uq_payments_order_id] ON [payments] ("order_id")
GO

CREATE UNIQUE INDEX [uk_collection_book] ON [collection_items] ("collection_id", "book_id")
GO

ALTER TABLE [reading_progress] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [reading_progress] ADD FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id])
GO

ALTER TABLE [reader_setting] ADD CONSTRAINT [FK_ReaderSetting_Users] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id]) ON DELETE CASCADE
GO

ALTER TABLE [books] ADD CONSTRAINT [fk_books_author] FOREIGN KEY ([author_id]) REFERENCES [authors] ([author_id])
GO

ALTER TABLE [books] ADD CONSTRAINT [fk_books_category] FOREIGN KEY ([category_id]) REFERENCES [categories] ([category_id])
GO

ALTER TABLE [reviews] ADD CONSTRAINT [fk_reviews_user] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [reviews] ADD CONSTRAINT [fk_reviews_book] FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id])
GO

ALTER TABLE [orders] ADD CONSTRAINT [fk_orders_user] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [orders] ADD CONSTRAINT [fk_orders_book] FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id])
GO

ALTER TABLE [payments] ADD CONSTRAINT [fk_payments_order] FOREIGN KEY ([order_id]) REFERENCES [orders] ([order_id])
GO

ALTER TABLE [collections] ADD CONSTRAINT [fk_collections_user] FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [collection_items] ADD CONSTRAINT [fk_col_items_collection] FOREIGN KEY ([collection_id]) REFERENCES [collections] ([collection_id]) ON DELETE CASCADE
GO

ALTER TABLE [collection_items] ADD CONSTRAINT [fk_col_items_book] FOREIGN KEY ([book_id]) REFERENCES [books] ([book_id])
GO
