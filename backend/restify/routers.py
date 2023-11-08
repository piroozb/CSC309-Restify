from rest_framework import routers
from account.views import AccountViewSet
from notifications.views import NotificationsViewSet
from reservations.views import ReservationsViewSet
from crud.views import ImageViewSet
from comments.views import CommentUserViewSet, CommentListingViewSet, ReplyViewSet

router = routers.DefaultRouter()
router.register(r'account', AccountViewSet, basename="UserProfile")
router.register(r'notifications', NotificationsViewSet)
router.register(r'reservations', ReservationsViewSet)
router.register(r'user_comments/(?P<user_id>\d+)', CommentUserViewSet)
router.register(r'listing_comments/(?P<listing_id>\d+)', CommentListingViewSet)
router.register(r'reply/(?P<comment_id>\d+)', ReplyViewSet)
