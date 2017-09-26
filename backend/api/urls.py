from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token
from . import views

urlpatterns = [
    url(r'^exercises*', views.exercises, name='exercises'),
    url(r'^routine*', views.routine, name='routine'),
    url(r'^journal*', views.journal, name='journal'),
    url(r'^register*', views.register, name='register'),
    url(r'^token-auth*', obtain_jwt_token, name='auth'),
    url(r'^token-verify*', verify_jwt_token, name='verify'),
    url(r'^login*', views.loginRoute, name='login'),
    url(r'^logout*', views.logoutRoute, name='logout')
]