from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^exercises*', views.exercises, name='exercises'),
    url(r'^testroute*', views.testroute, name='testroute')
]