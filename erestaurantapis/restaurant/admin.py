from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
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



class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 1  


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total', 'status_order', 'created_date']
    list_filter = ['status_order', 'created_date']
    search_fields = ['user__username', 'user__phone']
    inlines = [OrderDetailInline]  

    
    list_select_related = ['user', 'table']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'table', 'serve_time', 'end_time', 'customer_quantity', 'is_active_now']
    list_filter = ['serve_time', 'table']
    search_fields = ['user__phone', 'user__username']
    list_select_related = ['user', 'table']

@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = [
        'id',
        'username',
        'email',
        'phone',
        'user_role',
        'is_staff',
        'is_active'
    ]

    list_filter = [
        'user_role',
        'is_staff',
        'is_active'
    ]

    search_fields = [
        'username',
        'email',
        'phone'
    ]

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung', {
            'fields': (
                'phone',
                'avatar',
                'user_role',
                'is_approved',
            )
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {
            'fields': (
                'phone',
                'avatar',
                'user_role',
                'is_approved',
            )
        }),
    )


admin.site.register(Category)
admin.site.register(Food, MyFoodAdmin)
