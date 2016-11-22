from __future__ import unicode_literals

from django.db import models

class ImageData(models.Model):
    image_location = models.CharField(max_length=1000)


# Create your models here.
