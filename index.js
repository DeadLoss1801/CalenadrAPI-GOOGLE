const express = require('express')
const { google } = require('googleapis');
const { dayjs } = require('dayjs')
const { v4 } = require('uuid')
const app = express()
const calendar = google.calendar({
    version: "v3",
    auth: "AIzaSyAMg7aE1GYuLY9HJM7BTS4k3n95KbysIzU"
})


const oauth2Client = new google.auth.OAuth2(
    "54807242707-euie6m9v5njl0vkrjr1pnb5ipdkl7qhr.apps.googleusercontent.com",
    "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",
    "http://localhost:8000/google/redirect"
);
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

app.get('/', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: scopes
    });
    res.redirect(url);
})

app.get('/google/redirect', async (req, res) => {
    const code = req.query.code
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    res.send("IT IS  WORKING")
})

app.get('/create', async (req, res) => {
    const event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
            'dateTime': '2023-08-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'end': {
            'dateTime': '2023-08-28T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
            {
                'email': 'abhi1801jeet@gmail.com',
                'email': 'deadloss1801@gmail.com'
            },
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
        conferenceData: {
            createRequest: { requestId: v4() }
        }
    };
    await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        resource: event
    })
    res.send("WORKED")
})

app.listen(8000, () => {
    console.log(`http://localhost:8000/`);
})