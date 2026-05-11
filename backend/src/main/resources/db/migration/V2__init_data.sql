-- ============================================================
-- SEED DATA - SQL SERVER
-- ============================================================

SET NOCOUNT ON;
SET IDENTITY_INSERT [Users] ON;

-- ============================================================
-- 1. USERS (10 users: 2 admin, 8 user)
-- ============================================================
INSERT INTO [Users] ([user_id],[username],[avatar_url],[email],[phone],[password_hash],[role],[status],[created_at],[updated_at])
VALUES
(1,  N'Nguyễn Văn An',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user001',  'an.nguyen@gmail.com',      '0912345678', '$2b$10$hashed_password_001', 'ADM', 'active', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
(2,  N'Trần Thị Bình',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user002',  'binh.tran@gmail.com',      '0923456789', '$2b$10$hashed_password_002', 'ADM', 'active', '2024-01-02 09:00:00', '2024-01-02 09:00:00'),
(3,  N'Lê Minh Châu',     'https://api.dicebear.com/7.x/avataaars/svg?seed=user003',  'chau.le@gmail.com',        '0934567890', '$2b$10$hashed_password_003', 'USR', 'active', '2024-01-05 10:00:00', '2024-03-10 15:30:00'),
(4,  N'Phạm Thị Dung',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user004',  'dung.pham@gmail.com',      '0945678901', '$2b$10$hashed_password_004', 'USR', 'active', '2024-01-10 11:00:00', '2024-02-20 09:00:00'),
(5,  N'Hoàng Văn Em',     'https://api.dicebear.com/7.x/avataaars/svg?seed=user005',  'em.hoang@gmail.com',       '0956789012', '$2b$10$hashed_password_005', 'USR', 'active', '2024-01-15 08:30:00', '2024-04-01 12:00:00'),
(6,  N'Vũ Thị Phương',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user006',  'phuong.vu@gmail.com',      '0967890123', '$2b$10$hashed_password_006', 'USR', 'locked', '2024-01-20 14:00:00', '2024-03-05 10:00:00'),
(7,  N'Đặng Quốc Hùng',   'https://api.dicebear.com/7.x/avataaars/svg?seed=user007',  'hung.dang@gmail.com',      '0978901234', '$2b$10$hashed_password_007', 'USR', 'active', '2024-02-01 08:00:00', '2024-04-10 11:00:00'),
(8,  N'Bùi Thị Lan',      'https://api.dicebear.com/7.x/avataaars/svg?seed=user008',  'lan.bui@gmail.com',        '0989012345', '$2b$10$hashed_password_008', 'USR', 'active', '2024-02-10 09:00:00', '2024-04-05 16:00:00'),
(9,  N'Ngô Thành Long',   'https://api.dicebear.com/7.x/avataaars/svg?seed=user009',  'long.ngo@gmail.com',       '0990123456', '$2b$10$hashed_password_009', 'USR', 'active', '2024-02-15 10:30:00', '2024-03-20 08:00:00'),
(10, N'Trịnh Thị Mai',    'https://api.dicebear.com/7.x/avataaars/svg?seed=user010',  'mai.trinh@gmail.com',      '0901234567', '$2b$10$hashed_password_010', 'USR', 'active', '2024-03-01 13:00:00', '2024-04-12 09:30:00');

SET IDENTITY_INSERT [Users] OFF;
GO

-- ============================================================
-- 2. AUTHORS (10 tác giả)
-- ============================================================
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

-- ============================================================
-- 3. CATEGORIES (8 thể loại)
-- ============================================================
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

-- ============================================================
-- 4. BOOKS (20 cuốn sách)
-- ============================================================
SET IDENTITY_INSERT [Books] ON;

INSERT INTO [Books] ([book_id],[title],[description],[price],[preview_percentage],[file_url],[cover_image],[author_id],[category_id],[publish_year],[created_at],[updated_at])
VALUES
(1,  N'Tôi thấy hoa vàng trên cỏ xanh',
     N'Câu chuyện về tuổi thơ đẹp đẽ và trong sáng của hai anh em Thiều và Tường ở một làng quê Việt Nam. Tác phẩm được chuyển thể thành bộ phim điện ảnh nổi tiếng.',
     85000, 15, 'files/books/hoa_vang_co_xanh.epub', 'https://picsum.photos/seed/book001/200/300', 1, 1, 2015, '2024-01-05 08:00:00', '2024-01-05 08:00:00'),

(2,  N'Mắt biếc',
     N'Câu chuyện tình yêu lãng mạn, buồn thương giữa Ngạn và Hà Lan trải dài suốt những năm tháng tuổi thơ đến trưởng thành. Một trong những tác phẩm được yêu thích nhất của Nguyễn Nhật Ánh.',
     79000, 10, 'files/books/mat_biec.epub', 'https://picsum.photos/seed/book002/200/300', 1, 1, 2016, '2024-01-05 08:30:00', '2024-01-05 08:30:00'),

(3,  N'Cho tôi xin một vé đi tuổi thơ',
     N'Cuốn sách kể về những ngày tháng tuổi thơ hồn nhiên, trong sáng của một cậu bé tám tuổi với những trò chơi và ước mơ giản dị.',
     69000, 20, 'files/books/ve_di_tuoi_tho.epub', 'https://picsum.photos/seed/book003/200/300', 1, 5, 2008, '2024-01-05 09:00:00', '2024-01-05 09:00:00'),

(4,  N'Chí Phèo',
     N'Tác phẩm xuất sắc của Nam Cao, kể về số phận bi thảm của Chí Phèo - người nông dân lương thiện bị xã hội đẩy vào con đường tha hóa. Tác phẩm kinh điển của văn học hiện thực Việt Nam.',
     45000, 25, 'files/books/chi_pheo.epub', 'https://picsum.photos/seed/book004/200/300', 2, 1, 1941, '2024-01-06 08:00:00', '2024-01-06 08:00:00'),

(5,  N'Lão Hạc',
     N'Truyện ngắn của Nam Cao viết về người nông dân nghèo khổ tên Lão Hạc với tình cảm sâu sắc dành cho người con trai và con chó. Tác phẩm phản ánh hiện thực xã hội Việt Nam trước 1945.',
     35000, 30, 'files/books/lao_hac.epub', 'https://picsum.photos/seed/book005/200/300', 2, 1, 1943, '2024-01-06 08:30:00', '2024-01-06 08:30:00'),

(6,  N'Dế Mèn phiêu lưu ký',
     N'Tác phẩm văn học thiếu nhi nổi tiếng nhất Việt Nam của Tô Hoài. Cuộc phiêu lưu của chú Dế Mèn qua nhiều vùng đất kỳ thú chứa đựng nhiều bài học về cuộc sống.',
     55000, 20, 'files/books/de_men_phieu_luu_ky.epub', 'https://picsum.photos/seed/book006/200/300', 3, 5, 1941, '2024-01-07 08:00:00', '2024-01-07 08:00:00'),

(7,  N'Nhà Giả Kim',
     N'Tiểu thuyết của Paulo Coelho kể về cuộc hành trình của chàng chăn cừu Santiago tìm kiếm kho báu và khám phá ý nghĩa của cuộc đời. Sách bán chạy nhất mọi thời đại.',
     95000, 15, 'files/books/nha_gia_kim.epub', 'https://picsum.photos/seed/book007/200/300', 4, 2, 1988, '2024-01-08 08:00:00', '2024-01-08 08:00:00'),

(8,  N'Rừng Na Uy',
     N'Tiểu thuyết của Haruki Murakami kể về Watanabe và những mối tình phức tạp trong những năm 1960 tại Nhật Bản. Tác phẩm mang âm hưởng buồn bã, sâu lắng về tình yêu và sự mất mát.',
     110000, 10, 'files/books/rung_na_uy.epub', 'https://picsum.photos/seed/book008/200/300', 5, 2, 1987, '2024-01-09 08:00:00', '2024-01-09 08:00:00'),

(9,  N'Kafka bên bờ biển',
     N'Tiểu thuyết của Murakami xen lẫn thực tế và huyền ảo, kể về cậu bé Kafka Tamura bỏ nhà ra đi và người đàn ông già Nakata có khả năng nói chuyện với mèo.',
     120000, 10, 'files/books/kafka_ben_bo_bien.epub', 'https://picsum.photos/seed/book009/200/300', 5, 2, 2002, '2024-01-09 09:00:00', '2024-01-09 09:00:00'),

(10, N'Harry Potter và Hòn đá Phù thủy',
     N'Tập đầu tiên trong bộ truyện Harry Potter của J.K. Rowling. Cậu bé Harry Potter khám phá ra mình là phù thủy và bắt đầu hành trình tại trường Hogwarts.',
     125000, 15, 'files/books/harry_potter_1.epub', 'https://picsum.photos/seed/book010/200/300', 6, 2, 1997, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(11, N'Harry Potter và Phòng chứa Bí mật',
     N'Tập thứ hai của bộ truyện Harry Potter. Harry trở lại Hogwarts và phải đối mặt với bí ẩn của Phòng Chứa Bí Mật và Kẻ Thừa Kế của Slytherin.',
     125000, 10, 'files/books/harry_potter_2.epub', 'https://picsum.photos/seed/book011/200/300', 6, 2, 1998, '2024-01-10 08:30:00', '2024-01-10 08:30:00'),

(12, N'Đắc Nhân Tâm',
     N'Cuốn sách kinh điển của Dale Carnegie về nghệ thuật giao tiếp và gây ảnh hưởng đến người khác. Một trong những cuốn sách self-help bán chạy nhất lịch sử.',
     89000, 20, 'files/books/dac_nhan_tam.epub', 'https://picsum.photos/seed/book012/200/300', 7, 3, 1936, '2024-01-11 08:00:00', '2024-01-11 08:00:00'),

(13, N'Sapiens: Lược sử loài người',
     N'Yuval Noah Harari đưa người đọc qua hành trình 70.000 năm lịch sử loài người, từ thời đồ đá đến cách mạng khoa học. Một tác phẩm phi hư cấu xuất sắc.',
     135000, 15, 'files/books/sapiens.epub', 'https://picsum.photos/seed/book013/200/300', 8, 4, 2011, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(14, N'Homo Deus: Lược sử tương lai',
     N'Tiếp nối Sapiens, Harari khám phá tương lai của loài người trong thế kỷ 21 khi công nghệ và trí tuệ nhân tạo ngày càng phát triển.',
     135000, 15, 'files/books/homo_deus.epub', 'https://picsum.photos/seed/book014/200/300', 8, 4, 2015, '2024-01-12 09:00:00', '2024-01-12 09:00:00'),

(15, N'Số đỏ',
     N'Tiểu thuyết trào phúng xuất sắc của Vũ Trọng Phụng viết về nhân vật Xuân Tóc Đỏ - kẻ cơ hội leo lên đỉnh cao xã hội. Tác phẩm phê phán sắc nét xã hội thực dân nửa phong kiến.',
     55000, 25, 'files/books/so_do.epub', 'https://picsum.photos/seed/book015/200/300', 9, 1, 1936, '2024-01-13 08:00:00', '2024-01-13 08:00:00'),

(16, N'Tắt đèn',
     N'Tiểu thuyết của Ngô Tất Tố khắc họa cuộc sống khốn khổ của người nông dân nghèo qua hình ảnh chị Dậu phải bán con và chồng để nộp sưu thuế.',
     45000, 25, 'files/books/tat_den.epub', 'https://picsum.photos/seed/book016/200/300', 10, 1, 1939, '2024-01-14 08:00:00', '2024-01-14 08:00:00'),

(17, N'Vợ chồng A Phủ',
     N'Truyện ngắn của Tô Hoài kể về cuộc đời của Mị và A Phủ - hai người dân tộc Mông bị áp bức, bóc lột và hành trình giải phóng bản thân.',
     40000, 30, 'files/books/vo_chong_a_phu.epub', 'https://picsum.photos/seed/book017/200/300', 3, 1, 1952, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(18, N'21 bài học cho thế kỷ 21',
     N'Harari phân tích những thách thức lớn nhất mà nhân loại đang đối mặt trong thế kỷ 21: chủ nghĩa dân tộc, tôn giáo, khủng bố, công nghệ và biến đổi khí hậu.',
     129000, 15, 'files/books/21_bai_hoc.epub', 'https://picsum.photos/seed/book018/200/300', 8, 4, 2018, '2024-01-16 08:00:00', '2024-01-16 08:00:00'),

(19, N'Đường về',
     N'Tiểu thuyết của Nguyễn Nhật Ánh kể về hành trình tìm lại ký ức và tình yêu của nhân vật chính sau nhiều năm xa cách quê hương.',
     75000, 10, 'files/books/duong_ve.epub', 'https://picsum.photos/seed/book019/200/300', 1, 1, 2020, '2024-01-17 08:00:00', '2024-01-17 08:00:00'),

(20, N'Muôn kiếp nhân sinh',
     N'Tác phẩm tâm linh của Nguyên Phong kể về những câu chuyện luân hồi, nhân quả và ý nghĩa của cuộc sống qua nhiều kiếp người khác nhau.',
     98000, 20, 'files/books/muon_kiep_nhan_sinh.epub', 'https://picsum.photos/seed/book020/200/300', 1, 8, 2019, '2024-01-18 08:00:00', '2024-01-18 08:00:00');

SET IDENTITY_INSERT [Books] OFF;
GO

-- ============================================================
-- 5. REVIEWS (25 đánh giá)
-- ============================================================
SET IDENTITY_INSERT [Reviews] ON;

INSERT INTO [Reviews] ([review_id],[user_id],[book_id],[rating],[comment],[status],[created_at])
VALUES
(1,  3,  1, 5, N'Cuốn sách tuyệt vời! Gợi lại bao nhiêu kỷ niệm tuổi thơ. Văn phong trong sáng, cảm xúc dạt dào. Highly recommend!', 'visible', '2024-02-01 10:00:00'),
(2,  4,  1, 4, N'Câu chuyện xúc động về tình anh em và tuổi thơ đẹp. Tuy nhiên đôi chỗ hơi chậm nhịp. Vẫn rất đáng đọc.', 'visible', '2024-02-05 14:00:00'),
(3,  5,  1, 5, N'Nguyễn Nhật Ánh đỉnh quá! Đọc xong khóc không cầm được. Sẽ mua tặng cho các em nhỏ nhà mình.', 'visible', '2024-02-10 09:00:00'),
(4,  7,  2, 5, N'Mắt Biếc là tác phẩm hay nhất của Nguyễn Nhật Ánh theo mình. Tình yêu của Ngạn dành cho Hà Lan thật đẹp và buồn.', 'visible', '2024-02-12 11:00:00'),
(5,  8,  2, 4, N'Truyện buồn nhưng rất đẹp. Nhân vật được xây dựng chân thực và sâu sắc. Kết thúc khiến mình ngồi thẫn thờ cả tiếng đồng hồ.', 'visible', '2024-02-15 15:00:00'),
(6,  3,  4, 5, N'Chí Phèo là tác phẩm không thể bỏ qua của văn học Việt Nam. Nam Cao viết quá sắc sảo, phân tích tâm lý nhân vật rất hay.', 'visible', '2024-02-18 10:30:00'),
(7,  9,  4, 5, N'Một tuyệt tác! Số phận của Chí Phèo khiến người đọc vừa thương vừa ám ảnh mãi không quên. Văn học hiện thực đỉnh cao.', 'visible', '2024-02-20 14:00:00'),
(8,  10, 6, 5, N'Dế Mèn phiêu lưu ký - tuổi thơ của biết bao thế hệ. Đọc lại vẫn thấy thích như lần đầu tiên. Cổ điển mà không bao giờ lỗi thời.', 'visible', '2024-02-22 09:00:00'),
(9,  4,  7, 5, N'Nhà Giả Kim thay đổi cách nhìn của mình về cuộc sống. Câu chuyện về việc theo đuổi ước mơ thật truyền cảm hứng. Đọc đi đọc lại nhiều lần.', 'visible', '2024-03-01 10:00:00'),
(10, 5,  7, 4, N'Sách hay, ý nghĩa. Tuy nhiên mình thấy một số phần hơi dài dòng. Nhưng thông điệp về việc lắng nghe trái tim mình thì rất đáng suy nghĩ.', 'visible', '2024-03-05 11:00:00'),
(11, 7,  7, 5, N'Cuốn sách thay đổi cuộc đời mình! Santiago trên hành trình tìm kho báu chính là hành trình của mỗi chúng ta. Xuất sắc!', 'visible', '2024-03-08 15:00:00'),
(12, 8,  8, 5, N'Rừng Na Uy là trải nghiệm đọc sách đáng nhớ nhất của mình. Murakami viết về tình yêu và mất mát một cách tinh tế không ai bằng được.', 'visible', '2024-03-10 10:00:00'),
(13, 9,  8, 4, N'Sách hay nhưng khá nặng nề về mặt cảm xúc. Nên đọc khi tâm trạng ổn định. Nhân vật Naoko ám ảnh mình mãi.', 'visible', '2024-03-12 14:00:00'),
(14, 3, 10, 5, N'Harry Potter luôn là phần ký ức đẹp nhất của tuổi thơ mình. Đọc bản dịch tiếng Việt cũng rất hay, giữ được hồn của câu chuyện.', 'visible', '2024-03-15 09:00:00'),
(15, 10, 10, 5, N'Đây là lần thứ 3 mình đọc lại bộ Harry Potter. Mỗi lần đọc lại đều phát hiện ra chi tiết mới thú vị. Rowling thật tài năng!', 'visible', '2024-03-18 11:00:00'),
(16, 4, 12, 5, N'Đắc Nhân Tâm là cuốn sách PHẢI ĐỌC. Những nguyên tắc của Carnegie tuy đơn giản nhưng cực kỳ hiệu quả trong cuộc sống và công việc.', 'visible', '2024-03-20 10:00:00'),
(17, 5, 12, 4, N'Sách kinh điển về kỹ năng giao tiếp. Một số ví dụ đã cũ nhưng bài học vẫn còn nguyên giá trị. Rất bổ ích cho người đi làm.', 'visible', '2024-03-22 14:00:00'),
(18, 8, 13, 5, N'Sapiens mở ra một góc nhìn hoàn toàn mới về lịch sử nhân loại. Harari viết rất dễ hiểu dù đề tài phức tạp. Sách phi hư cấu hay nhất từng đọc.', 'visible', '2024-03-25 09:00:00'),
(19, 9, 13, 5, N'Một tác phẩm phi thường! Cách Harari phân tích và diễn giải lịch sử thật sáng tạo và thuyết phục. Bắt buộc phải đọc.', 'visible', '2024-03-28 11:00:00'),
(20, 7, 15, 5, N'Số Đỏ vẫn còn nguyên tính thời sự dù được viết từ gần 90 năm trước. Vũ Trọng Phụng châm biếm xã hội cực kỳ sắc bén và hài hước.', 'visible', '2024-04-01 10:00:00'),
(21, 3, 16, 4, N'Tắt Đèn là bức tranh chân thực về cuộc sống nông dân Việt Nam. Chị Dậu là hình tượng người phụ nữ Việt Nam kiên cường và đáng thương.', 'visible', '2024-04-03 14:00:00'),
(22, 10, 18, 5, N'21 bài học cho thế kỷ 21 rất kịp thời và cần thiết. Harari giúp người đọc hiểu rõ hơn về những thách thức mà thế giới đang đối mặt.', 'visible', '2024-04-05 09:00:00'),
(23, 6,  3, 3, N'Sách ổn nhưng mình thấy không hay bằng các tác phẩm khác của Nguyễn Nhật Ánh. Đọc được nhưng không quá ấn tượng.', 'visible', '2024-04-07 11:00:00'),
(24, 6,  9, 2, N'Sách hơi khó đọc với mình, cốt truyện phức tạp và rối rắm. Có thể phù hợp với những người thích văn học thực-ảo nhưng không hợp với gu của mình.', 'hidden', '2024-04-09 14:00:00'),
(25, 5, 20, 4, N'Muôn kiếp nhân sinh là cuốn sách rất đặc biệt. Câu chuyện về luân hồi và nhân quả khiến mình suy nghĩ nhiều về ý nghĩa của cuộc sống.', 'visible', '2024-04-10 10:00:00');

SET IDENTITY_INSERT [Reviews] OFF;
GO

-- ============================================================
-- 6. ORDERS (20 đơn hàng)
-- ============================================================
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

-- ============================================================
-- 7. PAYMENTS (18 thanh toán - tương ứng với đơn paid + failed)
-- ============================================================
SET IDENTITY_INSERT [Payments] ON;

INSERT INTO [Payments] ([payment_id],[order_id],[payment_method],[qr_code],[status],[created_at])
VALUES
(1,  1,  'VNPay',    'qr/vnpay_order_001.png', 'success', '2024-02-01 09:02:00'),
(2,  2,  'MoMo',     'qr/momo_order_002.png',  'success', '2024-02-01 09:07:00'),
(3,  3,  'ZaloPay',  'qr/zalo_order_003.png',  'success', '2024-02-10 10:03:00'),
(4,  4,  'VNPay',    'qr/vnpay_order_004.png', 'success', '2024-02-10 10:08:00'),
(5,  5,  'MoMo',     'qr/momo_order_005.png',  'success', '2024-02-15 11:05:00'),
(6,  6,  'VNPay',    'qr/vnpay_order_006.png', 'success', '2024-03-01 08:03:00'),
(7,  7,  'ZaloPay',  'qr/zalo_order_007.png',  'success', '2024-03-01 08:08:00'),
(8,  8,  'MoMo',     'qr/momo_order_008.png',  'success', '2024-03-05 09:05:00'),
(9,  9,  'VNPay',    'qr/vnpay_order_009.png', 'success', '2024-03-10 10:03:00'),
(10, 10, 'MoMo',     'qr/momo_order_010.png',  'success', '2024-03-10 10:08:00'),
(11, 11, 'ZaloPay',  'qr/zalo_order_011.png',  'success', '2024-03-15 11:03:00'),
(12, 12, 'VNPay',    'qr/vnpay_order_012.png', 'success', '2024-03-15 11:08:00'),
(13, 13, 'MoMo',     'qr/momo_order_013.png',  'success', '2024-03-20 09:03:00'),
(14, 14, 'ZaloPay',  'qr/zalo_order_014.png',  'success', '2024-03-20 09:08:00'),
(15, 15, 'VNPay',    'qr/vnpay_order_015.png', 'success', '2024-03-25 10:03:00'),
(16, 16, 'MoMo',     'qr/momo_order_016.png',  'success', '2024-03-25 10:08:00'),
(17, 17, 'ZaloPay',  'qr/zalo_order_017.png',  'success', '2024-04-01 08:03:00'),
(18, 18, 'VNPay',    'qr/vnpay_order_018.png', 'success', '2024-04-01 08:08:00');

SET IDENTITY_INSERT [Payments] OFF;
GO

-- ============================================================
-- 8. COLLECTIONS (8 bộ sưu tập)
-- ============================================================
SET IDENTITY_INSERT [Collections] ON;

INSERT INTO [Collections] ([collection_id],[user_id],[name],[description],[created_at],[updated_at])
VALUES
(1, 3, N'Văn học Việt Nam yêu thích',    N'Tổng hợp những tác phẩm văn học Việt Nam mình yêu thích nhất, từ cổ điển đến hiện đại.', '2024-02-01 10:00:00', '2024-04-10 09:00:00'),
(2, 3, N'Đọc cuối tuần',                 N'Danh sách sách sẽ đọc vào cuối tuần, ưu tiên những cuốn nhẹ nhàng và thú vị.', '2024-03-01 10:00:00', '2024-04-12 09:00:00'),
(3, 4, N'Sách self-help',                N'Những cuốn sách giúp phát triển bản thân và kỹ năng sống.', '2024-02-10 11:00:00', '2024-04-05 10:00:00'),
(4, 5, N'Văn học nước ngoài đỉnh cao',   N'Các tác phẩm văn học nước ngoài được dịch sang tiếng Việt chất lượng tốt.', '2024-03-01 09:00:00', '2024-04-08 11:00:00'),
(5, 7, N'Kho tàng tiểu thuyết',          N'Tập hợp những bộ tiểu thuyết hay nhất đã và đang đọc.', '2024-03-10 10:00:00', '2024-04-11 09:00:00'),
(6, 8, N'Sách phi hư cấu',               N'Những cuốn sách về lịch sử, khoa học và xã hội học thú vị.', '2024-03-20 11:00:00', '2024-04-09 10:00:00'),
(7, 9, N'Đọc lại nhiều lần',             N'Những cuốn sách quá hay, đọc đi đọc lại mãi không chán.', '2024-03-25 09:00:00', '2024-04-10 11:00:00'),
(8, 10, N'Danh sách chờ đọc',            N'Những cuốn sách đang trong danh sách chờ, sẽ đọc dần dần.', '2024-04-01 10:00:00', '2024-04-12 08:00:00');

SET IDENTITY_INSERT [Collections] OFF;
GO

-- ============================================================
-- 9. COLLECTION_ITEMS (30 item trong bộ sưu tập)
-- ============================================================
SET IDENTITY_INSERT [Collection_Items] ON;

INSERT INTO [Collection_Items] ([collection_item_id],[collection_id],[book_id],[added_at])
VALUES
-- Collection 1: Văn học Việt Nam (user 3)
(1,  1,  1,  '2024-02-01 10:05:00'),
(2,  1,  2,  '2024-02-01 10:06:00'),
(3,  1,  4,  '2024-02-01 10:07:00'),
(4,  1,  5,  '2024-02-10 09:00:00'),
(5,  1,  15, '2024-03-01 09:00:00'),
(6,  1,  16, '2024-03-05 09:00:00'),
-- Collection 2: Đọc cuối tuần (user 3)
(7,  2,  3,  '2024-03-01 10:05:00'),
(8,  2,  6,  '2024-03-01 10:06:00'),
(9,  2,  19, '2024-03-10 09:00:00'),
-- Collection 3: Sách self-help (user 4)
(10, 3,  7,  '2024-02-10 11:05:00'),
(11, 3,  12, '2024-02-15 10:00:00'),
(12, 3,  18, '2024-03-01 09:00:00'),
(13, 3,  20, '2024-03-10 10:00:00'),
-- Collection 4: Văn học nước ngoài (user 5)
(14, 4,  7,  '2024-03-01 09:05:00'),
(15, 4,  8,  '2024-03-01 09:06:00'),
(16, 4,  9,  '2024-03-05 10:00:00'),
(17, 4,  10, '2024-03-10 09:00:00'),
(18, 4,  11, '2024-03-15 09:00:00'),
-- Collection 5: Tiểu thuyết (user 7)
(19, 5,  2,  '2024-03-10 10:05:00'),
(20, 5,  7,  '2024-03-10 10:06:00'),
(21, 5,  8,  '2024-03-15 09:00:00'),
(22, 5,  10, '2024-03-15 09:05:00'),
(23, 5,  15, '2024-03-20 10:00:00'),
-- Collection 6: Phi hư cấu (user 8)
(24, 6,  13, '2024-03-20 11:05:00'),
(25, 6,  14, '2024-03-20 11:06:00'),
(26, 6,  18, '2024-03-25 10:00:00'),
-- Collection 7: Đọc lại nhiều lần (user 9)
(27, 7,  4,  '2024-03-25 09:05:00'),
(28, 7,  8,  '2024-03-25 09:06:00'),
-- Collection 8: Danh sách chờ (user 10)
(29, 8,  9,  '2024-04-01 10:05:00'),
(30, 8,  11, '2024-04-01 10:06:00');

SET IDENTITY_INSERT [Collection_Items] OFF;
GO

-- ============================================================
-- 10. READING_PROGRESS (20 bản ghi tiến độ đọc)
-- ============================================================
SET IDENTITY_INSERT [Reading_Progress] ON;

INSERT INTO [Reading_Progress] ([progress_id],[user_id],[book_id],[fi_location],[progress_percentage],[status],[updated_at])
VALUES
(1,  3,  1,  'chapter_12/page_85',   100.00, 'completed', '2024-03-01 21:00:00'),
(2,  3,  4,  'chapter_5/page_112',   100.00, 'completed', '2024-03-10 20:00:00'),
(3,  3,  6,  'chapter_8/page_65',     55.50, 'reading',   '2024-04-12 21:30:00'),
(4,  4,  2,  'chapter_15/page_180',  100.00, 'completed', '2024-03-20 22:00:00'),
(5,  4,  7,  'chapter_20/page_208',  100.00, 'completed', '2024-03-28 21:00:00'),
(6,  4,  12, 'chapter_10/page_150',   68.20, 'reading',   '2024-04-10 20:00:00'),
(7,  5,  7,  'chapter_20/page_208',  100.00, 'completed', '2024-04-05 21:00:00'),
(8,  5,  8,  'chapter_18/page_250',   72.30, 'reading',   '2024-04-12 22:00:00'),
(9,  5,  13, 'chapter_6/page_98',     35.80, 'reading',   '2024-04-11 20:30:00'),
(10, 7,  2,  'chapter_12/page_145',  100.00, 'completed', '2024-04-01 21:00:00'),
(11, 7,  7,  'chapter_20/page_208',  100.00, 'completed', '2024-04-08 20:00:00'),
(12, 7,  10, 'chapter_10/page_130',   55.10, 'reading',   '2024-04-12 21:00:00'),
(13, 7,  15, 'chapter_7/page_95',     82.40, 'reading',   '2024-04-11 22:00:00'),
(14, 8,  8,  'chapter_25/page_360',  100.00, 'completed', '2024-04-10 21:00:00'),
(15, 8,  13, 'chapter_15/page_230',   68.50, 'reading',   '2024-04-12 20:30:00'),
(16, 9,  4,  'chapter_5/page_112',   100.00, 'completed', '2024-04-05 20:00:00'),
(17, 9,  8,  'chapter_8/page_110',    42.30, 'reading',   '2024-04-12 21:30:00'),
(18, 10, 10, 'chapter_17/page_222',  100.00, 'completed', '2024-04-10 22:00:00'),
(19, 10, 18, 'chapter_4/page_55',     22.10, 'reading',   '2024-04-12 19:00:00'),
(20, 3,  19, 'chapter_3/page_42',     28.60, 'paused',    '2024-04-08 20:00:00');

SET IDENTITY_INSERT [Reading_Progress] OFF;
GO

-- ============================================================
-- 11. READER_SETTING (8 cài đặt giao diện đọc)
-- ============================================================
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

-- ============================================================
-- VERIFY DATA
-- ============================================================
SELECT 'Users'            AS [Table], COUNT(*) AS [Rows] FROM [Users]
UNION ALL
SELECT 'Authors',           COUNT(*) FROM [Authors]
UNION ALL
SELECT 'Categories',        COUNT(*) FROM [Categories]
UNION ALL
SELECT 'Books',             COUNT(*) FROM [Books]
UNION ALL
SELECT 'Reviews',           COUNT(*) FROM [Reviews]
UNION ALL
SELECT 'Orders',            COUNT(*) FROM [Orders]
UNION ALL
SELECT 'Payments',          COUNT(*) FROM [Payments]
UNION ALL
SELECT 'Collections',       COUNT(*) FROM [Collections]
UNION ALL
SELECT 'Collection_Items',  COUNT(*) FROM [Collection_Items]
UNION ALL
SELECT 'Reading_Progress',  COUNT(*) FROM [Reading_Progress]
UNION ALL
SELECT 'Reader_Setting',    COUNT(*) FROM [Reader_Setting];