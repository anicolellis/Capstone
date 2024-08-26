# Generated by Django 4.2.10 on 2024-04-09 01:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("FTRApp", "0011_alter_vectorformcompact_selection"),
    ]

    operations = [
        migrations.CreateModel(
            name="Form",
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
                    "type",
                    models.CharField(
                        choices=[("1", "VectorForm"), ("2", "AstronautForm")],
                        default="1",
                        max_length=2,
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
                        on_delete=django.db.models.deletion.CASCADE,
                        to="FTRApp.userinfo",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MachineInfoGeneric",
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
                    "form",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="FTRApp.form"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ChecklistItem",
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
                ("itemNumber", models.IntegerField()),
                ("selection", models.CharField(default="", max_length=10)),
                ("remark", models.TextField(default="")),
                (
                    "form",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="FTRApp.form"
                    ),
                ),
            ],
        ),
    ]
