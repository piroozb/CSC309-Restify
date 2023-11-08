from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import CommentUser, CommentListing, Reply
from .serializers import CommentUserSerializer, CommentListingSerializer, ReplySerializer
from account.models import UserProfile
from crud.models import ListingModel
from rest_framework.decorators import action, api_view
from drf_yasg.utils import swagger_auto_schema


class CommentUserViewSet(viewsets.ModelViewSet):
    queryset = CommentUser.objects.all()
    serializer_class = CommentUserSerializer
    paginate_by = 10

    http_method_names = ['post', 'get']

    def list(self, request, user_id):
        try:
            user = UserProfile.objects.get(id=user_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND)
        # TODO: REMOVE EVERYTHING BELOW ONCE OTHER PART IS UNCOMMENTED
        queryset = user.comment_set
        # filter query set if filter is available
        queryset = self.filter_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"comments":serializer.data})
        # TODO: UNCOMMENT THIS ONCE YOU GOT IT SET UP SO WE KNOW WHO HOSTED WHO
        # if request.user.is_authenticated and request.user.host.filter(guest=user):
        #     # get all comments of specific user
        #     queryset = user.comment_set
        #     # filter query set if filter is available
        #     queryset = self.filter_queryset(queryset)
        #     serializer = self.get_serializer(queryset, many=True)
        #     return Response({"comments":serializer.data})
        # else:
        #     return Response({"error": "403 Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
    @swagger_auto_schema(operation_description="Creates a new comment for a guest that reserved one of the hosts' listings")
    def create(self, request, user_id):
        try:
            user = UserProfile.objects.get(id=user_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND) 
        # TODO: UNCOMMENT THIS ONCE RESERVATION SET UP
        if request.user.is_authenticated: # and request.user.host.filter(guest=user):
            serializer = self.get_serializer(data=request.data, context={'user': user})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "403 Forbidden"}, status=status.HTTP_403_FORBIDDEN)

class CommentListingViewSet(viewsets.ModelViewSet):
    queryset = CommentListing.objects.all()
    serializer_class = CommentListingSerializer
    paginate_by = 10

    http_method_names = ['post', 'get']

    def list(self, request, listing_id):
        try:
            listing = ListingModel.objects.get(id=listing_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND)
        # get all comments of specific listing
        queryset = CommentListing.objects.filter(listing=listing)

        # filter query set if filter is available
        queryset = self.filter_queryset(queryset)

        serializer = self.get_serializer(queryset, many=True)
        return Response({"comments":serializer.data})
    
    @swagger_auto_schema(operation_description="Creates a new comment for a listing that the user has reserved")
    def create(self, request, listing_id):
        try:
            listing = ListingModel.objects.get(id=listing_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND)
        # TODO: UNCOMMENT THIS ONCE RESERVATION SET UP
        if request.user.is_authenticated: # and request.user.guest.filter(property=listing):
            serializer = self.get_serializer(data=request.data, context={'listing': listing})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"403 Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    

class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    paginate_by = 10

    http_method_names = ['post', 'get']

    def list(self, request, comment_id):
        try:
            reply_to = CommentListing.objects.get(id=comment_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND)
        # get all replies of specific comment
        queryset = Reply.objects.filter(reply_to=reply_to)

        # filter query set if filter is available
        queryset = self.filter_queryset(queryset)

        serializer = self.get_serializer(queryset, many=True)
        return Response({"replies":serializer.data})
    
    @swagger_auto_schema(operation_description="Creates a new reply for a listing comment")
    def create(self, request, comment_id):
        try:
            reply_to = CommentListing.objects.get(id=comment_id)
        except:
            return Response({"error":"404 Not Found"}, status=status.HTTP_404_NOT_FOUND)
        valid = False
        if request.user.is_authenticated:
            if not reply_to.replies.all():
                if reply_to.listing.created_user == request.user:
                    valid = True
            else:
                valid = True # TODO: REMOVE THIS LINE ONCE RESERVATIONS ARE BUILT
                guest_res = request.user.guest.filter(property=reply_to.listing)
                if guest_res and guest_res[0].host == reply_to.replies.last().author:
                    valid = True
                host_list = request.user.host.filter(property=reply_to.listing)
                if host_list and host_list[0].guest == reply_to.replies.last().author:
                    valid = True
        if valid:
            serializer = self.get_serializer(data=request.data, context={'reply_to': reply_to})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"403 Forbidden"}, status=status.HTTP_403_FORBIDDEN)