from django.http import HttpResponse
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from Framework import imageController
#from _360_Views_Framework import imageController
from django.http import request, response

# Create your views here.6

from .models import Image


def index(request):
    return render(request,"index.html",{})

@csrf_exempt
def get_image(request):
    print 'inside get image'
    try:
        if request.method == 'GET':
            image_name =  request.GET.get('name')
            image = imageController.ImageController.get_image(image_name)
            return HttpResponse(
                json.dumps({'image': image}))
    except Exception:
            return None

def get_image_list(request):
    print 'inside get image list'
    try:
        if request.method == 'GET':
            image_list = imageController.ImageController.get_image_list()
            return HttpResponse(
                json.dumps({'image_list': image_list}))
    except Exception:
        return None

def get_layer_list(request):
    print 'inside get layer list'
    try:
        if request.method == 'GET':
            layer_list = imageController.ImageController.get_layer_list()
            return HttpResponse(
                json.dumps({'layer_list': layer_list}))
    except Exception:
        return None

@csrf_exempt
def save_image(request):
    if request.method == "POST":
        print 'in save image'
        image_data = json.loads(request.body)
        imageController.ImageController.save_image(image_data)
        return HttpResponse(json.dumps({'saved':True}))

#171421216205000