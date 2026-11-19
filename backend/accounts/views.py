from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UpdateProfileSerializer

def format_serializer_errors(errors):
    """Extracts a clear, human-readable string from serializer errors."""
    if isinstance(errors, dict):
        for field, messages in errors.items():
            if isinstance(messages, list) and messages:
                field_name = field.replace('_', ' ').capitalize()
                return f"{messages[0]}" if field in ['non_field_errors', 'detail'] else f"{field_name}: {messages[0]}"
            elif isinstance(messages, str):
                return messages
    elif isinstance(errors, list) and errors:
        return str(errors[0])
    return "Please check the provided data."

class RegisterView(APIView):
    """
    Register a new user account. Returns authentication token and user profile.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'success': True,
                'message': 'Registration successful.',
                'token': token.key,
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'error': {
                'status_code': status.HTTP_400_BAD_REQUEST,
                'message': format_serializer_errors(serializer.errors),
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    Authenticate user with username and password. Returns authentication token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'success': True,
                'message': 'Login successful.',
                'token': token.key,
                'user': user_data
            }, status=status.HTTP_200_OK)
        return Response({
            'success': False,
            'error': {
                'status_code': status.HTTP_400_BAD_REQUEST,
                'message': format_serializer_errors(serializer.errors),
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    Logout the authenticated user by invalidating the auth token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete user's auth token
            Token.objects.filter(user=request.user).delete()
            return Response({
                'success': True,
                'message': 'Successfully logged out.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                    'message': 'Failed to logout cleanly.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CurrentUserView(APIView):
    """
    Get profile information of the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        })

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully.',
                'user': UserSerializer(user).data
            })
        return Response({
            'success': False,
            'error': {
                'status_code': status.HTTP_400_BAD_REQUEST,
                'message': format_serializer_errors(serializer.errors),
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

