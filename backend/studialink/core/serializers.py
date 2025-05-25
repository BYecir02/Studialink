# core/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from allauth.account.models import EmailAddress
from .models import Utilisateur, Filiere

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    filiere_id = serializers.PrimaryKeyRelatedField(queryset=Filiere.objects.all(), source='filiere')

    class Meta:
        model = Utilisateur
        fields = ['email', 'password', 'prenom', 'nom', 'niveau', 'filiere_id']

    def create(self, validated_data):
        username = validated_data.get('email').split('@')[0]
        user = Utilisateur.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            prenom=validated_data['prenom'],
            nom=validated_data['nom'],
            niveau=validated_data['niveau'],
            filiere=validated_data['filiere'],
        )
        # Envoie l'email de vérification
        EmailAddress.objects.create(user=user, email=user.email, verified=False, primary=True)
        user.emailaddress_set.filter(email=user.email).first().send_confirmation()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Identifiants incorrects.")

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = ['id', 'nom', 'type']

class UtilisateurSerializer(serializers.ModelSerializer):
    filiere = FiliereSerializer(read_only=True)
    filiere_id = serializers.PrimaryKeyRelatedField(
        queryset=Filiere.objects.all(), source='filiere', write_only=True
    )

    class Meta:
        model = Utilisateur
        fields = [
            'id', 'email', 'prenom', 'nom', 'photo', 'niveau',
            'actif', 'administrateur', 'date_inscription',
            'derniere_connexion', 'filiere', 'filiere_id'
        ]
        read_only_fields = ['id', 'date_inscription', 'derniere_connexion']