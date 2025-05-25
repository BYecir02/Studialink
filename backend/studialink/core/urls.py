# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/register/', views.RegisterView.as_view(), name='register'),
    path('api/auth/login/', views.LoginView.as_view(), name='login'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/users/', views.UtilisateurListView.as_view(), name='utilisateur-list'),
    path('api/users/<int:pk>/', views.UtilisateurDetailView.as_view(), name='utilisateur-detail'),
]