from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

# URLS: For each View, add a line here and specify the url path

urlpatterns = [
    path("", views.getAllUsers, name="getAllUsers"),
    path("<int:user_id>", views.getUser, name="getUser"),
    path('post/', views.addUser, name="addUser"),
    path('forms/vector/add/<str:lastName>/<str:custNum>/', views.addVector, name='addVector'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('customer-info/', views.createCustomerInfo, name="createCustomerInfo"),
    path('customer-sign-in/', views.customerSignIn, name="customerSignIn"),
    path('forms/astronaut/add/<str:lastName>/<str:custNum>/', views.addAstronaut, name="addAstronaut"),
    path('forms/horizon/add/<str:lastName>/<str:custNum>/', views.addHorizon, name="addHorizon"),
    path('customerInfo/<str:lastName>/<str:custNum>/', views.getCustomerInfoByLastAndNum, name="getCustomerInfoByLastAndNum"),
    path('forms/create/', views.createForm, name='createForm'),
    path('forms/', views.getAllForms, name='getForms'),
    path('forms/save-data/', views.saveForm2Data, name='saveForm2Data'),
    path('forms/get-data/<str:form_name>/<str:customer_last_name>/<str:customer_number>/', views.getForm2Data, name='getForm2Data'),
]
