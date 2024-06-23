import sys
import json
import datetime as dt
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def main():
    # Retrieve the schedule from command line arguments
    schedule = json.loads(sys.argv[1])

    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json")

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        # Process the schedule and create events on Google Calendar
        for event_info in schedule['events']:
            event = {
                "summary": event_info['summary'],
                "location": event_info.get('location', 'Online'),
                "description": event_info.get('description', ''),
                "start": {
                    "dateTime": event_info['start'],
                    "timeZone": "America/Los_Angeles"  # Change to your timezone
                },
                "end": {
                    "dateTime": event_info['end'],
                    "timeZone": "America/Los_Angeles"  # Change to your timezone
                },
            }
            created_event = service.events().insert(calendarId='primary', body=event).execute()
            print(f"Event created: {created_event.get('htmlLink')}")

    except HttpError as error:
        print("An error occurred: ", error)

if __name__ == "__main__":
    main()
