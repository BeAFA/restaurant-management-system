echo "=== Installing libraries from requirements.txt ==="
pip install -r requirements.txt

echo "=== Running database migrations ==="
python manage.py migrate

echo "=== Creating superuser ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=Admin@123

python manage.py createsuperuser --no-input || echo "SuperUser already exists!"

echo "=== Inserting sample data ==="
python manage.py shell <<EOF
from django.utils import timezone
from datetime import timedelta
from restaurant.models import (
    User, UserRole, Category, Food, Ingredient, FoodIngredient,
    Table, Status_Table, DiningSession, Status_Session,
    Order, Status_Order, OrderDetail,
    Review, Rating, FoodChef,
    Reservation, Status_Reservation
)

# ==================== USERS ====================
print(">>> Creating Users...")

u_admin, _ = User.objects.get_or_create(username='admin_restaurant', defaults={
    'first_name': 'Admin', 'last_name': 'Restaurant',
    'email': 'admin@restaurant.com', 'user_role': UserRole.ADMIN,
    'phone': '0900000000', 'is_approved': True
})
u_admin.set_password('Admin@123')
u_admin.save()

u_chef1, _ = User.objects.get_or_create(username='chef_john', defaults={
    'first_name': 'John', 'last_name': 'Smith',
    'email': 'john.chef@restaurant.com', 'user_role': UserRole.CHEF,
    'phone': '0911111111', 'is_approved': True
})
u_chef1.set_password('Chef@123')
u_chef1.save()

u_chef2, _ = User.objects.get_or_create(username='chef_emily', defaults={
    'first_name': 'Emily', 'last_name': 'Brown',
    'email': 'emily.chef@restaurant.com', 'user_role': UserRole.CHEF,
    'phone': '0922222222', 'is_approved': True
})
u_chef2.set_password('Chef@123')
u_chef2.save()

u1, _ = User.objects.get_or_create(username='customer_alice', defaults={
    'first_name': 'Alice', 'last_name': 'Nguyen',
    'email': 'alice@gmail.com', 'user_role': UserRole.CUSTOMER,
    'phone': '0933333333', 'is_approved': True
})
u1.set_password('User@123')
u1.save()

u2, _ = User.objects.get_or_create(username='customer_bob', defaults={
    'first_name': 'Bob', 'last_name': 'Tran',
    'email': 'bob@gmail.com', 'user_role': UserRole.CUSTOMER,
    'phone': '0944444444', 'is_approved': True
})
u2.set_password('User@123')
u2.save()

u3, _ = User.objects.get_or_create(username='customer_carol', defaults={
    'first_name': 'Carol', 'last_name': 'Vo',
    'email': 'carol@gmail.com', 'user_role': UserRole.CUSTOMER,
    'phone': '0955555555', 'is_approved': True
})
u3.set_password('User@123')
u3.save()

u4, _ = User.objects.get_or_create(username='customer_david', defaults={
    'first_name': 'David', 'last_name': 'Hoang',
    'email': 'david@gmail.com', 'user_role': UserRole.CUSTOMER,
    'phone': '0966666666', 'is_approved': True
})
u4.set_password('User@123')
u4.save()

u5, _ = User.objects.get_or_create(username='customer_eva', defaults={
    'first_name': 'Eva', 'last_name': 'Dang',
    'email': 'eva@gmail.com', 'user_role': UserRole.CUSTOMER,
    'phone': '0977777777', 'is_approved': True
})
u5.set_password('User@123')
u5.save()

print("    Users created successfully!")

# ==================== CATEGORIES ====================
print(">>> Creating Categories...")

cat1, _ = Category.objects.get_or_create(name='Appetizer')
cat2, _ = Category.objects.get_or_create(name='Main Course')
cat3, _ = Category.objects.get_or_create(name='Dessert')
cat4, _ = Category.objects.get_or_create(name='Beverage')
cat5, _ = Category.objects.get_or_create(name='Grilled Dishes')
cat6, _ = Category.objects.get_or_create(name='Hot Pot')

print("    Categories created successfully!")

# ==================== FOODS ====================
print(">>> Creating Foods...")

