from django.urls import path
from .views import index, tt, sr, sr2

app_name = 'vlx'

urlpatterns = [

    path('', index, name='index'),
    path('sr/', sr, name='sr'),
    path('tt/', tt, name='tt'),
    path('sr2/', sr2, name='sr2'),



]