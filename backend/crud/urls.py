from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('create-listing', ListingViewSet, basename='create_listing')
router.register('create-image', ImageViewSet, basename="create_image")

urlpatterns = [
    # Your URLs...
    path('', include(router.urls)),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('listing-list/', ListingPaginationAPIView.as_view(), name='listing'),
    path('images/<int:listing_id>/', ImageAPIView.as_view(), name="images")

]
