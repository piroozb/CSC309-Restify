from rest_framework import viewsets
from .models import Reservations
from .serializers import ReservationSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class ReservationsViewSet(viewsets.ModelViewSet):
    queryset = Reservations.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    paginate_by = 10
    filterset_fields = ['status', 'id']
    basename = 'reservations'
    http_method_names = ['get', 'post', 'put']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.query_params.get('host_reservations'):
                queryset = Reservations.objects.filter(host=self.request.user)
                if self.request.query_params.get('status'):
                    status = self.request.query_params.get('status')
                    queryset = queryset.filter(status=status)
                if self.request.query_params.get('id'):
                    id = self.request.query_params.get('id')
                    queryset = queryset.filter(id=id)
                return queryset
            elif self.request.query_params.get('guest_reservations'):
                queryset = Reservations.objects.filter(guest=self.request.user)
                if self.request.query_params.get('status'):
                    status = self.request.query_params.get('status')
                    queryset = queryset.filter(status=status)
                if self.request.query_params.get('id'):
                    id = self.request.query_params.get('id')
                    queryset = queryset.filter(id=id)
                return queryset
            else:
                queryset_host = Reservations.objects.filter(host=self.request.user)
                queryset_guest = Reservations.objects.filter(guest=self.request.user)
                queryset = queryset_host | queryset_guest
                if self.request.query_params.get('status'):
                    status = self.request.query_params.get('status')
                    queryset = queryset.filter(status=status)
                if self.request.query_params.get('id'):
                    id = self.request.query_params.get('id')
                    queryset = queryset.filter(id=id)
                return queryset
        return Reservations.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)
        return super().perform_create(serializer)
    