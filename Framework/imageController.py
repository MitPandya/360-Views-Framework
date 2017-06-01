from models import models
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
import json
from models import Image
from bs4 import BeautifulSoup
import requests

class ImageController:
    def __init__(self):
        print 'called class'

    @classmethod
    def get_image(self, image_name):
        print 'image name : ',image_name
        try:
            a = Image.objects.get(image_name = image_name)
            image = serializers.serialize('json', [a,])
            print 'image data'
            print json.loads(image)
            return image
        except ObjectDoesNotExist:
            return None

    @classmethod
    def get_image_list(self):
        print 'inside get image list'
        try:
            # url of the server where 360 images are saved
            url = "https://iiif-staging02.lib.ncsu.edu/360/"
            soup = BeautifulSoup(requests.get(url).text)

            hrefs = []

            for a in soup.find_all('a'):
                hrefs.append(a['href'])

            images = [i for i in hrefs if '.jpg' in i or '.png' in i]

            return images

        except:
            print("Unexpected error fetching images from url")

    @classmethod
    def get_layer_list(self):
        print 'inside get layer list'
        try:
            layers = []
            data = Image.objects.get()
            markerData = serializers.serialize('json', [data,])
            markerData = eval(markerData)
            print markerData
            markers = {}
            for i in range(len(markerData)):
                markers = eval(markerData[i]['fields']['image_marker_data'])
                if 'markers' in markers:
                    for j in range(len(markers['markers'])):
                        temp = markers['markers'][j]
                        if 'layer' in temp:
                            layers.append(temp['layer'])
            print layers
            return list(set(layers))
        except:
            print("Unexpected error fetching images from url")

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