f1,  _ = Food.objects.get_or_create(dish='Fresh Spring Rolls',             category=cat1, defaults={'description': 'Fresh rolls with shrimp, pork, vermicelli and herbs wrapped in rice paper',                    'price': 45000,  'time': 10})
f2,  _ = Food.objects.get_or_create(dish='Crispy Fried Spring Rolls',      category=cat1, defaults={'description': 'Golden fried rolls filled with pork, wood ear mushrooms and glass noodles',                   'price': 55000,  'time': 10})
f3,  _ = Food.objects.get_or_create(dish='Crab and Corn Soup',             category=cat1, defaults={'description': 'Smooth crab soup with quail eggs and sweet corn',                                             'price': 40000,  'time': 10})
f4,  _ = Food.objects.get_or_create(dish='Broken Rice with Grilled Pork',  category=cat2, defaults={'description': 'Saigon-style broken rice with grilled pork chop, shredded pork skin and egg cake',            'price': 75000,  'time': 10})
f5,  _ = Food.objects.get_or_create(dish='Spicy Beef Noodle Soup',         category=cat2, defaults={'description': 'Central Vietnamese spicy noodle soup with beef, pork knuckle and lemongrass',                 'price': 65000,  'time': 10})
f6,  _ = Food.objects.get_or_create(dish='Traditional Beef Pho',           category=cat2, defaults={'description': 'Classic beef pho with 12-hour slow-cooked bone broth and fresh herbs',                        'price': 70000,  'time': 20})
f7,  _ = Food.objects.get_or_create(dish='Braised Catfish in Clay Pot',    category=cat2, defaults={'description': 'Catfish braised in caramel sauce with black pepper and chili',                                 'price': 85000,  'time': 20})
f8,  _ = Food.objects.get_or_create(dish='Three-Color Bean Dessert',       category=cat3, defaults={'description': 'Layered dessert with mung bean, red bean, jelly and coconut cream',                           'price': 30000,  'time': 20})
f9,  _ = Food.objects.get_or_create(dish='Caramel Flan',                   category=cat3, defaults={'description': 'Silky smooth caramel custard pudding',                                                        'price': 35000,  'time': 20})
f10, _ = Food.objects.get_or_create(dish='Fresh Orange Juice',             category=cat4, defaults={'description': 'Freshly squeezed orange juice, no added sugar',                                               'price': 35000,  'time': 20})
f11, _ = Food.objects.get_or_create(dish='Iced Lemon Tea',                 category=cat4, defaults={'description': 'Cold-brewed black tea with fresh lemon slices',                                               'price': 20000,  'time': 30})
f12, _ = Food.objects.get_or_create(dish='Grilled Beef in Wild Pepper Leaves', category=cat5, defaults={'description': 'Minced beef with lemongrass wrapped in wild pepper leaves grilled over charcoal',         'price': 95000,  'time': 30})
f13, _ = Food.objects.get_or_create(dish='Grilled Shrimp with Chili Salt', category=cat5, defaults={'description': 'Fresh tiger prawns grilled with green chili salt',                                            'price': 120000, 'time': 30})
f14, _ = Food.objects.get_or_create(dish='Thai Seafood Hot Pot',           category=cat6, defaults={'description': 'Spicy and sour Thai-style hot pot with fresh shrimp, squid, fish and vegetables',             'price': 250000, 'time': 30})
f15, _ = Food.objects.get_or_create(dish='Beef Vinegar Hot Pot',           category=cat6, defaults={'description': 'Tangy vinegar-based hot pot with thinly sliced fresh beef and rice paper',                    'price': 220000, 'time': 30})

print("    Foods created successfully!")

# ==================== INGREDIENTS ====================
print(">>> Creating Ingredients...")

ing1,  _ = Ingredient.objects.get_or_create(name='Tiger Prawn')
ing2,  _ = Ingredient.objects.get_or_create(name='Pork')
ing3,  _ = Ingredient.objects.get_or_create(name='Rice Vermicelli')
ing4,  _ = Ingredient.objects.get_or_create(name='Fresh Herbs')
ing5,  _ = Ingredient.objects.get_or_create(name='Wood Ear Mushroom')
ing6,  _ = Ingredient.objects.get_or_create(name='Glass Noodle')
ing7,  _ = Ingredient.objects.get_or_create(name='Beef')
ing8,  _ = Ingredient.objects.get_or_create(name='Bone Broth')
ing9,  _ = Ingredient.objects.get_or_create(name='Catfish')
ing10, _ = Ingredient.objects.get_or_create(name='Wild Pepper Leaf')

print("    Ingredients created successfully!")

# ==================== FOOD INGREDIENTS ====================
# Lưu ý: field tên là "ingredients" (có s) theo định nghĩa model
print(">>> Creating FoodIngredients...")

