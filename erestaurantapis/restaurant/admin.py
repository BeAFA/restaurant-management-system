from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import User, Category, Food, Table, Order, OrderDetail, Reservation

class MyFoodAdmin(admin.ModelAdmin):
    list_display = ['id', 'dish', 'active', 'created_date']
    search_fields = ['dish']
    list_filter = ['active', 'created_date']
    readonly_fields = ['illustration_view']

    def illustration_view(self, food):
        if food.illustration:
            return mark_safe(f'<img src="{food.illustration.url}" width = "200" />')
        return None


# Inline: Cho phép thêm/sửa món ăn ngay bên trong trang chi tiết Đơn hàng
class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 1  # Hiển thị sẵn 1 dòng trống để thêm món


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'table', 'total', 'status_order', 'created_date']
    list_filter = ['status_order', 'created_date']
    search_fields = ['user__username', 'user__phone']
    inlines = [OrderDetailInline]  # Tích hợp Inline

    # TỐI ƯU HIỆU NĂNG CHO ADMIN (Tránh N+1 Query)
    list_select_related = ['user', 'table']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'table', 'serve_time', 'end_time', 'customer_quantity', 'is_active_now']
    list_filter = ['serve_time', 'table']
    search_fields = ['user__phone', 'user__username']
    list_select_related = ['user', 'table']

admin.site.register(Category)
admin.site.register(Food, MyFoodAdmin)
