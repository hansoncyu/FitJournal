from rest_framework import serializers
from api.models import Workout, Routine, Exercise, Sets, Journal

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ('exercise_name', 'muscle_group', 'id')

class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Workout
        fields = ('days', 'exercises', 'id')
        ordering = ('id',)

class RoutineSerializer(serializers.ModelSerializer):
    workouts = WorkoutSerializer(many=True, read_only=True)

    class Meta:
        model = Routine
        fields = ('name', 'workouts', 'id')


class SetsSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)

    class Meta:
        model = Sets
        fields = ('exercise', 'reps', 'weight', 'id')
        ordering = ['id']
        order_by = ['id']

class JournalSerializer(serializers.ModelSerializer):
    exercises = SetsSerializer(many=True, read_only=True)

    class Meta:
        model = Journal
        fields = ('exercises', 'date', 'id')


