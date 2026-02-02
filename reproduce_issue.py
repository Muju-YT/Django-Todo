import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Todo_List.settings')
django.setup()

from tasks.forms import RegisterForm
from django.contrib.auth.models import User

# Test case: Passwords match
data_match = {
    'username': 'testuser',
    'email': 'test@example.com',
    'first_name': 'Test',
    'last_name': 'User',
    'password1': 'mypassword123',
    'password2': 'mypassword123',
}

form = RegisterForm(data=data_match)
if form.is_valid():
    print("SUCCESS: Form is valid with matching passwords.")
else:
    print("FAILURE: Form is invalid with matching passwords.")
    print(form.errors)

# Test case: Passwords do not match
data_mismatch = {
    'username': 'testuser2',
    'email': 'test2@example.com',
    'first_name': 'Test',
    'last_name': 'User',
    'password1': 'mypassword123',
    'password2': 'mypassword1234',
}

form2 = RegisterForm(data=data_mismatch)
if not form2.is_valid():
    print("SUCCESS: Form correctly detected mismatch.")
    if 'password_mismatch' in str(form2.errors) or "didn't match" in str(form2.errors):
        print("Error message confirmed.")
else:
    print("FAILURE: Form accepted mismatched passwords.")
