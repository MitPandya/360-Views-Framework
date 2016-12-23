from models import models
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
import json
from models import Image

class ImageController:
    def __init__(self):
        print 'called class'

    @classmethod
    def get_image(self, image_name):
        print 'here'
        try:
            a = Image.objects.get(image_name = image_name)
            image = serializers.serialize('json', [a,])
            print 'image data'
            print json.loads(image)
            return image
        except ObjectDoesNotExist:
            return None

    @classmethod
    def save_image(self , image_data):
        try:
            image = Image.objects.get(image_name=image_data['image']['name'])
            image.image_marker_data = image_data['image']['marker_json']
            image.save(update_fields=['image_marker_data'])
        except ObjectDoesNotExist:
            image = Image()
            image.image_name = image_data['image']['name']
            image.image_location = image_data['image']['path']
            image.image_marker_data = image_data['image']['marker_json']
            image.save()