FoodIngredient.objects.get_or_create(food=f1,  ingredients=ing1, defaults={'notes': '5 medium tiger prawns'})
FoodIngredient.objects.get_or_create(food=f1,  ingredients=ing2, defaults={'notes': '50g sliced boiled pork'})
FoodIngredient.objects.get_or_create(food=f1,  ingredients=ing3, defaults={'notes': 'Adequate rice vermicelli'})
FoodIngredient.objects.get_or_create(food=f1,  ingredients=ing4, defaults={'notes': 'Lettuce and basil leaves'})
FoodIngredient.objects.get_or_create(food=f2,  ingredients=ing2, defaults={'notes': '100g minced pork'})
FoodIngredient.objects.get_or_create(food=f2,  ingredients=ing5, defaults={'notes': '20g soaked wood ear mushrooms'})
FoodIngredient.objects.get_or_create(food=f2,  ingredients=ing6, defaults={'notes': '30g soaked and chopped glass noodles'})
FoodIngredient.objects.get_or_create(food=f6,  ingredients=ing7, defaults={'notes': '100g rare and well-done beef slices'})
FoodIngredient.objects.get_or_create(food=f6,  ingredients=ing8, defaults={'notes': 'Bone broth simmered for 12 hours'})
FoodIngredient.objects.get_or_create(food=f6,  ingredients=ing3, defaults={'notes': 'Fresh flat rice noodles'})
FoodIngredient.objects.get_or_create(food=f7,  ingredients=ing9, defaults={'notes': '200g catfish fillet'})
FoodIngredient.objects.get_or_create(food=f12, ingredients=ing7, defaults={'notes': '200g minced beef'})
FoodIngredient.objects.get_or_create(food=f12, ingredients=ing10, defaults={'notes': '20 fresh wild pepper leaves'})

print("    FoodIngredients created successfully!")

# ==================== TABLES ====================
print(">>> Creating Tables...")

t1, _ = Table.objects.get_or_create(id=1, defaults={'slot': 2,  'status_table': Status_Table.AVAILABLE})
t2, _ = Table.objects.get_or_create(id=2, defaults={'slot': 4,  'status_table': Status_Table.AVAILABLE})
t3, _ = Table.objects.get_or_create(id=3, defaults={'slot': 4,  'status_table': Status_Table.AVAILABLE})
t4, _ = Table.objects.get_or_create(id=4, defaults={'slot': 6,  'status_table': Status_Table.AVAILABLE})
t5, _ = Table.objects.get_or_create(id=5, defaults={'slot': 6,  'status_table': Status_Table.AVAILABLE})
t6, _ = Table.objects.get_or_create(id=6, defaults={'slot': 8,  'status_table': Status_Table.AVAILABLE})
t7, _ = Table.objects.get_or_create(id=7, defaults={'slot': 8,  'status_table': Status_Table.AVAILABLE})
t8, _ = Table.objects.get_or_create(id=8, defaults={'slot': 10, 'status_table': Status_Table.AVAILABLE})

print("    Tables created successfully!")

# ==================== DINING SESSIONS ====================
# DiningSession là bắt buộc cho Order (thay thế field table cũ).
# Dùng bulk_create để bypass auto_now_add và set opened_at thủ công cho session quá khứ.
print(">>> Creating DiningSessions...")

s1, _ = DiningSession.objects.get_or_create(session_code='TB3-100001', defaults={
    'table': t3, 'customer': u1, 'status_session': Status_Session.CLOSED
})
s2, _ = DiningSession.objects.get_or_create(session_code='TB5-100002', defaults={
    'table': t5, 'customer': u2, 'status_session': Status_Session.CLOSED
})
s3, _ = DiningSession.objects.get_or_create(session_code='TB6-100003', defaults={
    'table': t6, 'customer': u3, 'status_session': Status_Session.CLOSED
})
s4, _ = DiningSession.objects.get_or_create(session_code='TB7-100004', defaults={
    'table': t7, 'customer': u4, 'status_session': Status_Session.CLOSED
})
s5, _ = DiningSession.objects.get_or_create(session_code='TB8-100005', defaults={
    'table': t8, 'customer': u5, 'status_session': Status_Session.CLOSED
})
# Session đang mở (OPEN) — UniqueConstraint chỉ cho phép 1 session OPEN mỗi bàn
s6, _ = DiningSession.objects.get_or_create(session_code='TB2-100006', defaults={
    'table': t2, 'customer': u1, 'status_session': Status_Session.OPEN
})

