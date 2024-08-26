from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from .models import CustomerInfo, Form2, Form2Data
from .serializer import UserSerializer, CustomerInfoSerializer, Form2Serializer
from .serializer import *
import json
from pdfdocument.document import PDFDocument
from django.core import serializers
from django.core.mail import EmailMessage
from reportlab.pdfgen import canvas 

@api_view(['GET'])
def getForm2Data(request, form_name, customer_last_name, customer_number):
    try:
        form = Form2.objects.get(title=form_name)
        form_data = Form2Data.objects.get(form=form, customer_last_name=customer_last_name, customer_number=customer_number)
        serializer = Form2DataSerializer(form_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except (Form2.DoesNotExist, Form2Data.DoesNotExist):
        return Response({'error': 'Form data not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def saveForm2Data(request):
    form_name = request.data.get('formName')
    customer_last_name = request.data.get('customerLastName')
    customer_number = request.data.get('customerNumber')
    rows = request.data.get('rows')

    try:
        form = Form2.objects.get(title=form_name)
        form_data, created = Form2Data.objects.update_or_create(
            form=form,
            customer_last_name=customer_last_name,
            customer_number=customer_number,
            defaults={'data': rows}
        )
        serializer = Form2DataSerializer(form_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Form2.DoesNotExist:
        return Response({'error': 'Form not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getAllForms(request):
    forms = Form2.objects.all()
    serializer = Form2Serializer(forms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createForm(request):
    serializer = Form2Serializer(data=request.data)
    if serializer.is_valid():
        form = serializer.save()
        for column_data in serializer.validated_data['columns']:
            column_name = column_data['name']
            column, created = Column.objects.get_or_create(form=form, name=column_name)
            column.column_type = column_data['column_type']
            if column.column_type == 'select':
                column.options = column_data.get('options', [])
            column.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def customerSignIn(request):
    last_name = request.data.get('last')
    customer_number = request.data.get('num')

    try:
        customer = CustomerInfo.objects.get(last=last_name, num=customer_number)
        serializer = CustomerInfoSerializer(customer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomerInfo.DoesNotExist:
        return Response({'error': 'Invalid last name or customer number'}, status=status.HTTP_401_UNAUTHORIZED)

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUsers(request):
    userList = User.objects.all()
    serializer = UserSerializer(userList, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request, user_id):
    result = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(result)
    return Response(serializer.data)

@api_view(['POST'])
def addUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
        )
        user.set_password(serializer.validated_data['password'])
        user.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

"""
Add Vector
Author: Alex Nicolellis

Params: lastName - the "last" field of the customer's CustomerInfo
        custNum - the customer's "num" field
    These two fields uniquely identify the customer.

Returns: 200 Status if the request succeeds, 400-level Status otherwise.

This view is used to submit the vector form.
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addVector(request, lastName, custNum):
    body = request.data
    # It is assumed that the CustomerInfo already exists (created or checked when customer logged in) 
    # The user info entered in the form replaces the data in the database
    CustomerInfo.objects.filter(last=lastName,num=custNum).update(
                        farm=body['userInfo']['farm'],
                       first=body['userInfo']['first'],
                       last=body['userInfo']['last'],
                       num=body['userInfo']['num'],
                       street=body['userInfo']['street'],
                       zip=body['userInfo']['zip'],
                       city=body['userInfo']['city'],
                       country=body['userInfo']['country'])
    # Obtain the CustomerInfo object to be used later
    currentUser = CustomerInfo.objects.get(last=lastName,num=custNum)
    currentUser.save()
    
    # The Lely Info should eventually be handled like the CustomerInfo, but currently it's not fully supported in the frontend
    # For now we create a new object upon submission
    lelySerializer = LelyCenterInfoSerializer(data=body['lelyInfo'])
    
    if lelySerializer.is_valid():
        lely = lelySerializer.save()
    else:
        print('Invalid request: lelySerializer could not accept the following: ')
        print(body['lelyInfo'])
        return Response({'message': 'Invalid request: lelySerializer could not accept lelyInfo: '},
                        status=status.HTTP_400_BAD_REQUEST)

    # Create form object - type 1 corresponds to Vector
    form = Form.objects.create(type='1', user=currentUser, lelyCenter=lely)
    
    # For each machine info in the form, create a machine info object and link to the form object using ForeignKey
    for i in range(len(body['machineTypes'])):
        MachineInfoGeneric.objects.create(machineType=body['machineTypes'][i],
                                   machineDate=body['machineDates'][i],
                                   machineItemNo=body['machineItemNos'][i],
                                   machineSerialNo=body['machineSerialNos'][i],
                                   form=form)
    
    # For each checklist item in the form, create an object and link to the form object using ForeignKey
    for i in range(len(body['vectorVals'])):
        ChecklistItem.objects.create(form=form,
                                    itemNumber=i,
                                    selection=body['vectorVals'][i],
                                    remark=body['vectorRemarks'][i])
    
    # Since the creation was successful, decrement the number of vector forms remaining for the customer.
    currentUser.remaining2 -= 1
    currentUser.save()
    
    return Response({'message': 'success'})

"""
Add Astronaut
Author: Alex Nicolellis

Params: lastName - the "last" field of the customer's CustomerInfo
        custNum - the customer's "num" field
    These two fields uniquely identify the customer.

Returns: 200 Status if the request succeeds, 400-level Status otherwise.

This view is used to submit the astronaut form.
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addAstronaut(request, lastName, custNum):
    body = request.data
    # It is assumed that the CustomerInfo already exists (created or checked when customer logged in) 
    # The user info entered in the form replaces the data in the database
    CustomerInfo.objects.filter(last=lastName,num=custNum).update(
                        farm=body['userInfo']['farm'],
                       first=body['userInfo']['first'],
                       last=body['userInfo']['last'],
                       num=body['userInfo']['num'],
                       street=body['userInfo']['street'],
                       zip=body['userInfo']['zip'],
                       city=body['userInfo']['city'],
                       country=body['userInfo']['country'])
    # Obtain the CustomerInfo object to be used later
    currentUser = CustomerInfo.objects.get(last=lastName,num=custNum)
    # The Lely Info should eventually be handled like the CustomerInfo, but currently it's not fully supported in the frontend
    # For now we create a new object upon submission
    lelySerializer = LelyCenterInfoSerializer(data=body['lelyInfo'])

    currentUser.save()

    if lelySerializer.is_valid():
        lely = lelySerializer.save()
    else:
        print('Invalid request: lelySerializer could not accept the following: ')
        print(body['lelyInfo'])
        return Response({'message': 'Invalid request: lelySerializer could not accept lelyInfo: '},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Create form object - type 2 corresponds to Astronaut
    form = Form.objects.create(type='2', user=currentUser, lelyCenter=lely)

    # For each machine info in the form, create a machine info object and link to the form object using ForeignKey
    for i in range(len(body['machineTypes'])):
        MachineInfoGeneric.objects.create(machineType=body['machineTypes'][i],
                                   machineDate=body['machineDates'][i],
                                   machineItemNo=body['machineItemNos'][i],
                                   machineSerialNo=body['machineSerialNos'][i],
                                   form=form)
        
    # For each checklist item in the form, create an object and link to the form object using ForeignKey
    for i in range(len(body['checklistVals'])):
        ChecklistItem.objects.create(form=form,
                                    itemNumber=i,
                                    selection=body['checklistVals'][i],
                                    remark=body['checklistRemarks'][i])
    
    # Since the creation was successful, decrement the number of astronaut forms remaining for the customer.
    currentUser.remaining1 -= 1
    currentUser.save()

    return Response({'message': 'success'})

"""
Add Horizon
Author: Alex Nicolellis

Params: lastName - the "last" field of the customer's CustomerInfo
        custNum - the customer's "num" field
    These two fields uniquely identify the customer.

Returns: 200 Status if the request succeeds, 400-level Status otherwise.

This view is used to submit the horizon form.
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addHorizon(request, lastName, custNum):
    body = request.data
    # It is assumed that the CustomerInfo already exists (created or checked when customer logged in) 
    # The user info entered in the form replaces the data in the database
    CustomerInfo.objects.filter(last=lastName,num=custNum).update(
                        farm=body['userInfo']['farm'],
                       first=body['userInfo']['first'],
                       last=body['userInfo']['last'],
                       num=body['userInfo']['num'],
                       street=body['userInfo']['street'],
                       zip=body['userInfo']['zip'],
                       city=body['userInfo']['city'],
                       country=body['userInfo']['country'])
    # Obtain the CustomerInfo object to be used later
    currentUser = CustomerInfo.objects.get(last=lastName,num=custNum)
    # The Lely Info should eventually be handled like the CustomerInfo, but currently it's not fully supported in the frontend
    # For now we create a new object upon submission
    lelySerializer = LelyCenterInfoSerializer(data=body['lelyInfo'])

    currentUser.save()

    if lelySerializer.is_valid():
        lely = lelySerializer.save()
    else:
        print('Invalid request: lelySerializer could not accept the following: ')
        print(body['lelyInfo'])
        return Response({'message': 'Invalid request: lelySerializer could not accept lelyInfo: '},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Create form object - type 3 corresponds to Horizon
    form = Form.objects.create(type='3', user=currentUser, lelyCenter=lely)
        
    checklistItems = []
    # For each checklist item in the form, create an object and link to the form object using ForeignKey
    # For the purposes of generating a pdf, gather the checklistitems into a list
    for i in range(len(body['checklistVals'])):
        ChecklistItem.objects.create(form=form,
                                    itemNumber=i,
                                    selection=body['checklistVals'][i])
        checklistItems.append(body['checklistVals'][i])
    
    # Gather full form data
    
    data = {}
    user_obj = serializers.serialize('json', [currentUser,])
    lely_obj = serializers.serialize('json', [lely,])

    data['userInfo'] = user_obj
    data['lelyInfo'] = lely_obj
    data['checklistItems'] = checklistItems

    jsondata = json.dumps(data)
    lines = jsondata.split(',')
    
    # PDF generation
    # The current pdf is just a proof of concept with no formatting. The JSON data is simply dumped line by line into the document.
    fileName = 'horizonform.pdf'
    documentTitle='horizon'
    title = 'Horizon Form'

    pdf = canvas.Canvas(fileName)
    pdf.setTitle(documentTitle)
    pdf.setFont("Courier-Bold", 24)
    pdf.drawCentredString(300, 770, title)
    text = pdf.beginText(40, 680)
    text.setFont("Courier", 12)
    for line in lines:
        text.textLine(line)
    pdf.drawText(text)
    pdf.save()

    # Email generation
    # I didn't have an email server to actually test this code, but this is an example of how an email could be sent.
    """
    email = EmailMessage('Horizon Form Submission',
                         'Here is a copy of your Horizon Form',
                         '<sender email address>',
                         ['<recipient email address>'])
    email.attach_file('horizonform.pdf')
    email.send()"""

    # Since the creation was successful, decrement the number of horizon forms remaining for the customer.
    currentUser.remaining3 -= 1
    currentUser.save()

    return Response({'message': 'success'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCustomerInfoByLastAndNum(request, lastName, custNum):
    custInfo = CustomerInfo.objects.get(last=lastName,num=custNum)
    serializer = CustomerInfoSerializer(custInfo)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def createCustomerInfo(request):
    last = request.data.get('last')
    num = request.data.get('num')
    #print(request.data)

    if last and num:
        try:
            customer_info = CustomerInfo.objects.get(last=last, num=num)
            serializer = CustomerInfoSerializer(customer_info, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomerInfo.DoesNotExist:
            serializer = CustomerInfoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Missing last or num field in the request.'}, status=status.HTTP_400_BAD_REQUEST)
