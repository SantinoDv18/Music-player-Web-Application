from django.db import models

# Create your models here.

class Canciones(models.Model):
    titulo = models.CharField(max_length=200)
    artista = models.CharField(max_length=200)
    archivo = models.FileField(upload_to='Canciones/')
    portada = models.ImageField(upload_to='portadas/', null=True, blank=True)
    def __str__(self):
        return f'{self.titulo} - {self.artista}'