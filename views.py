from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.6

from .models import ImageData

def index(request):
    return render(request,"index.html",{})
