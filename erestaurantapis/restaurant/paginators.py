from rest_framework import pagination

class FoodPagination(pagination.PageNumberPagination):
    page_size = 20

class ReviewsPagination(pagination.PageNumberPagination):
    page_size = 5