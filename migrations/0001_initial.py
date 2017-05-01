# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-21 16:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_location', models.CharField(max_length=1000)),
                ('image_name', models.CharField(max_length=20)),
                ('image_marker_data', models.CharField(max_length=1000)),
            ],
        ),
    ]
