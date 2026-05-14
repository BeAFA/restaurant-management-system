from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.utils import timezone
from cloudinary.models import CloudinaryField
from datetime import timedelta


class UserRole(models.TextChoices):
    CHEF = 'CHEF', 'Đầu bếp'
    ADMIN = 'ADMIN', 'Quản trị viên'
    CUSTOMER = 'CUSTOMER', 'Khách hàng'


class Status_Table(models.TextChoices):
    AVAILABLE = 'AVAILABLE', 'Trống'
    RESERVED = 'RESERVED', 'Đã đặt trước'
    OCCUPIED = 'OCCUPIED', 'Đang có khách'


class Status_Order(models.TextChoices):
    SUCCESS = 'SUCCESS', 'Thành công'
    WAITING = 'WAITING', 'Đang chờ'


class Rating(models.IntegerChoices):
    STAR_1 = 1, '1 Sao'
    STAR_2 = 2, '2 Sao'
    STAR_3 = 3, '3 Sao'
    STAR_4 = 4, '4 Sao'
    STAR_5 = 5, '5 Sao'


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_date']


class User(AbstractUser, BaseModel):
    user_role = models.CharField(choices=UserRole.choices, default=UserRole.CUSTOMER, max_length=20)
    avatar = CloudinaryField(null=True)
    phone = models.CharField(max_length=20, null=True, db_index=True)


class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Food(BaseModel):
    dish = models.CharField(max_length=255, db_index=True)
    description = models.TextField(null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.DateTimeField()
    illustration = CloudinaryField(null=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='foods')

    class Meta:
        unique_together = ('dish', 'category')

    def __str__(self):
        return self.dish


class Ingredient(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class FoodIngredient(BaseModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    food = models.ForeignKey(Food, on_delete=models.PROTECT)
    notes = models.TextField(null=True)

    class Meta:
        unique_together = ('ingredient', 'food')


class Table(BaseModel):
    slot = models.IntegerField()
    status_table = models.CharField(choices=Status_Table.choices, default=Status_Table.AVAILABLE, max_length=20)

    def __str__(self):
        return f"Bàn {self.id} ({self.slot} chỗ)"


class Order(BaseModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, related_name='orders')
    total = models.DecimalField(max_digits=12, decimal_places=2)
    table = models.ForeignKey(Table, on_delete=models.PROTECT,related_name='orders')
    status_order = models.CharField(choices=Status_Order.choices, default=Status_Order.WAITING, max_length=20)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['table'],
                condition=models.Q(status_order='WAITING'),
                name='unique_active_table'
            )
        ]

    def update_total(self):
        # Tính tổng tất cả total_price của các OrderDetail thuộc Order này
        total_sum = self.details.aggregate(Sum('total_price'))['total_price__sum'] or 0
        self.total = total_sum
        # dùng update để tránh gọi lại hàm save() gây vòng lặp vô tận
        Order.objects.filter(pk=self.pk).update(total=total_sum)

    def __str__(self):
        return f"Đơn hàng {self.id} - Bàn {self.table.id} ({self.total} VNĐ)"


class OrderDetail(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='details')
    food = models.ForeignKey(Food, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    def save(self, *args, **kwargs):
        # Chỉ copy giá từ bảng Food ở lần đầu tiên tạo OrderDetail
        if not self.pk:
            self.unit_price = self.food.price

        # Tính toán tổng giá cho món này
        self.total_price = self.unit_price * self.quantity

        super().save(*args, **kwargs)
        # Sau đó cập nhật tổng tiền cho Order cha
        self.order.update_total()


class Review(BaseModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, related_name='reviews')
    food = models.ForeignKey(Food, on_delete=models.PROTECT, related_name='reviews')
    comment = models.TextField(null=True)
    rating = models.IntegerField(choices=Rating.choices, default=Rating.STAR_5)

    class Meta:
        unique_together = ('user', 'food')


class FoodChef(BaseModel):
    food = models.ForeignKey(Food, related_name='chefs', on_delete=models.PROTECT)
    chef = models.ForeignKey(User, related_name='foods', on_delete=models.PROTECT)


class Reservation(BaseModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, related_name='reservations')
    table = models.ForeignKey(Table, on_delete=models.PROTECT, null=False, related_name='reservations')
    serve_time = models.DateTimeField(verbose_name="Thời gian bắt đầu", db_index=True)
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian kết thúc", db_index=True)
    customer_quantity = models.IntegerField()

    @property
    def is_active_now(self):
        # Kiểm tra xem thời điểm HIỆN TẠI có đang nằm trong khung giờ đặt bàn hay không
        now = timezone.now()
        if self.serve_time and self.end_time:
            return self.serve_time <= now <= self.end_time
        return False

    # 2. Tự động tính end_time trước khi lưu vào Database
    def save(self, *args, **kwargs):
        if self.serve_time and not self.end_time:
            # Cộng thêm 2 tiếng vào thời gian bắt đầu
            self.end_time = self.serve_time + timedelta(hours=2)
        super().save(*args, **kwargs)

    # 3. Logic chặn đặt trùng bàn trong khoảng 2 tiếng đó
    def clean(self):
        if self.serve_time:
            # Nếu chưa có end_time (lúc đang tạo mới), tạm tính để check
            expected_end_time = self.end_time or (self.serve_time + timedelta(hours=2))

            # Tìm các đơn đặt bàn có thời gian giao thoa (overlap)
            # Công thức: (Bắt đầu A < Kết thúc B) AND (Kết thúc A > Bắt đầu B)
            conflicting_reservations = Reservation.objects.filter(
                table=self.table,
                serve_time__lt=expected_end_time,
                end_time__gt=self.serve_time
            ).exclude(pk=self.pk)  # Loại trừ chính nó nếu là đang sửa (update)

            if conflicting_reservations.exists():
                raise ValidationError(
                    f"Bàn này đã được đặt trong khoảng từ {self.serve_time.strftime('%H:%M')} "
                    f"đến {expected_end_time.strftime('%H:%M')}."
                )
