from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from account.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView
from account.models import User
from account.serializers import UserProfileSerializer
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib import messages

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.create(serializer.validated_data)
        return Response({'msg': 'Registration successful. Please check your email to activate your account.'}, status=status.HTTP_201_CREATED)



from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

# Activate Account View
class ActivateAccountView(APIView):
    def get(self, request, uid, token):
        try:
            # Decode the user ID (not the email)
            uid_decoded = urlsafe_base64_decode(uid)
            user_id = int(uid_decoded)  # Convert decoded value to integer
            user = User.objects.get(id=user_id)

            # Verify the token
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid or Expired Token'}, status=status.HTTP_400_BAD_REQUEST)

            # Activate the user and save to the database
            if user.is_active:
                return Response({'error': 'User already activated.'}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()  # Now save the user to the database

            return Response({'msg': 'Account activated successfully'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Activation failed. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data['email']
        password = serializer.data['password']
        user = authenticate(email=email, password=password)
        if user and user.is_active:
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Login successful'}, status=status.HTTP_200_OK)
        elif user and not user.is_active:
            return Response({'error': 'Account is not activated. Check your email.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
  
  
class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]  # Only admins can access

