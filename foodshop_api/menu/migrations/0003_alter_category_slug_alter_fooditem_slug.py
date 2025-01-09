# Generated by Django 5.1.2 on 2024-11-26 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0002_category_slug_fooditem_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(max_length=100),
        ),
        migrations.AlterField(
            model_name='fooditem',
            name='slug',
            field=models.SlugField(max_length=100),
        ),
    ]
