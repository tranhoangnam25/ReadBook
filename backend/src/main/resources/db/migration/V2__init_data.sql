-- ============================================================
-- DỮ LIỆU MẪU - BOOKSTORE DATABASE (SQL SERVER)
-- ============================================================

-- Tắt kiểm tra khóa ngoại tạm thời
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

-- ============================================================
-- USERS (20 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Users] ON;

INSERT INTO [Users] ([user_id], [username], [email], [phone], [password_hash], [role], [status], [created_at], [updated_at]) VALUES
(1,  N'nguyen_van_an',    N'an.nguyen@gmail.com',       N'0901234567', N'$2b$12$xK9mLpQrVwNzYbTsHcDfEuJ1aG3kM5nP7qR8sT0uV2wX4yZ6A8bC', N'ADM', N'active', '2024-01-05 08:00:00', '2024-01-05 08:00:00'),
(2,  N'tran_thi_bich',    N'bich.tran@gmail.com',       N'0912345678', N'$2b$12$aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3A4bC5dE6fG7hI', N'USR', N'active', '2024-01-10 09:15:00', '2024-01-10 09:15:00'),
(3,  N'le_minh_cuong',    N'cuong.le@yahoo.com',        N'0923456789', N'$2b$12$hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4p', N'USR', N'active', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(4,  N'pham_ngoc_diem',   N'diem.pham@outlook.com',     N'0934567890', N'$2b$12$pQ3rS4tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5pQ6rS7tU8vW9x', N'USR', N'active', '2024-01-20 11:45:00', '2024-01-20 11:45:00'),
(5,  N'hoang_van_em',     N'em.hoang@gmail.com',        N'0945678901', N'$2b$12$zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3dE4fG5h', N'USR', N'active', '2024-02-01 08:00:00', '2024-02-01 08:00:00'),
(6,  N'vu_thi_phuong',    N'phuong.vu@gmail.com',       N'0956789012', N'$2b$12$I6jK7lM8nO9pQ0rS1tU2vW3xY4zA5bC6dE7fG8hI9jK0lM1nO2pQ', N'USR', N'active', '2024-02-05 09:00:00', '2024-02-05 09:00:00'),
(7,  N'do_quoc_hung',     N'hung.do@gmail.com',         N'0967890123', N'$2b$12$3rS4tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5pQ6rS7tU8vW9xY0', N'USR', N'active', '2024-02-10 10:00:00', '2024-02-10 10:00:00'),
(8,  N'nguyen_thu_ha',    N'ha.nguyen@gmail.com',       N'0978901234', N'$2b$12$zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7h', N'USR', N'active', '2024-02-15 11:00:00', '2024-02-15 11:00:00'),
(9,  N'tran_duc_kien',    N'kien.tran@hotmail.com',     N'0989012345', N'$2b$12$I8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ', N'USR', N'active', '2024-02-20 12:00:00', '2024-02-20 12:00:00'),
(10, N'bui_mai_lan',      N'lan.bui@gmail.com',         N'0990123456', N'$2b$12$5rS6tU7vW8xY9zA0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU0vW1xY2', N'USR', N'active', '2024-03-01 08:00:00', '2024-03-01 08:00:00'),
(11, N'ly_van_manh',      N'manh.ly@gmail.com',         N'0901122334', N'$2b$12$zA3bC4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5zA6bC7dE8fG9h', N'USR', N'active', '2024-03-05 09:00:00', '2024-03-05 09:00:00'),
(12, N'phan_thi_ngoc',    N'ngoc.phan@gmail.com',       N'0912233445', N'$2b$12$I0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ', N'USR', N'active', '2024-03-10 10:00:00', '2024-03-10 10:00:00'),
(13, N'cao_thi_oanh',     N'oanh.cao@yahoo.com',        N'0923344556', N'$2b$12$7rS8tU9vW0xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4', N'USR', N'active', '2024-03-15 11:00:00', '2024-03-15 11:00:00'),
(14, N'dinh_van_phuc',    N'phuc.dinh@gmail.com',       N'0934455667', N'$2b$12$zA5bC6dE7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE0fG1h', N'USR', N'locked', '2024-03-20 12:00:00', '2024-04-01 08:00:00'),
(15, N'vo_thi_quynh',     N'quynh.vo@gmail.com',        N'0945566778', N'$2b$12$I2jK3lM4nO5pQ6rS7tU8vW9xY0zA1bC2dE3fG4hI5jK6lM7nO8pQ', N'USR', N'active', '2024-04-01 08:00:00', '2024-04-01 08:00:00'),
(16, N'ngo_duc_son',      N'son.ngo@gmail.com',         N'0956677889', N'$2b$12$9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6', N'USR', N'active', '2024-04-05 09:00:00', '2024-04-05 09:00:00'),
(17, N'truong_thi_thu',   N'thu.truong@outlook.com',    N'0967788990', N'$2b$12$zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA0bC1dE2fG3h', N'USR', N'active', '2024-04-10 10:00:00', '2024-04-10 10:00:00'),
(18, N'dang_minh_uy',     N'uy.dang@gmail.com',         N'0978899001', N'$2b$12$I4jK5lM6nO7pQ8rS9tU0vW1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQ', N'USR', N'active', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
(19, N'ha_thi_van',       N'van.ha@gmail.com',          N'0989900112', N'$2b$12$1rS2tU3vW4xY5zA6bC7dE8fG9hI0jK1lM2nO3pQ4rS5tU6vW7xY8', N'USR', N'active', '2024-04-20 12:00:00', '2024-04-20 12:00:00'),
(20, N'luu_van_xuan',     N'xuan.luu@gmail.com',        N'0990011223', N'$2b$12$zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3dE4fG5h', N'ADM', N'active', '2024-01-01 07:00:00', '2024-01-01 07:00:00');

SET IDENTITY_INSERT [Users] OFF;
GO

-- ============================================================
-- AUTHORS (15 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Authors] ON;

INSERT INTO [Authors] ([author_id], [name], [biography], [avatar_url], [awards], [created_at]) VALUES
(1,  N'Nguyễn Nhật Ánh',   N'Nhà văn nổi tiếng người Việt Nam, chuyên viết về tuổi thơ và tình yêu. Sinh năm 1955 tại Quảng Nam. Ông là một trong những tác giả được yêu thích nhất Việt Nam với hàng triệu bản sách được bán ra.',                       N'https://cdn.bookstore.vn/authors/nguyen-nhat-anh.jpg',  N'Giải thưởng Hội Nhà văn Việt Nam 1995, Giải thưởng ASEAN 2010',                       '2024-01-01 00:00:00'),
(2,  N'Tô Hoài',            N'Nhà văn lớn của văn học Việt Nam hiện đại. Sinh năm 1920, mất năm 2014. Ông nổi tiếng với tác phẩm Dế Mèn Phiêu Lưu Ký và nhiều tác phẩm khác về cuộc sống nông thôn và thiên nhiên.',                                   N'https://cdn.bookstore.vn/authors/to-hoai.jpg',          N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật 1996',                                  '2024-01-01 00:00:00'),
(3,  N'Nam Cao',             N'Nhà văn hiện thực xuất sắc của văn học Việt Nam giai đoạn 1930-1945. Các tác phẩm của ông phản ánh sâu sắc cuộc sống người nông dân và trí thức nghèo trong xã hội cũ.',                                                N'https://cdn.bookstore.vn/authors/nam-cao.jpg',           N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật 1996 (truy tặng)',                      '2024-01-01 00:00:00'),
(4,  N'Yuval Noah Harari',  N'Nhà sử học, triết học và tác giả người Israel. Giáo sư tại Đại học Hebrew Jerusalem. Nổi tiếng toàn cầu với bộ ba tác phẩm Sapiens, Homo Deus và 21 Bài học cho thế kỷ 21.',                                            N'https://cdn.bookstore.vn/authors/yuval-harari.jpg',     N'Polonsky Prize 2009, Prix du meilleur livre étranger 2015',                            '2024-01-01 00:00:00'),
(5,  N'Dale Carnegie',      N'Nhà văn và diễn giả người Mỹ, chuyên gia hàng đầu về phát triển bản thân và kỹ năng giao tiếp. Sinh năm 1888, mất năm 1955. Tác phẩm của ông đã thay đổi cuộc đời hàng triệu người.',                                   N'https://cdn.bookstore.vn/authors/dale-carnegie.jpg',    N'Bestseller list New York Times nhiều thập kỷ',                                         '2024-01-01 00:00:00'),
(6,  N'Paulo Coelho',       N'Nhà văn người Brazil nổi tiếng thế giới. Sinh năm 1947. Tác phẩm của ông đã được dịch ra hơn 80 ngôn ngữ và bán hơn 225 triệu bản trên toàn cầu.',                                                                      N'https://cdn.bookstore.vn/authors/paulo-coelho.jpg',     N'Crystal Award (World Economic Forum) 1999, Chevalier de la Légion d''Honneur 2013',   '2024-01-01 00:00:00'),
(7,  N'Haruki Murakami',    N'Nhà văn Nhật Bản đương đại nổi tiếng. Sinh năm 1949. Tác phẩm của ông có phong cách hư thực đặc trưng, pha trộn giữa thực tại và tưởng tượng, được dịch ra hơn 50 ngôn ngữ.',                                           N'https://cdn.bookstore.vn/authors/haruki-murakami.jpg',  N'Franz Kafka Prize 2006, Jerusalem Prize 2009, Hans Christian Andersen Literature Award 2016', '2024-01-01 00:00:00'),
(8,  N'Robert T. Kiyosaki', N'Doanh nhân, tác giả và diễn giả người Mỹ gốc Nhật. Sinh năm 1947. Nổi tiếng với cuốn sách Cha Giàu Cha Nghèo - một trong những cuốn sách tài chính cá nhân bán chạy nhất mọi thời đại.',                                N'https://cdn.bookstore.vn/authors/robert-kiyosaki.jpg',  N'Bestseller #1 New York Times nhiều năm liền',                                          '2024-01-01 00:00:00'),
(9,  N'Vũ Trọng Phụng',    N'Nhà văn hiện thực phê phán xuất sắc của Việt Nam thế kỷ 20. Sinh năm 1912, mất năm 1939. Mặc dù sống ngắn ngủi nhưng ông để lại di sản văn học đồ sộ.',                                                                 N'https://cdn.bookstore.vn/authors/vu-trong-phung.jpg',   N'Được UNESCO vinh danh là Danh nhân văn hóa',                                           '2024-01-01 00:00:00'),
(10, N'Hồ Anh Thái',       N'Nhà văn và nhà ngoại giao Việt Nam đương đại. Sinh năm 1960. Tác phẩm của ông đã được dịch ra nhiều thứ tiếng và nhận được nhiều giải thưởng văn học trong và ngoài nước.',                                              N'https://cdn.bookstore.vn/authors/ho-anh-thai.jpg',      N'Giải thưởng Hội Nhà văn Hà Nội 2007, Giải thưởng Văn học ASEAN 2012',                '2024-01-01 00:00:00'),
(11, N'Stephen Hawking',    N'Nhà vật lý lý thuyết và vũ trụ học người Anh vĩ đại. Sinh năm 1942, mất năm 2018. Giáo sư tại Đại học Cambridge, nổi tiếng với các công trình về hố đen và vũ trụ học.',                                                N'https://cdn.bookstore.vn/authors/stephen-hawking.jpg',  N'Presidential Medal of Freedom 2009, Albert Einstein Award',                            '2024-01-01 00:00:00'),
(12, N'Ngô Tất Tố',        N'Nhà văn, nhà báo và học giả Hán học Việt Nam. Sinh năm 1893, mất năm 1954. Tác phẩm của ông phản ánh cuộc sống khổ cực của người nông dân Việt Nam thời thuộc địa.',                                                     N'https://cdn.bookstore.vn/authors/ngo-tat-to.jpg',       N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật (truy tặng)',                           '2024-01-01 00:00:00'),
(13, N'James Clear',        N'Tác giả, diễn giả và chuyên gia về thói quen và cải thiện bản thân người Mỹ. Cuốn sách Atomic Habits của ông đã bán hơn 15 triệu bản trên toàn cầu.',                                                                    N'https://cdn.bookstore.vn/authors/james-clear.jpg',      N'Bestseller #1 New York Times, Wall Street Journal, USA Today',                         '2024-01-01 00:00:00'),
(14, N'Nguyễn Du',          N'Đại thi hào dân tộc Việt Nam. Sinh năm 1766, mất năm 1820. Tác phẩm Truyện Kiều của ông được coi là đỉnh cao của văn học chữ Nôm và là di sản văn hóa vô giá của dân tộc.',                                             N'https://cdn.bookstore.vn/authors/nguyen-du.jpg',        N'UNESCO vinh danh là Danh nhân văn hóa thế giới năm 1965',                              '2024-01-01 00:00:00'),
(15, N'Malcolm Gladwell',   N'Nhà báo, tác giả và diễn giả người Canada-Anh. Sinh năm 1963. Nổi tiếng với khả năng kể chuyện hấp dẫn và phân tích sâu sắc các hiện tượng xã hội và tâm lý học.',                                                      N'https://cdn.bookstore.vn/authors/malcolm-gladwell.jpg', N'Time 100 Most Influential People 2005, Bestseller nhiều tuần liên tiếp',               '2024-01-01 00:00:00');

SET IDENTITY_INSERT [Authors] OFF;
GO

-- ============================================================
-- CATEGORIES (12 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Categories] ON;

INSERT INTO [Categories] ([category_id], [name], [description], [created_at]) VALUES
(1,  N'Văn học Việt Nam',       N'Các tác phẩm văn học của các tác giả Việt Nam, bao gồm tiểu thuyết, truyện ngắn, thơ và ký.',                                        '2024-01-01 00:00:00'),
(2,  N'Văn học nước ngoài',     N'Các tác phẩm văn học nổi tiếng của các tác giả nước ngoài đã được dịch sang tiếng Việt.',                                             '2024-01-01 00:00:00'),
(3,  N'Kỹ năng sống',           N'Sách hướng dẫn phát triển bản thân, kỹ năng giao tiếp, tư duy tích cực và các kỹ năng mềm cần thiết trong cuộc sống.',                '2024-01-01 00:00:00'),
(4,  N'Kinh tế - Tài chính',    N'Sách về kinh tế học, đầu tư tài chính, quản lý tiền bạc và khởi nghiệp kinh doanh.',                                                  '2024-01-01 00:00:00'),
(5,  N'Khoa học - Công nghệ',   N'Sách phổ biến khoa học, công nghệ thông tin, trí tuệ nhân tạo và các lĩnh vực STEM.',                                                 '2024-01-01 00:00:00'),
(6,  N'Lịch sử - Địa lý',       N'Sách nghiên cứu lịch sử, địa lý, văn hóa và các nền văn minh của nhân loại.',                                                         '2024-01-01 00:00:00'),
(7,  N'Thiếu nhi',              N'Sách dành cho trẻ em và thiếu niên, bao gồm truyện tranh, truyện cổ tích và sách giáo dục.',                                           '2024-01-01 00:00:00'),
(8,  N'Triết học - Tâm lý học', N'Sách về triết học phương Đông và phương Tây, tâm lý học ứng dụng và nghiên cứu hành vi con người.',                                    '2024-01-01 00:00:00'),
(9,  N'Tâm linh - Tôn giáo',    N'Sách về tín ngưỡng, tôn giáo, thiền định và tâm linh học.',                                                                            '2024-01-01 00:00:00'),
(10, N'Sức khỏe - Ẩm thực',     N'Sách hướng dẫn chăm sóc sức khỏe, dinh dưỡng, nấu ăn và lối sống lành mạnh.',                                                        '2024-01-01 00:00:00'),
(11, N'Hồi ký - Tiểu sử',       N'Hồi ký của các nhân vật nổi tiếng, tiểu sử và câu chuyện cuộc đời có thật.',                                                          '2024-01-01 00:00:00'),
(12, N'Giáo dục - Học thuật',   N'Sách giáo trình, tài liệu học tập và nghiên cứu học thuật ở các cấp độ khác nhau.',                                                    '2024-01-01 00:00:00');

SET IDENTITY_INSERT [Categories] OFF;
GO

-- ============================================================
-- BOOKS (30 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Books] ON;

INSERT INTO [Books] ([book_id], [title], [description], [price], [preview_percentage], [file_url], [cover_image], [author_id], [category_id], [publish_year], [created_at], [updated_at]) VALUES
(1,  N'Cho Tôi Xin Một Vé Đi Tuổi Thơ',       N'Cuốn sách đưa độc giả trở về tuổi thơ trong sáng với những trò chơi và kỷ niệm đẹp. Câu chuyện về bốn đứa trẻ: cu Mùi, Hải cò, con Tủi và con Tí sún sẽ khiến bạn bật cười và rơi nước mắt.',                   45000.00, 15, N'https://cdn.bookstore.vn/books/cho-toi-xin-mot-ve-di-tuoi-tho.pdf',     N'https://cdn.bookstore.vn/covers/cho-toi-xin-mot-ve.jpg',          1, 1,  2008, '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
(2,  N'Mắt Biếc',                              N'Câu chuyện tình yêu buồn đẹp giữa Ngạn và Hà Lan ở một làng quê Việt Nam. Tác phẩm gợi lên nỗi nhớ da diết về một mối tình đầu trong trẻo và tiếc nuối.',                                                         55000.00, 20, N'https://cdn.bookstore.vn/books/mat-biec.pdf',                         N'https://cdn.bookstore.vn/covers/mat-biec.jpg',                     1, 1,  1990, '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
(3,  N'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',       N'Câu chuyện cảm động về tình anh em giữa Thiều và Tường trong một ngôi làng nghèo miền Trung. Tác phẩm chứa đựng vẻ đẹp của tuổi thơ, gia đình và tình yêu quê hương.',                                             55000.00, 15, N'https://cdn.bookstore.vn/books/toi-thay-hoa-vang-tren-co-xanh.pdf',  N'https://cdn.bookstore.vn/covers/hoa-vang-co-xanh.jpg',            1, 1,  2010, '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
(4,  N'Dế Mèn Phiêu Lưu Ký',                  N'Tác phẩm văn học thiếu nhi kinh điển Việt Nam kể về cuộc phiêu lưu của chú dế Mèn cùng những người bạn. Qua đó tác giả gửi gắm những bài học quý giá về cuộc sống và tình bạn.',                                   35000.00, 25, N'https://cdn.bookstore.vn/books/de-men-phieu-luu-ky.pdf',             N'https://cdn.bookstore.vn/covers/de-men-phieu-luu-ky.jpg',         2, 7,  1941, '2024-01-11 00:00:00', '2024-01-11 00:00:00'),
(5,  N'Chí Phèo - Lão Hạc',                   N'Hai truyện ngắn xuất sắc nhất của Nam Cao. Chí Phèo - câu chuyện bi thảm về một người nông dân bị xã hội đẩy vào con đường tha hóa. Lão Hạc - tình phụ tử thiêng liêng và nhân cách cao đẹp.',                     38000.00, 30, N'https://cdn.bookstore.vn/books/chi-pheo-lao-hac.pdf',                N'https://cdn.bookstore.vn/covers/chi-pheo-lao-hac.jpg',            3, 1,  1941, '2024-01-11 00:00:00', '2024-01-11 00:00:00'),
(6,  N'Sapiens: Lược Sử Loài Người',           N'Cuốn sách kể lại toàn bộ lịch sử của loài người từ thời đồ đá đến thế kỷ 21 một cách hấp dẫn và đầy thuyết phục. Harari đặt ra những câu hỏi sâu sắc về bản chất của con người.',                                  89000.00, 20, N'https://cdn.bookstore.vn/books/sapiens.pdf',                          N'https://cdn.bookstore.vn/covers/sapiens.jpg',                      4, 6,  2011, '2024-01-12 00:00:00', '2024-01-12 00:00:00'),
(7,  N'Homo Deus: Lược Sử Tương Lai',          N'Harari khám phá những gì có thể xảy ra khi loài người đã chinh phục nạn đói, bệnh dịch và chiến tranh. Ông đặt câu hỏi về tương lai của nhân loại trong thời đại công nghệ.',                                      89000.00, 15, N'https://cdn.bookstore.vn/books/homo-deus.pdf',                        N'https://cdn.bookstore.vn/covers/homo-deus.jpg',                    4, 6,  2015, '2024-01-12 00:00:00', '2024-01-12 00:00:00'),
(8,  N'Đắc Nhân Tâm',                          N'Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật giao tiếp và ứng xử. Carnegie đưa ra những nguyên tắc vàng giúp bạn chinh phục lòng người và thành công trong cuộc sống.',                                      65000.00, 20, N'https://cdn.bookstore.vn/books/dac-nhan-tam.pdf',                    N'https://cdn.bookstore.vn/covers/dac-nhan-tam.jpg',                5, 3,  1936, '2024-01-13 00:00:00', '2024-01-13 00:00:00'),
(9,  N'Quẳng Gánh Lo Đi Và Vui Sống',         N'Dale Carnegie hướng dẫn cách thoát khỏi lo âu, phiền muộn và sống một cuộc đời ý nghĩa. Sách chia sẻ những phương pháp thực tế giúp bạn tìm lại niềm vui trong cuộc sống.',                                       65000.00, 20, N'https://cdn.bookstore.vn/books/quang-ganh-lo-di-va-vui-song.pdf',   N'https://cdn.bookstore.vn/covers/quang-ganh-lo-di.jpg',            5, 3,  1948, '2024-01-13 00:00:00', '2024-01-13 00:00:00'),
(10, N'Nhà Giả Kim',                           N'Kiệt tác của Paulo Coelho kể về hành trình của Santiago - chàng chăn cừu người Tây Ban Nha đi tìm kho báu và khám phá ra ý nghĩa thực sự của cuộc đời.',                                                           59000.00, 25, N'https://cdn.bookstore.vn/books/nha-gia-kim.pdf',                     N'https://cdn.bookstore.vn/covers/nha-gia-kim.jpg',                 6, 2,  1988, '2024-01-14 00:00:00', '2024-01-14 00:00:00'),
(11, N'Rừng Na Uy',                            N'Tiểu thuyết nổi tiếng nhất của Murakami về tình yêu, mất mát và trưởng thành. Câu chuyện của Toru Watanabe nhìn lại quãng thời gian sinh viên đầy biến động tại Tokyo thập niên 1960.',                             79000.00, 15, N'https://cdn.bookstore.vn/books/rung-na-uy.pdf',                      N'https://cdn.bookstore.vn/covers/rung-na-uy.jpg',                  7, 2,  1987, '2024-01-14 00:00:00', '2024-01-14 00:00:00'),
(12, N'Kafka Bên Bờ Biển',                     N'Một kiệt tác văn học với hai câu chuyện song song: cậu bé 15 tuổi bỏ nhà ra đi và ông lão mất trí nhớ Nakata. Murakami dệt nên một thế giới hư thực huyền bí và sâu sắc.',                                        85000.00, 15, N'https://cdn.bookstore.vn/books/kafka-ben-bo-bien.pdf',               N'https://cdn.bookstore.vn/covers/kafka-ben-bo-bien.jpg',           7, 2,  2002, '2024-01-14 00:00:00', '2024-01-14 00:00:00'),
(13, N'Cha Giàu Cha Nghèo',                    N'Cuốn sách tài chính cá nhân kinh điển giải thích sự khác biệt trong tư duy về tiền bạc giữa người giàu và người nghèo, hướng dẫn cách đạt được tự do tài chính.',                                                  75000.00, 20, N'https://cdn.bookstore.vn/books/cha-giau-cha-ngheo.pdf',              N'https://cdn.bookstore.vn/covers/cha-giau-cha-ngheo.jpg',          8, 4,  1997, '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
(14, N'Số Đỏ',                                 N'Tiểu thuyết trào phúng xuất sắc của Vũ Trọng Phụng phê phán xã hội thực dân phong kiến Việt Nam. Nhân vật Xuân Tóc Đỏ với cuộc đời lên voi xuống chó là biểu tượng cho sự tha hóa đạo đức.',                      42000.00, 30, N'https://cdn.bookstore.vn/books/so-do.pdf',                           N'https://cdn.bookstore.vn/covers/so-do.jpg',                       9, 1,  1936, '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
(15, N'Tắt Đèn',                               N'Tiểu thuyết của Ngô Tất Tố miêu tả cuộc sống khốn khổ của người nông dân Việt Nam dưới ách thực dân phong kiến qua hình tượng chị Dậu - người phụ nữ đẹp người đẹp nết nhưng số phận bi thảm.',                    38000.00, 30, N'https://cdn.bookstore.vn/books/tat-den.pdf',                          N'https://cdn.bookstore.vn/covers/tat-den.jpg',                     12, 1, 1939, '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
(16, N'Lược Sử Thời Gian',                     N'Stephen Hawking giải thích những khái niệm khoa học phức tạp về vũ trụ, thời gian và không gian theo cách dễ hiểu nhất. Cuốn sách đã thay đổi cách nhân loại nhìn nhận về vũ trụ.',                                  79000.00, 20, N'https://cdn.bookstore.vn/books/luoc-su-thoi-gian.pdf',               N'https://cdn.bookstore.vn/covers/luoc-su-thoi-gian.jpg',           11, 5, 1988, '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
(17, N'Atomic Habits',                         N'James Clear chia sẻ phương pháp khoa học để xây dựng thói quen tốt và loại bỏ thói quen xấu. Cuốn sách cung cấp framework thực tế giúp bạn cải thiện 1% mỗi ngày.',                                                 85000.00, 20, N'https://cdn.bookstore.vn/books/atomic-habits.pdf',                   N'https://cdn.bookstore.vn/covers/atomic-habits.jpg',               13, 3, 2018, '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
(18, N'Điểm Bùng Phát',                        N'Malcolm Gladwell phân tích cách những ý tưởng, sản phẩm và thông điệp lan rộng như dịch bệnh xã hội. Ông chỉ ra ba yếu tố then chốt tạo nên sự lan truyền và thành công.',                                          75000.00, 20, N'https://cdn.bookstore.vn/books/diem-bung-phat.pdf',                  N'https://cdn.bookstore.vn/covers/diem-bung-phat.jpg',              15, 8, 2000, '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
(19, N'Truyện Kiều',                           N'Kiệt tác của đại thi hào Nguyễn Du - tác phẩm văn học chữ Nôm đặc sắc nhất Việt Nam. Câu chuyện về cuộc đời đầy sóng gió của Thúy Kiều là bức tranh toàn cảnh về số phận người phụ nữ trong xã hội phong kiến.',    35000.00, 40, N'https://cdn.bookstore.vn/books/truyen-kieu.pdf',                     N'https://cdn.bookstore.vn/covers/truyen-kieu.jpg',                 14, 1, 1820, '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
(20, N'Cô Đơn Trên Mạng',                      N'Tiểu thuyết đương đại của nhà văn Ba Lan Janusz Wiśniewski về tình yêu và sự cô đơn trong thế giới internet. Câu chuyện về cuộc gặp gỡ qua mạng giữa hai tâm hồn cô đơn.',                                          65000.00, 15, N'https://cdn.bookstore.vn/books/co-don-tren-mang.pdf',                N'https://cdn.bookstore.vn/covers/co-don-tren-mang.jpg',            6, 2,  2001, '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
(21, N'Người Giàu Nhất Thành Babylon',         N'Cuốn sách kinh điển về tài chính cá nhân được kể qua những câu chuyện của người Babylon cổ đại. George Clason truyền đạt những bài học về tiết kiệm, đầu tư và làm giàu một cách thú vị.',                          55000.00, 20, N'https://cdn.bookstore.vn/books/nguoi-giau-nhat-thanh-babylon.pdf',   N'https://cdn.bookstore.vn/covers/nguoi-giau-nhat.jpg',             8, 4,  1926, '2024-01-19 00:00:00', '2024-01-19 00:00:00'),
(22, N'Bố Già',                                N'Kiệt tác của Mario Puzo về gia tộc mafia Corleone - một trong những tiểu thuyết nổi tiếng nhất thế kỷ 20. Câu chuyện về quyền lực, lòng trung thành, gia đình và sự tàn nhẫn.',                                      79000.00, 15, N'https://cdn.bookstore.vn/books/bo-gia.pdf',                          N'https://cdn.bookstore.vn/covers/bo-gia.jpg',                      6, 2,  1969, '2024-01-19 00:00:00', '2024-01-19 00:00:00'),
(23, N'Tuổi Trẻ Đáng Giá Bao Nhiêu',          N'Cuốn sách truyền cảm hứng của Rosie Nguyễn dành cho giới trẻ Việt Nam. Tác giả chia sẻ những bài học quý giá về lựa chọn, trưởng thành và xây dựng cuộc sống có ý nghĩa.',                                         69000.00, 20, N'https://cdn.bookstore.vn/books/tuoi-tre-dang-gia-bao-nhieu.pdf',     N'https://cdn.bookstore.vn/covers/tuoi-tre-dang-gia.jpg',           10, 3, 2016, '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
(24, N'Thinking Fast and Slow',                N'Daniel Kahneman - nhà tâm lý học đoạt giải Nobel - khám phá hai hệ thống tư duy của não bộ: hệ thống nhanh (trực giác) và hệ thống chậm (lý trí) ảnh hưởng đến mọi quyết định của chúng ta.',                       95000.00, 15, N'https://cdn.bookstore.vn/books/thinking-fast-and-slow.pdf',          N'https://cdn.bookstore.vn/covers/thinking-fast-slow.jpg',          15, 8, 2011, '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
(25, N'Tội Ác Và Hình Phạt',                   N'Kiệt tác của Dostoevsky về cuộc đấu tranh tâm lý của Raskolnikov sau khi thực hiện tội ác. Tác phẩm đặt ra những câu hỏi sâu sắc về đạo đức, tội lỗi và sự chuộc lỗi.',                                           85000.00, 20, N'https://cdn.bookstore.vn/books/toi-ac-va-hinh-phat.pdf',             N'https://cdn.bookstore.vn/covers/toi-ac-hinh-phat.jpg',            6, 2,  1866, '2024-01-21 00:00:00', '2024-01-21 00:00:00'),
(26, N'Đừng Bao Giờ Đi Ăn Một Mình',          N'Keith Ferrazzi chia sẻ nghệ thuật xây dựng mối quan hệ và kết nối con người. Cuốn sách hướng dẫn cách tạo dựng network thực sự có giá trị và bền vững.',                                                           69000.00, 20, N'https://cdn.bookstore.vn/books/dung-bao-gio-di-an-mot-minh.pdf',    N'https://cdn.bookstore.vn/covers/dung-bao-gio-di-an.jpg',          5, 3,  2005, '2024-01-21 00:00:00', '2024-01-21 00:00:00'),
(27, N'Vũ Trụ Trong Vỏ Hạt Dẻ',               N'Stephen Hawking tiếp tục hành trình khám phá vũ trụ với những lý thuyết mới nhất về không-thời gian, siêu dây, hố đen và hành trình thời gian được trình bày sinh động với nhiều hình ảnh minh họa.',                85000.00, 15, N'https://cdn.bookstore.vn/books/vu-tru-trong-vo-hat-de.pdf',         N'https://cdn.bookstore.vn/covers/vu-tru-vo-hat-de.jpg',            11, 5, 2001, '2024-01-22 00:00:00', '2024-01-22 00:00:00'),
(28, N'Outliers: Những Kẻ Xuất Chúng',         N'Malcolm Gladwell phân tích những yếu tố thực sự đằng sau thành công của các thiên tài và những người xuất chúng. Ông thách thức quan niệm thông thường về tài năng và nỗ lực cá nhân.',                             75000.00, 20, N'https://cdn.bookstore.vn/books/outliers.pdf',                        N'https://cdn.bookstore.vn/covers/outliers.jpg',                    15, 8, 2008, '2024-01-22 00:00:00', '2024-01-22 00:00:00'),
(29, N'Hành Trình Về Phương Đông',             N'Tác phẩm của Nguyên Phong kể về hành trình của các nhà khoa học phương Tây đến Ấn Độ và khám phá những bí ẩn của triết học, tâm linh và khoa học phương Đông.',                                                    59000.00, 20, N'https://cdn.bookstore.vn/books/hanh-trinh-ve-phuong-dong.pdf',      N'https://cdn.bookstore.vn/covers/hanh-trinh-phuong-dong.jpg',      10, 9, 1997, '2024-01-23 00:00:00', '2024-01-23 00:00:00'),
(30, N'Bí Quyết Tư Duy Triệu Phú',            N'T. Harv Eker chia sẻ 17 cách tư duy khác biệt giữa người giàu và người nghèo. Cuốn sách giúp bạn nhận ra và thay đổi những niềm tin hạn chế về tiền bạc và thành công.',                                          69000.00, 20, N'https://cdn.bookstore.vn/books/bi-quyet-tu-duy-trieu-phu.pdf',      N'https://cdn.bookstore.vn/covers/bi-quyet-tu-duy.jpg',             8, 4,  2005, '2024-01-23 00:00:00', '2024-01-23 00:00:00');

SET IDENTITY_INSERT [Books] OFF;
GO

-- ============================================================
-- CHAPTERS (60 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Chapters] ON;

INSERT INTO [Chapters] ([chapter_id], [book_id], [chapter_number], [chapter_title], [url], [created_at]) VALUES
-- Book 1
(1,  1, 1, N'Chương 1: Thế giới của những đứa trẻ',             N'https://cdn.bookstore.vn/chapters/1/1.html',  '2024-01-10 00:00:00'),
(2,  1, 2, N'Chương 2: Trò chơi dưới ánh mặt trời',            N'https://cdn.bookstore.vn/chapters/1/2.html',  '2024-01-10 00:00:00'),
(3,  1, 3, N'Chương 3: Những giấc mơ trong vắt',                N'https://cdn.bookstore.vn/chapters/1/3.html',  '2024-01-10 00:00:00'),
(4,  1, 4, N'Chương 4: Bí mật của cu Mùi',                     N'https://cdn.bookstore.vn/chapters/1/4.html',  '2024-01-10 00:00:00'),
-- Book 2
(5,  2, 1, N'Chương 1: Đôi mắt ấy',                            N'https://cdn.bookstore.vn/chapters/2/1.html',  '2024-01-10 00:00:00'),
(6,  2, 2, N'Chương 2: Mùa hè đầu tiên',                       N'https://cdn.bookstore.vn/chapters/2/2.html',  '2024-01-10 00:00:00'),
(7,  2, 3, N'Chương 3: Hà Lan của tôi',                        N'https://cdn.bookstore.vn/chapters/2/3.html',  '2024-01-10 00:00:00'),
(8,  2, 4, N'Chương 4: Chia xa',                                N'https://cdn.bookstore.vn/chapters/2/4.html',  '2024-01-10 00:00:00'),
(9,  2, 5, N'Chương 5: Trở về',                                 N'https://cdn.bookstore.vn/chapters/2/5.html',  '2024-01-10 00:00:00'),
-- Book 3
(10, 3, 1, N'Chương 1: Làng tôi',                               N'https://cdn.bookstore.vn/chapters/3/1.html',  '2024-01-10 00:00:00'),
(11, 3, 2, N'Chương 2: Hai anh em',                             N'https://cdn.bookstore.vn/chapters/3/2.html',  '2024-01-10 00:00:00'),
(12, 3, 3, N'Chương 3: Mùa hoa vàng',                          N'https://cdn.bookstore.vn/chapters/3/3.html',  '2024-01-10 00:00:00'),
-- Book 4
(13, 4, 1, N'Phần 1: Dế Mèn và Dế Choắt',                     N'https://cdn.bookstore.vn/chapters/4/1.html',  '2024-01-11 00:00:00'),
(14, 4, 2, N'Phần 2: Cuộc phiêu lưu đầu tiên',                 N'https://cdn.bookstore.vn/chapters/4/2.html',  '2024-01-11 00:00:00'),
(15, 4, 3, N'Phần 3: Vương quốc kiến',                         N'https://cdn.bookstore.vn/chapters/4/3.html',  '2024-01-11 00:00:00'),
-- Book 5
(16, 5, 1, N'Chí Phèo - Phần 1',                               N'https://cdn.bookstore.vn/chapters/5/1.html',  '2024-01-11 00:00:00'),
(17, 5, 2, N'Chí Phèo - Phần 2',                               N'https://cdn.bookstore.vn/chapters/5/2.html',  '2024-01-11 00:00:00'),
(18, 5, 3, N'Lão Hạc',                                         N'https://cdn.bookstore.vn/chapters/5/3.html',  '2024-01-11 00:00:00'),
-- Book 6
(19, 6, 1, N'Phần I: Cuộc cách mạng nhận thức',                N'https://cdn.bookstore.vn/chapters/6/1.html',  '2024-01-12 00:00:00'),
(20, 6, 2, N'Phần II: Cuộc cách mạng nông nghiệp',             N'https://cdn.bookstore.vn/chapters/6/2.html',  '2024-01-12 00:00:00'),
(21, 6, 3, N'Phần III: Sự thống nhất của loài người',          N'https://cdn.bookstore.vn/chapters/6/3.html',  '2024-01-12 00:00:00'),
(22, 6, 4, N'Phần IV: Cuộc cách mạng khoa học',                N'https://cdn.bookstore.vn/chapters/6/4.html',  '2024-01-12 00:00:00'),
-- Book 7
(23, 7, 1, N'Phần I: Homo Sapiens chinh phục thế giới',        N'https://cdn.bookstore.vn/chapters/7/1.html',  '2024-01-12 00:00:00'),
(24, 7, 2, N'Phần II: Homo Sapiens trao ý nghĩa cho thế giới', N'https://cdn.bookstore.vn/chapters/7/2.html',  '2024-01-12 00:00:00'),
(25, 7, 3, N'Phần III: Homo Sapiens mất kiểm soát',            N'https://cdn.bookstore.vn/chapters/7/3.html',  '2024-01-12 00:00:00'),
-- Book 8
(26, 8, 1, N'Phần 1: Các kỹ thuật cơ bản',                    N'https://cdn.bookstore.vn/chapters/8/1.html',  '2024-01-13 00:00:00'),
(27, 8, 2, N'Phần 2: Sáu cách tạo thiện cảm',                  N'https://cdn.bookstore.vn/chapters/8/2.html',  '2024-01-13 00:00:00'),
(28, 8, 3, N'Phần 3: Làm người khác thay đổi suy nghĩ',        N'https://cdn.bookstore.vn/chapters/8/3.html',  '2024-01-13 00:00:00'),
(29, 8, 4, N'Phần 4: Làm thủ lĩnh',                            N'https://cdn.bookstore.vn/chapters/8/4.html',  '2024-01-13 00:00:00'),
-- Book 10
(30, 10,1, N'Phần 1: Chàng chăn cừu',                          N'https://cdn.bookstore.vn/chapters/10/1.html', '2024-01-14 00:00:00'),
(31, 10,2, N'Phần 2: Hành trình đến Ai Cập',                   N'https://cdn.bookstore.vn/chapters/10/2.html', '2024-01-14 00:00:00'),
(32, 10,3, N'Phần 3: Kho báu thực sự',                         N'https://cdn.bookstore.vn/chapters/10/3.html', '2024-01-14 00:00:00'),
-- Book 11
(33, 11,1, N'Chương 1',                                         N'https://cdn.bookstore.vn/chapters/11/1.html', '2024-01-14 00:00:00'),
(34, 11,2, N'Chương 2',                                         N'https://cdn.bookstore.vn/chapters/11/2.html', '2024-01-14 00:00:00'),
(35, 11,3, N'Chương 3',                                         N'https://cdn.bookstore.vn/chapters/11/3.html', '2024-01-14 00:00:00'),
-- Book 13
(36, 13,1, N'Chương 1: Người cha giàu dạy tôi',                N'https://cdn.bookstore.vn/chapters/13/1.html', '2024-01-15 00:00:00'),
(37, 13,2, N'Chương 2: Tại sao người giàu ngày càng giàu hơn', N'https://cdn.bookstore.vn/chapters/13/2.html', '2024-01-15 00:00:00'),
(38, 13,3, N'Chương 3: Hãy tự lo cho bản thân',                N'https://cdn.bookstore.vn/chapters/13/3.html', '2024-01-15 00:00:00'),
(39, 13,4, N'Chương 4: Lịch sử thuế và tập đoàn',              N'https://cdn.bookstore.vn/chapters/13/4.html', '2024-01-15 00:00:00'),
-- Book 17
(40, 17,1, N'Phần 1: Nền tảng - Tại sao thói quen nhỏ tạo sự khác biệt lớn', N'https://cdn.bookstore.vn/chapters/17/1.html', '2024-01-17 00:00:00'),
(41, 17,2, N'Phần 2: Làm thói quen hiển nhiên',                N'https://cdn.bookstore.vn/chapters/17/2.html', '2024-01-17 00:00:00'),
(42, 17,3, N'Phần 3: Làm thói quen hấp dẫn',                   N'https://cdn.bookstore.vn/chapters/17/3.html', '2024-01-17 00:00:00'),
(43, 17,4, N'Phần 4: Làm thói quen dễ dàng',                   N'https://cdn.bookstore.vn/chapters/17/4.html', '2024-01-17 00:00:00'),
(44, 17,5, N'Phần 5: Làm thói quen thỏa mãn',                  N'https://cdn.bookstore.vn/chapters/17/5.html', '2024-01-17 00:00:00'),
-- Book 19
(45, 19,1, N'Phần 1: Gặp gỡ và đính ước',                      N'https://cdn.bookstore.vn/chapters/19/1.html', '2024-01-18 00:00:00'),
(46, 19,2, N'Phần 2: Gia biến và lưu lạc',                     N'https://cdn.bookstore.vn/chapters/19/2.html', '2024-01-18 00:00:00'),
(47, 19,3, N'Phần 3: Đoàn tụ',                                 N'https://cdn.bookstore.vn/chapters/19/3.html', '2024-01-18 00:00:00'),
-- Book 24
(48, 24,1, N'Phần 1: Hệ thống 1 và Hệ thống 2',                N'https://cdn.bookstore.vn/chapters/24/1.html', '2024-01-20 00:00:00'),
(49, 24,2, N'Phần 2: Heuristics và Bias',                      N'https://cdn.bookstore.vn/chapters/24/2.html', '2024-01-20 00:00:00'),
(50, 24,3, N'Phần 3: Sự tự tin thái quá',                      N'https://cdn.bookstore.vn/chapters/24/3.html', '2024-01-20 00:00:00'),
-- Book 28
(51, 28,1, N'Phần 1: Cơ hội',                                  N'https://cdn.bookstore.vn/chapters/28/1.html', '2024-01-22 00:00:00'),
(52, 28,2, N'Phần 2: Di sản',                                  N'https://cdn.bookstore.vn/chapters/28/2.html', '2024-01-22 00:00:00'),
-- Book 29
(53, 29,1, N'Chương 1: Khởi hành',                             N'https://cdn.bookstore.vn/chapters/29/1.html', '2024-01-23 00:00:00'),
(54, 29,2, N'Chương 2: Ấn Độ huyền bí',                        N'https://cdn.bookstore.vn/chapters/29/2.html', '2024-01-23 00:00:00'),
(55, 29,3, N'Chương 3: Những bí ẩn được giải mã',              N'https://cdn.bookstore.vn/chapters/29/3.html', '2024-01-23 00:00:00'),
-- Book 9
(56, 9, 1, N'Phần 1: Những điều cơ bản về lo lắng',            N'https://cdn.bookstore.vn/chapters/9/1.html',  '2024-01-13 00:00:00'),
(57, 9, 2, N'Phần 2: Phân tích và giải quyết lo âu',           N'https://cdn.bookstore.vn/chapters/9/2.html',  '2024-01-13 00:00:00'),
(58, 9, 3, N'Phần 3: Chiến thắng lo lắng và lo âu',            N'https://cdn.bookstore.vn/chapters/9/3.html',  '2024-01-13 00:00:00'),
-- Book 16
(59, 16,1, N'Chương 1: Bức tranh về vũ trụ',                   N'https://cdn.bookstore.vn/chapters/16/1.html', '2024-01-16 00:00:00'),
(60, 16,2, N'Chương 2: Không gian và thời gian',                N'https://cdn.bookstore.vn/chapters/16/2.html', '2024-01-16 00:00:00');

SET IDENTITY_INSERT [Chapters] OFF;
GO

-- ============================================================
-- ORDERS (40 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Orders] ON;

INSERT INTO [Orders] ([order_id], [user_id], [book_id], [price], [status], [created_at]) VALUES
(1,  2,  1,  45000.00, N'paid',      '2024-02-01 09:15:00'),
(2,  2,  8,  65000.00, N'paid',      '2024-02-01 09:20:00'),
(3,  3,  6,  89000.00, N'paid',      '2024-02-03 10:30:00'),
(4,  3,  10, 59000.00, N'paid',      '2024-02-03 10:35:00'),
(5,  4,  13, 75000.00, N'paid',      '2024-02-05 11:00:00'),
(6,  4,  17, 85000.00, N'paid',      '2024-02-05 11:05:00'),
(7,  5,  11, 79000.00, N'paid',      '2024-02-07 08:45:00'),
(8,  5,  2,  55000.00, N'paid',      '2024-02-07 08:50:00'),
(9,  6,  3,  55000.00, N'paid',      '2024-02-10 14:00:00'),
(10, 6,  19, 35000.00, N'paid',      '2024-02-10 14:05:00'),
(11, 7,  24, 95000.00, N'paid',      '2024-02-12 16:30:00'),
(12, 7,  18, 75000.00, N'paid',      '2024-02-12 16:35:00'),
(13, 8,  28, 75000.00, N'paid',      '2024-02-15 09:00:00'),
(14, 8,  6,  89000.00, N'paid',      '2024-02-15 09:05:00'),
(15, 9,  1,  45000.00, N'paid',      '2024-02-18 11:00:00'),
(16, 9,  5,  38000.00, N'paid',      '2024-02-18 11:05:00'),
(17, 10, 29, 59000.00, N'paid',      '2024-02-20 13:00:00'),
(18, 10, 9,  65000.00, N'paid',      '2024-02-20 13:05:00'),
(19, 11, 12, 85000.00, N'paid',      '2024-02-22 10:00:00'),
(20, 11, 7,  89000.00, N'paid',      '2024-02-22 10:05:00'),
(21, 12, 30, 69000.00, N'paid',      '2024-02-25 15:00:00'),
(22, 12, 13, 75000.00, N'paid',      '2024-02-25 15:05:00'),
(23, 13, 22, 79000.00, N'paid',      '2024-03-01 09:00:00'),
(24, 13, 25, 85000.00, N'paid',      '2024-03-01 09:05:00'),
(25, 14, 16, 79000.00, N'cancelled', '2024-03-03 10:00:00'),
(26, 15, 23, 69000.00, N'paid',      '2024-03-05 11:00:00'),
(27, 15, 3,  55000.00, N'paid',      '2024-03-05 11:05:00'),
(28, 16, 27, 85000.00, N'paid',      '2024-03-08 14:00:00'),
(29, 16, 20, 65000.00, N'paid',      '2024-03-08 14:05:00'),
(30, 17, 4,  35000.00, N'paid',      '2024-03-10 09:00:00'),
(31, 17, 14, 42000.00, N'paid',      '2024-03-10 09:05:00'),
(32, 18, 8,  65000.00, N'paid',      '2024-03-12 16:00:00'),
(33, 18, 17, 85000.00, N'paid',      '2024-03-12 16:05:00'),
(34, 19, 21, 55000.00, N'paid',      '2024-03-15 10:00:00'),
(35, 19, 15, 38000.00, N'paid',      '2024-03-15 10:05:00'),
(36, 2,  11, 79000.00, N'pending',   '2024-04-01 09:00:00'),
(37, 3,  30, 69000.00, N'pending',   '2024-04-02 10:00:00'),
(38, 5,  26, 69000.00, N'paid',      '2024-04-03 11:00:00'),
(39, 8,  24, 95000.00, N'paid',      '2024-04-05 13:00:00'),
(40, 10, 17, 85000.00, N'cancelled', '2024-04-06 15:00:00');

SET IDENTITY_INSERT [Orders] OFF;
GO

-- ============================================================
-- PAYMENTS (35 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Payments] ON;

INSERT INTO [Payments] ([payment_id], [order_id], [payment_method], [qr_code], [status], [created_at]) VALUES
(1,  1,  N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-1.png',  N'success', '2024-02-01 09:16:00'),
(2,  2,  N'MoMo',         N'https://cdn.bookstore.vn/qr/order-2.png',  N'success', '2024-02-01 09:21:00'),
(3,  3,  N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-3.png',  N'success', '2024-02-03 10:31:00'),
(4,  4,  N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-4.png',  N'success', '2024-02-03 10:36:00'),
(5,  5,  N'MoMo',         N'https://cdn.bookstore.vn/qr/order-5.png',  N'success', '2024-02-05 11:01:00'),
(6,  6,  N'Thẻ tín dụng', N'https://cdn.bookstore.vn/qr/order-6.png',  N'success', '2024-02-05 11:06:00'),
(7,  7,  N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-7.png',  N'success', '2024-02-07 08:46:00'),
(8,  8,  N'MoMo',         N'https://cdn.bookstore.vn/qr/order-8.png',  N'success', '2024-02-07 08:51:00'),
(9,  9,  N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-9.png',  N'success', '2024-02-10 14:01:00'),
(10, 10, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-10.png', N'success', '2024-02-10 14:06:00'),
(11, 11, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-11.png', N'success', '2024-02-12 16:31:00'),
(12, 12, N'Thẻ tín dụng', N'https://cdn.bookstore.vn/qr/order-12.png', N'success', '2024-02-12 16:36:00'),
(13, 13, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-13.png', N'success', '2024-02-15 09:01:00'),
(14, 14, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-14.png', N'success', '2024-02-15 09:06:00'),
(15, 15, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-15.png', N'success', '2024-02-18 11:01:00'),
(16, 16, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-16.png', N'success', '2024-02-18 11:06:00'),
(17, 17, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-17.png', N'success', '2024-02-20 13:01:00'),
(18, 18, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-18.png', N'success', '2024-02-20 13:06:00'),
(19, 19, N'Thẻ tín dụng', N'https://cdn.bookstore.vn/qr/order-19.png', N'success', '2024-02-22 10:01:00'),
(20, 20, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-20.png', N'success', '2024-02-22 10:06:00'),
(21, 21, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-21.png', N'success', '2024-02-25 15:01:00'),
(22, 22, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-22.png', N'success', '2024-02-25 15:06:00'),
(23, 23, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-23.png', N'success', '2024-03-01 09:01:00'),
(24, 24, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-24.png', N'success', '2024-03-01 09:06:00'),
(25, 25, N'Thẻ tín dụng', N'https://cdn.bookstore.vn/qr/order-25.png', N'failed',  '2024-03-03 10:01:00'),
(26, 26, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-26.png', N'success', '2024-03-05 11:01:00'),
(27, 27, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-27.png', N'success', '2024-03-05 11:06:00'),
(28, 28, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-28.png', N'success', '2024-03-08 14:01:00'),
(29, 29, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-29.png', N'success', '2024-03-08 14:06:00'),
(30, 30, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-30.png', N'success', '2024-03-10 09:01:00'),
(31, 31, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-31.png', N'success', '2024-03-10 09:06:00'),
(32, 32, N'Thẻ tín dụng', N'https://cdn.bookstore.vn/qr/order-32.png', N'success', '2024-03-12 16:01:00'),
(33, 33, N'VNPAY',        N'https://cdn.bookstore.vn/qr/order-33.png', N'success', '2024-03-12 16:06:00'),
(34, 38, N'MoMo',         N'https://cdn.bookstore.vn/qr/order-38.png', N'success', '2024-04-03 11:01:00'),
(35, 39, N'ZaloPay',      N'https://cdn.bookstore.vn/qr/order-39.png', N'success', '2024-04-05 13:01:00');

SET IDENTITY_INSERT [Payments] OFF;
GO

-- ============================================================
-- REVIEWS (50 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Reviews] ON;

INSERT INTO [Reviews] ([review_id], [user_id], [book_id], [rating], [comment], [status], [created_at]) VALUES
(1,  2,  1,  5, N'Cuốn sách tuyệt vời! Nguyễn Nhật Ánh đã đưa tôi trở về tuổi thơ trong sáng. Mỗi trang sách là một kỷ niệm đẹp đẽ không thể quên.',                                             N'visible', '2024-02-05 10:00:00'),
(2,  9,  1,  5, N'Đọc mà cứ thấy mình trong đó. Văn phong nhẹ nhàng, hồn nhiên. Rất hay!',                                                                                                         N'visible', '2024-02-22 12:00:00'),
(3,  2,  8,  5, N'Đắc nhân tâm - cuốn sách thay đổi cách tôi giao tiếp với mọi người. Mỗi nguyên tắc đều thực tế và có thể áp dụng ngay.',                                                       N'visible', '2024-02-05 10:30:00'),
(4,  18, 8,  4, N'Sách hay nhưng một số phần hơi lỗi thời so với xã hội hiện đại. Tuy nhiên các nguyên tắc cốt lõi vẫn rất giá trị.',                                                            N'visible', '2024-03-15 11:00:00'),
(5,  3,  6,  5, N'Sapiens là cuốn sách làm thay đổi thế giới quan của tôi. Harari viết rất hay, dễ hiểu dù nội dung rất sâu. Bắt buộc phải đọc!',                                                N'visible', '2024-02-08 09:00:00'),
(6,  8,  6,  5, N'Tuyệt tác! Lần đầu tiên tôi đọc một cuốn sách lịch sử mà không thể dừng lại. Rất đáng tiền.',                                                                                   N'visible', '2024-02-18 10:00:00'),
(7,  3,  10, 4, N'Nhà Giả Kim - câu chuyện đẹp về hành trình tìm kiếm bản thân. Văn phong thơ mộng, triết lý sâu sắc. Đọc đi đọc lại vẫn thấy hay.',                                             N'visible', '2024-02-08 09:30:00'),
(8,  4,  13, 5, N'Cha Giàu Cha Nghèo đã thay đổi hoàn toàn tư duy về tài chính của tôi. Nên đọc sớm để thay đổi cuộc sống.',                                                                      N'visible', '2024-02-10 11:00:00'),
(9,  12, 13, 5, N'Cuốn sách tài chính tốt nhất tôi từng đọc. Kiyosaki giải thích rõ ràng sự khác biệt trong tư duy của người giàu và người nghèo.',                                               N'visible', '2024-02-28 14:00:00'),
(10, 5,  11, 5, N'Rừng Na Uy - tuyệt phẩm của Murakami! Buồn, đẹp và ám ảnh. Đọc xong cứ nghĩ mãi.',                                                                                              N'visible', '2024-02-12 08:00:00'),
(11, 5,  2,  5, N'Mắt Biếc làm tôi khóc. Một mối tình đẹp nhưng đau đến thế. NNA thật sự là bậc thầy về cảm xúc.',                                                                                N'visible', '2024-02-12 08:30:00'),
(12, 6,  3,  5, N'Tôi Thấy Hoa Vàng Trên Cỏ Xanh - vừa xem phim vừa đọc sách, cả hai đều tuyệt. Sách chi tiết và cảm xúc hơn.',                                                                  N'visible', '2024-02-14 09:00:00'),
(13, 6,  19, 4, N'Truyện Kiều - di sản vô giá của văn học Việt Nam. Đọc với bản dịch chú thích rất giúp ích.',                                                                                      N'visible', '2024-02-14 09:30:00'),
(14, 7,  24, 5, N'Thinking Fast and Slow - cuốn sách khoa học tâm lý hay nhất tôi đọc. Giải thích rõ tại sao chúng ta lại ra quyết định sai.',                                                     N'visible', '2024-02-16 10:00:00'),
(15, 7,  18, 4, N'Điểm Bùng Phát - phân tích thú vị về cách ý tưởng lan truyền. Gladwell luôn kể chuyện rất hấp dẫn.',                                                                            N'visible', '2024-02-16 10:30:00'),
(16, 8,  28, 5, N'Outliers thực sự mở mắt tôi về nguồn gốc của thành công. 10,000 giờ luyện tập và cơ hội - đó là tất cả.',                                                                       N'visible', '2024-02-18 10:30:00'),
(17, 9,  5,  5, N'Chí Phèo là một trong những truyện ngắn hay nhất Việt Nam. Nam Cao viết về số phận con người đau xót và thấm thía.',                                                             N'visible', '2024-02-22 12:30:00'),
(18, 10, 29, 5, N'Hành Trình Về Phương Đông - cuốn sách mở ra một thế giới mới. Đọc và ngẫm nghĩ rất nhiều về khoa học và tâm linh.',                                                             N'visible', '2024-02-24 13:00:00'),
(19, 10, 9,  4, N'Quẳng Gánh Lo Đi - thực tế và hữu ích. Nhiều bài tập và ví dụ cụ thể giúp tôi bớt lo âu trong cuộc sống.',                                                                      N'visible', '2024-02-24 13:30:00'),
(20, 11, 12, 5, N'Kafka Bên Bờ Biển - kỳ lạ, huyền ảo và sâu sắc. Murakami ở đỉnh cao phong độ. Đọc cần kiên nhẫn nhưng rất xứng đáng.',                                                         N'visible', '2024-02-26 14:00:00'),
(21, 11, 7,  4, N'Homo Deus - cái nhìn đáng lo ngại nhưng cần thiết về tương lai nhân loại. Harari đặt ra những câu hỏi khó nhưng quan trọng.',                                                   N'visible', '2024-02-26 14:30:00'),
(22, 12, 30, 4, N'Bí Quyết Tư Duy Triệu Phú - có nhiều điểm thú vị về mindset tài chính. Một số phần hơi lặp lại nhưng tổng thể vẫn đáng đọc.',                                                  N'visible', '2024-02-28 14:30:00'),
(23, 13, 22, 5, N'Bố Già - kiệt tác văn học. Không phải về mafia mà về gia đình, lòng trung thành và quyền lực. Đọc đi đọc lại vẫn hay.',                                                        N'visible', '2024-03-05 09:00:00'),
(24, 13, 25, 5, N'Tội Ác Và Hình Phạt - Dostoevsky viết về tâm lý tội phạm quá xuất sắc. Đọc cứ như bị hút vào.',                                                                                  N'visible', '2024-03-05 09:30:00'),
(25, 15, 23, 5, N'Tuổi Trẻ Đáng Giá Bao Nhiêu - cuốn sách rất phù hợp với giới trẻ Việt Nam. Rosie Nguyễn truyền cảm hứng tuyệt vời.',                                                          N'visible', '2024-03-08 10:00:00'),
(26, 15, 3,  4, N'Hoa Vàng Trên Cỏ Xanh - câu chuyện về tình anh em cảm động. Văn phong NNA luôn trong sáng và dễ đọc.',                                                                          N'visible', '2024-03-08 10:30:00'),
(27, 16, 27, 4, N'Vũ Trụ Trong Vỏ Hạt Dẻ - khó hơn Lược Sử Thời Gian một chút nhưng hình ảnh minh họa rất đẹp và giúp ích nhiều.',                                                              N'visible', '2024-03-11 14:00:00'),
(28, 16, 20, 3, N'Cô Đơn Trên Mạng - câu chuyện tình yêu thú vị về thời đại internet. Hơi buồn nhưng đẹp.',                                                                                        N'visible', '2024-03-11 14:30:00'),
(29, 17, 4,  5, N'Dế Mèn Phiêu Lưu Ký - đọc lại lần thứ 3 vẫn thấy hay. Tô Hoài viết cho thiếu nhi nhưng người lớn cũng thích.',                                                                 N'visible', '2024-03-13 09:00:00'),
(30, 17, 14, 5, N'Số Đỏ - Vũ Trọng Phụng xuất sắc! Trào phúng sắc bén, đọc vừa buồn cười vừa đau. Đây là đỉnh cao của văn xuôi Việt Nam.',                                                     N'visible', '2024-03-13 09:30:00'),
(31, 18, 17, 5, N'Atomic Habits - cuốn sách thực dụng nhất tôi đọc năm nay. Đã áp dụng và thấy hiệu quả rõ rệt.',                                                                                  N'visible', '2024-03-15 11:30:00'),
(32, 19, 21, 4, N'Người Giàu Nhất Thành Babylon - câu chuyện cổ đại nhưng bài học về tài chính vẫn còn nguyên giá trị đến ngày nay.',                                                            N'visible', '2024-03-18 10:00:00'),
(33, 19, 15, 4, N'Tắt Đèn - đọc mà đau lòng cho chị Dậu. Ngô Tất Tố phác họa xã hội thực dân phong kiến chân thực và ám ảnh.',                                                                   N'visible', '2024-03-18 10:30:00'),
(34, 2,  13, 5, N'Sau khi đọc Cha Giàu Cha Nghèo, tôi bắt đầu đầu tư và tiết kiệm có hệ thống hơn. Sách rất có giá trị thực tiễn.',                                                              N'visible', '2024-03-20 09:00:00'),
(35, 3,  17, 5, N'Atomic Habits thay đổi cuộc sống tôi. Đơn giản, khoa học và hiệu quả. Đây là một trong những cuốn sách tốt nhất về phát triển bản thân.',                                      N'visible', '2024-03-20 10:00:00'),
(36, 4,  6,  4, N'Sapiens rất hay nhưng đôi khi Harari đưa ra quan điểm hơi chủ quan. Dù sao đây vẫn là cuốn sách đáng đọc.',                                                                     N'visible', '2024-03-22 11:00:00'),
(37, 5,  29, 5, N'Hành Trình Về Phương Đông - cuốn sách kỳ diệu! Mỗi trang là một khám phá về triết học và tâm linh phương Đông.',                                                              N'visible', '2024-04-05 11:00:00'),
(38, 6,  8,  5, N'Đắc Nhân Tâm - đọc lần đầu năm 20 tuổi, nay đọc lại vẫn thấy thấm. Những nguyên tắc này không bao giờ lỗi thời.',                                                              N'visible', '2024-04-06 09:00:00'),
(39, 7,  11, 4, N'Rừng Na Uy không phải sách dành cho tất cả mọi người. Nó buồn và nặng nề nhưng rất hay nếu bạn thích phong cách của Murakami.',                                                 N'visible', '2024-04-07 10:00:00'),
(40, 8,  24, 4, N'Thinking Fast and Slow - dài và đôi khi khô. Nhưng nội dung rất giá trị. Nên đọc từng phần một.',                                                                                 N'visible', '2024-04-08 11:00:00'),
(41, 9,  8,  3, N'Đắc Nhân Tâm - một số mẹo cảm giác không tự nhiên lắm. Nhưng tư tưởng cốt lõi về sự đồng cảm và lắng nghe rất đúng.',                                                         N'visible', '2024-04-09 09:00:00'),
(42, 10, 6,  5, N'Sapiens lần thứ hai đọc vẫn phát hiện thêm nhiều điều mới. Cuốn sách mà ai cũng nên đọc ít nhất một lần.',                                                                       N'visible', '2024-04-10 10:00:00'),
(43, 11, 28, 4, N'Outliers - phân tích thuyết phục về thành công. Ví dụ về The Beatles và Bill Gates rất thú vị.',                                                                                  N'visible', '2024-04-11 11:00:00'),
(44, 12, 10, 5, N'Nhà Giả Kim là cuốn sách tôi đọc mỗi năm. Mỗi lần đọc lại thấy thêm một tầng nghĩa mới sâu sắc hơn.',                                                                          N'visible', '2024-04-12 12:00:00'),
(45, 13, 3,  3, N'Hoa Vàng Trên Cỏ Xanh - cốt truyện đơn giản nhưng cảm xúc. Phù hợp để đọc nhẹ nhàng thư giãn.',                                                                                N'visible', '2024-04-13 09:00:00'),
(46, 14, 23, 4, N'Tuổi Trẻ Đáng Giá Bao Nhiêu - một số nội dung chưa đủ sâu nhưng phù hợp cho bạn trẻ bắt đầu nghĩ về tương lai.',                                                              N'visible', '2024-04-14 10:00:00'),
(47, 15, 7,  4, N'Homo Deus - Harari dự đoán tương lai đáng suy nghĩ. Một số điều đã đang xảy ra rồi, thật đáng lo ngại.',                                                                         N'visible', '2024-04-15 11:00:00'),
(48, 16, 16, 5, N'Lược Sử Thời Gian - Hawking giải thích vũ trụ theo cách ai cũng hiểu. Thiên tài đích thực.',                                                                                      N'visible', '2024-04-16 09:00:00'),
(49, 3,  13, 2, N'Cha Giàu Cha Nghèo - nhiều ý tưởng hay nhưng thiếu hướng dẫn cụ thể. Một số lời khuyên không phù hợp với thị trường Việt Nam.',                                                 N'visible', '2024-04-17 10:00:00'),
(50, 17, 1,  5, N'Cho Tôi Xin Một Vé Đi Tuổi Thơ - tuyệt vời! Đọc mà cứ tưởng đang sống lại tuổi thơ của mình. Nguyễn Nhật Ánh thật sự là nhà văn của trái tim.',                              N'visible', '2024-04-18 08:00:00');

SET IDENTITY_INSERT [Reviews] OFF;
GO

-- ============================================================
-- COLLECTIONS (15 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Collections] ON;

INSERT INTO [Collections] ([collection_id], [user_id], [name], [description], [created_at], [updated_at]) VALUES
(1,  2,  N'Sách yêu thích',                 N'Những cuốn sách tôi yêu thích nhất, đọc đi đọc lại nhiều lần',                          '2024-02-10 00:00:00', '2024-04-01 00:00:00'),
(2,  2,  N'Sách phát triển bản thân',        N'Bộ sưu tập sách kỹ năng sống và phát triển cá nhân',                                    '2024-02-15 00:00:00', '2024-04-01 00:00:00'),
(3,  3,  N'Khoa học & Triết học',            N'Những cuốn sách về khoa học, triết học và tư duy',                                       '2024-02-20 00:00:00', '2024-04-05 00:00:00'),
(4,  4,  N'Tài chính cá nhân',              N'Sách hướng dẫn đầu tư, tài chính và làm giàu',                                          '2024-02-25 00:00:00', '2024-04-10 00:00:00'),
(5,  5,  N'Văn học nước ngoài hay nhất',     N'Những tác phẩm văn học ngoại văn xuất sắc đã đọc',                                      '2024-03-01 00:00:00', '2024-04-12 00:00:00'),
(6,  6,  N'Văn học Việt Nam cổ điển',        N'Di sản văn học Việt Nam từ cổ điển đến hiện đại',                                       '2024-03-05 00:00:00', '2024-04-08 00:00:00'),
(7,  7,  N'Sách đọc năm 2024',              N'Danh sách sách tôi đặt mục tiêu đọc trong năm 2024',                                     '2024-03-10 00:00:00', '2024-04-15 00:00:00'),
(8,  8,  N'Khoa học đại chúng',             N'Sách khoa học viết cho người không chuyên, dễ hiểu',                                     '2024-03-12 00:00:00', '2024-04-10 00:00:00'),
(9,  9,  N'Văn học Nhật Bản',              N'Yêu thích văn học Nhật Bản, đặc biệt Murakami',                                          '2024-03-15 00:00:00', '2024-04-05 00:00:00'),
(10, 10, N'Sách tâm linh & triết học',       N'Những cuốn sách về hành trình tâm linh và triết học phương Đông',                       '2024-03-18 00:00:00', '2024-04-12 00:00:00'),
(11, 11, N'Best of Harari & Gladwell',       N'Hai tác giả tôi ngưỡng mộ nhất - Yuval Harari và Malcolm Gladwell',                     '2024-03-20 00:00:00', '2024-04-10 00:00:00'),
(12, 12, N'Đọc lại nhiều lần',              N'Những cuốn sách xuất sắc đến mức tôi đọc đi đọc lại',                                   '2024-03-22 00:00:00', '2024-04-08 00:00:00'),
(13, 15, N'Sách cho tuổi 20',              N'Những cuốn sách bắt buộc phải đọc khi còn trẻ',                                         '2024-04-01 00:00:00', '2024-04-15 00:00:00'),
(14, 17, N'Văn học thiếu nhi kinh điển',     N'Sách thiếu nhi hay cho cả trẻ em lẫn người lớn',                                        '2024-04-05 00:00:00', '2024-04-15 00:00:00'),
(15, 19, N'Wish list - Muốn mua',           N'Danh sách sách muốn mua trong tương lai',                                                 '2024-04-10 00:00:00', '2024-04-18 00:00:00');

SET IDENTITY_INSERT [Collections] OFF;
GO

-- ============================================================
-- COLLECTION_ITEMS (50 bản ghi)
-- ============================================================
SET IDENTITY_INSERT [Collection_Items] ON;

INSERT INTO [Collection_Items] ([collection_item_id], [collection_id], [book_id], [added_at]) VALUES
(1,  1, 1,  '2024-02-10 00:00:00'),
(2,  1, 2,  '2024-02-10 00:00:00'),
(3,  1, 8,  '2024-02-15 00:00:00'),
(4,  1, 10, '2024-02-20 00:00:00'),
(5,  1, 11, '2024-03-01 00:00:00'),
(6,  2, 8,  '2024-02-15 00:00:00'),
(7,  2, 9,  '2024-02-15 00:00:00'),
(8,  2, 17, '2024-02-20 00:00:00'),
(9,  2, 26, '2024-03-05 00:00:00'),
(10, 3, 6,  '2024-02-20 00:00:00'),
(11, 3, 7,  '2024-02-20 00:00:00'),
(12, 3, 16, '2024-02-25 00:00:00'),
(13, 3, 18, '2024-03-01 00:00:00'),
(14, 3, 24, '2024-03-05 00:00:00'),
(15, 3, 27, '2024-03-10 00:00:00'),
(16, 4, 13, '2024-02-25 00:00:00'),
(17, 4, 21, '2024-02-28 00:00:00'),
(18, 4, 30, '2024-03-05 00:00:00'),
(19, 5, 10, '2024-03-01 00:00:00'),
(20, 5, 11, '2024-03-01 00:00:00'),
(21, 5, 12, '2024-03-05 00:00:00'),
(22, 5, 22, '2024-03-10 00:00:00'),
(23, 5, 25, '2024-03-15 00:00:00'),
(24, 6, 1,  '2024-03-05 00:00:00'),
(25, 6, 2,  '2024-03-05 00:00:00'),
(26, 6, 3,  '2024-03-08 00:00:00'),
(27, 6, 5,  '2024-03-10 00:00:00'),
(28, 6, 14, '2024-03-12 00:00:00'),
(29, 6, 15, '2024-03-15 00:00:00'),
(30, 6, 19, '2024-03-18 00:00:00'),
(31, 7, 6,  '2024-03-10 00:00:00'),
(32, 7, 13, '2024-03-10 00:00:00'),
(33, 7, 17, '2024-03-12 00:00:00'),
(34, 7, 24, '2024-03-15 00:00:00'),
(35, 7, 28, '2024-03-18 00:00:00'),
(36, 8, 16, '2024-03-12 00:00:00'),
(37, 8, 27, '2024-03-15 00:00:00'),
(38, 8, 6,  '2024-03-18 00:00:00'),
(39, 9, 11, '2024-03-15 00:00:00'),
(40, 9, 12, '2024-03-18 00:00:00'),
(41, 10,29, '2024-03-18 00:00:00'),
(42, 10,10, '2024-03-20 00:00:00'),
(43, 10,18, '2024-03-25 00:00:00'),
(44, 11,6,  '2024-03-20 00:00:00'),
(45, 11,7,  '2024-03-20 00:00:00'),
(46, 11,18, '2024-03-22 00:00:00'),
(47, 11,28, '2024-03-25 00:00:00'),
(48, 12,10, '2024-03-22 00:00:00'),
(49, 12,13, '2024-03-25 00:00:00'),
(50, 13,8,  '2024-04-01 00:00:00');

SET IDENTITY_INSERT [Collection_Items] OFF;
GO

-- Bật lại kiểm tra khóa ngoại
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO