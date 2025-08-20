# utils/code_generator.py
import re
from django.utils.text import slugify
from ..models.course_model import Course, Module

def generate_course_code(name: str) -> str:
    """
    Generate a unique course code from the course name.
    Example: 'Software Engineering' -> 'SE-001'
    """
    
    initials = ''.join(word[0].upper() for word in re.findall(r'\w+', name))
    
    count = 1
    course_code = f"{initials}-{count:03d}"
    while Course.objects.filter(course_code=course_code).exists():
        count += 1
        course_code = f"{initials}-{count:03d}"

    return course_code


def generate_module_code(course_code: str, module_title: str) -> str:
    """
    Generate a unique module code under a course.
    Example: Course 'SE-001', module 'Databases' -> 'SE-001-DB'
    """
    initials = ''.join(word[0].upper() for word in re.findall(r'\w+', module_title))
    base_code = f"{course_code}-{initials}"
    
    # Ensure uniqueness if modules have similar names
    suffix = 1
    final_code = base_code
    while Module.objects.filter(code=final_code).exists():
        suffix += 1
        final_code = f"{base_code}{suffix}"
    
    return final_code
