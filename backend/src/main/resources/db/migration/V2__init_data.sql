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
     '2024-01-01 08:00:00'),
    (11,
     'https://picsum.photos/seed/author011/300/300',
     N'Giải Edgar Award, Giải Văn học Mỹ',
     N'Mario Puzo là nhà văn và biên kịch người Mỹ nổi tiếng với tiểu thuyết "Bố Già". Ông được biết đến qua những tác phẩm viết về thế giới mafia và quyền lực trong xã hội Mỹ. Văn phong của Mario Puzo kết hợp giữa yếu tố tội phạm, gia đình và tâm lý nhân vật sâu sắc.',
     '2024-01-19 08:00:00',
     N'Mario Puzo'),

    (12,
     'https://picsum.photos/seed/author012/300/300',
     N'Tác giả truyền cảm hứng nổi bật tại Việt Nam',
     N'Rosie Nguyễn là tác giả và blogger nổi tiếng với những cuốn sách truyền cảm hứng dành cho giới trẻ. Cô được yêu thích bởi lối viết gần gũi, tích cực và những trải nghiệm thực tế về học tập, du lịch và phát triển bản thân.',
     '2024-01-20 08:00:00',
     N'Rosie Nguyễn'),

    (13,
     'https://picsum.photos/seed/author013/300/300',
     N'Giải thưởng Viện Hàn lâm Pháp',
     N'Hector Malot là nhà văn người Pháp nổi tiếng với các tác phẩm dành cho thiếu nhi và thanh thiếu niên. Tác phẩm "Không gia đình" của ông đã trở thành một trong những tiểu thuyết kinh điển được yêu thích trên toàn thế giới.',
     '2024-01-21 08:00:00',
     N'Hector Malot'),

    (14,
     'https://picsum.photos/seed/author014/300/300',
     N'Giải Nobel Văn học 1885',
     N'Victor Hugo là đại văn hào Pháp và là một trong những nhà văn quan trọng nhất của văn học thế giới. Ông nổi tiếng với các tác phẩm giàu tính nhân văn như "Những người khốn khổ" và "Nhà thờ Đức Bà Paris".',
     '2024-01-22 08:00:00',
     N'Victor Hugo'),

    (15,
     'https://picsum.photos/seed/author015/300/300',
     N'Tác giả sách tài chính bán chạy nhất thế giới',
     N'Robert Kiyosaki là doanh nhân và tác giả người Mỹ nổi tiếng với cuốn sách "Cha giàu cha nghèo". Ông chuyên viết về giáo dục tài chính, đầu tư và tư duy làm giàu.',
     '2024-01-23 08:00:00',
     N'Robert Kiyosaki'),

    (16,
     'https://picsum.photos/seed/author016/300/300',
     N'Giải thưởng Crystal Award',
     N'Paulo Coelho là nhà văn người Brazil nổi tiếng toàn cầu với tiểu thuyết "Nhà giả kim". Các tác phẩm của ông thường mang màu sắc triết lý, tâm linh và truyền cảm hứng sống.',
     '2024-01-24 08:00:00',
     N'Paulo Coelho'),

    (17,
     'https://picsum.photos/seed/author017/300/300',
     N'Giải Nobel Văn học 1954',
     N'Ernest Hemingway là nhà văn và nhà báo người Mỹ nổi tiếng với phong cách viết ngắn gọn, mạnh mẽ và giàu chiều sâu. Ông là tác giả của nhiều tác phẩm kinh điển như "Ông già và biển cả".',
     '2024-01-25 08:00:00',
     N'Ernest Hemingway'),

    (18,
     'https://picsum.photos/seed/author018/300/300',
     N'Chuyên gia tâm lý học ứng dụng',
     N'David J. Lieberman là nhà tâm lý học và tác giả nổi tiếng với nhiều cuốn sách về giao tiếp, hành vi và phân tích tâm lý con người. Các tác phẩm của ông được đánh giá cao về tính ứng dụng thực tế.',
     '2024-01-26 08:00:00',
     N'David J. Lieberman'),

    (19,
     'https://picsum.photos/seed/author019/300/300',
     N'Giải Pulitzer 1937',
     N'Margaret Mitchell là nữ tiểu thuyết gia người Mỹ nổi tiếng với tác phẩm kinh điển "Cuốn theo chiều gió". Dù chỉ xuất bản một tiểu thuyết duy nhất, bà vẫn để lại dấu ấn lớn trong văn học thế giới.',
     '2024-01-27 08:00:00',
     N'Margaret Mitchell'),

    (20,
     'https://picsum.photos/seed/author020/300/300',
     N'Nhà văn thiếu nhi nổi tiếng Brazil',
     N'José Mauro de Vasconcelos là nhà văn người Brazil nổi tiếng với tác phẩm "Cây cam ngọt của tôi". Văn phong của ông giàu cảm xúc, nhân văn và đặc biệt thành công trong việc khắc họa tâm hồn trẻ thơ.',
     '2024-01-28 08:00:00',
     N'José Mauro de Vasconcelos');

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
([book_id], [title], [description], [summary_content], [price], [preview_percentage], [file_url], [cover_image], [author_id], [category_id], [publish_year], [created_at], [updated_at])
VALUES

    -- Nguyễn Nhật Ánh (author_id=1), Văn học Việt Nam (category_id=1)
    (1,N'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
     N'Câu chuyện cảm động về tuổi thơ của hai anh em Thiều và Tường ở một làng quê Việt Nam. Tác phẩm mang đến những kỷ niệm đẹp về tuổi thơ hồn nhiên, vô tư.',
     N'Tác phẩm kể về cuộc sống của hai anh em Thiều và Tường trong một làng quê nghèo yên bình. Qua góc nhìn trẻ thơ, độc giả được dẫn dắt vào thế giới của những trò chơi, tình bạn, sự ganh tị và tình cảm gia đình sâu sắc. Những biến cố nhỏ trong cuộc sống đã khiến Thiều dần trưởng thành và nhận ra giá trị của tình thân. Cuốn sách là bản hòa ca đầy cảm xúc về tuổi thơ Việt Nam.',
     89000.00, 15,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/T%C3%B4i%20Th%E1%BA%A5y%20Hoa%20V%C3%A0ng%20Tr%C3%AAn%20C%E1%BB%8F%20Xanh%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://covers.openlibrary.org/b/id/12547329-L.jpg',
     1, 1, 2010, GETDATE(), GETDATE()),

    (2,N'Mắt Biếc',
     N'Câu chuyện tình đơn phương buồn bã của Ngạn dành cho Hà Lan – cô gái có đôi mắt biếc đẹp nhất làng Đo Đo. Một tác phẩm về tình yêu, sự lựa chọn và những nuối tiếc của cuộc đời.',
     N'Ngạn và Hà Lan lớn lên cùng nhau tại làng Đo Đo yên bình. Ngạn luôn yêu Hà Lan bằng thứ tình cảm chân thành và sâu đậm, nhưng Hà Lan lại bị cuốn hút bởi cuộc sống nơi thành thị. Những lựa chọn sai lầm, sự thay đổi của thời gian và khoảng cách trong tâm hồn khiến câu chuyện tình trở nên day dứt. Đây là một tác phẩm giàu cảm xúc về tình yêu, tuổi trẻ và những điều không thể quay lại.',
     79000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/M%E1%BA%AFt%20bi%E1%BA%BFc%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/mat-biec-pdf-epub-azw3-mobi.jpg',
     1, 1, 1990, GETDATE(), GETDATE()),

    -- Paulo Coelho (author_id=2), Văn học nước ngoài (category_id=2)
    (3,N'Nhà Giả Kim',
     N'Câu chuyện về Santiago, một cậu bé chăn cừu người Andalusia theo đuổi giấc mơ tìm kho báu ở Ai Cập. Hành trình của cậu là một ẩn dụ sâu sắc về việc theo đuổi ước mơ và lắng nghe tiếng gọi của trái tim.',
     N'Santiago, một chàng trai chăn cừu trẻ tuổi, quyết định rời bỏ cuộc sống bình yên để theo đuổi giấc mơ về kho báu bên kim tự tháp Ai Cập. Trên hành trình ấy, cậu gặp nhiều con người đặc biệt, học được ngôn ngữ của thế giới và khám phá “Vận mệnh cá nhân” của mình. Cuốn sách truyền cảm hứng mạnh mẽ về việc dám theo đuổi ước mơ và tin vào chính mình.',
     95000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/Nh%C3%A0%20Gi%E1%BA%A3%20Kim%20-%20Paulo%20Coelho.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/nha-gia-kim-pdf-epub-azw3-mobi.jpg',
     2, 2, 1988, GETDATE(), GETDATE()),

    (4,N'Veronika Quyết Chết',
     N'Veronika, một cô gái 24 tuổi xinh đẹp và có mọi thứ, quyết định tự tử. Nhưng cô tỉnh dậy trong một bệnh viện tâm thần và bắt đầu khám phá ý nghĩa thực sự của cuộc sống.',
     N'Sau khi tự tử bất thành, Veronika tỉnh dậy tại một bệnh viện tâm thần và được thông báo rằng trái tim cô chỉ còn hoạt động trong vài ngày ngắn ngủi. Tại đây, cô gặp những con người bị xã hội xem là “điên”, nhưng chính họ lại giúp cô hiểu được giá trị của tự do, tình yêu và sự sống. Cuốn sách đặt ra nhiều câu hỏi sâu sắc về ý nghĩa cuộc đời và những giới hạn do xã hội áp đặt.',
     88000.00, 15,
     'https://files.example.com/books/veronika-quyet-chet.epub',
     'https://covers.openlibrary.org/b/isbn/9780061741975-L.jpg',
     2, 2, 1998, GETDATE(), GETDATE()),

    -- Haruki Murakami (author_id=3), Văn học nước ngoài (category_id=2)
    (5,N'Rừng Na Uy',
     N'Câu chuyện về Watanabe, một sinh viên đại học ở Tokyo những năm 1960, với những mối quan hệ phức tạp và những đau thương của tuổi trẻ. Một tác phẩm về tình yêu, cái chết và sự trưởng thành.',
     N'Watanabe hồi tưởng về quãng đời sinh viên tại Tokyo, nơi anh bị cuốn vào những mối quan hệ đầy cảm xúc với Naoko mong manh và Midori sôi nổi. Giữa mất mát, cô đơn và những khủng hoảng tinh thần, anh phải tìm cách trưởng thành và hiểu rõ chính mình. Tác phẩm mang màu sắc trầm buồn đặc trưng của Haruki Murakami và khắc họa sâu sắc tâm hồn tuổi trẻ.',
     105000.00, 10,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/sachmoi.net_rung_na_uy.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tieu-thuyet-rung-nauy.jpg',
     3, 2, 1987, GETDATE(), GETDATE()),

    -- Dale Carnegie (author_id=4), Kỹ năng sống (category_id=3)
    (6,N'Đắc Nhân Tâm',
     N'Cuốn sách nổi tiếng nhất về nghệ thuật giao tiếp và ảnh hưởng đến người khác. Dale Carnegie chia sẻ những nguyên tắc cơ bản giúp bạn kết bạn, tạo ảnh hưởng và thành công trong cuộc sống.',
     N'Đắc Nhân Tâm tổng hợp những nguyên tắc ứng xử và giao tiếp giúp con người xây dựng mối quan hệ tốt đẹp trong cuộc sống và công việc. Thông qua nhiều câu chuyện thực tế, Dale Carnegie chỉ ra cách thấu hiểu tâm lý người khác, tạo thiện cảm và truyền cảm hứng tích cực. Đây là một trong những cuốn sách kỹ năng sống có sức ảnh hưởng lớn nhất thế giới.',
     75000.00, 25,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/%C4%90%E1%BA%AFc%20Nh%C3%A2n%20T%C3%A2m%20-%20Dale%20Carnegie.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/dac-nhan-tam-pdf-epub-azw3-mobi.jpg',
     4, 3, 1936, GETDATE(), GETDATE()),

    -- Nam Cao (author_id=5), Văn học Việt Nam (category_id=1)
    (7,N'Chí Phèo',
     N'Tuyển tập truyện ngắn của Nam Cao bao gồm tác phẩm kinh điển "Chí Phèo" và nhiều truyện ngắn khác. Phản ánh hiện thực xã hội Việt Nam trước năm 1945 một cách sắc sảo và nhân văn.',
     N'Chí Phèo kể về cuộc đời bi kịch của một người nông dân lương thiện bị xã hội phong kiến đẩy vào con đường lưu manh hóa. Sau nhiều năm sống trong men rượu và sự khinh miệt của làng Vũ Đại, Chí gặp Thị Nở và lần đầu tiên khao khát được trở lại làm người. Tuy nhiên, định kiến xã hội đã dập tắt hy vọng cuối cùng của hắn. Tác phẩm là tiếng nói tố cáo sâu sắc xã hội bất công trước Cách mạng.',
     65000.00, 30,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/CH%C3%8D%20PH%C3%88O%20-%20Nam%20Cao.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tai-ebook-chi-pheo-nam-cao-pdf-epub-azw3-mobi.jpg',
     5, 1, 1941, GETDATE(), GETDATE()),

    -- Stephen King (author_id=6), Văn học nước ngoài (category_id=2)
    (8,N'It',
     N'Câu chuyện kinh dị về nhóm bạn thời thơ ấu phải đối mặt với một thực thể ma quái ẩn mình trong hệ thống cống ngầm của thành phố Derry. Được coi là một trong những tác phẩm kinh dị vĩ đại nhất mọi thời đại.',
     N'Tại thị trấn Derry, một thực thể tà ác xuất hiện theo chu kỳ và gieo rắc nỗi sợ hãi dưới hình dạng gã hề Pennywise. Một nhóm trẻ em có tên “The Losers Club” đã cùng nhau chống lại nó khi còn nhỏ, nhưng nhiều năm sau họ buộc phải quay lại để đối mặt lần cuối. Cuốn tiểu thuyết khai thác sâu nỗi sợ, ký ức tuổi thơ và sức mạnh của tình bạn.',
     120000.00, 10,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/G%C3%A3%20H%E1%BB%81%20Ma%20Qu%C3%A1i%20-%20Stephen%20King%20%26%20%C4%90%E1%BB%97%20Phan%20Thu%20H%C3%A0%20(d%E1%BB%8Bch).epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/tai-ebook-it-ga-he-ma-quai-pdf-epub-mobi.jpg',
     6, 2, 1986, GETDATE(), GETDATE()),

    -- Tô Hoài (author_id=7), Thiếu nhi (category_id=7)
    (9,N'Dế Mèn Phiêu Lưu Ký',
     N'Cuộc phiêu lưu của chú dế mèn dũng cảm qua nhiều vùng đất kỳ thú, gặp gỡ nhiều nhân vật thú vị. Tác phẩm văn học thiếu nhi kinh điển nhất của Việt Nam, truyền tải bài học về dũng cảm và tình bạn.',
     N'Dế Mèn, một chú dế trẻ tuổi hiếu thắng, bắt đầu hành trình khám phá thế giới sau biến cố khiến Dế Choắt qua đời. Trên đường phiêu lưu, Dế Mèn gặp nhiều loài vật khác nhau và học được những bài học quý giá về lòng nhân ái, tình bạn và trách nhiệm. Tác phẩm vừa giàu trí tưởng tượng vừa mang nhiều ý nghĩa giáo dục sâu sắc.',
     55000.00, 35,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/sachmoi.net_de_men_phieu_luu_ky.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/ebook-de-men-phieu-luu-ky-epub-pdf.jpg',
     7, 7, 1941, GETDATE(), GETDATE()),

    -- Nguyễn Nhật Ánh (author_id=1), Thiếu nhi (category_id=7)
    (10,N'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
     N'Hành trình trở về tuổi thơ với những ký ức trong sáng, hồn nhiên của nhóm bạn nhỏ. Tác phẩm gợi lên nỗi nhớ tuổi thơ và những điều giản dị nhưng đẹp đẽ của cuộc sống.',
     N'Tác phẩm là lời kể hài hước và đầy cảm xúc của một người trưởng thành khi nhớ lại tuổi thơ của mình cùng nhóm bạn thân. Những trò nghịch ngợm, suy nghĩ ngây ngô và cách nhìn thế giới rất riêng của trẻ nhỏ khiến câu chuyện vừa vui vẻ vừa sâu lắng. Cuốn sách giúp người đọc tìm lại những ký ức đẹp và sự trong trẻo đã bị thời gian lãng quên.',
     72000.00, 20,
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/Cho%20t%C3%B4i%20xin%20m%E1%BB%99t%20v%C3%A9%20%C4%91i%20tu%E1%BB%95i%20th%C6%A1%20-%20Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh.epub',
     'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/%E1%BA%A3nh%20b%C3%ACa/cho-toi-xin-mot-ve-di-tuoi-tho-pdf-epub-azw3-mobi.jpg',
     1, 7, 2008, GETDATE(), GETDATE()),

    (11, N'Vợ chồng A Phủ',
     N'Truyện ngắn của Tô Hoài kể về cuộc đời của Mị và A Phủ - hai người dân tộc Mông bị áp bức, bóc lột và hành trình giải phóng bản thân.',
     N'Tác phẩm nổi tiếng của nhà văn Tô Hoài khắc họa chân thực cuộc sống khổ cực của đồng bào dân tộc miền núi dưới ách áp bức phong kiến. Nhân vật Mị và A Phủ đại diện cho sức sống mãnh liệt cùng khát vọng tự do của con người. Với lối kể chuyện giàu chất hiện thực và nhân văn, Tô Hoài đã tạo nên một trong những truyện ngắn xuất sắc nhất của văn học Việt Nam hiện đại.',
     40000, 30, 'files/books/vo_chong_a_phu.epub', 'https://picsum.photos/seed/book017/200/300',
     3, 1, 1952, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

    (12, N'21 bài học cho thế kỷ 21',
     N'Harari phân tích những thách thức lớn nhất mà nhân loại đang đối mặt trong thế kỷ 21: chủ nghĩa dân tộc, tôn giáo, khủng bố, công nghệ và biến đổi khí hậu.',
     N'Trong cuốn sách này, Yuval Noah Harari đưa ra góc nhìn sắc bén về các vấn đề nổi bật của thế giới hiện đại như trí tuệ nhân tạo, dữ liệu lớn, tin giả và biến đổi xã hội. Tác giả không chỉ phân tích hiện trạng mà còn đặt ra nhiều câu hỏi về tương lai của nhân loại. Với phong cách viết dễ hiểu nhưng sâu sắc, Harari giúp người đọc suy ngẫm về vai trò của con người trong thế kỷ 21.',
     129000, 15, 'files/books/21_bai_hoc.epub', 'https://picsum.photos/seed/book018/200/300',
     8, 4, 2018, '2024-01-16 08:00:00', '2024-01-16 08:00:00'),

    (13, N'Đường về',
     N'Tiểu thuyết của Nguyễn Nhật Ánh kể về hành trình tìm lại ký ức và tình yêu của nhân vật chính sau nhiều năm xa cách quê hương.',
     N'Nguyễn Nhật Ánh tiếp tục mang đến một câu chuyện nhẹ nhàng, giàu cảm xúc về tuổi trẻ, quê hương và tình yêu. Nhân vật chính sau nhiều năm xa quê đã trở về để đối diện với những ký ức cũ và những tình cảm chưa từng phai nhạt. Bằng giọng văn trong sáng và gần gũi, tác giả khơi gợi nỗi nhớ quê hương cùng những giá trị giản dị của cuộc sống.',
     75000, 10, 'files/books/duong_ve.epub', 'https://picsum.photos/seed/book019/200/300',
     1, 1, 2020, '2024-01-17 08:00:00', '2024-01-17 08:00:00'),

    (14, N'Homo Deus: Lược sử tương lai',
     N'Tiếp nối Sapiens, Harari khám phá tương lai của loài người trong thế kỷ 21 khi công nghệ và trí tuệ nhân tạo ngày càng phát triển.',
     N'Yuval Noah Harari dự đoán những thay đổi to lớn của nhân loại trong tương lai khi công nghệ sinh học và trí tuệ nhân tạo phát triển vượt bậc. Cuốn sách đặt ra nhiều vấn đề về quyền lực, ý thức, dữ liệu và khả năng con người bị thay thế bởi máy móc. Với góc nhìn độc đáo và giàu tri thức, Harari mở ra những cuộc tranh luận sâu sắc về tương lai của nền văn minh.',
     135000, 15, 'files/books/homo_deus.epub', 'https://picsum.photos/seed/book014/200/300',
     8, 4, 2015, '2024-01-12 09:00:00', '2024-01-12 09:00:00'),

    (15, N'Số đỏ',
     N'Tiểu thuyết trào phúng xuất sắc của Vũ Trọng Phụng viết về nhân vật Xuân Tóc Đỏ - kẻ cơ hội leo lên đỉnh cao xã hội. Tác phẩm phê phán sắc nét xã hội thực dân nửa phong kiến.',
     N'Nhà văn Vũ Trọng Phụng sử dụng giọng văn châm biếm sắc sảo để vạch trần sự lố bịch của xã hội thành thị Việt Nam thời thực dân nửa phong kiến. Nhân vật Xuân Tóc Đỏ từ một kẻ vô học đã trở thành người nổi tiếng nhờ những tình huống trớ trêu và sự giả dối của xã hội. Tác phẩm được xem là đỉnh cao của văn học hiện thực phê phán Việt Nam.',
     55000, 25, 'files/books/so_do.epub', 'https://picsum.photos/seed/book015/200/300',
     9, 1, 1936, '2024-01-13 08:00:00', '2024-01-13 08:00:00'),

    (16, N'Tắt đèn',
     N'Tiểu thuyết của Ngô Tất Tố khắc họa cuộc sống khốn khổ của người nông dân nghèo qua hình ảnh chị Dậu phải bán con và chồng để nộp sưu thuế.',
     N'Ngô Tất Tố đã tái hiện chân thực xã hội nông thôn Việt Nam trước Cách mạng thông qua số phận bi thảm của chị Dậu. Vì sưu thuế và áp bức, gia đình chị rơi vào cảnh cùng cực, buộc chị phải đấu tranh để bảo vệ chồng con. Tác phẩm phản ánh sâu sắc hiện thực bất công và ca ngợi sức mạnh của người phụ nữ Việt Nam.',
     45000, 25, 'files/books/tat_den.epub', 'https://picsum.photos/seed/book016/200/300',
     10, 1, 1939, '2024-01-14 08:00:00', '2024-01-14 08:00:00'),

    (17, N'Đắc Nhân Tâm',
     N'Cuốn sách kinh điển của Dale Carnegie về nghệ thuật giao tiếp và gây ảnh hưởng đến người khác. Một trong những cuốn sách self-help bán chạy nhất lịch sử.',
     N'Dale Carnegie chia sẻ những nguyên tắc giao tiếp và ứng xử giúp con người tạo dựng mối quan hệ tích cực trong công việc lẫn cuộc sống. Thông qua nhiều câu chuyện thực tế và bài học đơn giản nhưng hiệu quả, tác giả giúp người đọc hiểu cách thuyết phục, tạo thiện cảm và phát triển bản thân. Đây là một trong những cuốn sách kỹ năng sống có ảnh hưởng lớn nhất thế giới.',
     89000, 20, 'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/%C4%90%E1%BA%AFc%20Nh%C3%A2n%20T%C3%A2m%20-%20Dale%20Carnegie.epub',
     'https://picsum.photos/seed/book012/200/300',
     7, 3, 1936, '2024-01-11 08:00:00', '2024-01-11 08:00:00'),

    (18, N'Sapiens: Lược sử loài người',
     N'Yuval Noah Harari đưa người đọc qua hành trình 70.000 năm lịch sử loài người, từ thời đồ đá đến cách mạng khoa học.',
     N'Trong tác phẩm nổi tiếng này, Yuval Noah Harari phân tích quá trình tiến hóa và phát triển của loài người qua các cuộc cách mạng nhận thức, nông nghiệp và khoa học. Tác giả giải thích cách con người xây dựng xã hội, tôn giáo, kinh tế và đế chế dựa trên niềm tin tập thể. Cuốn sách mang đến góc nhìn mới mẻ và sâu sắc về lịch sử nhân loại.',
     135000, 15, 'files/books/sapiens.epub', 'https://picsum.photos/seed/book013/200/300',
     8, 4, 2011, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

    (19, N'Lão Hạc',
     N'Truyện ngắn của Nam Cao viết về người nông dân nghèo khổ tên Lão Hạc với tình cảm sâu sắc dành cho người con trai và con chó.',
     N'Nam Cao đã khắc họa đầy cảm động cuộc đời của Lão Hạc — một người nông dân nghèo sống cô độc nhưng giàu lòng tự trọng và tình thương con. Bi kịch của nhân vật phản ánh sự bế tắc của người nông dân Việt Nam trước Cách mạng tháng Tám. Với ngòi bút hiện thực sắc bén và giàu tính nhân văn, Nam Cao khiến người đọc xúc động sâu sắc.',
     35000, 30, 'files/books/lao_hac.epub', 'https://picsum.photos/seed/book005/200/300',
     2, 1, 1943, '2024-01-06 08:30:00', '2024-01-06 08:30:00'),

    (20, N'Harry Potter và Hòn đá Phù thủy',
     N'Tập đầu tiên trong bộ truyện Harry Potter của J.K. Rowling. Cậu bé Harry Potter khám phá ra mình là phù thủy và bắt đầu hành trình tại trường Hogwarts.',
     N'J.K. Rowling mở ra thế giới phép thuật kỳ diệu thông qua hành trình của cậu bé Harry Potter tại trường Hogwarts. Từ một đứa trẻ mồ côi sống khổ sở, Harry phát hiện thân phận đặc biệt của mình và kết bạn với Ron cùng Hermione. Cuốn sách hấp dẫn độc giả bởi trí tưởng tượng phong phú, những cuộc phiêu lưu kỳ thú và thông điệp về tình bạn, lòng dũng cảm.',
     125000, 15, 'files/books/harry_potter_1.epub', 'https://picsum.photos/seed/book010/200/300',
     6, 2, 1997, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

    (21, N'Harry Potter và Phòng chứa Bí mật',
     N'Tập thứ hai của bộ truyện Harry Potter. Harry trở lại Hogwarts và phải đối mặt với bí ẩn của Phòng Chứa Bí Mật và Kẻ Thừa Kế của Slytherin.',
     N'Trong năm học thứ hai tại Hogwarts, Harry Potter phải điều tra hàng loạt sự kiện bí ẩn liên quan đến Phòng Chứa Bí Mật. J.K. Rowling tiếp tục phát triển thế giới phép thuật với nhiều nhân vật mới, sinh vật kỳ bí và những tình tiết hồi hộp. Cuốn sách mang đến hành trình phiêu lưu hấp dẫn cùng thông điệp về lòng trung thực và sự dũng cảm.',
     125000, 10, 'files/books/harry_potter_2.epub', 'https://picsum.photos/seed/book011/200/300',
     6, 2, 1998, '2024-01-10 08:30:00', '2024-01-10 08:30:00'),

    (22, N'Dế Mèn phiêu lưu ký',
     N'Tác phẩm văn học thiếu nhi nổi tiếng nhất Việt Nam của Tô Hoài. Cuộc phiêu lưu của chú Dế Mèn qua nhiều vùng đất kỳ thú chứa đựng nhiều bài học về cuộc sống.',
     N'Tô Hoài xây dựng hình tượng Dế Mèn đầy sống động và giàu cá tính trong hành trình khám phá thế giới rộng lớn. Qua những cuộc gặp gỡ và thử thách, Dế Mèn dần trưởng thành, hiểu được giá trị của tình bạn, lòng nhân ái và trách nhiệm. Tác phẩm không chỉ hấp dẫn thiếu nhi mà còn mang nhiều ý nghĩa nhân văn sâu sắc.',
     55000, 20, 'https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/s%C3%A1ch/sachmoi.net_de_men_phieu_luu_ky.epub',
     'https://picsum.photos/seed/book006/200/300',
     3, 5, 1941, '2024-01-07 08:00:00', '2024-01-07 08:00:00'),

    (23, N'Muôn kiếp nhân sinh',
     N'Tác phẩm tâm linh của Nguyên Phong kể về những câu chuyện luân hồi, nhân quả và ý nghĩa của cuộc sống qua nhiều kiếp người khác nhau.',
     N'Nguyên Phong mang đến những câu chuyện giàu tính chiêm nghiệm về luật nhân quả, luân hồi và hành trình phát triển tâm linh của con người. Thông qua nhiều kiếp sống khác nhau, tác giả truyền tải thông điệp về đạo đức, lòng nhân ái và ý nghĩa thật sự của cuộc đời. Cuốn sách đã tạo nên sức ảnh hưởng lớn đối với độc giả yêu thích chủ đề tâm linh và triết lý sống.',
     98000, 20, 'files/books/muon_kiep_nhan_sinh.epub', 'https://picsum.photos/seed/book020/200/300',
     1, 8, 2019, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),
    (24, N'Bố Già',
     N'Tiểu thuyết nổi tiếng của Mario Puzo kể về gia đình mafia Corleone và thế giới ngầm đầy quyền lực, phản bội và danh dự.',
     N'Mario Puzo xây dựng hình tượng Don Vito Corleone như một ông trùm mafia quyền lực nhưng giàu nguyên tắc. Tác phẩm không chỉ nói về tội phạm mà còn khắc họa sâu sắc tình cảm gia đình, lòng trung thành và cuộc chiến quyền lực trong xã hội Mỹ. Với cốt truyện hấp dẫn và nhiều nhân vật ấn tượng, Bố Già trở thành một trong những tiểu thuyết kinh điển mọi thời đại.',
     145000, 15, 'files/books/bo_gia.epub', 'https://picsum.photos/seed/book024/200/300',
     11, 2, 1969, '2024-01-19 08:00:00', '2024-01-19 08:00:00'),

    (25, N'Tuổi trẻ đáng giá bao nhiêu',
     N'Cuốn sách truyền cảm hứng của Rosie Nguyễn dành cho người trẻ về học tập, trải nghiệm và theo đuổi đam mê.',
     N'Rosie Nguyễn chia sẻ những trải nghiệm thực tế trong học tập, công việc và hành trình khám phá thế giới để truyền động lực cho giới trẻ. Tác giả khuyến khích người đọc bước ra khỏi vùng an toàn, học hỏi không ngừng và sống có mục tiêu. Cuốn sách mang giọng văn gần gũi, chân thành và chứa nhiều bài học tích cực về tuổi trẻ.',
     78000, 20, 'files/books/tuoi_tre_dang_gia_bao_nhieu.epub', 'https://picsum.photos/seed/book025/200/300',
     12, 3, 2016, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

    (26, N'Không gia đình',
     N'Tác phẩm kinh điển của Hector Malot kể về cậu bé Rémi trong hành trình phiêu lưu đầy khó khăn để tìm gia đình thật sự của mình.',
     N'Hector Malot đưa người đọc theo chân cậu bé Rémi mồ côi trên hành trình rong ruổi khắp nước Pháp cùng gánh xiếc nhỏ. Qua nhiều biến cố và thử thách, Rémi học được tình yêu thương, lòng dũng cảm và ý nghĩa của gia đình. Tác phẩm giàu tính nhân văn và đã trở thành cuốn sách tuổi thơ quen thuộc với nhiều thế hệ.',
     92000, 20, 'files/books/khong_gia_dinh.epub', 'https://picsum.photos/seed/book026/200/300',
     13, 7, 1878, '2024-01-21 08:00:00', '2024-01-21 08:00:00'),

    (27, N'Những người khốn khổ',
     N'Kiệt tác văn học của Victor Hugo kể về số phận của Jean Valjean và bức tranh xã hội Pháp thế kỷ 19.',
     N'Victor Hugo khắc họa cuộc đời đầy biến động của Jean Valjean — người tù khổ sai luôn tìm cách sống lương thiện giữa xã hội bất công. Tác phẩm phản ánh sâu sắc sự đối lập giữa luật pháp và lòng nhân đạo, đồng thời ca ngợi tình yêu thương và khát vọng tự do. Đây là một trong những tiểu thuyết vĩ đại nhất của văn học thế giới.',
     165000, 10, 'files/books/nhung_nguoi_khon_kho.epub', 'https://picsum.photos/seed/book027/200/300',
     14, 2, 1862, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

    (28, N'Cha giàu cha nghèo',
     N'Robert Kiyosaki chia sẻ những bài học tài chính nổi tiếng thông qua góc nhìn của hai người cha có tư duy khác nhau về tiền bạc.',
     N'Trong cuốn sách nổi tiếng này, Robert Kiyosaki phân tích sự khác biệt giữa tư duy làm giàu và tư duy tài chính truyền thống. Tác giả nhấn mạnh tầm quan trọng của đầu tư, tài sản và giáo dục tài chính thay vì chỉ làm việc để kiếm lương. Cuốn sách đã thay đổi cách nhìn của hàng triệu người về tiền bạc và tự do tài chính.',
     99000, 25, 'files/books/cha_giau_cha_ngheo.epub', 'https://picsum.photos/seed/book028/200/300',
     15, 3, 1997, '2024-01-23 08:00:00', '2024-01-23 08:00:00'),

    (29, N'Nhà giả kim',
     N'Tiểu thuyết nổi tiếng của Paulo Coelho kể về hành trình theo đuổi giấc mơ của chàng chăn cừu Santiago.',
     N'Paulo Coelho kể câu chuyện đầy cảm hứng về Santiago — chàng trai trẻ rời quê hương để đi tìm kho báu theo giấc mơ của mình. Trên hành trình ấy, cậu học được nhiều bài học về định mệnh, lòng tin và ý nghĩa cuộc sống. Tác phẩm truyền động lực mạnh mẽ cho người đọc trong việc theo đuổi ước mơ cá nhân.',
     89000, 20, 'files/books/nha_gia_kim.epub', 'https://picsum.photos/seed/book029/200/300',
     16, 2, 1988, '2024-01-24 08:00:00', '2024-01-24 08:00:00'),

    (30, N'Ông già và biển cả',
     N'Tác phẩm nổi tiếng của Ernest Hemingway kể về cuộc chiến giữa con người và thiên nhiên qua hình tượng ông lão đánh cá Santiago.',
     N'Ernest Hemingway xây dựng câu chuyện giản dị nhưng đầy ý nghĩa về ông lão Santiago trong chuyến ra khơi săn con cá kiếm khổng lồ. Tác phẩm thể hiện tinh thần kiên cường, lòng tự trọng và ý chí không khuất phục trước thất bại của con người. Với văn phong cô đọng và giàu biểu tượng, cuốn sách đã giúp Hemingway giành giải Nobel Văn học.',
     68000, 20, 'files/books/ong_gia_va_bien_ca.epub', 'https://picsum.photos/seed/book030/200/300',
     17, 2, 1952, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

    (31, N'Đọc vị bất kỳ ai',
     N'Cuốn sách tâm lý học ứng dụng giúp người đọc hiểu hành vi, cảm xúc và suy nghĩ của người khác.',
     N'Tác giả David J. Lieberman chia sẻ nhiều phương pháp phân tích tâm lý và giao tiếp giúp người đọc hiểu rõ người đối diện trong cuộc sống và công việc. Thông qua các ví dụ thực tế, cuốn sách hướng dẫn cách nhận biết cảm xúc, sự thật và động cơ ẩn sau hành động của con người. Đây là một trong những cuốn sách kỹ năng tâm lý được yêu thích hiện nay.',
     85000, 20, 'files/books/doc_vi_bat_ky_ai.epub', 'https://picsum.photos/seed/book031/200/300',
     18, 3, 2008, '2024-01-26 08:00:00', '2024-01-26 08:00:00'),

    (32, N'Cuốn theo chiều gió',
     N'Tiểu thuyết nổi tiếng của Margaret Mitchell lấy bối cảnh nội chiến Mỹ và chuyện tình đầy biến động của Scarlett O’Hara.',
     N'Margaret Mitchell tái hiện bức tranh nước Mỹ thời nội chiến thông qua cuộc đời nhiều sóng gió của Scarlett O’Hara. Nhân vật chính là biểu tượng của sự mạnh mẽ, tham vọng và khát vọng sinh tồn trong thời kỳ biến động lịch sử. Tác phẩm nổi bật với cốt truyện lôi cuốn, chuyện tình sâu sắc và giá trị văn học lâu bền.',
     150000, 10, 'files/books/cuon_theo_chieu_gio.epub', 'https://picsum.photos/seed/book032/200/300',
     19, 2, 1936, '2024-01-27 08:00:00', '2024-01-27 08:00:00'),

    (33, N'Cây cam ngọt của tôi',
     N'Tiểu thuyết cảm động của José Mauro de Vasconcelos kể về tuổi thơ nghèo khó nhưng giàu trí tưởng tượng của cậu bé Zezé.',
     N'José Mauro de Vasconcelos mang đến câu chuyện đầy xúc động về cậu bé Zezé sống trong nghèo khó nhưng luôn lạc quan và giàu tình cảm. Qua những biến cố trong cuộc sống và mối quan hệ với người lớn xung quanh, Zezé dần trưởng thành và hiểu hơn về tình yêu thương. Tác phẩm khiến người đọc đồng cảm sâu sắc với tâm hồn trẻ thơ mong manh nhưng mạnh mẽ.',
     88000, 20, 'files/books/cay_cam_ngot_cua_toi.epub', 'https://picsum.photos/seed/book033/200/300',
     20, 1, 1968, '2024-01-28 08:00:00', '2024-01-28 08:00:00');

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
