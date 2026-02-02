from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(
        max_length=10,
        choices=[
            ('Low', 'Low'),
            ('Medium', 'Medium'),
            ('High', 'High')
        ],
        default='Medium'
    )
    due_date = models.DateField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        upload_to='profiles/',
        default='profiles/default.png'
    )

    def __str__(self):
        return self.user.username
