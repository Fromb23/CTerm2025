# views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from user.models.course_model import Module, Course, Sprint
from user.serializers.module_serializers import ModuleSerializer, ModuleListSerializer


class ModuleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing modules under courses
    Provides CRUD operations for modules within a specific course
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return ModuleListSerializer
        return ModuleSerializer

    def get_queryset(self):
        """Return modules for the specific course"""
        course_pk = self.kwargs.get('course_pk')
        if course_pk:
            # Ensure course exists
            get_object_or_404(Course, pk=course_pk)
            return Module.objects.filter(sprint__course_id=course_pk)
        return Module.objects.none()

    def get_serializer_context(self):
        """Add course_pk to serializer context for validation"""
        context = super().get_serializer_context()
        context['course_pk'] = self.kwargs.get('course_pk')
        return context

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a new module under a course"""
        course_pk = kwargs.get('course_pk')
        if not course_pk:
            return Response(
                {"error": "Course ID is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify course exists
        get_object_or_404(Course, pk=course_pk)
        
        # Check if sprint_id is provided
        sprint_id = request.data.get('sprint_id')
        if not sprint_id:
            return Response(
                {"error": "sprint_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            module = serializer.save()
            
            return Response({
                "status": "success",
                "module": ModuleSerializer(module, context=self.get_serializer_context()).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """List all modules for a specific course"""
        course_pk = kwargs.get('course_pk')
        
        # Check if course exists
        try:
            Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "modules": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single module by ID under a specific course"""
        course_pk = kwargs.get('course_pk')
        module_pk = kwargs.get('pk')
        
        if not course_pk:
            return Response(
                {"error": "Course ID is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not module_pk:
            return Response(
                {"error": "Module ID is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify course exists
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Get module for this specific course
        try:
            module = Module.objects.get(pk=module_pk, sprint__course=course)
        except Module.DoesNotExist:
            return Response(
                {"error": "Module not found for this course"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(module)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update an existing module (supports both PUT and PATCH)"""
        partial = kwargs.pop('partial', True)
        course_pk = kwargs.get('course_pk')
        module_pk = kwargs.get('pk')
        
        if not course_pk or not module_pk:
            return Response(
                {"error": "Course ID and Module ID are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify course exists
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Get module for this specific course
        try:
            module = Module.objects.get(pk=module_pk, sprint__course=course)
        except Module.DoesNotExist:
            return Response(
                {"error": "Module not found for this course"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(module, data=request.data, partial=partial)
        
        if serializer.is_valid():
            updated_module = serializer.save()
            return Response({
                "status": "success",
                "module": ModuleSerializer(updated_module, context=self.get_serializer_context()).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """Delete a module under a specific course"""
        course_pk = kwargs.get('course_pk')
        module_pk = kwargs.get('pk')
        
        if not course_pk or not module_pk:
            return Response(
                {"error": "Course ID and Module ID are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify course exists
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Get module for this specific course
        try:
            module = Module.objects.get(pk=module_pk, sprint__course=course)
        except Module.DoesNotExist:
            return Response(
                {"error": "Module not found for this course"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        module.delete()
        return Response({
            "status": "success",
            "message": "Module deleted"
        }, status=status.HTTP_200_OK)

    # Override partial_update to use our custom update method
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)