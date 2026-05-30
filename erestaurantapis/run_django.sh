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

# ==================== USERS (15 users) ====================
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

u_chef3, _ = User.objects.get_or_create(username='chef_minh', defaults={
    'first_name': 'Minh', 'last_name': 'Le',
    'email': 'minh.chef@restaurant.com', 'user_role': UserRole.CHEF,
    'phone': '0923333333', 'is_approved': True
})
u_chef3.set_password('Chef@123')
u_chef3.save()

# 11 customers
customers_data = [
    ('customer_alice',  'Alice',   'Nguyen', 'alice@gmail.com',   '0933333333'),
    ('customer_bob',    'Bob',     'Tran',   'bob@gmail.com',     '0944444444'),
    ('customer_carol',  'Carol',   'Vo',     'carol@gmail.com',   '0955555555'),
    ('customer_david',  'David',   'Hoang',  'david@gmail.com',   '0966666666'),
    ('customer_eva',    'Eva',     'Dang',   'eva@gmail.com',     '0977777777'),
    ('customer_frank',  'Frank',   'Pham',   'frank@gmail.com',   '0988888888'),
    ('customer_grace',  'Grace',   'Nguyen', 'grace@gmail.com',   '0999999999'),
    ('customer_henry',  'Henry',   'Do',     'henry@gmail.com',   '0901234567'),
    ('customer_iris',   'Iris',    'Bui',    'iris@gmail.com',    '0912345678'),
    ('customer_james',  'James',   'Luu',    'james@gmail.com',   '0923456789'),
    ('customer_kelly',  'Kelly',   'Mai',    'kelly@gmail.com',   '0934567890'),
]

customers = []
for uname, fname, lname, email, phone in customers_data:
    u, _ = User.objects.get_or_create(username=uname, defaults={
        'first_name': fname, 'last_name': lname,
        'email': email, 'user_role': UserRole.CUSTOMER,
        'phone': phone, 'is_approved': True
    })
    u.set_password('User@123')
    u.save()
    customers.append(u)

u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11 = customers
print("    Users created successfully! (15 total)")

# ==================== CATEGORIES (6) ====================
print(">>> Creating Categories...")

cat1, _ = Category.objects.get_or_create(name='Appetizer')
cat2, _ = Category.objects.get_or_create(name='Main Course')
cat3, _ = Category.objects.get_or_create(name='Dessert')
cat4, _ = Category.objects.get_or_create(name='Beverage')
cat5, _ = Category.objects.get_or_create(name='Grilled Dishes')
cat6, _ = Category.objects.get_or_create(name='Hot Pot')
print("    Categories created successfully!")

# ==================== FOODS (20 dishes) ====================
print(">>> Creating Foods...")

