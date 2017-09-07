from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings

# Create your models here.

class Exercise(models.Model):
    exercise_name = models.CharField(max_length=50, default=None, null=True)
    muscle_group = models.CharField(max_length=20)
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.exercise_name

class Sets(models.Model):
    exercise = models.ForeignKey(Exercise)
    reps = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)

    def __str__(self):
        return self.exercise.exercise_name + ' ' + str(self.weight) + ' ' + str(self.reps) + 'reps'

    class Meta:
        ordering = ['id']

class Workout(models.Model):
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

class Routine(models.Model):
    name = models.CharField(max_length=30)
    workouts = models.ManyToManyField(Workout, blank=True)
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)


class Journal(models.Model):
    date = models.DateTimeField()
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercises = models.ManyToManyField(Sets, blank=True)

    def __str__(self):
        return 'Journal on ' + str(self.date)

