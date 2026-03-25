from django.contrib import admin

from attachments.models import FileAttachments, AudioAttachments

admin.site.register(FileAttachments)
admin.site.register(AudioAttachments)