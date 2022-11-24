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
3. install with `npm install`
4. add playlist ids to the playlists.json file
5. `npm run start`
