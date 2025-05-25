# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

class Filiere(models.Model):
    TYPE_CHOICES = [
        ('cycle', 'Cycle'),
        ('specialisation', 'Spécialisation'),
    ]
    nom = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.nom} ({self.get_type_display()})"

class Utilisateur(AbstractUser):
    NIVEAU_CHOICES = [
        ('1', '1ère année'),
        ('2', '2ème année'),
        ('3', '3ème année'),
        ('4', '4ème année'),
        ('5', '5ème année'),
    ]
    email = models.EmailField(unique=True)
    prenom = models.CharField(max_length=50)
    nom = models.CharField(max_length=50)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    niveau = models.CharField(max_length=1, choices=NIVEAU_CHOICES)
    actif = models.BooleanField(default=True)
    administrateur = models.BooleanField(default=False)
    date_inscription = models.DateTimeField(auto_now_add=True)
    derniere_connexion = models.DateTimeField(blank=True, null=True)
    filiere = models.ForeignKey(Filiere, on_delete=models.SET_NULL, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','prenom', 'nom']

    def clean(self):
        if self.niveau in ['1', '2', '3'] and self.filiere and self.filiere.type != 'cycle':
            raise ValidationError("Seul un cycle est autorisé pour les 1ère à 3ème années.")
        elif self.niveau in ['4', '5'] and self.filiere and self.filiere.type != 'specialisation':
            raise ValidationError("Seule une spécialisation est autorisée pour les 4ème et 5ème années.")

    def __str__(self):
        return f"{self.prenom} {self.nom}"

class Matiere(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom

class MatiereSuivie(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.utilisateur} - {self.matiere}"

    class Meta:
        unique_together = ('utilisateur', 'matiere')

class SessionTravail(models.Model):
    CONFIDENTIALITE_CHOICES = [
        ('public', 'Public'),
        ('prive', 'Privé'),
    ]
    STATUT_CHOICES = [
        ('planifiee', 'Planifiée'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
        ('annulee', 'Annulée'),
    ]
    titre = models.CharField(max_length=200)
    description = models.TextField(max_length=500, blank=True)
    lieu = models.CharField(max_length=200, blank=True)
    en_ligne = models.BooleanField(default=False)
    lien_en_ligne = models.URLField(blank=True)
    salle = models.CharField(max_length=100, blank=True)
    date_heure = models.DateTimeField()
    max_participants = models.PositiveIntegerField(validators=[MinValueValidator(2), MaxValueValidator(20)])
    confidentialite = models.CharField(max_length=20, choices=CONFIDENTIALITE_CHOICES)
    code_acces = models.CharField(max_length=6, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    cree_le = models.DateTimeField(auto_now_add=True)
    modifie_le = models.DateTimeField(auto_now=True)
    createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='sessions_creees')
    matiere = models.ForeignKey(Matiere, on_delete=models.SET_NULL, null=True, blank=True)

    def clean(self):
        if self.en_ligne and not self.lien_en_ligne:
            raise ValidationError("Un lien en ligne est requis si la session est en ligne.")
        if not self.en_ligne and not self.salle:
            raise ValidationError("Une salle est requise si la session n'est pas en ligne.")

    def __str__(self):
        return self.titre

class ParticipantSession(models.Model):
    session = models.ForeignKey(SessionTravail, on_delete=models.CASCADE)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    approuve = models.BooleanField(default=False)
    date_rejoindre = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.utilisateur} - {self.session}"

    class Meta:
        unique_together = ('session', 'utilisateur')

class Message(models.Model):
    session = models.ForeignKey(SessionTravail, on_delete=models.CASCADE)
    expediteur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='messages_envoyes')
    contenu = models.TextField()
    piece_jointe = models.FileField(upload_to='pieces_jointes/', blank=True, null=True)
    date_envoi = models.DateTimeField(auto_now_add=True)
    prive = models.BooleanField(default=False)
    destinataire = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=True, blank=True, related_name='messages_recus')

    def clean(self):
        if self.prive and not self.destinataire:
            raise ValidationError("Un destinataire est requis pour un message privé.")

    def __str__(self):
        return f"Message de {self.expediteur} dans {self.session}"

class Fichier(models.Model):
    session = models.ForeignKey(SessionTravail, on_delete=models.CASCADE)
    uploadeur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    fichier = models.FileField(upload_to='fichiers/')
    date_upload = models.DateTimeField(auto_now_add=True)
    taille = models.PositiveIntegerField()
    type = models.CharField(max_length=50)

    def __str__(self):
        return f"Fichier {self.fichier.name} par {self.uploadeur}"

class Notification(models.Model):
    TYPE_CHOICES = [
        ('session', 'Session'),
        ('message', 'Message'),
        ('fichier', 'Fichier'),
    ]
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    contenu = models.TextField()
    lue = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification pour {self.utilisateur}: {self.contenu}"

class Signalement(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('traite', 'Traité'),
    ]
    signale_par = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='signalements_faits')
    utilisateur_cible = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=True, blank=True, related_name='signalements_recus')
    session_cible = models.ForeignKey(SessionTravail, on_delete=models.CASCADE, null=True, blank=True)
    message_cible = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    motif = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    date_signalement = models.DateTimeField(auto_now_add=True)
    traite_par = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='signalements_traites')
    date_traitement = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if not any([self.utilisateur_cible, self.session_cible, self.message_cible]):
            raise ValidationError("Un signalement doit cibler un utilisateur, une session ou un message.")

    def __str__(self):
        return f"Signalement par {self.signale_par}"

class EvenementCalendrier(models.Model):
    TYPE_EVENEMENT_CHOICES = [
        ('session', 'Session'),
        ('personnel', 'Personnel'),
    ]
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    session = models.ForeignKey(SessionTravail, on_delete=models.CASCADE, null=True, blank=True)
    type_evenement = models.CharField(max_length=20, choices=TYPE_EVENEMENT_CHOICES)
    debut = models.DateTimeField()
    fin = models.DateTimeField()
    synchronise_avec = models.CharField(max_length=100, blank=True)

    def clean(self):
        if self.debut >= self.fin:
            raise ValidationError("La date de début doit être antérieure à la date de fin.")

    def __str__(self):
        return f"Événement {self.type_evenement} pour {self.utilisateur}"

class DemandeMatching(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('traite', 'Traité'),
    ]
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)
    creneau_prefere = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    date_demande = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Demande de {self.utilisateur} pour {self.matiere}"