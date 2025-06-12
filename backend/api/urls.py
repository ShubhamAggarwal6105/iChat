from django.urls import path
from . import views

urlpatterns = [
    path('auth/send-code/', views.send_verification_code, name='send_verification_code'),
    path('auth/verify-code/', views.verify_code, name='verify_code'),
    path('auth/check/', views.check_authentication, name='check_authentication'),
    path('auth/logout/', views.logout, name='logout'),
    path('groups/', views.get_groups, name='get_groups'),
    path('groups/<str:group_id>/messages/', views.get_messages, name='get_messages'),
]
