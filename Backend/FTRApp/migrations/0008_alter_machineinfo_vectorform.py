# Generated by Django 4.2.10 on 2024-04-02 20:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("FTRApp", "0007_rename_user_userinfo"),
    ]

    operations = [
        migrations.AlterField(
            model_name="machineinfo",
            name="vectorForm",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="FTRApp.vectorformcompact",
            ),
        ),
    ]
