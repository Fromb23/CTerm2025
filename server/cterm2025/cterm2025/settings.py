import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

# ------------------------------
# BASE DIRECTORY
# ------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# load environment variables from a .env file if it exists

load_dotenv(BASE_DIR / ".env")

# ------------------------------
# SECURITY SETTINGS
# ------------------------------
SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
CORS_ALLOW_ALL_ORIGINS = True  # Add hostnames in production
AUTH_USER_MODEL = 'user.CustomUser'
AUTHENTICATION_BACKENDS = [
    'user.views.auth.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# ------------------------------
# INSTALLED APPS
# ------------------------------
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	"django_extensions",
    'django.contrib.admin',  # Include if you want admin access

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    'user',
    'api',
    'sandbox',
]

# ------------------------------
# MIDDLEWARE
# ------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'user.middlewares.auth.JWTAuthenticationMiddleware',
]

# ------------------------------
# TEMPLATES
# ------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ------------------------------
# URLS & WSGI
# ------------------------------
ROOT_URLCONF = 'cterm2025.urls'
WSGI_APPLICATION = 'cterm2025.wsgi.application'

# ------------------------------
# DATABASE
# ------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'checker',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# ------------------------------
# AUTHENTICATION
# ------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ------------------------------
# INTERNATIONALIZATION
# ------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

# ------------------------------
# STATIC FILES
# ------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

# ------------------------------
# MEDIA FILES
# ------------------------------
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

# ------------------------------
# CORS
# ------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# ------------------------------
# REST FRAMEWORK
# ------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=120),   # 2 hours
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),      # 7 days
    "ROTATE_REFRESH_TOKENS": True,                    # issue new refresh on refresh
    "BLACKLIST_AFTER_ROTATION": True,                 # old refresh token becomes invalid
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,                        # from your .env
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ------------------------------
# LOGGING
# ------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / "logs/requests.log",
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
