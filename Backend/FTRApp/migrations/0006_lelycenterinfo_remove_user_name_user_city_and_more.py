# Generated by Django 4.2.10 on 2024-04-01 20:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("FTRApp", "0005_alter_vectorform_machinedate_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="LelyCenterInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("num", models.CharField(default="", max_length=50)),
                ("name", models.CharField(default="", max_length=50)),
                ("area", models.CharField(default="", max_length=50)),
                ("coordname", models.CharField(default="", max_length=50)),
                ("installco", models.CharField(default="", max_length=50)),
            ],
        ),
        migrations.RemoveField(model_name="user", name="name",),
        migrations.AddField(
            model_name="user",
            name="city",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="country",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="farm",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="first",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="last",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="num",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="street",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.AddField(
            model_name="user",
            name="zip",
            field=models.CharField(default="", max_length=50),
        ),
        migrations.CreateModel(
            name="VectorFormCompact",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "lelyCenter",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="FTRApp.lelycenterinfo",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to="FTRApp.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserMachineInstallation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("machine1Installations", models.IntegerField(default=0)),
                ("machine2Installations", models.IntegerField(default=0)),
                ("machine3Installations", models.IntegerField(default=0)),
                ("formNames", models.TextField(default="A,B,C,D,E")),
                (
                    "userName",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MachineInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("machineType", models.CharField(default="", max_length=50)),
                ("machineDate", models.CharField(default="", max_length=50)),
                ("machineItemNo", models.CharField(default="", max_length=50)),
                ("machineSerialNo", models.CharField(default="", max_length=50)),
                (
                    "vectorForm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="FTRApp.vectorform",
                    ),
                ),
            ],
        ),
    ]
