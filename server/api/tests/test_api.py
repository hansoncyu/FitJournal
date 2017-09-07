from django.test import TestCase, Client
from api.tests.test_models import ExerciseTestCase, RoutineTestCase, JournalTestCase
from api.models import Exercise, Journal, Sets
from django.utils import timezone
import json, urllib

class ExerciseRouteTestCase(TestCase):
    def setUp(self):
        ExerciseTestCase().setUp()

    def test_can_get_default_exercises_and_user_specific(self):
        client = Client()
        # not logged in so should fail auth test
        response = client.get('/api/exercises')
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        self.assertEqual(response_data['error'], 'Not logged in')

        # no parameters set so should fail
        client.login(username='testUser', password='testPassword')
        response = client.get('/api/exercises')
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        self.assertEqual(response_data['error'], 'Invalid GET parameters')

        queryAll = '/api/exercises?muscle_group=All'
        queryLegs = '/api/exercises?muscle_group=Legs'

        response = client.get(queryAll)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        first_exercise = response_data[0]['fields']['exercise_name']
        self.assertEqual(first_exercise, 'Deadlift')

        response = client.get(queryLegs)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        first_exercise = response_data[0]['fields']['exercise_name']
        self.assertEqual(first_exercise, 'Seated Calf Raise')

    def test_can_post_user_specific_exercises(self):
        client = Client()
        client.login(username='testUser', password='testPassword')
        payload = {
            'muscle_group': 'Biceps',
            'exercise_name': 'Barbell Curl'
        }

        response = client.post('/api/exercise', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        self.assertEqual('success' in response_data, True)

        queryBiceps = '/api/exercises?muscle_group=Biceps'
        response = client.get(queryBiceps)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        first_exercise = response_data[0]['fields']['exercise_name']
        self.assertEqual(first_exercise, 'Barbell Curl')

class RoutineRouteTestCase(TestCase):
    def setUp(self):
        RoutineTestCase().setUp()

    def test_can_get_all_routines(self):
        client = Client()
        client.login(username='testUser', password='testPassword')

        queryAll = '/api/routine?name=All'
        response = client.get(queryAll)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        name = response_data[0]['fields']['name']
        self.assertEqual(name, 'Strength Block')

        # specific routine query
        querySpec = '/api/routine?name=Strength+Block'
        response = client.get(querySpec)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        name = response_data['name']
        days = response_data['workouts'][0]['days']
        exercise = response_data['workouts'][0]['exercises'][0]['exercise_name']
        self.assertEqual(name, 'Strength Block')
        self.assertEqual(days, ['Sun', 'Wed'])
        self.assertEqual(exercise, 'Flat Bench Press')

    def test_can_post_routines(self):
        client = Client()
        client.login(username='testUser', password='testPassword')

        deadlift = Exercise.objects.get(exercise_name='Deadlift')
        deadlift_id = deadlift.id
        payload = {
            'name': 'Volume Block',
            'days': "['Mon', 'Thurs']",
            'exercise_id': deadlift_id
        }

        response = client.post('/api/routine', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        name = response_data['name']
        days = response_data['workouts'][0]['days']
        exercise = response_data['workouts'][0]['exercises'][0]['exercise_name']
        self.assertEqual(name, 'Volume Block')
        self.assertEqual(days, ['Mon', 'Thurs'])
        self.assertEqual(exercise, 'Deadlift')

class JournalRouteTestCase(TestCase):
    def setUp(self):
        JournalTestCase().setUp()

    def test_can_get_user_journals(self):
        client = Client()
        client.login(username='testUser', password='testPassword')

        date = str(timezone.now())
        date = { 'date': date }
        date = urllib.parse.urlencode(date)

        query = '/api/journal?' + date

        response = client.get(query)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        name = response_data['exercises'][0]['exercise']['exercise_name']
        reps = response_data['exercises'][1]['reps']
        weight = response_data['exercises'][2]['weight']
        self.assertEqual(name, 'Flat Bench Press')
        self.assertEqual(reps, 5)
        self.assertEqual(weight, 155)

    # TODO: make post test
    def test_can_post_user_journals(self):
        client = Client()
        client.login(username='testUser', password='testPassword')

        date = str(timezone.now())
        date = {'date': date}
        date = urllib.parse.urlencode(date)
        deadlift = Exercise.objects.get(exercise_name='Deadlift')
        deadlift_id = deadlift.pk

        payload = {
            'date': date,
            'exercise_id': deadlift_id,
            'reps': 10,
            'weight': 225
        }

        response = client.post('/api/journal', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        name = response_data['exercises'][0]['exercise']['exercise_name']
        weight = response_data['exercises'][0]['weight']
        exercises = response_data['exercises']
        self.assertEqual(name, 'Deadlift')
        self.assertEqual(weight, 225)
        self.assertEqual(len(exercises), 1)

        # update the journal with more sets
        journal_id = response_data['id']
        payload = {
            'journal_id': journal_id,
            'exercise_id': deadlift_id,
            'reps': 8,
            'weight': 240
        }

        response = client.post('/api/journal', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        reps = response_data['exercises'][1]['reps']
        exercises = response_data['exercises']
        self.assertEqual(reps, 8)
        self.assertEqual(len(exercises), 2)

        # change first set of journal
        journal_id = response_data['id']
        set_id = response_data['exercises'][0]['id']
        payload = {
            'journal_id': journal_id,
            'set_id': set_id,
            'reps': 5,
            'weight': 275
        }
        response = client.post('/api/journal', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        reps = response_data['exercises'][0]['reps']
        weight = response_data['exercises'][0]['weight']
        exercises = response_data['exercises']
        self.assertEqual(reps, 5)
        self.assertEqual(weight, 275)
        self.assertEqual(len(exercises), 2)
    def test_can_delete_sets(self):
        client = Client()
        client.login(username='testUser', password='testPassword')

        # get a journal to delete sets
        date = str(timezone.now())
        date = {'date': date}
        date = urllib.parse.urlencode(date)

        query = '/api/journal?' + date

        response = client.get(query)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        reps = response_data['exercises'][0]['reps']
        weight = response_data['exercises'][0]['weight']
        self.assertEqual(reps, 8)
        self.assertEqual(weight, 135)

        journal_id = response_data['id']
        set_id = response_data['exercises'][0]['id']

        payload = {
            'set_id': set_id,
            'journal_id': journal_id
        }

        response = client.delete('/api/journal', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        reps = response_data['exercises'][0]['reps']
        weight = response_data['exercises'][0]['weight']
        self.assertEqual(reps, 5)
        self.assertEqual(weight, 145)

class RegisterTestCase(TestCase):
    def test_can_register_new_users(self):
        client = Client()

        payload = {
            'username': 'testaccount123',
            'password': 'password123'
        }
        response = client.put('/api/register', payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        success = response_data['success']
        self.assertEqual(success, 'New user was created')

        # test for username that already exists
        repeat_payload = {
            'username': 'testaccount123',
            'password': 'anotherpass'
        }
        response = client.put('/api/register', repeat_payload)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        error = response_data['error']
        self.assertEqual(error, 'Username already exists')

class LoginLogoutTestCase(TestCase):
    def setUp(self):
        ExerciseTestCase().setUp()

    def test_can_login_and_logout(self):
        client = Client()

        query = '/api/login?username=testUser&password=testPassword'

        response = client.get(query)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        username = response_data['username']
        self.assertEqual(username, 'testUser')

        query = '/api/logout'
        response = client.get(query)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        success = response_data['success']
        self.assertEqual(success, 'Successfully logged out')

        # login attempt with incorrect credentials
        query = '/api/login?username=testUser&password=wrongPassword'
        response = client.get(query)
        response_data = response.content.decode('utf-8')
        response_data = json.loads(response_data)
        error = response_data['error']
        self.assertEqual(error, 'Username or password was incorrect')





