# Restaurant Management System

A full-stack restaurant management system built with a Django REST API backend and a React Native mobile application for customers, chefs, and administrators.

## Overview

This project combines:

- Backend API: Django + Django REST Framework
- Frontend mobile app: React Native + Expo
- Database: MySQL
- Media storage: Cloudinary
- Payment integration: PayOS
- Authentication: OAuth2 + custom user roles

The system supports food browsing, reservations, order management, table flow, chef management, admin dashboards, and payment processing.

## Project structure

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

## Main features

### Customer features
- Browse food categories and menu items
- Search foods and compare food options
- Add to cart and place orders
- Reserve tables and check in
- View order history
- Update profile and password
- Pay via QR payment flow

### Chef features
- View assigned food items
- Create/update food entries
- Manage menu and food approval status
- View statistics for sold dishes and revenue

### Admin features
- Approve or reject chef accounts
- Manage users and food assignments
- View dashboards and revenue statistics
- Monitor reservations and restaurant activity

## API capabilities

The Django backend exposes REST endpoints for:

- Categories
- Foods and food reviews
- Users and authentication-related actions
- Orders and payment
- Reservations and table booking
- Dining sessions and statistics
- Ingredients and food comparisons

The API router is defined in `erestaurantapis/restaurant/urls.py` and contains resource groups such as:

- `/categories`
- `/foods`
- `/users`
- `/reviews`
- `/orders`
- `/reservations`
- `/statistics`
- `/tables`
- `/ingredients`

## Tech stack

### Backend
- Python 3.x
- Django 6.0.3
- Django REST Framework
- drf-yasg for Swagger docs
- OAuth Toolkit
- MySQL
- Cloudinary
- PayOS SDK

### Mobile app
- React Native
- Expo
- React Navigation
- React Native Paper
- Axios
- Secure storage
- QR code and chart libraries

## How to run

### 1) Backend

```bash
cd erestaurantapis
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Then configure your local database and cloud credentials in `erestaurantapis/settings.py`.

Important notes:
- The project uses MySQL (`restaurantdb`, user `root`, password `root` by default)
- Cloudinary credentials and OAuth client credentials are configured in the settings file
- For production, these values should be moved to environment variables and not committed to source control

Create database tables:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

You can also use the helper shell script:

```bash
bash run_django.sh
```

### 2) Mobile app

```bash
cd restaurantmobileapp
npm install
npm start
```

For Android/iOS:

```bash
npm run android
npm run ios
```

## Environment and security notes

This repository currently contains example or placeholder configuration values in `erestaurantapis/erestaurantapis/settings.py` for:

- Cloudinary
- OAuth client settings
- database connection configuration

Before deploying, replace them with real environment-based configuration.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Notes

This repository is a practical restaurant management project combining backend business logic with a mobile customer experience. It is suitable for learning full-stack application design, role-based access, reservation management, and order/payment workflows.

## Authors

Repository owner: `BeAFA`

## Contributing

Pull requests and improvements are welcome. If you want to extend the project, consider adding:

- test coverage for API endpoints
- CI/CD pipeline
- Docker support
- environment variable management
- admin analytics improvements
- user notification system

---

If you want, I can also help you:
- create a more polished bilingual README (English + Vietnamese)
- add setup screenshots or architecture diagrams
- generate Docker configuration for this project
- write a project roadmap for future features
