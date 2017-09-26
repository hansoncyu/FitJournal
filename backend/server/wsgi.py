"""
WSGI config for server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os
import sys

FILE_PATH = os.path.abspath(__file__)
sys.path.append(os.path.dirname(os.path.dirname(FILE_PATH)))
sys.path.append(os.path.dirname(FILE_PATH))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

application = get_wsgi_application()
