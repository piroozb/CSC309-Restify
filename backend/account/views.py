from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, status
from django.contrib.auth import get_user_model
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import  UserSerializer
from django.core.serializers import serialize
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse
from rest_framework.response import Response
import json
from django.http import JsonResponse


User = get_user_model()

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_superuser=False)
    filter_backends = (SearchFilter, OrderingFilter)
    filterset_fields=["groups"]
    search_fields = ('username', 'email')
    ordering_fields = ('username')
    ordering = ('-id')
    parser_classes=[MultiPartParser]

    def list(self, request):
        if request.user.is_authenticated:
            queryset = self.queryset.filter(id=request.user.id)
            # filter query set if filter is available
            queryset = self.filter_queryset(queryset)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "403 Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    def perform_create(self, serializer):
        password = make_password(self.request.data['password'])

        serializer.save(password=password)

    def perform_update(self, serializer):
        if ('password' in self.request.data) and self.request.data['password']:
            password = make_password(self.request.data['password'])
            serializer.save(password=password)
        else:
            serializer.save()