print("    DiningSessions created successfully!")

# ==================== ORDERS + ORDER DETAILS ====================
print(">>> Creating Orders and OrderDetails...")

o1, created1 = Order.objects.get_or_create(
    session=s1, status_order=Status_Order.SUCCESS,
    defaults={'user': u1, 'total': 0}
)
if created1:
    OrderDetail.objects.create(order=o1, food=f1,  quantity=2)
    OrderDetail.objects.create(order=o1, food=f4,  quantity=1)
    OrderDetail.objects.create(order=o1, food=f11, quantity=2)

o2, created2 = Order.objects.get_or_create(
    session=s2, status_order=Status_Order.SUCCESS,
    defaults={'user': u2, 'total': 0}
)
if created2:
    OrderDetail.objects.create(order=o2, food=f14, quantity=1)
    OrderDetail.objects.create(order=o2, food=f12, quantity=2)
    OrderDetail.objects.create(order=o2, food=f10, quantity=3)

o3, created3 = Order.objects.get_or_create(
    session=s3, status_order=Status_Order.SUCCESS,
    defaults={'user': u3, 'total': 0}
)
if created3:
    OrderDetail.objects.create(order=o3, food=f5,  quantity=2)
    OrderDetail.objects.create(order=o3, food=f8,  quantity=2)
    OrderDetail.objects.create(order=o3, food=f11, quantity=2)

o4, created4 = Order.objects.get_or_create(
    session=s4, status_order=Status_Order.SUCCESS,
    defaults={'user': u4, 'total': 0}
)
if created4:
    OrderDetail.objects.create(order=o4, food=f6,  quantity=3)
    OrderDetail.objects.create(order=o4, food=f2,  quantity=2)
    OrderDetail.objects.create(order=o4, food=f9,  quantity=3)
    OrderDetail.objects.create(order=o4, food=f10, quantity=3)

o5, created5 = Order.objects.get_or_create(
    session=s5, status_order=Status_Order.SUCCESS,
    defaults={'user': u5, 'total': 0}
)
if created5:
    OrderDetail.objects.create(order=o5, food=f15, quantity=1)
    OrderDetail.objects.create(order=o5, food=f13, quantity=2)
    OrderDetail.objects.create(order=o5, food=f3,  quantity=2)

# o6: WAITING — session đang OPEN
o6, created6 = Order.objects.get_or_create(
    session=s6, status_order=Status_Order.WAITING,
    defaults={'user': u1, 'total': 0}
)
if created6:
    OrderDetail.objects.create(order=o6, food=f7,  quantity=1)
    OrderDetail.objects.create(order=o6, food=f12, quantity=1)
    OrderDetail.objects.create(order=o6, food=f11, quantity=2)

print("    Orders and OrderDetails created successfully!")

# ==================== REVIEWS ====================
print(">>> Creating Reviews...")

