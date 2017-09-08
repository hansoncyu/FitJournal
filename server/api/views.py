from django.shortcuts import render
import json
import ast
from django.http import HttpResponse, JsonResponse
from api.models import Exercise, Sets, Workout, Journal, Routine
from django.core import serializers
from django.utils import timezone, dateparse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from api.serializers import RoutineSerializer, JournalSerializer
from rest_framework.renderers import JSONRenderer
from django.views.decorators.csrf import csrf_exempt


def exercises(request):
    if request.method == 'GET':
        # turn params from querydict to python dictionary
        params = request.GET.dict()
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        if not 'muscle_group' in params:
            error = { 'error': 'Invalid GET parameters' }
            return JsonResponse(error, status=400)
        muscle_group_req = params['muscle_group']
        user = request.user
        if muscle_group_req == 'All':
            response = Exercise.objects.filter(author=None)
            try:
                response_user_specific = Exercise.objects.filter(author=user)
            except ObjectDoesNotExist:
                pass
        else:
            response = Exercise.objects.filter(muscle_group=muscle_group_req, author=None)
            try:
                response_user_specific = Exercise.objects.filter(muscle_group=muscle_group_req, author=user)
            except ObjectDoesNotExist:
                pass
        try:
            response = response.union(response_user_specific, all=True)
        except:
            pass
        response = response.order_by('exercise_name')
        data = serializers.serialize('python', response, fields=('exercise_name', 'muscle_group'))
        for d in data:
            del d['model']
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        # turn params from querydict to python dictionary
        params = request.POST.dict()
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        if not 'muscle_group' in params or not 'exercise_name' in params:
            error = {'error': 'Invalid POST parameters'}
            return JsonResponse(error, status=400)
        exercise_name_req = params['exercise_name']
        muscle_group_req = params['muscle_group']
        user = request.user
        new_exercise = Exercise(
            exercise_name = exercise_name_req,
            muscle_group = muscle_group_req,
            author = user
        )
        try:
            new_exercise.save()
        except Exception as err:
            error = {'error': str(err)}
            return JsonResponse(error, status=500)
        success = {'success': 'New exercise was added'}
        return JsonResponse(success)

    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)

def routine(request):
    if request.method == 'GET':
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        params = request.GET.dict()
        if not 'name' in params:
            error = { 'error': 'Invalid GET parameters' }
            return JsonResponse(error, status=400)
        user = request.user
        name = params['name']
        data = []
        if name == 'All':
            try:
                data = Routine.objects.filter(author=user)
            except:
                error = {'error': 'No routines found'}
                return JsonResponse(error, status=500)
            data = serializers.serialize('python', data, fields=('name'))
        else:
            try:
                data = Routine.objects.get(name=name, author=user)
            except:
                pass

            # custom serializer and then rendered into JSON. Need to convert back to python dict before sending as JsonResponse
            data = RoutineSerializer(data)
            data = JSONRenderer().render(data.data)
            data = data.decode('utf-8')
            data = json.loads(data)
        try:
            for d in data:
                del d['model']
        except:
            pass
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        params = request.POST.dict()
        if 'name' not in params:
            error = {'error': 'Invalid POST parameters'}
            return JsonResponse(error, status=400)
        user = request.user
        name = params['name']
        new_routine = Routine(
            name=name,
            author=user
        )
        if 'routine_id' in params:
            new_routine.pk = params['routine_id']
        try:
            new_routine.save()
        except Exception as err:
            error = {'error': str(err)}
            return JsonResponse(error, status=500)
        if 'days' in params:
            days = params['days']
            days = ast.literal_eval(days)
            new_workout = Workout(
                days=days
            )
        if 'workout_id' in params:
            new_workout.pk = params['workout_id']
        try:
            new_workout.save()
        except Exception as err:
            error = {'error': str(err)}
            return JsonResponse(error, status=500)
        if 'exercise_id' in params:
            exercise_id = params['exercise_id']
            try:
                new_exercise = Exercise.objects.get(pk=exercise_id)
                new_workout.exercises.add(new_exercise)
            except Exception as err:
                error = {'error': str(err)}
                return JsonResponse(error, status=500)

        try:
            new_routine.workouts.add(new_workout)
        except Exception as err:
            error = {'error': str(err)}
            return JsonResponse(error, status=500)

        data = RoutineSerializer(new_routine)
        data = JSONRenderer().render(data.data)
        data = data.decode('utf-8')
        data = json.loads(data)
        return JsonResponse(data)

    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)

