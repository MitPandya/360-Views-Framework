from django.conf.urls import url
<<<<<<< HEAD
from Framework import views
=======
from _360_Views_Framework import views
>>>>>>> 79fe5ec721a6dd7a8965d434170883d41247c0c3

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_image', views.get_image, name='get_image'),
    url(r'^save_image', views.save_image , name='save_image')
<<<<<<< HEAD
]
=======
]
>>>>>>> 79fe5ec721a6dd7a8965d434170883d41247c0c3
