# Generated by Django 4.1.7 on 2023-03-15 08:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('room', '0002_remove_room_name_room_first_user_room_second_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='first_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='first_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='room',
            name='second_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='second_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
