from django.shortcuts import render
from django.http import JsonResponse
from .models import Canciones

# Create your views here.

def lista_canciones(request):
    canciones = Canciones.objects.all()
    
    data = []
    
    for cancion in canciones:
        data.append({
            'id' : cancion.id,
            'titulo' : cancion.titulo,
            'artista' : cancion.artista,
            'archivo' : cancion.archivo.url,
            'portada' : cancion.portada.url if cancion.portada else None
        })
    
    return JsonResponse(data, safe = False)
