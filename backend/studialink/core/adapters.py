# core/adapters.py
from allauth.account.adapter import DefaultAccountAdapter
from django.core.exceptions import ValidationError

class UniversityEmailAdapter(DefaultAccountAdapter):
    def clean_email(self, email):
        allowed_domains = [
            'junia.com',
            'etudiant.univ-lille.fr',
            'student.junia.com',
            'gmail.com',
        ]
        domain = email.split('@')[1]
        if domain not in allowed_domains:
            raise ValidationError("Seuls les emails universitaires sont autorisés.")
        return super().clean_email(email)