from django.conf.urls import url
from Framework import views
#from _360_Views_Framework import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_image', views.get_image, name='get_image'),
    url(r'^save_image', views.save_image , name='save_image'),
    url(r'^fetch_image_list', views.get_image_list, name='get_image_list'),
    url(r'^fetch_layer_list', views.get_layer_list, name='get_layer_list')

]