f1,  _ = Food.objects.get_or_create(dish='Fresh Spring Rolls',               category=cat1, defaults={'description': 'Fresh rolls with shrimp, pork, vermicelli and herbs wrapped in rice paper',                     'price': 45000,  'time': 10})
f2,  _ = Food.objects.get_or_create(dish='Crispy Fried Spring Rolls',        category=cat1, defaults={'description': 'Golden fried rolls filled with pork, wood ear mushrooms and glass noodles',                    'price': 55000,  'time': 10})
f3,  _ = Food.objects.get_or_create(dish='Crab and Corn Soup',               category=cat1, defaults={'description': 'Smooth crab soup with quail eggs and sweet corn',                                              'price': 40000,  'time': 10})
f4,  _ = Food.objects.get_or_create(dish='Steamed Dumplings',                category=cat1, defaults={'description': 'Delicate steamed dumplings filled with shrimp and pork',                                       'price': 60000,  'time': 15})
f5,  _ = Food.objects.get_or_create(dish='Grilled Squid Salad',              category=cat1, defaults={'description': 'Fresh squid grilled and tossed with green mango, herbs and chili lime dressing',              'price': 75000,  'time': 15})
f6,  _ = Food.objects.get_or_create(dish='Broken Rice with Grilled Pork',    category=cat2, defaults={'description': 'Saigon-style broken rice with grilled pork chop, shredded pork skin and egg cake',            'price': 75000,  'time': 15})
f7,  _ = Food.objects.get_or_create(dish='Spicy Beef Noodle Soup',           category=cat2, defaults={'description': 'Central Vietnamese spicy noodle soup with beef, pork knuckle and lemongrass',                 'price': 65000,  'time': 20})
f8,  _ = Food.objects.get_or_create(dish='Traditional Beef Pho',             category=cat2, defaults={'description': 'Classic beef pho with 12-hour slow-cooked bone broth and fresh herbs',                        'price': 70000,  'time': 20})
f9,  _ = Food.objects.get_or_create(dish='Braised Catfish in Clay Pot',      category=cat2, defaults={'description': 'Catfish braised in caramel sauce with black pepper and chili',                                 'price': 85000,  'time': 25})
f10, _ = Food.objects.get_or_create(dish='Steamed Rice with Ginger Chicken', category=cat2, defaults={'description': 'Fragrant steamed rice served with poached chicken and ginger scallion sauce',                  'price': 80000,  'time': 20})
f11, _ = Food.objects.get_or_create(dish='Banh Mi Sandwich',                 category=cat2, defaults={'description': 'Vietnamese baguette stuffed with cold cuts, pâté, pickled vegetables and chili',              'price': 35000,  'time': 10})
f12, _ = Food.objects.get_or_create(dish='Three-Color Bean Dessert',         category=cat3, defaults={'description': 'Layered dessert with mung bean, red bean, jelly and coconut cream',                           'price': 30000,  'time': 10})
f13, _ = Food.objects.get_or_create(dish='Caramel Flan',                     category=cat3, defaults={'description': 'Silky smooth caramel custard pudding',                                                        'price': 35000,  'time': 10})
f14, _ = Food.objects.get_or_create(dish='Coconut Sticky Rice with Mango',   category=cat3, defaults={'description': 'Sweet sticky rice cooked in coconut milk served with fresh ripe mango',                       'price': 45000,  'time': 10})
f15, _ = Food.objects.get_or_create(dish='Fresh Orange Juice',               category=cat4, defaults={'description': 'Freshly squeezed orange juice, no added sugar',                                               'price': 35000,  'time': 5})
f16, _ = Food.objects.get_or_create(dish='Iced Lemon Tea',                   category=cat4, defaults={'description': 'Cold-brewed black tea with fresh lemon slices',                                               'price': 20000,  'time': 5})
f17, _ = Food.objects.get_or_create(dish='Sugarcane Juice',                  category=cat4, defaults={'description': 'Fresh-pressed sugarcane juice with kumquat',                                                  'price': 25000,  'time': 5})
f18, _ = Food.objects.get_or_create(dish='Grilled Beef in Wild Pepper Leaves', category=cat5, defaults={'description': 'Minced beef with lemongrass wrapped in wild pepper leaves grilled over charcoal',           'price': 95000,  'time': 20})
f19, _ = Food.objects.get_or_create(dish='Grilled Shrimp with Chili Salt',   category=cat5, defaults={'description': 'Fresh tiger prawns grilled with green chili salt',                                            'price': 120000, 'time': 20})
f20, _ = Food.objects.get_or_create(dish='Thai Seafood Hot Pot',             category=cat6, defaults={'description': 'Spicy and sour Thai-style hot pot with fresh shrimp, squid, fish and vegetables',             'price': 250000, 'time': 30})
f21, _ = Food.objects.get_or_create(dish='Beef Vinegar Hot Pot',             category=cat6, defaults={'description': 'Tangy vinegar-based hot pot with thinly sliced fresh beef and rice paper',                    'price': 220000, 'time': 30})

all_foods = [f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19,f20,f21]
print("    Foods created successfully! (21 total)")

# ==================== INGREDIENTS (15) ====================
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
ing11, _ = Ingredient.objects.get_or_create(name='Squid')
ing12, _ = Ingredient.objects.get_or_create(name='Chicken')
ing13, _ = Ingredient.objects.get_or_create(name='Mango')
ing14, _ = Ingredient.objects.get_or_create(name='Coconut Milk')
ing15, _ = Ingredient.objects.get_or_create(name='Corn')
print("    Ingredients created successfully! (15 total)")

