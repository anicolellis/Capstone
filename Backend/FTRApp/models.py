from django.conf import settings
from django.db import models

class Form2(models.Model):
    title = models.CharField(max_length=100)

class Form2Data(models.Model):
    form = models.ForeignKey(Form2, on_delete=models.CASCADE, related_name='form2_data')
    customer_last_name = models.CharField(max_length=100)
    customer_number = models.CharField(max_length=100)
    data = models.JSONField()

    class Meta:
        unique_together = ('form', 'customer_last_name', 'customer_number')

class Column(models.Model):
    form = models.ForeignKey(Form2, on_delete=models.CASCADE, related_name='columns')
    name = models.CharField(max_length=100)
    column_type = models.CharField(max_length=20, choices=[
        ('text', 'Text'),
        ('number', 'Number'),
        ('select', 'Select'),
        ('radio', 'Radio')
    ])
    options = models.JSONField(default=list, blank=True)

# Information regarding Customer Information that typically appears near the start of a form
class CustomerInfo(models.Model):
    farm = models.CharField(max_length=50, default='')
    first = models.CharField(max_length=50, default='')
    last = models.CharField(max_length=50, default='')
    num = models.CharField(max_length=50, default='')
    street = models.CharField(max_length=50, default='')
    zip = models.CharField(max_length=50, default='')
    city = models.CharField(max_length=50, default='')
    country = models.CharField(max_length=50, default='')
    installations = models.TextField(default="0,0,0")
    remaining1 = models.IntegerField(default=0)
    remaining2 = models.IntegerField(default=0)
    remaining3 = models.IntegerField(default=0)
    forms = models.TextField(default="")

    class Meta:
        unique_together = ('last', 'num')

# Information regarding Lely Centers that typically appears near the start of a form.
class LelyCenterInfo(models.Model):
    num = models.CharField(max_length=50, default='')
    name = models.CharField(max_length=50, default='')
    area = models.CharField(max_length=50, default='')
    coordname = models.CharField(max_length=50, default='')
    installco = models.CharField(max_length=50, default='')
  
# Each entry represents a form. Fields are form type (enumerated), User info and Lely info.
# Machine info and Checklist items are linked to a form object by a foreign key in those models.
class Form(models.Model):
    class FormType(models.TextChoices):
        Vector = '1', 'VectorForm'
        Astronaut = '2', 'AstronautForm'
        Horizon = '3', 'HorizonForm'
    
    type = models.CharField(max_length=2, choices=FormType.choices, default=FormType.Vector, unique=False)
    user = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE, unique=False)
    lelyCenter = models.ForeignKey(LelyCenterInfo, on_delete=models.CASCADE, unique=False)

# Each entry represents a single machine info in a form
class MachineInfoGeneric(models.Model):
    machineType = models.CharField(max_length=50, default='')
    machineDate = models.CharField(max_length=50, default='')
    machineItemNo = models.CharField(max_length=50, default='')
    machineSerialNo = models.CharField(max_length=50, default='')
    form = models.ForeignKey(Form, on_delete=models.CASCADE)

# Each entry represents a single checklist item in a form
class ChecklistItem(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE)
    itemNumber = models.IntegerField(blank=True)
    selection = models.CharField(max_length=10, default='')
    remark = models.TextField(default='')
