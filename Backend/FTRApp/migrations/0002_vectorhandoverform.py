# Generated by Django 4.2.10 on 2024-03-05 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("FTRApp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="VectorHandoverForm",
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
                ("machineType", models.CharField(max_length=50)),
                ("itemNum", models.CharField(max_length=50)),
                ("serialNum", models.CharField(max_length=50)),
            ],
        ),
    ]