# ==================== FOOD INGREDIENTS ====================
print(">>> Creating FoodIngredients...")

food_ingredients_data = [
    (f1,  ing1,  '5 medium tiger prawns'),
    (f1,  ing2,  '50g sliced boiled pork'),
    (f1,  ing3,  'Adequate rice vermicelli'),
    (f1,  ing4,  'Lettuce and basil leaves'),
    (f2,  ing2,  '100g minced pork'),
    (f2,  ing5,  '20g soaked wood ear mushrooms'),
    (f2,  ing6,  '30g soaked and chopped glass noodles'),
    (f3,  ing15, '50g sweet corn kernels'),
    (f4,  ing1,  '6 medium tiger prawns'),
    (f4,  ing2,  '80g minced pork'),
    (f5,  ing11, '150g fresh squid'),
    (f5,  ing13, '100g green mango strips'),
    (f5,  ing4,  'Mint, cilantro, Vietnamese balm'),
    (f8,  ing7,  '100g rare and well-done beef slices'),
    (f8,  ing8,  'Bone broth simmered for 12 hours'),
    (f8,  ing3,  'Fresh flat rice noodles'),
    (f9,  ing9,  '200g catfish fillet'),
    (f10, ing12, '250g whole poached chicken thigh'),
    (f14, ing14, '200ml coconut milk'),
    (f14, ing13, '1 fresh ripe mango, sliced'),
    (f18, ing7,  '200g minced beef'),
    (f18, ing10, '20 fresh wild pepper leaves'),
    (f19, ing1,  '6 fresh tiger prawns'),
    (f20, ing1,  '8 fresh tiger prawns'),
    (f20, ing11, '100g squid rings'),
]

for food, ingredient, note in food_ingredients_data:
    FoodIngredient.objects.get_or_create(food=food, ingredients=ingredient, defaults={'notes': note})

print("    FoodIngredients created successfully!")

# ==================== TABLES (10) ====================
print(">>> Creating Tables...")

tables_data = [
    (1, 2,  Status_Table.AVAILABLE),
    (2, 2,  Status_Table.AVAILABLE),
    (3, 4,  Status_Table.AVAILABLE),
    (4, 4,  Status_Table.AVAILABLE),
    (5, 4,  Status_Table.AVAILABLE),
    (6, 6,  Status_Table.AVAILABLE),
    (7, 6,  Status_Table.AVAILABLE),
    (8, 8,  Status_Table.AVAILABLE),
    (9, 8,  Status_Table.AVAILABLE),
    (10, 10, Status_Table.AVAILABLE),
]
tables = []
for tid, slot, status in tables_data:
    t, _ = Table.objects.get_or_create(id=tid, defaults={'slot': slot, 'status_table': status})
    tables.append(t)

t1,t2,t3,t4,t5,t6,t7,t8,t9,t10 = tables
print("    Tables created successfully! (10 total)")

# ==================== DINING SESSIONS (12) ====================
print(">>> Creating DiningSessions...")

sessions_data = [
    ('TB1-200001', t1, u1,  Status_Session.CLOSED),
    ('TB2-200002', t2, u2,  Status_Session.CLOSED),
    ('TB3-200003', t3, u3,  Status_Session.CLOSED),
    ('TB4-200004', t4, u4,  Status_Session.CLOSED),
    ('TB5-200005', t5, u5,  Status_Session.CLOSED),
    ('TB6-200006', t6, u6,  Status_Session.CLOSED),
    ('TB7-200007', t7, u7,  Status_Session.CLOSED),
    ('TB8-200008', t8, u8,  Status_Session.CLOSED),
    ('TB9-200009', t9, u9,  Status_Session.CLOSED),
    ('TB10-200010', t10, u10, Status_Session.CLOSED),
    # 2 OPEN sessions (unique per table constraint)
    ('TB3-200011', t3, u11, Status_Session.OPEN),
    ('TB5-200012', t5, u1,  Status_Session.OPEN),
]

