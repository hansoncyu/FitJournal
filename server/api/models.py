from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings

# Create your models here.

class Exercise(models.Model):
    exercise_name = models.CharField(max_length=30, default=None, null=True)
    muscle_group = models.CharField(max_length=20)
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)

class Sets(models.Model):
    exercise = models.ForeignKey(Exercise)
    reps = models.IntegerField(default=0)
    sets = models.IntegerField(default=0)

class Workout(models.Model):
    name = models.CharField(max_length=30)
    DAYS = (
        ('Sun', 'Sunday'),
        ('Mon', 'Monday'),
        ('Tues', 'Tuesday'),
        ('Wed', 'Wednesday'),
        ('Thurs', 'Thursday'),
        ('Fri', 'Friday'),
        ('Sat', 'Saturday')
    )
    days = ArrayField(models.CharField(max_length=5, choices=DAYS))
    exercises = models.ManyToManyField(Exercise)

class Journal(models.Model):
    date = models.DateTimeField()
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercises = models.ManyToManyField(Sets)

