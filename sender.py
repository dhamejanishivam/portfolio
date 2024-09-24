import smtplib
from email.mime.text import MIMEText

# SMTP server configuration
smtp_server = 'smtp.mailgun.org'
smtp_port = 587
username = 'postmaster@shivamdhamejani.in'
password = '620b1024e869bf4f57af0bcd9fae76bd-7a3af442-d71c817e'

# Email details
sender_email = 'postmaster@shivamdhamejani.in'
receiver_email = 'bar@example.com'  # Change to your recipient
subject = 'Hello'
body = 'Testing some Mailgun awesomeness!'

# Create a MIMEText object
msg = MIMEText(body)
msg['Subject'] = subject
msg['From'] = sender_email
msg['To'] = receiver_email

# Send the email
with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.starttls()  # Upgrade to a secure connection
    server.login(username, password)
    server.sendmail(sender_email, receiver_email, msg.as_string())

print('Email sent successfully!')
