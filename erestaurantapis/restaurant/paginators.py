from rest_framework import pagination

class FoodPagination(pagination.PageNumberPagination):
    page_size = 5

class ReviewsPagination(pagination.PageNumberPagination):
    page_size = 5