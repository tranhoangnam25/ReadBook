-- ============================================================
-- SEED DATA - SQL SERVER
-- ============================================================

SET NOCOUNT ON;

-- 1. XÓA DỮ LIỆU CŨ
DELETE FROM [users_roles];
DELETE FROM [roles_permissions];
DELETE FROM [roles];
DELETE FROM [permissions];
DELETE FROM [users];
DELETE FROM [authors];
DELETE FROM [categories];
DELETE FROM [books];
GO

-- 2. KHỞI TẠO ROLES
INSERT INTO [roles] ([name], [description]) VALUES ('ADM', 'Administrator'), ('USR', 'User');
GO

-- 3. KHỞI TẠO USERS
SET IDENTITY_INSERT [users] ON;
INSERT INTO [users] ([user_id],[username],[avatar_url],[email],[phone],[password_hash],[status],[created_at],[updated_at])
VALUES
(1,  N'Nguyễn Văn An',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user001',  'an.nguyen@gmail.com',      '0912345678', '$2a$10$hashed_password_001', 'active', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
(2,  N'Trần Thị Bình',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user002',  'binh.tran@gmail.com',      '0923456789', '$2a$10$hashed_password_002', 'active', '2024-01-02 09:00:00', '2024-01-02 09:00:00'),
(3,  N'Lê Minh Châu',     'https://api.dicebear.com/7.x/avataaars/svg?seed=user003',  'chau.le@gmail.com',        '0934567890', '$2a$10$hashed_password_003', 'active', '2024-01-05 10:00:00', '2024-03-10 15:30:00'),
(4,  N'Phạm Thị Dung',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user004',  'dung.pham@gmail.com',      '0945678901', '$2a$10$hashed_password_004', 'active', '2024-01-10 11:00:00', '2024-02-20 09:00:00'),
(5,  N'Hoàng Văn Em',     'https://api.dicebear.com/7.x/avataaars/svg?seed=user005',  'em.hoang@gmail.com',       '0956789012', '$2a$10$hashed_password_005', 'active', '2024-01-15 08:30:00', '2024-04-01 12:00:00'),
(6,  N'Vũ Thị Phương',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user006',  'phuong.vu@gmail.com',      '0967890123', '$2a$10$hashed_password_006', 'locked', '2024-01-20 14:00:00', '2024-03-05 10:00:00'),
(7,  N'Đặng Quốc Hùng',   'https://api.dicebear.com/7.x/avataaars/svg?seed=user007',  'hung.dang@gmail.com',      '0978901234', '$2a$10$hashed_password_007', 'active', '2024-02-01 08:00:00', '2024-04-10 11:00:00'),
(8,  N'Bùi Thị Lan',      'https://api.dicebear.com/7.x/avataaars/svg?seed=user008',  'lan.bui@gmail.com',        '0989012345', '$2a$10$hashed_password_008', 'active', '2024-02-10 09:00:00', '2024-04-05 16:00:00'),
(9,  N'Ngô Thành Long',   'https://api.dicebear.com/7.x/avataaars/svg?seed=user009',  'long.ngo@gmail.com',       '0990123456', '$2a$10$hashed_password_009', 'active', '2024-02-15 10:30:00', '2024-03-20 08:00:00'),
(10, N'Trịnh Thị Mai',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user010',  'mai.trinh@gmail.com',      '0901234567', '$2a$10$hashed_password_010', 'active', '2024-03-01 13:00:00', '2024-04-12 09:30:00');
SET IDENTITY_INSERT [users] OFF;
GO

-- 4. GÁN QUYỀN
INSERT INTO [users_roles] (user_user_id, roles_name)
VALUES (1, 'ADM'), (2, 'ADM'), (3, 'USR'), (4, 'USR'), (5, 'USR'), (6, 'USR'), (7, 'USR'), (8, 'USR'), (9, 'USR'), (10, 'USR');
GO

-- 5. TÁC GIẢ
SET IDENTITY_INSERT [Authors] ON;

INSERT INTO [Authors] ([author_id],[name],[biography],[avatar_url],[awards],[created_at])
VALUES
    (1,  N'Nguyễn Nhật Ánh',
     N'Nhà văn nổi tiếng người Việt Nam, tác giả của nhiều tác phẩm văn học thiếu nhi được yêu thích như Tôi thấy hoa vàng trên cỏ xanh, Mắt biếc, Cho tôi xin một vé đi tuổi thơ.',
     'https://ui-avatars.com/api/?name=Nguyen+Nhat+Anh&size=220&background=f4a261&color=fff&bold=true',
     N'Giải thưởng Hội Nhà văn Việt Nam 2008; Sách bán chạy nhất Việt Nam nhiều năm liên tiếp',
     '2024-01-01 08:00:00'),
    (2,  N'Nam Cao',
     N'Nhà văn hiện thực xuất sắc của văn học Việt Nam giai đoạn 1930–1945. Các tác phẩm nổi tiếng: Chí Phèo, Lão Hạc, Đời thừa.',
     'https://ui-avatars.com/api/?name=Nam+Cao&size=220&background=457b9d&color=fff&bold=true',
     N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật (truy tặng)',
     '2024-01-01 08:00:00'),
    (3,  N'Tô Hoài',
     N'Nhà văn Việt Nam nổi tiếng với tác phẩm Dế Mèn phiêu lưu ký, Vợ chồng A Phủ. Ông có đóng góp lớn cho nền văn học Việt Nam hiện đại.',
     'https://ui-avatars.com/api/?name=To+Hoai&size=220&background=2a9d8f&color=fff&bold=true',
     N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật; Huân chương Độc lập hạng Nhất',
     '2024-01-01 08:00:00'),
    (4,  N'Paulo Coelho',
     N'Nhà văn người Brazil nổi tiếng thế giới với tác phẩm Nhà Giả Kim (The Alchemist). Sách của ông đã được dịch ra hơn 80 ngôn ngữ.',
     'https://ui-avatars.com/api/?name=Paulo+Coelho&size=220&background=e9c46a&color=333&bold=true',
     N'Giải Crystal Award của World Economic Forum; Bắc đẩu Bội tinh (Pháp)',
     '2024-01-01 08:00:00'),
    (5,  N'Haruki Murakami',
     N'Nhà văn Nhật Bản nổi tiếng với các tác phẩm như Rừng Na Uy, Kafka bên bờ biển, 1Q84. Phong cách viết pha trộn giữa thực tế và huyền ảo.',
     'https://ui-avatars.com/api/?name=Haruki+Murakami&size=220&background=6d6875&color=fff&bold=true',
     N'Kafka Prize (Séc) 2006; Franz Kafka Prize; Jerusalem Prize 2009',
     '2024-01-01 08:00:00'),
    (6,  N'J.K. Rowling',
     N'Tác giả người Anh nổi tiếng với bộ truyện Harry Potter. Bộ sách đã bán được hơn 500 triệu bản trên toàn thế giới.',
     'https://ui-avatars.com/api/?name=JK+Rowling&size=220&background=8338ec&color=fff&bold=true',
     N'British Book Award; Hugo Award; Bram Stoker Award',
     '2024-01-01 08:00:00'),
    (7,  N'Dale Carnegie',
     N'Tác giả và diễn giả người Mỹ nổi tiếng với cuốn sách Đắc Nhân Tâm (How to Win Friends and Influence People), một trong những sách self-help bán chạy nhất mọi thời đại.',
     'https://ui-avatars.com/api/?name=Dale+Carnegie&size=220&background=3a86ff&color=fff&bold=true',
     N'Tác phẩm nằm trong danh sách 25 cuốn sách kinh doanh có ảnh hưởng nhất của Time Magazine',
     '2024-01-01 08:00:00'),
    (8,  N'Yuval Noah Harari',
     N'Nhà sử học và triết học người Israel, tác giả của Sapiens: Lược sử loài người, Homo Deus và 21 bài học cho thế kỷ 21.',
     'https://ui-avatars.com/api/?name=Yuval+Harari&size=220&background=fb5607&color=fff&bold=true',
     N'Polonsky Prize 2009; Các tác phẩm dịch ra hơn 60 ngôn ngữ',
     '2024-01-01 08:00:00'),
    (9,  N'Vũ Trọng Phụng',
     N'Nhà văn hiện thực phê phán xuất sắc của Việt Nam giai đoạn 1930–1945. Tác phẩm nổi bật: Số đỏ, Giông tố, Vỡ đê.',
     'https://ui-avatars.com/api/?name=Vu+Trong+Phung&size=220&background=06d6a0&color=fff&bold=true',
     N'Được mệnh danh là "ông vua phóng sự đất Bắc"',
     '2024-01-01 08:00:00'),
    (10, N'Ngô Tất Tố',
     N'Nhà văn, nhà báo Việt Nam nổi tiếng với tác phẩm Tắt đèn, phản ánh cuộc sống cơ cực của nông dân Việt Nam dưới ách thực dân phong kiến.',
     'https://ui-avatars.com/api/?name=Ngo+Tat+To&size=220&background=ef233c&color=fff&bold=true',
     N'Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật (truy tặng)',
     '2024-01-01 08:00:00');

SET IDENTITY_INSERT [Authors] OFF;
GO

-- 6. THỂ LOẠI
SET IDENTITY_INSERT [Categories] ON;

INSERT INTO [Categories] ([category_id],[name],[description],[created_at])
VALUES
    (1, N'Văn học Việt Nam',       N'Các tác phẩm văn học của các tác giả Việt Nam, bao gồm văn xuôi, thơ, truyện ngắn và tiểu thuyết.', '2024-01-01 08:00:00'),
    (2, N'Văn học nước ngoài',     N'Các tác phẩm văn học được dịch từ nước ngoài, bao gồm tiểu thuyết, truyện ngắn từ các nền văn học lớn trên thế giới.', '2024-01-01 08:00:00'),
    (3, N'Kỹ năng sống',           N'Sách hướng dẫn phát triển bản thân, kỹ năng giao tiếp, lãnh đạo và thành công trong cuộc sống.', '2024-01-01 08:00:00'),
    (4, N'Lịch sử & Địa lý',      N'Sách về lịch sử thế giới, lịch sử Việt Nam, địa lý và các nền văn minh nhân loại.', '2024-01-01 08:00:00'),
    (5, N'Thiếu nhi',              N'Sách dành cho trẻ em và thanh thiếu niên, bao gồm truyện tranh, truyện cổ tích và tiểu thuyết thiếu nhi.', '2024-01-01 08:00:00'),
    (6, N'Khoa học & Công nghệ',   N'Sách về khoa học tự nhiên, công nghệ, lập trình và các lĩnh vực STEM.', '2024-01-01 08:00:00'),
    (7, N'Kinh tế & Kinh doanh',   N'Sách về kinh tế học, quản trị kinh doanh, đầu tư tài chính và khởi nghiệp.', '2024-01-01 08:00:00'),
    (8, N'Tâm lý học',             N'Sách về tâm lý học, hành vi con người, sức khỏe tâm thần và các liệu pháp tâm lý.', '2024-01-01 08:00:00');

SET IDENTITY_INSERT [Categories] OFF;
GO

-- 7. SÁCH
SET IDENTITY_INSERT [Books] ON;

INSERT INTO [Books]
([title], [description], [summary_content], [price], [preview_percentage], [file_url], [cover_image], [author_id], [category_id], [publish_year])
VALUES
    -- Nguyễn Nhật Ánh (author_id=1), Văn học Việt Nam (category_id=1)
    (N'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
     N'Câu chuyện cảm động về tuổi thơ của hai anh em Thiều và Tường ở một làng quê Việt Nam. Tác phẩm mang đến những kỷ niệm đẹp về tuổi thơ hồn nhiên, vô tư.',
     N'Tác phẩm kể về cuộc sống của hai anh em Thiều và Tường trong một làng quê nghèo yên bình. Qua góc nhìn trẻ thơ, độc giả được dẫn dắt vào thế giới của những trò chơi, tình bạn, sự ganh tị và tình cảm gia đình sâu sắc. Những biến cố nhỏ trong cuộc sống đã khiến Thiều dần trưởng thành và nhận ra giá trị của tình thân. Cuốn sách là bản hòa ca đầy cảm xúc về tuổi thơ Việt Nam.',
     89000.00, 15,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/T%C3%B4i%20Th%E1%BA%A5y%20Hoa%20V%C3%A0ng%20Tr%C3%AAn%20C%E1%BB%8F%20Xanh%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://covers.openlibrary.org/b/id/12547329-L.jpg',
     1, 1, 2010),

    (N'Mắt Biếc',
     N'Câu chuyện tình đơn phương buồn bã của Ngạn dành cho Hà Lan – cô gái có đôi mắt biếc đẹp nhất làng Đo Đo. Một tác phẩm về tình yêu, sự lựa chọn và những nuối tiếc của cuộc đời.',
     N'Ngạn và Hà Lan lớn lên cùng nhau tại làng Đo Đo yên bình. Ngạn luôn yêu Hà Lan bằng thứ tình cảm chân thành và sâu đậm, nhưng Hà Lan lại bị cuốn hút bởi cuộc sống nơi thành thị. Những lựa chọn sai lầm, sự thay đổi của thời gian và khoảng cách trong tâm hồn khiến câu chuyện tình trở nên day dứt. Đây là một tác phẩm giàu cảm xúc về tình yêu, tuổi trẻ và những điều không thể quay lại.',
     79000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/M%E1%BA%AFt%20bi%E1%BA%BFc%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/mat-biec-pdf-epub-azw3-mobi.jpg',
     1, 1, 1990),

    -- Paulo Coelho (author_id=2), Văn học nước ngoài (category_id=2)
    (N'Nhà Giả Kim',
     N'Câu chuyện về Santiago, một cậu bé chăn cừu người Andalusia theo đuổi giấc mơ tìm kho báu ở Ai Cập. Hành trình của cậu là một ẩn dụ sâu sắc về việc theo đuổi ước mơ và lắng nghe tiếng gọi của trái tim.',
     N'Santiago, một chàng trai chăn cừu trẻ tuổi, quyết định rời bỏ cuộc sống bình yên để theo đuổi giấc mơ về kho báu bên kim tự tháp Ai Cập. Trên hành trình ấy, cậu gặp nhiều con người đặc biệt, học được ngôn ngữ của thế giới và khám phá “Vận mệnh cá nhân” của mình. Cuốn sách truyền cảm hứng mạnh mẽ về việc dám theo đuổi ước mơ và tin vào chính mình.',
     95000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/Nh%C3%A0%20Gi%E1%BA%A3%20Kim%20-%20Paulo%20Coelho.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/nha-gia-kim-pdf-epub-azw3-mobi.jpg',
     2, 2, 1988),

    (N'Veronika Quyết Chết',
     N'Veronika, một cô gái 24 tuổi xinh đẹp và có mọi thứ, quyết định tự tử. Nhưng cô tỉnh dậy trong một bệnh viện tâm thần và bắt đầu khám phá ý nghĩa thực sự của cuộc sống.',
     N'Sau khi tự tử bất thành, Veronika tỉnh dậy tại một bệnh viện tâm thần và được thông báo rằng trái tim cô chỉ còn hoạt động trong vài ngày ngắn ngủi. Tại đây, cô gặp những con người bị xã hội xem là “điên”, nhưng chính họ lại giúp cô hiểu được giá trị của tự do, tình yêu và sự sống. Cuốn sách đặt ra nhiều câu hỏi sâu sắc về ý nghĩa cuộc đời và những giới hạn do xã hội áp đặt.',
     88000.00, 15,
     'https://files.example.com/books/veronika-quyet-chet.epub',
     'https://covers.openlibrary.org/b/isbn/9780061741975-L.jpg',
     2, 2, 1998),

    -- Haruki Murakami (author_id=3), Văn học nước ngoài (category_id=2)
    (N'Rừng Na Uy',
     N'Câu chuyện về Watanabe, một sinh viên đại học ở Tokyo những năm 1960, với những mối quan hệ phức tạp và những đau thương của tuổi trẻ. Một tác phẩm về tình yêu, cái chết và sự trưởng thành.',
     N'Watanabe hồi tưởng về quãng đời sinh viên tại Tokyo, nơi anh bị cuốn vào những mối quan hệ đầy cảm xúc với Naoko mong manh và Midori sôi nổi. Giữa mất mát, cô đơn và những khủng hoảng tinh thần, anh phải tìm cách trưởng thành và hiểu rõ chính mình. Tác phẩm mang màu sắc trầm buồn đặc trưng của Haruki Murakami và khắc họa sâu sắc tâm hồn tuổi trẻ.',
     105000.00, 10,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/sachmoi.net_rung_na_uy.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tieu-thuyet-rung-nauy.jpg',
     3, 2, 1987),

    -- Dale Carnegie (author_id=4), Kỹ năng sống (category_id=3)
    (N'Đắc Nhân Tâm',
     N'Cuốn sách nổi tiếng nhất về nghệ thuật giao tiếp và ảnh hưởng đến người khác. Dale Carnegie chia sẻ những nguyên tắc cơ bản giúp bạn kết bạn, tạo ảnh hưởng và thành công trong cuộc sống.',
     N'Đắc Nhân Tâm tổng hợp những nguyên tắc ứng xử và giao tiếp giúp con người xây dựng mối quan hệ tốt đẹp trong cuộc sống và công việc. Thông qua nhiều câu chuyện thực tế, Dale Carnegie chỉ ra cách thấu hiểu tâm lý người khác, tạo thiện cảm và truyền cảm hứng tích cực. Đây là một trong những cuốn sách kỹ năng sống có sức ảnh hưởng lớn nhất thế giới.',
     75000.00, 25,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/%C4%90%E1%BA%AFc%20Nh%C3%A2n%20T%C3%A2m%20-%20Dale%20Carnegie.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/dac-nhan-tam-pdf-epub-azw3-mobi.jpg',
     4, 3, 1936),

    -- Nam Cao (author_id=5), Văn học Việt Nam (category_id=1)
    (N'Chí Phèo',
     N'Tuyển tập truyện ngắn của Nam Cao bao gồm tác phẩm kinh điển "Chí Phèo" và nhiều truyện ngắn khác. Phản ánh hiện thực xã hội Việt Nam trước năm 1945 một cách sắc sảo và nhân văn.',
     N'Chí Phèo kể về cuộc đời bi kịch của một người nông dân lương thiện bị xã hội phong kiến đẩy vào con đường lưu manh hóa. Sau nhiều năm sống trong men rượu và sự khinh miệt của làng Vũ Đại, Chí gặp Thị Nở và lần đầu tiên khao khát được trở lại làm người. Tuy nhiên, định kiến xã hội đã dập tắt hy vọng cuối cùng của hắn. Tác phẩm là tiếng nói tố cáo sâu sắc xã hội bất công trước Cách mạng.',
     65000.00, 30,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/CH%C3%8D%20PH%C3%88O%20-%20Nam%20Cao.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tai-ebook-chi-pheo-nam-cao-pdf-epub-azw3-mobi.jpg',
     5, 1, 1941),

    -- Stephen King (author_id=6), Văn học nước ngoài (category_id=2)
    (N'It',
     N'Câu chuyện kinh dị về nhóm bạn thời thơ ấu phải đối mặt với một thực thể ma quái ẩn mình trong hệ thống cống ngầm của thành phố Derry. Được coi là một trong những tác phẩm kinh dị vĩ đại nhất mọi thời đại.',
     N'Tại thị trấn Derry, một thực thể tà ác xuất hiện theo chu kỳ và gieo rắc nỗi sợ hãi dưới hình dạng gã hề Pennywise. Một nhóm trẻ em có tên “The Losers Club” đã cùng nhau chống lại nó khi còn nhỏ, nhưng nhiều năm sau họ buộc phải quay lại để đối mặt lần cuối. Cuốn tiểu thuyết khai thác sâu nỗi sợ, ký ức tuổi thơ và sức mạnh của tình bạn.',
     120000.00, 10,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/G%C3%A3%20H%E1%BB%81%20Ma%20Qu%C3%A1i%20-%20Stephen%20King%20%26%20%C4%90%E1%BB%97%20Phan%20Thu%20H%C3%A0%20(d%E1%BB%8Bch).epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tai-ebook-it-ga-he-ma-quai-pdf-epub-mobi.jpg',
     6, 2, 1986),

    -- Tô Hoài (author_id=7), Thiếu nhi (category_id=7)
    (N'Dế Mèn Phiêu Lưu Ký',
     N'Cuộc phiêu lưu của chú dế mèn dũng cảm qua nhiều vùng đất kỳ thú, gặp gỡ nhiều nhân vật thú vị. Tác phẩm văn học thiếu nhi kinh điển nhất của Việt Nam, truyền tải bài học về dũng cảm và tình bạn.',
     N'Dế Mèn, một chú dế trẻ tuổi hiếu thắng, bắt đầu hành trình khám phá thế giới sau biến cố khiến Dế Choắt qua đời. Trên đường phiêu lưu, Dế Mèn gặp nhiều loài vật khác nhau và học được những bài học quý giá về lòng nhân ái, tình bạn và trách nhiệm. Tác phẩm vừa giàu trí tưởng tượng vừa mang nhiều ý nghĩa giáo dục sâu sắc.',
     55000.00, 35,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/sachmoi.net_de_men_phieu_luu_ky.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/ebook-de-men-phieu-luu-ky-epub-pdf.jpg',
     7, 7, 1941),

    -- Nguyễn Nhật Ánh (author_id=1), Thiếu nhi (category_id=7)
    (N'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
     N'Hành trình trở về tuổi thơ với những ký ức trong sáng, hồn nhiên của nhóm bạn nhỏ. Tác phẩm gợi lên nỗi nhớ tuổi thơ và những điều giản dị nhưng đẹp đẽ của cuộc sống.',
     N'Tác phẩm là lời kể hài hước và đầy cảm xúc của một người trưởng thành khi nhớ lại tuổi thơ của mình cùng nhóm bạn thân. Những trò nghịch ngợm, suy nghĩ ngây ngô và cách nhìn thế giới rất riêng của trẻ nhỏ khiến câu chuyện vừa vui vẻ vừa sâu lắng. Cuốn sách giúp người đọc tìm lại những ký ức đẹp và sự trong trẻo đã bị thời gian lãng quên.',
     72000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/Cho%20t%C3%B4i%20xin%20m%E1%BB%99t%20v%C3%A9%20%C4%91i%20tu%E1%BB%95i%20th%C6%A1%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/cho-toi-xin-mot-ve-di-tuoi-tho-pdf-epub-azw3-mobi.jpg',
     1, 7, 2008);
SET IDENTITY_INSERT [Books] OFF;
GO

SET IDENTITY_INSERT [Orders] ON;

INSERT INTO [Orders] ([order_id],[user_id],[book_id],[price],[status],[created_at])
VALUES
    (1,  3,  1,  85000, 'paid',      '2024-02-01 09:00:00'),
    (2,  3,  4,  45000, 'paid',      '2024-02-01 09:05:00'),
    (3,  4,  2,  79000, 'paid',      '2024-02-10 10:00:00'),
    (4,  4,  7,  95000, 'paid',      '2024-02-10 10:05:00'),
    (5,  4,  12, 89000, 'paid',      '2024-02-15 11:00:00'),
    (6,  5,  7,  95000, 'paid',      '2024-03-01 08:00:00'),
    (7,  5,  8,  110000,'paid',      '2024-03-01 08:05:00'),
    (8,  5,  13, 135000,'paid',      '2024-03-05 09:00:00'),
    (9,  7,  2,  79000, 'paid',      '2024-03-10 10:00:00'),
    (10, 7,  7,  95000, 'paid',      '2024-03-10 10:05:00'),
    (11, 7,  10, 125000,'paid',      '2024-03-15 11:00:00'),
    (12, 7,  15, 55000, 'paid',      '2024-03-15 11:05:00'),
    (13, 8,  8,  110000,'paid',      '2024-03-20 09:00:00'),
    (14, 8,  13, 135000,'paid',      '2024-03-20 09:05:00'),
    (15, 9,  4,  45000, 'paid',      '2024-03-25 10:00:00'),
    (16, 9,  8,  110000,'paid',      '2024-03-25 10:05:00'),
    (17, 10, 10, 125000,'paid',      '2024-04-01 08:00:00'),
    (18, 10, 18, 129000,'paid',      '2024-04-01 08:05:00'),
    (19, 3,  6,  55000, 'pending',   '2024-04-15 09:00:00'),
    (20, 4,  14, 135000,'cancelled', '2024-04-10 10:00:00');

SET IDENTITY_INSERT [Orders] OFF;
GO

SET IDENTITY_INSERT [Reader_Setting] ON;

INSERT INTO [Reader_Setting] ([reader_setting_id],[user_id],[font_family],[font_size],[line_height],[background_color],[updated_at])
VALUES
    (1, 3,  'Merriweather', 17, 1.6,  'Light',  '2024-03-01 10:00:00'),
    (2, 4,  'Georgia',      16, 1.5,  'Light',  '2024-02-15 09:00:00'),
    (3, 5,  'Roboto',       18, 1.7,  'Dark',   '2024-03-10 11:00:00'),
    (4, 6,  'Lato',         15, 1.4,  'Sepia',  '2024-02-20 10:00:00'),
    (5, 7,  'Open Sans',    16, 1.5,  'Dark',   '2024-03-15 09:00:00'),
    (6, 8,  'Roboto',       20, 1.8,  'Light',  '2024-03-20 10:00:00'),
    (7, 9,  'Merriweather', 16, 1.6,  'Sepia',  '2024-03-25 11:00:00'),
    (8, 10, 'Georgia',      17, 1.5,  'Light',  '2024-04-01 09:00:00');

SET IDENTITY_INSERT [Reader_Setting] OFF;
GO
