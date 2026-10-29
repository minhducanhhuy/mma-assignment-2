# E-Commerce Product App (Assignment 2)

Ứng dụng duyệt sản phẩm và quản lý giỏ hàng xây dựng bằng React Native & Expo, tích hợp DummyJSON API, phân trang vô tận (Infinite Scroll), quản lý trạng thái giỏ hàng với Context API và custom hook `useCart`.

---

## 🚀 Tính năng chính

1. **Danh sách sản phẩm (`ProductListScreen`)**:
   - Tải dữ liệu sản phẩm từ DummyJSON API (`https://dummyjson.com/products`).
   - Phân trang bằng `FlatList` với `onEndReached` & `ActivityIndicator`.
   - Tìm kiếm sản phẩm thời gian thực kết hợp debounce (`useDebouncedSearch`).
   - Lọc sản phẩm theo danh mục (`CategoryChipBar`).
   - Kéo để làm mới (`RefreshControl`).

2. **Chi tiết sản phẩm (`ProductDetailScreen`)**:
   - Hiển thị đầy đủ thông tin: thư viện ảnh, phân loại, thương hiệu, giá gốc, tỷ lệ giảm giá, đánh giá sao, tồn kho, chính sách bảo hành / vận chuyển / đổi trả.
   - Chọn số lượng và thêm vào giỏ hàng với phản hồi tức thì.

3. **Quản lý giỏ hàng (`CartScreen`)**:
   - Quản lý giỏ hàng qua Context API (`CartContext` / `CartProvider`) và custom hook `useCart`.
   - Tăng/giảm số lượng từng món, xóa món hoặc dọn sạch toàn bộ giỏ hàng.
   - Tính toán hóa đơn thời gian thực: Tạm tính, tiết kiệm khuyến mãi, phí giao hàng, tiến độ Freeship và tổng thanh toán.
   - Lưu trữ dữ liệu liên tục qua `AsyncStorage`.

4. **Bonus & Tính năng nâng cao**:
   - **Danh sách yêu thích (`FavoritesTab` / `useFavorites`)**: Lưu sản phẩm yêu thích và chuyển nhanh vào giỏ hàng.
   - **Bộ nhớ đệm 2 lớp (Cache)**: Kết hợp In-memory `Map` và `AsyncStorage` giúp tối ưu tốc độ tải và tiết kiệm băng thông.
   - **Trợ lý AI Mua sắm (Google Gemini AI)**: Phân tích ưu/nhược điểm từ đánh giá thực tế và giải đáp thắc mắc của khách hàng về sản phẩm.
   - **Tìm kiếm bằng hình ảnh**: Tích hợp `expo-image-picker` để trích xuất gợi ý từ khóa tìm kiếm.

---

## 📁 Cấu trúc thư mục

```text
├── assets/                  # Icon, splash screen
├── src/
│   ├── api/
│   │   ├── catalogService.ts     # Gọi API DummyJSON & cơ chế Caching
│   │   └── geminiConsultant.ts   # Tích hợp Google Gemini AI
│   ├── core/constants/           # Hằng số màu sắc (Palette) & Storage Keys
│   ├── hooks/
│   │   ├── useCart.ts            # Custom hook quản lý giỏ hàng (chuẩn Assignment 2)
│   │   ├── useCatalogFeed.ts     # Hook phân trang & tìm kiếm sản phẩm
│   │   ├── useDebouncedSearch.ts # Hook debounce từ khóa tìm kiếm
│   │   └── useFavorites.ts       # Hook quản lý danh sách yêu thích
│   ├── models/                   # Kiểu dữ liệu TypeScript (Product, Cart, Category)
│   ├── state/
│   │   ├── BasketContext.tsx     # Context API quản lý trạng thái giỏ hàng
│   │   └── FavoritesContext.tsx  # Context API quản lý trạng thái yêu thích
│   └── ui/
│       ├── components/           # Atomic Components: ProductCard, CartItem, PriceSummary,...
│       ├── elements/             # UI Components: AppLoader, FeedbackView, PillBadge,...
│       ├── navigation/           # React Navigation (Bottom Tabs + Native Stack)
│       └── screens/              # ProductListScreen, ProductDetailScreen, CartScreen,...
├── App.tsx                  # Điểm khởi chạy chính của ứng dụng
├── app.json                 # Cấu hình Expo
├── package.json             # Danh sách dependencies
└── tsconfig.json            # Cấu hình TypeScript
```

---

## 🛠️ Cài đặt & Chạy cục bộ

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy dự án Expo
npm start
```

- Nhấn `a` để mở trên Android Emulator.
- Nhấn `w` để mở trên Web.
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại di động.

---

## 🌐 Import vào Expo Snack qua Git

1. Đẩy mã nguồn dự án lên một kho lưu trữ **GitHub Public**.
2. Truy cập [Expo Snack](https://snack.expo.dev).
3. Chọn menu **Import Git Repository** và nhập URL GitHub của dự án.
4. Snack sẽ tự động nhận diện `App.tsx` và nạp các thư viện từ `package.json`.

> **Lưu ý cấu hình Gemini AI (Tùy chọn)**:
> Để kích hoạt tính năng hỏi trợ lý Gemini AI trên Snack hoặc cục bộ, hãy cấu hình biến môi trường:
> ```
> EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
> ```
