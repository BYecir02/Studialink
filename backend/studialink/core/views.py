# core/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from .models import Utilisateur
from .serializers import RegisterSerializer, LoginSerializer, UtilisateurSerializer
from .permissions import IsOwnerOrAdmin  

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Inscription réussie. Vérifiez votre email."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user_id": user.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)

class UtilisateurListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        utilisateurs = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response(serializer.data)

class UtilisateurDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]  # Ajoute IsOwnerOrAdmin

    def get(self, request, pk):
        utilisateur = get_object_or_404(Utilisateur, pk=pk)
        serializer = UtilisateurSerializer(utilisateur)
        return Response(serializer.data)

    def put(self, request, pk):
        utilisateur = get_object_or_404(Utilisateur, pk=pk)
        if request.user != utilisateur and not request.user.administrateur:
            return Response(
                {"detail": "Vous n'avez pas la permission de modifier ce profil."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = UtilisateurSerializer(utilisateur, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)