def journal(request):
    if request.method == 'GET':
        params = request.GET.dict()
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        if not 'date' in params:
            error = {'error': 'Invalid GET parameters'}
            return JsonResponse(error, status=400)
        # date parameter should be moment js formatted date that can be converted to python date
        user = request.user
        date = dateparse.parse_datetime(params['date'])
        date = timezone.localdate(date)
        try:
            journal = Journal.objects.get(date=date, author=user)
        except Exception as err:
            error = {'error': str(err)}
            return JsonResponse(error, status=500)
        data = JournalSerializer(journal)
        data = JSONRenderer().render(data.data)
        data = data.decode('utf-8')
        data = json.loads(data)
        return JsonResponse(data)


    elif request.method == 'POST':
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        params = request.POST.dict()
        user = request.user
        if 'date' not in params and 'journal_id' not in params:
            error = {'error': 'Invalid POST parameters'}
            return JsonResponse(error, status=400)
        if 'journal_id' in params:
            journal_id = params['journal_id']
            try:
                journal = Journal.objects.get(pk=journal_id)
            except Exception as err:
                error = {'error': str(err)}
                return JsonResponse(error, status=500)
        elif 'date' in params:
            date = dateparse.parse_datetime(params['date'])
            date = timezone.localdate(date)
            journal = Journal(
                date=date,
                author=user
            )
            journal.save()
        reps = 0
        weight = 0
        try:
            reps = params['reps']
        except:
            pass
        try:
            weight = params['weight']
        except:
            pass
        if 'set_id' in params:
            set_id = params['set_id']
            try:
                set = Sets.objects.get(pk=set_id)
                set.reps = reps
                set.weight = weight
                set.save()
            except Exception as err:
                error = {'error': str(err)}
                return JsonResponse(error, status=500)
        else:
            try:
                exercise_id = params['exercise_id']
                exercise = Exercise.objects.get(pk=exercise_id)
                set = Sets(
                    exercise=exercise
                )
                set.reps = reps
                set.weight = weight
                set.save()
                journal.exercises.add(set)
            except ObjectDoesNotExist:
                error = {'error': 'Invalid exercise id'}
                return JsonResponse(error, status=500)
        data = JournalSerializer(journal)
        data = JSONRenderer().render(data.data)
        data = data.decode('utf-8')
        data = json.loads(data)
        return JsonResponse(data)

    elif request.method == 'DELETE':
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        params = request.body
        # body is in byte object format and needs to be decoded and formatted to json format then parsed to python dict
        params = params.decode('utf-8')
        params = ast.literal_eval(params)
        set_id = params['set_id']
        journal_id = params['journal_id']
        set = Sets.objects.get(pk=set_id)
        set.delete()
        journal = Journal.objects.get(pk=journal_id)
        data = JournalSerializer(journal)
        data = JSONRenderer().render(data.data)
        data = data.decode('utf-8')
        data = json.loads(data)
        return JsonResponse(data)

    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)

@csrf_exempt
def register(request):
    if request.method == 'PUT':
        params = request.body
        params = params.decode('utf-8')
        params = ast.literal_eval(params)
        if not 'username' in params or not 'password' in params:
            error = {'error': 'Invalid PUT parameters'}
            return JsonResponse(error, status=400)
        username = params['username']
        password = params['password']

        if User.objects.filter(username=username).exists():
            error = {'error': 'Username already exists'}
            return JsonResponse(error, status=403)

        new_user = User(username=username)
        new_user.set_password(password)
        new_user.save()
        success = {'success': 'New user was created'}
        return JsonResponse(success)


    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)

def loginRoute(request):
    if request.method == 'GET':

        # check to see if session is still active
        try:
            username = request.session['username']
            success = {
                'username': username
            }
            return JsonResponse(success)
        except:
            pass

        params = request.GET.dict()
        if not 'username' in params or not 'password' in params:
            error = {'error': 'Invalid POST parameters'}
            return JsonResponse(error, status=400)
        username = params['username']
        password = params['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            success = {
                'username': user.username
            }
            request.session['username'] = user.username
            return JsonResponse(success)
        else:
            error = {'error': 'Username or password was incorrect'}
            return JsonResponse(error, status=401)

    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)

def logoutRoute(request):
    if request.method == 'GET':
        if not request.user.is_authenticated():
            error = {'error': 'Not logged in'}
            return JsonResponse(error, status=401)
        logout(request)
        success = {
            'success': 'Successfully logged out'
        }
        return JsonResponse(success)

    else:
        error = {'error': 'Invalid HTTP request'}
        return JsonResponse(error, status=400)




