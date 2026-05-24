import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Bell, Settings, Tag, Calendar, Trash2, Eye, Edit3, ChevronLeft, ChevronRight, X, Plus, Percent, CheckSquare
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar'; 

// --- Interface hứng dữ liệu chuẩn từ Spring Boot ---
interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface SaleAdminResponse {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  bookCount?: number; // Sẽ được Frontend tính toán hoặc cập nhật động
}

interface SaleStatsResponse {
  totalSales: number;
  activeSales: number;
  upcomingSales: number;
}

interface BookResponse {
  id: number;
  title: string; 
  author?: string;
}

export default function SaleManagement(): React.JSX.Element {
  // --- States quản lý dữ liệu API ---
  const [sales, setSales] = useState<SaleAdminResponse[]>([]);
  const [stats, setStats] = useState<SaleStatsResponse>({ totalSales: 0, activeSales: 0, upcomingSales: 0 });
  const [selectedSale, setSelectedSale] = useState<SaleAdminResponse | null>(null);
  
  // State lưu trữ số lượng sách của từng saleId dạng Key-Value (Ví dụ: { 1: 5, 2: 12 })
  const [saleBookCounts, setSaleBookCounts] = useState<Record<number, number>>({});
  // State lưu danh sách sách chi tiết của đợt sale đang xem trong Modal chi tiết
  const [selectedSaleBooks, setSelectedSaleBooks] = useState<BookResponse[]>([]);

  // --- Trạng thái UI/UX và Modal ---
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'detail' | 'create' | 'edit' | null>(null); 
  const [editingSaleId, setEditingSaleId] = useState<number | null>(null);

  // --- Trạng thái Tìm kiếm, Bộ lọc & Phân trang ---
  const [keyword, setKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  // --- States phục vụ Form (Tạo mới & Sửa) ---
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');
  
  const [bookSearchKey, setBookSearchKey] = useState<string>('');
  const [dbBooks, setDbBooks] = useState<BookResponse[]>([]); 
  const [selectedBooks, setSelectedBooks] = useState<BookResponse[]>([]); 
  const [isSelectAllLoading, setIsSelectAllLoading] = useState<boolean>(false);

  // URL Cấu hình API Backend
  const API_BASE_URL = 'http://localhost:8080/api/sales';
  const API_BOOK_URL = 'http://localhost:8080/api/books'; 

  // Hàm gọi API đếm số lượng sách cho từng chiến dịch cụ thể
  const fetchBookCountForSale = useCallback(async (saleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${saleId}/books`, { method: 'GET' });
      if (response.ok) {
        const booksData: BookResponse[] = await response.json();
        // Cập nhật số lượng đếm được vào state bản đồ số lượng
        setSaleBookCounts(prev => ({ ...prev, [saleId]: booksData.length }));
        return booksData;
      }
    } catch (error) {
      console.error(`Lỗi lấy danh sách sách đếm số lượng cho sale #${saleId}:`, error);
    }
    return [];
  }, []);

  // 1. Lấy danh sách đợt Sale và tự động kích hoạt đếm số sách kèm theo
  const fetchSales = useCallback(async (searchKey: string, status: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin?keyword=${encodeURIComponent(searchKey)}&status=${status}&page=${page}&size=${pageSize}`,
        { method: 'GET' }
      );
      if (response.ok) {
        const data: SpringPage<SaleAdminResponse> = await response.json();
        const salesList = data.content || [];
        setSales(salesList);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);

        // BẮT ĐẦU ĐẾM SÁCH: Chạy vòng lặp gọi API lấy số lượng sách của từng đợt sale vừa tải về
        salesList.forEach(sale => {
          fetchBookCountForSale(sale.id);
        });

      } else {
        const errText = await response.text();
        console.error("Lỗi tải danh sách Sale từ hệ thống:", errText);
      }
    } catch (error) {
      console.error("Lỗi kết nối khi tải danh sách sales:", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, fetchBookCountForSale]);

  // 2. Lấy số liệu thống kê Widgets chân trang
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, { method: 'GET' });
      if (response.ok) {
        const data: SaleStatsResponse = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê sale:", error);
    }
  }, []);

  // 3. Tìm kiếm sách từ DB để hiển thị gợi ý trong Form
  const fetchBooksFromDB = useCallback(async (key: string) => {
    if (!key.trim()) {
      setDbBooks([]);
      return;
    }
    try {
      const response = await fetch(`${API_BOOK_URL}?keyword=${encodeURIComponent(key)}&page=0&size=5`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setDbBooks(data.content || (Array.isArray(data) ? data : []));
      }
    } catch (error) {
      console.error("Lỗi tải danh sách sách từ DB:", error);
    }
  }, []);

  // Tự động tìm kiếm sách khi gõ từ khóa chọn sản phẩm (Debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooksFromDB(bookSearchKey);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [bookSearchKey, fetchBooksFromDB]);

  // 4. Kích hoạt nút "Chọn tất cả sách trong DB" đưa vào form
  const handleSelectAllBooksInDB = async () => {
    setIsSelectAllLoading(true);
    try {
      const response = await fetch(`${API_BOOK_URL}?page=0&size=9999`, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        const allBooks: BookResponse[] = data.content || (Array.isArray(data) ? data : []);
        setSelectedBooks(allBooks);
        alert(`Đã áp dụng chọn toàn bộ ${allBooks.length} cuốn sách trong hệ thống!`);
      } else {
        alert("Không thể tải toàn bộ danh mục sách.");
      }
    } catch (error) {
      console.error("Lỗi khi kéo toàn bộ sách:", error);
      alert("Lỗi đường truyền kết nối.");
    } finally {
      setIsSelectAllLoading(false);
    }
  };

  // 5. Xử lý xóa/hủy đợt sale
  const handleDeleteSale = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chiến dịch Flash Sale này không? Hành động này không thể hoàn tác.")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("Xóa chiến dịch ưu đãi thành công!");
        refreshData();
      } else {
        const errText = await response.text();
        alert(`Không thể xóa đợt sale: ${errText || "Lỗi hệ thống phía Server."}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối khi xóa sale:", error);
    }
  };

  // 6. Mở Xem chi tiết (Detail Mode) - Gọi API /books để cập nhật danh sách và số lượng mới nhất
  const handleOpenDetailModal = async (sale: SaleAdminResponse) => {
    setSelectedSale(sale);
    setSelectedSaleBooks([]); // Reset tạm thời
    setModalType('detail');
    
    // Gọi API lấy sách trực tiếp để hiển thị số lượng chuẩn xác trên Modal
    const books = await fetchBookCountForSale(sale.id);
    setSelectedSaleBooks(books);
  };

  // 7. Mở form chỉnh sửa (Edit Mode)
  const handleOpenEditModal = async (sale: SaleAdminResponse) => {
    resetForm();
    setEditingSaleId(sale.id);
    setFormTitle(sale.title);
    setFormDescription(sale.description || '');
    setFormDiscount(sale.discountPercentage);
    setFormStartDate(sale.startDate.substring(0, 16));
    setFormEndDate(sale.endDate.substring(0, 16));
    
    setModalType('edit');
    const books = await fetchBookCountForSale(sale.id);
    setSelectedBooks(books);
  };

  // 8. Xử lý Submit Form (Dùng chung cho cả Create và Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formStartDate || !formEndDate || formDiscount <= 0) {
      alert("Vui lòng nhập đầy đủ các trường thông tin bắt buộc.");
      return;
    }
    if (selectedBooks.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm áp dụng khuyến mãi.");
      return;
    }

    const formattedStartDate = formStartDate.includes(':') && formStartDate.split(':').length === 2 ? `${formStartDate}:00` : formStartDate;
    const formattedEndDate = formEndDate.includes(':') && formEndDate.split(':').length === 2 ? `${formEndDate}:59` : formEndDate;

    const bodyData = {
      title: formTitle,
      description: formDescription,
      discountPercentage: Number(formDiscount),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      bookIds: selectedBooks.map(b => b.id)
    };

    const isEdit = modalType === 'edit';
    const url = isEdit ? `${API_BASE_URL}/admin/update/${editingSaleId}` : `${API_BASE_URL}/admin/create`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { 
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        alert(isEdit ? "Cập nhật chương trình Flash Sale thành công!" : "Tạo chiến dịch Flash Sale mới thành công!");
        setModalType(null);
        resetForm();
        refreshData(); 
      } else {
        const errText = await response.text();
        alert(`Thất bại: ${errText || "Vui lòng kiểm tra lại dữ liệu đầu vào."}`);
      }
    } catch (error) {
      console.error("Lỗi hệ thống khi gửi dữ liệu form:", error);
    }
  };

  const refreshData = () => {
    fetchSales(debouncedKeyword, statusFilter, currentPage);
    fetchStats();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDiscount(0);
    setFormStartDate('');
    setFormEndDate('');
    setSelectedBooks([]);
    setBookSearchKey('');
    setDbBooks([]);
    setEditingSaleId(null);
  };

  const handleSelectBook = (book: BookResponse) => {
    setSelectedBooks(prev => {
      const exists = prev.some(item => item.id === book.id);
      if (exists) {
        return prev.filter(item => item.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
    setBookSearchKey('');
    setDbBooks([]);
  };

  const getSaleStatusLabel = (startStr: string, endStr: string) => {
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (now < start) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          Sắp diễn ra
        </span>
      );
    } else if (now >= start && now <= end) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse">
          Đang chạy
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200">
          Đã kết thúc
        </span>
      );
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchSales(debouncedKeyword, statusFilter, currentPage);
    fetchStats();
  }, [debouncedKeyword, statusFilter, currentPage, fetchSales, fetchStats]);

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 text-slate-700 placeholder-slate-400" 
              placeholder="Tìm nhanh chiến dịch..." 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"><Bell className="w-5 h-5" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Chương trình Ưu đãi</h1>
              <p className="text-sm text-slate-400 mt-0.5">Thiết lập các đợt giảm giá Flash Sale, quản lý mức chiết khấu và theo dõi thời gian diễn ra.</p>
            </div>
            <button 
              onClick={() => { resetForm(); setModalType('create'); }}
              className="flex items-center gap-2 bg-[#1121d4] hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Tạo đợt sale mới
            </button>
          </div>

          {/* Thanh Bộ Lọc & Tìm kiếm */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder-slate-400" 
                placeholder="Tìm tên chiến dịch, mô tả..." 
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-400 uppercase">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                className="bg-slate-50 text-slate-700 text-sm py-2 px-3 border-none rounded-xl focus:ring-2 focus:ring-slate-200 cursor-pointer font-medium"
              >
                <option value="">Tất cả chương trình</option>
                <option value="ACTIVE">Đang diễn ra</option>
                <option value="UPCOMING">Sắp diễn ra</option>
                <option value="EXPIRED">Đã kết thúc</option>
              </select>
            </div>
          </div>

          {/* Bảng Dữ liệu */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 w-12 text-center">ID</th>
                    <th className="px-6 py-4">Tên chiến dịch / Mô tả</th>
                    <th className="px-6 py-4 text-center">Mức giảm</th>
                    <th className="px-6 py-4">Thời gian diễn ra</th>
                    <th className="px-6 py-4 text-center">Sản phẩm áp dụng</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-sm text-slate-400">Đang đồng bộ dữ liệu khuyến mãi...</td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-sm text-slate-400">Không tìm thấy đợt khuyến mãi nào.</td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-400 font-mono">#{sale.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-800">{sale.title}</span>
                            <span className="text-xs text-slate-400 max-w-xs truncate">{sale.description || 'Không có mô tả phụ'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-0.5 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg w-fit mx-auto font-bold text-xs border border-rose-100">
                            {sale.discountPercentage}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 space-y-0.5">
                          <div><span className="text-slate-400 font-medium">Bắt đầu:</span> {formatDate(sale.startDate)}</div>
                          <div><span className="text-slate-400 font-medium">Kết thúc:</span> {formatDate(sale.endDate)}</div>
                        </td>
                        
                        {/* HIỂN THỊ ĐẾM SỐ SÁCH: Lấy trực tiếp từ Map đếm dữ liệu theo ID */}
                        <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                          {saleBookCounts[sale.id] !== undefined ? saleBookCounts[sale.id] : 0} cuốn sách
                        </td>

                        <td className="px-6 py-4 text-center">
                          {getSaleStatusLabel(sale.startDate, sale.endDate)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <button 
                              onClick={() => handleOpenDetailModal(sale)}
                              className="text-slate-400 hover:text-[#1121d4] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Xem cấu hình chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenEditModal(sale)}
                              className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Chỉnh sửa chương trình"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSale(sale.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Xóa bỏ đợt ưu đãi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white">
              <span className="text-xs font-medium text-slate-400">
                Hiển thị {sales.length === 0 ? 0 : (currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} trên {totalElements} đợt ưu đãi
              </span>
              <div className="flex gap-1 items-center">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${currentPage === i ? 'bg-[#1121d4] text-white' : 'border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 ${currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Widgets Thống kê chân trang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số chiến dịch</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalSales} chương trình</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiến dịch đang chạy</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.activeSales} hoạt động</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiến dịch lên lịch sẵn</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.upcomingSales} sắp tới</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- POPUP MODAL 1: XEM CHI TIẾT --- */}
      {modalType === 'detail' && selectedSale && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Chi tiết chiến dịch Flash Sale</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Mã ưu đãi:</span>
                <span className="text-slate-800 font-mono font-bold">#{selectedSale.id}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Tên chiến dịch:</span>
                <span className="text-[#1121d4] font-bold">{selectedSale.title}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Mức giảm giá:</span>
                <span className="text-rose-600 font-bold">{selectedSale.discountPercentage}%</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Thời gian bắt đầu:</span>
                <span className="text-slate-800 font-semibold">{formatDate(selectedSale.startDate)}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Thời gian kết thúc:</span>
                <span className="text-slate-800 font-semibold">{formatDate(selectedSale.endDate)}</span>
              </div>

              {/* ĐẾM SỐ SÁCH TRONG MODAL CHI TIẾT */}
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Số sản phẩm áp dụng:</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">
                  {selectedSaleBooks.length} cuốn sách
                </span>
              </div>

              {/* Hiển thị danh sách tên các cuốn sách được áp dụng (Nếu có) */}
              {selectedSaleBooks.length > 0 && (
                <div className="flex flex-col gap-1 py-1.5">
                  <span className="text-slate-400 font-medium">Danh sách sách giảm giá:</span>
                  <div className="max-h-24 overflow-y-auto bg-slate-50 rounded-xl p-2 border border-slate-100 text-xs text-slate-600 space-y-1">
                    {selectedSaleBooks.map((b, idx) => (
                      <div key={b.id} className="truncate font-medium">{idx + 1}. {b.title}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 py-1.5">
                <span className="text-slate-400 font-medium">Mô tả chương trình:</span>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100/70 font-medium italic">
                  {selectedSale.description || "Chương trình không có nội dung mô tả bổ sung."}
                </p>
              </div>
            </div>

            <button onClick={() => setModalType(null)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition-colors mt-2">
              Đóng cửa sổ xem
            </button>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL 2: TẠO MỚI / CHỈNH SỬA CHIẾN DỊCH --- */}
      {(modalType === 'create' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {modalType === 'edit' ? 'Cập Nhật Chiến Dịch Ưu Đãi' : 'Tạo Chiến dịch Ưu đãi Mới'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên chiến dịch *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Flash Sale Sách Hè 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả chiến dịch</label>
                <textarea 
                  rows={2}
                  placeholder="Ví dụ: Giảm giá cực sâu các tác phẩm của Nguyễn Nhật Ánh"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mức giảm (%) *</label>
                  <input 
                    type="number" 
                    required
                    min={1} 
                    max={100}
                    placeholder="25"
                    value={formDiscount || ''}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thời gian bắt đầu *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thời gian kết thúc *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                </div>
              </div>

              {/* --- KHU VỰC TÌM KIẾM & CHỌN SÁCH TỪ DB --- */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Sản phẩm áp dụng khuyến mãi *</label>
                  <button
                    type="button"
                    disabled={isSelectAllLoading}
                    onClick={handleSelectAllBooksInDB}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Chọn tất cả sách trong hệ thống
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Gõ từ khóa để tìm sách đưa vào chiến dịch..."
                    value={bookSearchKey}
                    onChange={(e) => setBookSearchKey(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400"
                  />

                  {/* Dropdown kết quả tìm sách nhanh */}
                  {dbBooks.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-slate-50">
                      {dbBooks.map(book => {
                        const isChosen = selectedBooks.some(b => b.id === book.id);
                        return (
                          <div
                            key={book.id}
                            onClick={() => handleSelectBook(book)}
                            className="p-2.5 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-xs transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{book.title}</p>
                              {book.author && <p className="text-slate-400 mt-0.5">Tác giả: {book.author}</p>}
                            </div>
                            {isChosen ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Đã chọn</span>
                            ) : (
                              <span className="text-slate-400 hover:text-blue-600 font-medium">Thêm +</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Danh sách các sách đã được chọn hiển thị dạng tag badge */}
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto mt-1 p-1 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  {selectedBooks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-2 w-full text-center">Chưa có sản phẩm nào được chọn.</p>
                  ) : (
                    selectedBooks.map(book => (
                      <div key={book.id} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded-lg shadow-sm">
                        <span className="max-w-[180px] truncate font-medium">{book.title}</span>
                        <button
                          type="button"
                          onClick={() => handleSelectBook(book)}
                          className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Nhóm nút điều hướng cuối Form */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#1121d4] hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  {modalType === 'edit' ? 'Cập nhật ngay' : 'Kích hoạt đợt sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}