from django.core.mail import EmailMessage
from django.conf import settings  # Import settings to access EMA

class Util:
    @staticmethod
    def send_email(data):
        print(f"Attempting to send email: {data}")
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to_email']]
        )
        email.send()
