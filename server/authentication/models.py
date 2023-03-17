import secrets
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.http import JsonResponse

class ProfileManager(BaseUserManager):
    def create_user(self, password=None, token=None, token1=None):
        while not token or Profile.objects.filter(token=token).exists():
            token = secrets.token_hex(10)
        while not token1 or Profile.objects.filter(token1=token1).exists():
            token1 = secrets.token_hex(4).upper()
        if password is None:
            return JsonResponse({'status': 'error', 'message': 'Password is required'})
        if password.length < 8:
            return JsonResponse({'status': 'error', 'message': 'Password must be at least 8 characters'})
        user = self.model(token=token, token1=token1)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, password=None, token=None, token1=None):
        user = self.create_user(password=password, token=token, token1=token1)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    
    def __str__(self):
        return self.token + ' ' + self.password
    
        
class Profile(AbstractBaseUser):
    token = models.CharField(max_length=10, unique=True)
    token1 = models.CharField(max_length=4, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
        
    USERNAME_FIELD = 'token'
    
    last_login = None

    objects = ProfileManager()

class Friend(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friends_as_user')
    friend = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='frnick_as_friend')
    nickname = models.CharField(max_length=8)
