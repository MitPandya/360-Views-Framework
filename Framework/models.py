from __future__ import unicode_literals

from django.db import models

class Image(models.Model):
    image_location = models.CharField(max_length=1000)
    image_name = models.CharField(max_length=20)
    image_marker_data = models.CharField(max_length=1000)


# Create your models here.
