# Generated by Django 5.0.4 on 2024-05-08 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FTRApp', '0017_alter_customerinfo_remaining1_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customerinfo',
            name='remaining1',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='customerinfo',
            name='remaining2',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='customerinfo',
            name='remaining3',
            field=models.IntegerField(default=0),
        ),
    ]
