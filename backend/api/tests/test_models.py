from django.test import TestCase
from api.models import Exercise, Sets, Workout, Journal, Routine
from django.contrib.auth.models import User
from django.utils import timezone

class ExerciseTestCase(TestCase):
    def setUp(self):
        test_user = User(username='testUser')
        test_user.set_password('testPassword')
        test_user.save()

        bench_press = Exercise(
            exercise_name = 'Flat Bench Press',
            muscle_group = 'Chest'
        )
        bench_press.save()

        squat = Exercise(
            exercise_name='Squat',
            muscle_group='Legs'
        )
        squat.save()

        calf_raise = Exercise(
            exercise_name='Seated Calf Raise',
            muscle_group='Legs'
        )
        calf_raise.save()

        deadlift = Exercise(
            exercise_name = 'Deadlift',
            muscle_group = 'Back',
            author = test_user
        )
        deadlift.save()


    def test_exercises_have_id_or_author(self):
        bench = Exercise.objects.get(exercise_name='Flat Bench Press')
        squat = Exercise.objects.get(exercise_name='Squat')
        deadlift = Exercise.objects.get(exercise_name='Deadlift')
        self.assertEqual(bench.muscle_group, 'Chest')
        self.assertEqual(squat.muscle_group, 'Legs')
        self.assertEqual(deadlift.muscle_group, 'Back')
        self.assertEqual(deadlift.author.username, 'testUser')

class JournalTestCase(TestCase):
    def setUp(self):
        ExerciseTestCase().setUp()
        test_user = User.objects.get(username='testUser')
        date = timezone.localdate(timezone.now())
        bench = Exercise.objects.get(exercise_name='Flat Bench Press')
        squat = Exercise.objects.get(exercise_name='Squat')
        benchSet1 = Sets(
            exercise = bench,
            reps = 8,
            weight = 135
        )
        benchSet2 = Sets(
            exercise=bench,
            reps=5,
            weight=145
        )
        benchSet3 = Sets(
            exercise=bench,
            reps=3,
            weight=155
        )
        squatSet1 = Sets(
            exercise=squat,
            reps=5,
            weight=225
        )
        squatSet2 = Sets(
            exercise=squat,
            reps=8,
            weight=205
        )
        benchSet1.save()
        benchSet2.save()
        benchSet3.save()
        squatSet1.save()
        squatSet2.save()

        test_journal = Journal(
            date=date,
            author=test_user
        )
        test_journal.save()
        test_journal.exercises.add(benchSet1, benchSet2, benchSet3, squatSet1, squatSet2)

    def test_journals_have_date_author_exercises(self):
        test_user = User.objects.get(username='testUser')
        pk = test_user.id
        journal = Journal.objects.get(author=pk)
        sets = journal.exercises.all()
        firstset = sets[0]
        self.assertEqual(firstset.exercise.exercise_name, 'Flat Bench Press')
        self.assertEqual(firstset.reps, 8)
        self.assertEqual(firstset.weight, 135)

class RoutineTestCase(TestCase):
    def setUp(self):
        ExerciseTestCase().setUp()
        test_user = User.objects.get(username='testUser')
        workoutA = Workout(
            days = ['Sun', 'Wed']
        )
        workoutA.save()
        a = Exercise.objects.get(exercise_name='Flat Bench Press')
        b = Exercise.objects.get(exercise_name='Deadlift')
        c = Exercise.objects.get(exercise_name='Squat')
        workoutA.exercises.add(a, b)
        workoutB = Workout(
            days = ['Mon', 'Thurs']
        )
        workoutB.save()
        workoutB.exercises.add(b, c)

        routine = Routine(
            name='Strength Block',
            author=test_user
        )
        routine.save()
        routine.workouts.add(workoutA, workoutB)

    def test_routine_can_add_exercises(self):
        test_user = User.objects.get(username='testUser')
        pk = test_user.id
        routine = Routine.objects.get(author=pk)
        self.assertEqual(routine.name, 'Strength Block')
        workouts = routine.workouts.all()
        workoutA = workouts[0]
        workoutB = workouts[1]
        self.assertEqual(workoutA.days, ['Sun', 'Wed'])
        self.assertEqual(workoutB.days, ['Mon', 'Thurs'])
        exercises = workoutA.exercises.all()
        self.assertEqual(exercises[0].exercise_name, 'Flat Bench Press')










