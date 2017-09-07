from django.core.management.base import BaseCommand
from api.models import Exercise

class Command(BaseCommand):
    help = 'populate database with exercises'

    def handle(self, *args, **options):
        file = open('./exercises.txt')
        file = file.readlines()
        for exercise in file:
            exercise = exercise.rstrip('\n')
            entry = Exercise(
                exercise_name=exercise,
                muscle_group='Triceps'
            )
            entry.save()
