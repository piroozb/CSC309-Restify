from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from restify.permissions import IsOwnerOrReadOnly
from .serializers import NotificationsSerializer
from .models import Notification
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from .pagination import CustomPagination


class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationsSerializer
    ordering = ('-id')
    pagination_class = CustomPagination
    permission_classes = [IsOwnerOrReadOnly, IsAuthenticated]
    filterset_fields = ['read',]
    http_method_names = ['get',"retrieve", "delete"]


    def list(self, request, *args, **kwargs):
        # get all current logged in users notifications
        queryset = Notification.objects.filter(user=request.user).order_by("-id")

        # filter query set if filter is available
        queryset = self.filter_queryset(queryset)

        # paginate queryset
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)


        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Read notification", methods=["get",], responses={200: NotificationsSerializer(many=False), 404:{}})
    @action(methods=['get'], detail=True,  name='read_notification')
    def read(self, request, pk=None):
        try:
            notification = Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:

            return Response({"message":"Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        # set notification read to true
        notification.read = True
        notification.save()

            # filter query set if filter is available
        queryset = self.filter_queryset(self.queryset)
        

        serializer = self.get_serializer(queryset, many=True)
        return Response({"notification":serializer.data},status=status.HTTP_200_OK )
    
    
    @swagger_auto_schema(operation_description="Read all notifications", methods=["get",], responses={200: NotificationsSerializer(many=True)})
    @action(methods=['get'], detail=False,  name='read_all_notifications', url_path="read-all")
    def read_all(self, request):
        # get all current logged in users notifications
        queryset = Notification.objects.filter(user=request.user).order_by("-id")

        # set read to true for all notifications
        for notification in queryset:
            notification.read = True
            notification.save()
        

        # filter query set if filter is available
        queryset = self.filter_queryset(queryset)

        # paginate queryset
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK )

