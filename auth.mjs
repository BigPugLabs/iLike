import fs from "node:fs/promises"
import readline from "readline"
import { google } from "googleapis"
const OAuth2 = google.auth.OAuth2

const SCOPES = ["https://www.googleapis.com/auth/youtube"]
const TOKEN = "authtoken.json"

async function authorize() {
    let credentials
    try {
        credentials = JSON.parse(await fs.readFile("client_secret.json"))
    } catch (err) {
        console.log("error loading client secret file: " + err)
        return
    }

    const clientSecret = credentials.installed.client_secret
    const clientId = credentials.installed.client_id
    const redirectUrl = credentials.installed.redirect_uris[0]
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

    try {
        const token = await fs.readFile(TOKEN)
        oauth2Client.credentials = JSON.parse(token)
        return oauth2Client
    } catch (e) {
        return getNewToken(oauth2Client, callback, cbArgs)
    }
}

function getNewToken(oauth2Client) {
    const authUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES })
    console.log("Authorize this app by visiting this url: ", authUrl)
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question("Enter code from that page here: ", (code) => {
        rl.close()
        oauth2Client.getToken(code, (err, token) => {
            if (err) {
                console.log("Error while trying to retrieve access token", err)
                return
            }
            oauth2Client.credentials = token
            storeToken(token)
            return oauth2Client
        })
    })
}

function storeToken(token) {
    fs.writeFile(TOKEN, JSON.stringify(token), (err) => {
        if (err) throw err
        console.log("token stored to " + TOKEN)
    })
}

function getChannel(auth) {
    const service = google.youtube("v3")
    service.channels.list(
        {
            auth: auth,
            part: "snippet,contentDetails,statistics",
            id: "UCGiRSHBdWuCgjgmPPz_13xw",
        },
        (err, response) => {
            if (err) {
                console.log("The API returned an error: " + err)
                return
            }
            const channels = response.data.items
            if (channels.length == 0) {
                console.log("No channel found")
            } else {
                console.log(
                    "This channel's ID is %s. Its title is '%s', and " + "it has %s views.",
                    channels[0].id,
                    channels[0].snippet.title,
                    channels[0].statistics.viewCount
                )
            }
        }
    )
}

export { authorize, getChannel }
