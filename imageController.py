from models import models
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
import json
from models import Image

class ImageController:
    def __init__(self):
        print 'called class'

    @classmethod
    def get_image(self):
        print 'here'
        a = Image.objects.get(pk = 1)
        image = serializers.serialize('json', [a,])
        return image

    @classmethod
    def save_image(self , image_data):
        try:
            image = Image.objects.get(image_name=image_data['image']['name'])
            print image
        except ObjectDoesNotExist:
            image = Image()
            print image_data['image']
            image.image_name = image_data['image']['name']
            image.image_location = image_data['image']['path']
            image.save()