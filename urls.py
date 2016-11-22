from django.conf.urls import url

from _360_Views_Framework import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
]