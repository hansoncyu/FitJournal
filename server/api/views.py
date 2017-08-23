from django.shortcuts import render
import json

# Create your views here.
from django.http import HttpResponse
from django.http import HttpRequest
TestObj = {
    'name': 'Testing',
    'text': 'This object is for testing sending json',
    'display': 'Test should show'
}

def exercises(request):
    # TODO: return list of exercises filtered by muscle group
    if request.method == 'GET':
        params = request.GET
        if not hasattr(params, 'muscleGroup'):
            error = { 'error': 'Invalid GET parameters' }
            errorjson = json.dumps(error)
            return HttpResponse(errorjson)
        # TODO: get default exercises and user exercises
    elif request.method == 'POST':
        params = request.POST
        if not request.user.is_authenticated:
            error = {'error': 'Not logged in'}
            errorjson = json.dumps(error)
            return HttpResponse(errorjson)
        if not hasattr(params, 'exerciseName') or not hasattr(params,'muscleGroup'):
            error = {'error': 'Invalid POST parameters'}
            errorjson = json.dumps(error)
            return HttpResponse(errorjson)
        # TODO: add user specific exercises
    else:
        error = {'error': 'Invalid HTTP request'}
        errorjson = json.dumps(error)
        return HttpResponse(errorjson)

def sets(request):
    if request.method == 'POST':
        pass
        # TODO: add set to database
    return HttpResponse('TODO')

def workout(request):
    # TODO: add GET and POST handlers
    return HttpResponse('TODO')

def journal(request):
    # TODO: add GET and POST handlers
    return HttpResponse('TODO')

def testroute(request):
    if request.method == 'GET':
        params = request.GET
        return HttpResponse(params['test'])
    else:
        return HttpResponse('Could not get parameters')


