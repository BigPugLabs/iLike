# iLike
can like whole youtube playlists in one go

# WIP

!note this is incomplete!
### TODO
- [x] pull playlist contents from youtube
- [x] get playlist details
- [ ] like items on playlist
- [ ] track progress
- [x] specify multiple/other playlists
- [ ] pause/resume if api limits exceeded?

## Requirements

- node.js v18 or higher
- a google API key with "YouTube Data API v3" enabled

## Use

1. Clone this repo locally with `git clone https://github.com/BigPugLabs/iLike.git`
2. move to the project folder and rename the file `.envSAMPLE` to `.env` and replace the value with your API key
2. Alt - create a client secret for oauth2 following the below guide
3. install with `npm install`
4. add playlist ids to the playlists.json file
5. `npm run start`

### Create client secret

From the [google reference](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the)

- Use [this wizard](https://console.developers.google.com/start/api?id=youtube) to create or select a project in the Google Developers Console and automatically turn on the API. Click Continue, then Go to credentials.

- On the Create credentials page, click the Cancel button.

- At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.

- Select the Credentials tab, click the Create credentials button and select OAuth client ID.

- Select the application type Other, enter the name "YouTube Data API Quickstart", and click the Create button.

- Click OK to dismiss the resulting dialog.

- Click the file_download (Download JSON) button to the right of the client ID.

- Move the downloaded file to your working directory and rename it client_secret.json