sessions = []
for code, table, customer, status in sessions_data:
    s, _ = DiningSession.objects.get_or_create(session_code=code, defaults={
        'table': table, 'customer': customer, 'status_session': status
    })
    sessions.append(s)

s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12 = sessions
print("    DiningSessions created successfully! (12 total)")

# ==================== ORDERS + ORDER DETAILS (12 orders) ====================
print(">>> Creating Orders and OrderDetails...")

orders_data = [
    (s1,  u1,  Status_Order.SUCCESS,  [(f1,2),(f6,1),(f16,2)]),
    (s2,  u2,  Status_Order.SUCCESS,  [(f20,1),(f18,2),(f15,3)]),
    (s3,  u3,  Status_Order.SUCCESS,  [(f7,2),(f12,2),(f16,2)]),
    (s4,  u4,  Status_Order.SUCCESS,  [(f8,3),(f2,2),(f13,3),(f15,3)]),
    (s5,  u5,  Status_Order.SUCCESS,  [(f21,1),(f19,2),(f3,2)]),
    (s6,  u6,  Status_Order.SUCCESS,  [(f4,2),(f10,2),(f14,2),(f17,3)]),
    (s7,  u7,  Status_Order.SUCCESS,  [(f5,1),(f11,2),(f12,1),(f16,2)]),
    (s8,  u8,  Status_Order.SUCCESS,  [(f9,1),(f6,2),(f13,2),(f15,2)]),
    (s9,  u9,  Status_Order.SUCCESS,  [(f20,1),(f4,2),(f17,2)]),
    (s10, u10, Status_Order.SUCCESS,  [(f8,2),(f19,1),(f12,1),(f15,2)]),
    # 2 WAITING orders on OPEN sessions
    (s11, u11, Status_Order.WAITING,  [(f9,1),(f18,1),(f16,2)]),
    (s12, u1,  Status_Order.WAITING,  [(f20,1),(f5,1),(f15,2)]),
]

for session, user, status, details in orders_data:
    o, created = Order.objects.get_or_create(
        session=session, status_order=status,
        defaults={'user': user, 'total': 0}
    )
    if created:
        for food, qty in details:
            OrderDetail.objects.create(order=o, food=food, quantity=qty)

print("    Orders and OrderDetails created successfully! (12 total)")

# ==================== REVIEWS (18 reviews) ====================
print(">>> Creating Reviews...")

reviews_data = [
    (u1,  f1,  'Very fresh and tasty, the dipping sauce is amazing!',               Rating.STAR_5),
    (u2,  f1,  'Good but a bit light on the filling.',                              Rating.STAR_4),
    (u3,  f1,  'Love this dish, will definitely come back!',                        Rating.STAR_5),
    (u1,  f6,  'Authentic Saigon broken rice, the pork chop is perfectly grilled.', Rating.STAR_5),
    (u2,  f6,  'Tasty and portion size is just right.',                             Rating.STAR_4),
    (u3,  f8,  'Clear broth, naturally sweet, absolutely love it!',                 Rating.STAR_5),
    (u4,  f8,  'Generous bowl, noodles are soft and chewy.',                        Rating.STAR_4),
    (u5,  f8,  'Slightly salty but overall still good.',                            Rating.STAR_3),
    (u1,  f20, 'Perfectly spiced Thai hot pot, super fresh seafood!',               Rating.STAR_5),
    (u4,  f20, 'Great value, ideal for large groups.',                              Rating.STAR_5),
    (u5,  f20, 'Broth is excellent but service was a bit slow.',                    Rating.STAR_3),
    (u2,  f18, 'Fragrant grilled beef, pairs perfectly with rice paper.',           Rating.STAR_5),
    (u3,  f18, 'Delicious and very affordable.',                                    Rating.STAR_4),
    (u6,  f4,  'Dumplings were juicy and well-seasoned, highly recommend!',         Rating.STAR_5),
    (u7,  f10, 'Chicken was so tender, the ginger sauce really makes it.',          Rating.STAR_4),
    (u8,  f9,  'Rich caramel flavor, catfish was perfectly cooked.',                Rating.STAR_5),
    (u9,  f14, 'Mango sticky rice is my favorite dessert here!',                    Rating.STAR_5),
    (u10, f5,  'Grilled squid salad was refreshing and light, a perfect starter.',  Rating.STAR_4),
]

