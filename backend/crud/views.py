from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from .paginationUtils import PaginationHandlerMixin
from .serializers import ListingModelSerializer, ListingSerializer, ImageSerializer
from rest_framework.permissions import IsAuthenticated
from .FieldValidationUtils import FieldRequestValidationUtil
from .models import ListingModel, Image
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import GenericAPIView
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from django.db.models import Prefetch
User = get_user_model()


class BasicPagination(PageNumberPagination):
    page_size_query_param = 'size'


class ListingPaginationAPIView(GenericAPIView):
    """
        Listing List Endpoint
    """
    # queryset = ListingModel.objects.all()
    def get_queryset(self):
        queryset = ListingModel.objects.all()
        return queryset
        # return query_set
    pagination_class = BasicPagination
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = [
        "amentites",
        "number_of_guests",
        "location",
        "price_per_day",
        "number_of_washroom",
        "number_of_bedroom",
        'id'
    ]
    # ordering_fields = (
    #     'price_per_day',
    # )
    search_fields = ['title']

    def get(self, request, format=None):
        # queryset = self.filter_queryset(self.get_queryset)
        ordering = self.request.query_params.get('ordering')
        number_of_bedroom = self.request.query_params.get('number_of_bedroom')
        number_of_washroom = self.request.query_params.get('number_of_washroom')
        location = self.request.query_params.get('location')
        rating = self.request.query_params.get('rating')
        number_of_guests = self.request.query_params.get('number_of_guests')
        listing_title = self.request.query_params.get('title')

        queryset = self.filter_queryset(ListingModel.objects.all())
        print(ordering)
        if ordering == 'asc':
            # print('test if')
            queryset = queryset.order_by('price_per_day')
        elif ordering == 'dsc':
            # print('test elif')
            queryset = queryset.order_by("-price_per_day")
        elif rating == 'dsc':
            # print('test if')
            queryset = queryset.order_by('-rating')
        elif rating == 'asc':
            # print('test elif')
            queryset = queryset.order_by("rating")  
        # else:
        #     print('test else')
        #     queryset = ListingModel.objects.all()
        elif ordering == 'asc' and number_of_bedroom:
            print('test if')
            queryset = ListingModel.objects.all().filter(number_of_bedroom =  number_of_bedroom).order_by('id')
        elif ordering == 'dsc' and number_of_bedroom:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_bedroom =  number_of_bedroom).order_by("-id")


        elif ordering == 'asc' and number_of_washroom:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom).order_by("id")
        elif ordering == 'dsc' and number_of_washroom:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom).order_by("-id")


        elif number_of_bedroom and number_of_washroom:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom).filter(number_of_bedroom =  number_of_bedroom)
        elif number_of_bedroom and location:
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_bedroom =  number_of_bedroom)        
        elif number_of_bedroom and rating:
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_bedroom =  number_of_bedroom)
        elif number_of_bedroom and number_of_guests:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_bedroom =  number_of_bedroom)
        elif number_of_washroom and location:
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_washroom =  number_of_washroom)        
        elif number_of_washroom and rating:
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_washroom =  number_of_washroom)
        elif number_of_washroom and number_of_guests:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_washroom =  number_of_washroom)
        elif location and rating:
            queryset = ListingModel.objects.all().filter(location =  location).filter(rating =  rating)
        elif location and listing_title:
            queryset = ListingModel.objects.all().filter(location =  location).filter(listing_title =  listing_title)            
        elif location and number_of_guests:
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_guests =  number_of_guests)
        elif number_of_guests and rating:
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(rating =  rating)


        elif number_of_bedroom and number_of_washroom and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom).filter(number_of_bedroom =  number_of_bedroom).order_by("id")
        elif number_of_bedroom and location and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_bedroom =  number_of_bedroom).order_by("id")
        elif number_of_bedroom and rating and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_bedroom =  number_of_bedroom).order_by("id")
        elif number_of_bedroom and number_of_guests and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_bedroom =  number_of_bedroom).order_by("id")
        elif number_of_washroom and location and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_washroom =  number_of_washroom).order_by("id")
        elif number_of_washroom and rating and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_washroom =  number_of_washroom).order_by("id")
        elif number_of_washroom and number_of_guests and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_washroom =  number_of_washroom).order_by("id")
        elif location and rating and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(location =  location).filter(rating =  rating).order_by("id")
        elif location and number_of_guests and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_guests =  number_of_guests).order_by("id")
        elif number_of_guests and rating and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(rating =  rating).order_by("id")



        elif number_of_bedroom and number_of_washroom and ordering == 'dsc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom).filter(number_of_bedroom =  number_of_bedroom).order_by("-id")
        elif number_of_bedroom and location and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_bedroom =  number_of_bedroom).order_by("-id")
        elif number_of_bedroom and rating and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_bedroom =  number_of_bedroom).order_by("-id")
        elif number_of_bedroom and number_of_guests and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_bedroom =  number_of_bedroom).order_by("-id")
        elif number_of_washroom and location and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_washroom =  number_of_washroom).order_by("-id")
        elif number_of_washroom and rating and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).filter(number_of_washroom =  number_of_washroom).order_by("-id")
        elif number_of_washroom and number_of_guests and ordering == 'asc':
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(number_of_washroom =  number_of_washroom).order_by("-id")
        elif location and rating and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(location =  location).filter(rating =  rating).order_by("-id")
        elif location and number_of_guests and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(location =  location).filter(number_of_guests =  number_of_guests).order_by("-id")
        elif number_of_guests and rating and ordering == 'asc':
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).filter(rating =  rating).order_by("-id")



        elif ordering == 'asc' and location:
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).order_by("id")
        elif ordering == 'dsc' and location:
            print('test elif')
            queryset = ListingModel.objects.all().filter(location =  location).order_by("-id")


        elif ordering == 'asc' and rating:
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).order_by("id")
        elif ordering == 'dsc' and rating:
            print('test elif')
            queryset = ListingModel.objects.all().filter(rating =  rating).order_by("-id")


        elif ordering == 'asc' and number_of_guests:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).order_by("id")
        elif ordering == 'dsc' and number_of_guests:
            print('test elif')
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests).order_by("-id")



        elif number_of_bedroom:
            queryset = ListingModel.objects.all().filter(number_of_bedroom =  number_of_bedroom)
        elif number_of_washroom:
            queryset = ListingModel.objects.all().filter(number_of_washroom =  number_of_washroom)
        elif location:
            queryset = ListingModel.objects.all().filter(location =  location)
        elif rating:
            queryset = ListingModel.objects.all().filter(rating =  rating)
        elif number_of_guests:
            queryset = ListingModel.objects.all().filter(number_of_guests =  number_of_guests)
        elif ordering == 'asc':
            queryset = ListingModel.objects.all().order_by("id")      
        elif ordering == 'dsc':
            queryset = ListingModel.objects.all().order_by("-id")


        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_paginated_response(self.serializer_class(page, many=True).data)
        else:
            serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ListingViewSet(ViewSet):

    def create(self, request):
        title = request.data['title']
        amentites = request.data['amentites']
        available_start = request.data['available_start']
        available_end = request.data['available_end']
        number_of_guests = request.data['number_of_guests']
        location = request.data['location']
        price_per_day = request.data['price_per_day']
        number_of_washroom = request.data['number_of_washroom']
        number_of_bedroom = request.data['number_of_bedroom']
        description = request.data['description']

        listing_created = {}
        listing_created['title'] = title
        listing_created['amentites'] = amentites
        listing_created['available_start'] = available_start
        listing_created['available_end'] = available_end
        listing_created['number_of_guests'] = number_of_guests
        listing_created['location'] = location
        listing_created['price_per_day'] = price_per_day
        listing_created['number_of_washroom'] = number_of_washroom
        listing_created['number_of_bedroom'] = number_of_bedroom
        listing_created['description'] = description
        validation_check = FieldRequestValidationUtil.mandatory_field(listing_created)
        print("validation_data = ", validation_check)
        if validation_check is None:
            

            created_user = request.user.id
            print("created_user = ", created_user)

            if 'rating' in request.data:
                rating = request.data['rating']
                listing_created['rating'] = rating
            listing_created['created_user'] = request.user.id
            listing_created_serializer = ListingModelSerializer(data=listing_created, context={'request': request})
            listing_created_serializer.is_valid(raise_exception=True)
            listing = listing_created_serializer.save()
            dict_response = {
                'error': False,
                'message': 'listing created successfully',
                'id': listing.id
            }
            return Response(dict_response, status=status.HTTP_201_CREATED)
        else:
            return Response(validation_check, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        print('data = ', request.data)

        listing = ListingModel.objects.filter(id=pk)
        if len(listing) != 0:
            listing = listing[0]
            created_user = listing.created_user.id
            request_create_user = request.user.id
            if created_user == request_create_user:
                title = request.data['title']
                amentites = request.data['amentites']
                available_start = request.data['available_start']
                available_end = request.data['available_end']
                number_of_guests = request.data['number_of_guests']
                location = request.data['location']
                price_per_day = request.data['price_per_day']
                number_of_washroom = request.data['number_of_washroom']
                number_of_bedroom = request.data['number_of_bedroom']
                description = request.data['description']

                listing_created = {}

                listing_created['title'] = title
                listing_created['amentites'] = amentites
                listing_created['available_start'] = available_start
                listing_created['available_end'] = available_end
                listing_created['number_of_guests'] = number_of_guests
                listing_created['location'] = location
                listing_created['price_per_day'] = price_per_day
                listing_created['number_of_washroom'] = number_of_washroom
                listing_created['number_of_bedroom'] = number_of_bedroom
                listing_created['description'] = description
                validation_check = FieldRequestValidationUtil.mandatory_field(listing_created)
                print("validation_data = ", validation_check)

               
                if validation_check is None:

                    if 'rating' in request.data:
                        rating = request.data['rating']
                        listing_created['rating'] = rating
                    created_user = request.user.id
                    print("created_user = ", created_user)
                    
                    listing_created['created_user'] = request.user.id
                    listing_created_serializer = ListingModelSerializer(listing, data=listing_created, partial=True,
                                                                        context={'request': request})
                    listing_created_serializer.is_valid(raise_exception=True)
                    listing = listing_created_serializer.save()
                    dict_response = {
                        'error': False,
                        'message': 'listing updated successfully',
                        'id': listing.id
                    }
                    return Response(dict_response, status=status.HTTP_201_CREATED)
                else:
                    return Response(validation_check, status=status.HTTP_400_BAD_REQUEST)
            dict_response = {
                'error': True,
                'message': "user not same"
            }
            return Response(dict_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            dict_response = {
                'error': True,
                "message": 'not found'
            }
            return Response(dict_response, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        listing = ListingModel.objects.filter(id=pk)
        if len(listing) != 0:
            listing = listing[0]
            created_user = listing.created_user.id
            request_create_user = request.user.id
            if created_user == request_create_user:
                listing.delete()
                dict_response = {
                    'error': False,
                    'message': "delete successfully"
                }
                return Response(dict_response, status=status.HTTP_200_OK)
            else:
                dict_response = {
                    'error': True,
                    'message': "user not same"
                }
                return Response(dict_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            dict_response = {
                'error': True,
                "message": 'not found'
            }
            return Response(dict_response, status=status.HTTP_404_NOT_FOUND)

class ImageViewSet(ViewSet):

    def create(self, request):
        print(request.data)
        image = request.data['image']
        listing = request.data['listing']

        image_created = {}
        image_created['image'] = image
        image_created['listing'] = listing
        validation_check = FieldRequestValidationUtil.mandatory_field(image_created)
        if validation_check is None:
            image_created_serializer = ImageSerializer(data=image_created, context={'request': request})
            image_created_serializer.is_valid(raise_exception=True)
            image_created_serializer.save()
            dict_response = {
                'error': False,
                'message': 'listing created successfully',
            }
            return Response(dict_response, status=status.HTTP_201_CREATED)
        else:
            return Response(validation_check, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        print('data = ', request.data)

        image = Image.objects.filter(id=pk)
        if len(image) != 0:
            image = image[0]
            created_user = image.listing.created_user.id
            request_create_user = request.user.id
            if created_user == request_create_user:
                image = request.data['image']
                listing = request.data['listing']

                image_created = {}
                image_created['image'] = image
                image_created['listing'] = listing

                validation_check = FieldRequestValidationUtil.mandatory_field(image_created)
               
                if validation_check is None:
                    image_created_serializer = ImageSerializer(data=image_created, partial=True, context={'request': request})
                    image_created_serializer.is_valid(raise_exception=True)
                    image_created_serializer.save()
                    dict_response = {
                        'error': False,
                        'message': 'listing updated successfully',
                    }
                    return Response(dict_response, status=status.HTTP_201_CREATED)
                else:
                    return Response(validation_check, status=status.HTTP_400_BAD_REQUEST)
            dict_response = {
                'error': True,
                'message': "user not same"
            }
            return Response(dict_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            dict_response = {
                'error': True,
                "message": 'not found'
            }
            return Response(dict_response, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        image = Image.objects.filter(id=pk)
        if len(image) != 0:
            image = image[0]
            created_user = image.listing.created_user.id
            request_create_user = request.user.id
            if created_user == request_create_user:
                image.delete()
                dict_response = {
                    'error': False,
                    'message': "delete successfully"
                }
                return Response(dict_response, status=status.HTTP_200_OK)
            else:
                dict_response = {
                    'error': True,
                    'message': "user not same"
                }
                return Response(dict_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            dict_response = {
                'error': True,
                "message": 'not found'
            }
            return Response(dict_response, status=status.HTTP_404_NOT_FOUND)
        
class ImageAPIView(GenericAPIView):
    """
        Image List Endpoint
    """
    serializer_class = ImageSerializer

    def get_queryset(self):
        queryset = Image.objects.all()
        return queryset

    def get(self, request, listing_id):
        queryset = self.filter_queryset(Image.objects.all()).filter(listing__id=listing_id
                                                                    ).prefetch_related(Prefetch('listing', queryset=ListingModel.objects.filter(id=listing_id)))
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)