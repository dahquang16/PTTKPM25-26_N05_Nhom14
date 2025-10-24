INSERT INTO users (name, email, phone, password, role, address)
VALUES ('Admin', 'admin@bookstore.com', '0123456789',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'ADMIN', 'Số 1 Phố Huế, Hai Bà Trưng, Hà Nội');

INSERT INTO users (name, email, phone, password, role, address)
VALUES
('Nguyễn Văn An', 'an.nguyen@email.com', '0987654321',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'CUSTOMER', '123 Đường Trần Duy Hưng, Cầu Giấy, Hà Nội'),
('Trần Thị Bình', 'binh.tran@email.com', '0987654322',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'CUSTOMER', '456 Đường Giải Phóng, Hai Bà Trưng, Hà Nội'),
('Lê Văn Cường', 'cuong.le@email.com', '0987654323',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'CUSTOMER', '789 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội');

INSERT INTO books (title, author, publisher, isbn, description, summary, price, image_url, category, stock_quantity, rating, review_count)
VALUES
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 'NXB Trẻ', '9786041094567',
 'Câu chuyện tuổi thơ đầy cảm xúc tại một làng quê Việt Nam qua đôi mắt trẻ thơ.', 
 'Tình bạn, ký ức và niềm trong sáng tuổi nhỏ.', 95000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Văn học Việt Nam', 120, 4.7, 2100),

('Mắt Biếc', 'Nguyễn Nhật Ánh', 'NXB Trẻ', '9786041045681',
 'Chuyện tình buồn của Ngạn và Hà Lan, gắn liền với làng Đo Đo.', 
 'Một trong những tác phẩm nổi tiếng nhất của Nguyễn Nhật Ánh.', 98000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Văn học Việt Nam', 150, 4.8, 2500),

('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 'NXB Hội Nhà Văn', '9786046980421',
 'Cuốn sách truyền cảm hứng về hành trình khám phá bản thân và sống có ý nghĩa.', 
 'Giúp người trẻ định hướng, phát triển và tận dụng thanh xuân.', 89000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Kỹ năng sống', 90, 4.6, 1700),

('Đắc Nhân Tâm', 'Dale Carnegie', 'NXB Tổng Hợp TP.HCM', '9786041234505',
 'Tác phẩm kinh điển về nghệ thuật giao tiếp và ứng xử.', 
 'Giúp bạn được yêu mến, thuyết phục người khác và thành công hơn.', 115000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Kỹ năng sống', 200, 4.9, 3200),

('Nhà Giả Kim', 'Paulo Coelho', 'NXB Văn Học', '9786041198685',
 'Câu chuyện đầy triết lý về hành trình theo đuổi giấc mơ của chàng Santiago.', 
 'Tác phẩm biểu tượng về sự khám phá và ý nghĩa cuộc sống.', 99000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Văn học nước ngoài', 140, 4.8, 3100),

('Muôn Kiếp Nhân Sinh', 'Nguyên Phong', 'NXB Tổng Hợp TP.HCM', '9786041186860',
 'Khám phá nhân quả và luân hồi qua câu chuyện của một doanh nhân Mỹ.', 
 'Tác phẩm chứa đựng triết lý sâu sắc về nghiệp và cuộc sống.', 168000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Tâm linh', 100, 4.7, 2200),

('Trò Chuyện Với Thượng Đế', 'Neale Donald Walsch', 'NXB Văn Hóa Thông Tin', '9786041134564',
 'Tác giả kể về những đối thoại kỳ diệu giữa ông và Thượng Đế.', 
 'Một hành trình tìm kiếm sự thật và bình an nội tâm.', 175000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Tâm linh', 60, 4.5, 950),

('Không Gia Đình', 'Hector Malot', 'NXB Kim Đồng', '9786042048501',
 'Câu chuyện cảm động về cậu bé Rémi trong hành trình phiêu lưu khắp nước Pháp.', 
 'Một tác phẩm kinh điển về tình người và nghị lực sống.', 86000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Thiếu nhi', 130, 4.8, 2800),

('Chiến Binh Cầu Vồng', 'Andrea Hirata', 'NXB Hội Nhà Văn', '9786041129003',
 'Câu chuyện xúc động về hành trình học tập của nhóm học sinh nghèo Indonesia.', 
 'Truyền cảm hứng mạnh mẽ về giáo dục và niềm tin.', 97000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Văn học nước ngoài', 80, 4.6, 1600),

('Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 'NXB Thế Giới', '9786041131113',
 'Từ thời nguyên thủy đến kỷ nguyên công nghệ, loài người đã đi xa như thế nào.', 
 'Một tác phẩm kinh điển kết hợp giữa triết học, khoa học và lịch sử.', 245000,
 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 'Khoa học xã hội', 75, 4.9, 5000);

INSERT INTO orders (user_id, shipping_address, shipping_phone, total_amount, status, payment_method, notes)
VALUES
(2, '123 Đường Trần Duy Hưng, Cầu Giấy, Hà Nội', '0987654321', 193000, 'DELIVERED', 'CASH_ON_DELIVERY', 'Giao buổi chiều'),
(3, '456 Đường Giải Phóng, Hai Bà Trưng, Hà Nội', '0987654322', 204000, 'SHIPPED', 'BANK_TRANSFER', ''),
(4, '789 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội', '0987654323', 343000, 'PENDING', 'CASH_ON_DELIVERY', '');

INSERT INTO order_items (order_id, book_id, quantity, price)
VALUES
(1, 1, 1, 95000),
(1, 2, 1, 98000),
(2, 3, 1, 89000),
(2, 4, 1, 115000),
(3, 5, 1, 99000),
(3, 6, 1, 168000);
