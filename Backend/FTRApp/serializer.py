from rest_framework import serializers
from .models import Form2, Column
from .models import *
from django.contrib.auth.models import User

# Serializers are defined here. They are Python objects that can be easier to work with than the usual database objects.
# For example, they can be created from a user request body without needing to individually reference each field.

class Form2DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form2Data
        fields = ['form', 'customer_last_name', 'customer_number', 'data']


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ['name', 'column_type', 'options']

class Form2Serializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True)

    class Meta:
        model = Form2
        fields = ['id', 'title', 'columns']

    def create(self, validated_data):
        columns_data = validated_data.pop('columns')
        form = Form2.objects.create(**validated_data)
        for column_data in columns_data:
            Column.objects.create(form=form, **column_data)
        return form

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

class CustomerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInfo
        fields = ['farm', 'first', 'last', 'num', 'street', 'zip', 'city', 'country', 'installations', 'forms', 'remaining1', 'remaining2', 'remaining3']

class LelyCenterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=LelyCenterInfo
        fields= ('num','name','area','coordname','installco')