for user, food, comment, rating in reviews_data:
    Review.objects.get_or_create(user=user, food=food, defaults={'comment': comment, 'rating': rating})

print("    Reviews created successfully! (18 total)")

# ==================== FOOD CHEFS ====================
print(">>> Creating FoodChefs...")

food_chefs_data = [
    (f1,  u_chef1), (f2,  u_chef1), (f3,  u_chef1), (f4,  u_chef1), (f5,  u_chef1),
    (f6,  u_chef1), (f7,  u_chef2), (f8,  u_chef2), (f9,  u_chef2), (f10, u_chef2),
    (f11, u_chef3), (f12, u_chef3), (f13, u_chef3), (f14, u_chef3), (f15, u_chef3),
    (f16, u_chef3), (f17, u_chef3), (f18, u_chef2), (f19, u_chef2), (f20, u_chef1),
    (f21, u_chef2),
]

for food, chef in food_chefs_data:
    FoodChef.objects.get_or_create(food=food, chef=chef)

print("    FoodChefs created successfully!")

# ==================== RESERVATIONS (14) ====================
print(">>> Creating Reservations...")

from django.core.exceptions import ValidationError

now = timezone.now()

# --- Past reservations: bypass clean() via bulk_create ---
past_reservations_data = [
    (u1,  t1,  now - timedelta(days=7, hours=2), 2,  Status_Reservation.COMPLETED),
    (u2,  t2,  now - timedelta(days=6, hours=3), 4,  Status_Reservation.COMPLETED),
    (u3,  t4,  now - timedelta(days=5, hours=5), 6,  Status_Reservation.COMPLETED),
    (u4,  t5,  now - timedelta(days=4, hours=1), 5,  Status_Reservation.COMPLETED),
    (u5,  t6,  now - timedelta(days=3, hours=4), 7,  Status_Reservation.COMPLETED),
    (u6,  t7,  now - timedelta(days=2, hours=2), 8,  Status_Reservation.COMPLETED),
    (u7,  t8,  now - timedelta(days=1, hours=6), 10, Status_Reservation.COMPLETED),
]

for user, table, serve_time, qty, status in past_reservations_data:
    if not Reservation.objects.filter(user=user, table=table, serve_time=serve_time).exists():
        r = Reservation(user=user, table=table, serve_time=serve_time,
                        customer_quantity=qty, status_reservation=status)
        r.end_time = r.serve_time + timedelta(minutes=30)
        Reservation.objects.bulk_create([r])

# --- Future reservations: normal get_or_create ---
future_reservations_data = [
    (u8,  t1,  now + timedelta(days=1, hours=1),  2,  Status_Reservation.CONFIRMED),
    (u9,  t3,  now + timedelta(days=1, hours=3),  4,  Status_Reservation.CONFIRMED),
    (u10, t5,  now + timedelta(days=2, hours=2),  5,  Status_Reservation.CONFIRMED),
    (u11, t6,  now + timedelta(days=2, hours=4),  7,  Status_Reservation.CONFIRMED),
    (u1,  t7,  now + timedelta(days=3),            8,  Status_Reservation.CONFIRMED),
    (u2,  t8,  now + timedelta(days=4, hours=2),  10, Status_Reservation.CONFIRMED),
    (u3,  t9,  now + timedelta(days=5, hours=3),  8,  Status_Reservation.CONFIRMED),
]

for user, table, serve_time, qty, status in future_reservations_data:
    try:
        Reservation.objects.get_or_create(
            user=user, table=table, serve_time=serve_time,
            defaults={'customer_quantity': qty, 'status_reservation': status}
        )
    except ValidationError as e:
        print(f"    WARNING: Skipped reservation for {user} - {e}")

print("    Reservations created successfully! (14 total)")

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