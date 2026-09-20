# Hệ thống Quản lý Nhà hàng

Hệ thống quản lý nhà hàng đầy đủ tính năng, được xây dựng với backend Django REST API và ứng dụng di động React Native dành cho khách hàng, đầu bếp và quản trị viên.

## Tổng quan

Dự án này kết hợp các thành phần sau:

- Backend API: Django + Django REST Framework
- Frontend mobile: React Native + Expo
- Cơ sở dữ liệu: MySQL
- Lưu trữ media: Cloudinary
- Thanh toán: PayOS
- Xác thực: OAuth2 + phân quyền người dùng tùy chỉnh

Hệ thống hỗ trợ tìm kiếm món ăn, đặt bàn, quản lý đơn hàng, luồng bàn ăn, quản lý đầu bếp, dashboard quản trị và xử lý thanh toán.

## Cấu trúc dự án

```text
restaurant-management-system/
├── README.md
├── LICENSE
├── erestaurantapis/
│   ├── manage.py
│   ├── requirements.txt
│   ├── run_django.sh
│   ├── erestaurantapis/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── restaurant/
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── perms.py
│       ├── paginators.py
│       └── migrations/
└── restaurantmobileapp/
    ├── App.js
    ├── app.json
    ├── package.json
    ├── index.js
    ├── assets/
    ├── components/
    ├── contexts/
    ├── providers/
    ├── reducers/
    ├── screens/
    ├── styles/
    └── configs/
```

## Tính năng chính

### Tính năng cho khách hàng

- Duyệt danh mục và món ăn
- Tìm kiếm món ăn và so sánh lựa chọn
- Thêm vào giỏ hàng và đặt món
- Đặt bàn và check-in
- Xem lịch sử đơn hàng
- Cập nhật hồ sơ và mật khẩu
- Thanh toán qua quy trình QR

### Tính năng cho đầu bếp

- Xem món ăn được giao nhiệm vụ
- Tạo và cập nhật món ăn
- Quản lý thực đơn và trạng thái phê duyệt món
- Xem thống kê món bán chạy và doanh thu

### Tính năng cho quản trị viên

- Duyệt hoặc từ chối tài khoản đầu bếp
- Quản lý người dùng và phân công món ăn
- Xem dashboard và thống kê doanh thu
- Theo dõi đặt bàn và hoạt động của nhà hàng

## API backend

Backend Django cung cấp các endpoint REST cho:

- Danh mục (Categories)
- Món ăn và đánh giá món ăn
- Người dùng và các thao tác liên quan tới xác thực
- Đơn hàng và thanh toán
- Đặt bàn và đặt chỗ
- Phiên ăn và thống kê
- Nguyên liệu và so sánh món ăn

Router API được định nghĩa trong `erestaurantapis/restaurant/urls.py` và bao gồm các nhóm tài nguyên như:

- `/categories`
- `/foods`
- `/users`
- `/reviews`
- `/orders`
- `/reservations`
- `/statistics`
- `/tables`
- `/ingredients`

## Công nghệ sử dụng

### Backend

- Python 3.x
- Django 6.0.3
- Django REST Framework
- drf-yasg cho Swagger docs
- OAuth Toolkit
- MySQL
- Cloudinary
- PayOS SDK

### Ứng dụng di động

- React Native
- Expo
- React Navigation
- React Native Paper
- Axios
- Secure storage
- Thư viện QR code và biểu đồ

## Yêu cầu môi trường

Trước khi chạy dự án, bạn cần:

- Python 3.x
- Node.js và npm
- MySQL
- Git

## Hướng dẫn chạy dự án

### 1) Backend

```bash
cd erestaurantapis
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Sau đó, cấu hình cơ sở dữ liệu cục bộ và thông tin xác thực Cloudinary trong `erestaurantapis/settings.py`.

Lưu ý quan trọng:

- Dự án đang sử dụng MySQL với database `restaurantdb`, user `root`, password `root` mặc định
- Thông tin xác thực Cloudinary và OAuth client được cấu hình trong file settings
- Với môi trường production, nên chuyển các giá trị này sang biến môi trường và không lưu trực tiếp vào source code

Tạo database tables:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Bạn cũng có thể sử dụng script hỗ trợ:

```bash
bash run_django.sh
```

### 2) Ứng dụng di động

```bash
cd restaurantmobileapp
npm install
npm start
```

Để chạy trên Android/iOS:

```bash
npm run android
npm run ios
```

## Lưu ý về môi trường và bảo mật

Repository hiện tại chứa các giá trị cấu hình mẫu hoặc placeholder trong `erestaurantapis/erestaurantapis/settings.py` cho:

- Cloudinary
- Cài đặt OAuth client
- Cấu hình kết nối database

Trước khi triển khai, hãy thay thế các giá trị này bằng cấu hình thực tế dựa trên biến môi trường.

## Giấy phép

Dự án này được cấp phép theo MIT License. Xem file `LICENSE` để biết chi tiết.

## Ghi chú

Kho lưu trữ này là một dự án thực tế về hệ thống quản lý nhà hàng, kết hợp logic nghiệp vụ phía backend với trải nghiệm người dùng trên mobile. Đây là lựa chọn phù hợp để học về thiết kế ứng dụng full-stack, phân quyền người dùng và quản lý hoạt động nhà hàng.

## Tác giả

Chủ sở hữu repository: `BeAFA`

## Đóng góp

Pull requests và các cải tiến đều được hoan nghênh. Nếu bạn muốn mở rộng dự án, có thể cân nhắc thêm:

- Kiểm thử cho các API endpoint
- CI/CD pipeline
- Hỗ trợ Docker
- Quản lý biến môi trường
- Cải thiện dashboard quản trị
- Hệ thống thông báo cho người dùng

---

Nếu bạn muốn, tôi có thể hỗ trợ thêm:

- Tạo README song ngữ (Tiếng Anh + Tiếng Việt)
- Thêm sơ đồ kiến trúc hoặc ảnh chụp thiết lập
- Tạo cấu hình Docker cho dự án
- Viết roadmap phát triển cho các tính năng trong tương lai
