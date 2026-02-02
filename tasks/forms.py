from django import forms
from .models import Task
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'due_date', 'completed', 'tags', 'notes']


class RegisterForm(UserCreationForm):
    profile_image = forms.ImageField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'password1' in self.fields:
            self.fields['password1'].strip = False
        if 'password2' in self.fields:
            self.fields['password2'].strip = False

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

    def save(self, commit=True):
        user = super().save(commit)
        profile = user.profile
        profile.profile_image = self.cleaned_data.get('profile_image')
        profile.save()
        return user


class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_image']
