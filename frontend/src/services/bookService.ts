// ============================================================
// FILE: src/services/bookService.ts
// ============================================================
// TỔNG QUAN:
//   - Service xử lý tất cả API calls liên quan đến sách:
//     lấy danh sách, tìm kiếm, xem chi tiết, wishlist, tạo/sửa/xóa (admin)
//
//   TẠI SAO FILE NÀY QUAN TRỌNG NHẤT?
//   Book là entity trung tâm của ứng dụng.
//   Hầu hết mọi trang đều cần data từ bookService:
//   - Home.tsx: getBestsellers(), getNewReleases()
//   - BookList.tsx: getBooks(), searchBooks(), getByCategory()
//   - BookDetail.tsx: getBookBySlug(), getRelated()
//   - Library.tsx: (qua orderService.getLibrary())
//   - Navbar.tsx: (search form)
//
//   LIÊN HỆ VỚI CÁC FILE KHÁC:
//   - src/services/api.ts: Mọi request đi qua api instance
//   - src/types/index.ts: BookResponse, PageResponse, BookRequest
//   - src/pages/Home.tsx: getBestsellers(), getNewReleases()
//   - src/pages/BookList.tsx: getBooks(), searchBooks()
//   - src/pages/BookDetail.tsx: getBookBySlug(), getRelated()
//   - src/components/ui/BookCard.tsx: addToWishlist(), removeFromWishlist()
//
//   TỪ BACKEND (khớp với BookController.java):
//   - GET /api/books → BookController.getBooks()
//   - GET /api/books/search → BookController.searchBooks()
//   - GET /api/books/bestsellers → BookController.getBestsellers()
//   - GET /api/books/new-releases → BookController.getNewReleases()
//   - GET /api/books/category/{slug} → BookController.getByCategory()
//   - GET /api/books/{slug} → BookController.getBookBySlug()
//   - GET /api/books/{id}/related → BookController.getRelatedBooks()
//   - POST /api/books/{id}/wishlist → BookController.addToWishlist()
//   - DELETE /api/books/{id}/wishlist → BookController.removeFromWishlist()
//   - GET /api/books/wishlist → BookController.getWishlist()
// ============================================================

import api from "./api";
import type { BookResponse } from "../types";

export const bookService = {

    getBestRatings: async (limit = 4): Promise<BookResponse[]> => {
        const res = await api.get<BookResponse[]>("/books/bestRatings", {
            params: { limit },
        });
        return res.data;
    },
};