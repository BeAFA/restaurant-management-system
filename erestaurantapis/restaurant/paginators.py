from rest_framework import pagination

class FoodPagination(pagination.PageNumberPagination):
    page_size = 10

class ReviewsPagination(pagination.PageNumberPagination):
    page_size = 5