Review.objects.get_or_create(user=u1, food=f1,  defaults={'comment': 'Very fresh and tasty, the dipping sauce is amazing!',              'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u2, food=f1,  defaults={'comment': 'Good but a bit light on the filling.',                             'rating': Rating.STAR_4})
Review.objects.get_or_create(user=u3, food=f1,  defaults={'comment': 'Love this dish, will definitely come back!',                       'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u1, food=f4,  defaults={'comment': 'Authentic Saigon broken rice, the pork chop is perfectly grilled.','rating': Rating.STAR_5})
Review.objects.get_or_create(user=u2, food=f4,  defaults={'comment': 'Tasty and portion size is just right.',                            'rating': Rating.STAR_4})
Review.objects.get_or_create(user=u3, food=f6,  defaults={'comment': 'Clear broth, naturally sweet, absolutely love it!',                'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u4, food=f6,  defaults={'comment': 'Generous bowl, noodles are soft and chewy.',                       'rating': Rating.STAR_4})
Review.objects.get_or_create(user=u5, food=f6,  defaults={'comment': 'Slightly salty but overall still good.',                           'rating': Rating.STAR_3})
Review.objects.get_or_create(user=u1, food=f14, defaults={'comment': 'Perfectly spiced Thai hot pot, super fresh seafood!',              'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u4, food=f14, defaults={'comment': 'Great value, ideal for large groups.',                             'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u5, food=f14, defaults={'comment': 'Broth is excellent but service was a bit slow.',                   'rating': Rating.STAR_3})
Review.objects.get_or_create(user=u2, food=f12, defaults={'comment': 'Fragrant grilled beef, pairs perfectly with rice paper.',          'rating': Rating.STAR_5})
Review.objects.get_or_create(user=u3, food=f12, defaults={'comment': 'Delicious and very affordable.',                                   'rating': Rating.STAR_4})

print("    Reviews created successfully!")

# ==================== FOOD CHEFS ====================
print(">>> Creating FoodChefs...")

FoodChef.objects.get_or_create(food=f1,  chef=u_chef1)
FoodChef.objects.get_or_create(food=f2,  chef=u_chef1)
FoodChef.objects.get_or_create(food=f3,  chef=u_chef1)
FoodChef.objects.get_or_create(food=f4,  chef=u_chef1)
FoodChef.objects.get_or_create(food=f5,  chef=u_chef1)
FoodChef.objects.get_or_create(food=f6,  chef=u_chef2)
FoodChef.objects.get_or_create(food=f7,  chef=u_chef2)
FoodChef.objects.get_or_create(food=f8,  chef=u_chef2)
FoodChef.objects.get_or_create(food=f12, chef=u_chef2)
FoodChef.objects.get_or_create(food=f13, chef=u_chef2)
FoodChef.objects.get_or_create(food=f14, chef=u_chef1)
FoodChef.objects.get_or_create(food=f15, chef=u_chef2)

print("    FoodChefs created successfully!")

# ==================== RESERVATIONS ====================
# Reservation.clean() chặn serve_time trong quá khứ.
# Dùng bulk_create để bypass clean() cho các reservation quá khứ.
# end_time KHÔNG cần truyền — save() tự tính = serve_time + 30 phút.
print(">>> Creating Reservations...")

from django.core.exceptions import ValidationError

now = timezone.now()

# --- Reservation quá khứ: bypass clean() bằng bulk_create ---
past_reservations = [
    Reservation(user=u1, table=t1, serve_time=now - timedelta(days=3, hours=2), customer_quantity=2,  status_reservation=Status_Reservation.COMPLETED),
    Reservation(user=u2, table=t2, serve_time=now - timedelta(days=2, hours=3), customer_quantity=4,  status_reservation=Status_Reservation.COMPLETED),
    Reservation(user=u3, table=t4, serve_time=now - timedelta(days=1, hours=5), customer_quantity=6,  status_reservation=Status_Reservation.COMPLETED),
]
for r in past_reservations:
    if not Reservation.objects.filter(user=r.user, table=r.table, serve_time=r.serve_time).exists():
        # bulk_create bỏ qua full_clean() nên bypass được validation quá khứ
        # Tính end_time thủ công vì save() không được gọi
        r.end_time = r.serve_time + timedelta(minutes=30)
        Reservation.objects.bulk_create([r])

# --- Reservation tương lai: dùng get_or_create bình thường ---
future_reservations = [
    {'user': u4, 'table': t5, 'serve_time': now + timedelta(days=1, hours=2),  'customer_quantity': 5},
    {'user': u5, 'table': t6, 'serve_time': now + timedelta(days=2, hours=1),  'customer_quantity': 7},
    {'user': u1, 'table': t7, 'serve_time': now + timedelta(days=3),           'customer_quantity': 8},
    {'user': u2, 'table': t8, 'serve_time': now + timedelta(days=5, hours=3),  'customer_quantity': 10},
]
for r in future_reservations:
    try:
        Reservation.objects.get_or_create(
            user=r['user'], table=r['table'], serve_time=r['serve_time'],
            defaults={'customer_quantity': r['customer_quantity']}
        )
    except ValidationError as e:
        print(f"    WARNING: Skipped reservation for {r['user']} - {e}")

print("    Reservations created successfully!")

print("")
print("========================================")
print("   SAMPLE DATA INSERTED SUCCESSFULLY")
print("========================================")
print(f"  Users          : {User.objects.count()}")
print(f"  Categories     : {Category.objects.count()}")
print(f"  Foods          : {Food.objects.count()}")
print(f"  Ingredients    : {Ingredient.objects.count()}")
print(f"  Tables         : {Table.objects.count()}")
print(f"  DiningSessions : {DiningSession.objects.count()}")
print(f"  Orders         : {Order.objects.count()}")
print(f"  Reviews        : {Review.objects.count()}")
print(f"  Reservations   : {Reservation.objects.count()}")
print("========================================")

EOF

echo "=== Starting Django server ==="
python manage.py runserver