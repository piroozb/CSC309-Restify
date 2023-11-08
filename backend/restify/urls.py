from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
from account.serializers import CustomJWTSerializer
from .routers import *
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions


class BothHttpAndHttpsSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=True):
        schema = super().get_schema(request, public)
        schema.schemes = ["http", "https"]
        return schema

schema_view = get_schema_view(
   openapi.Info(
      title="Restify api",
      default_version='v1',
      description="Documentation for Restify",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="restify@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes = (permissions.AllowAny,),
   generator_class=BothHttpAndHttpsSchemaGenerator
)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('', include('crud.urls')),
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/', include(router.urls)),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomJWTSerializer),
        name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(serializer_class=CustomJWTSerializer),
        name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
