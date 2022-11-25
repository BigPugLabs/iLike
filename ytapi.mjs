import { google } from "googleapis"
const youtube = google.youtube("v3")

const getChannel = async (auth) => {
    try {
        const response = await youtube.channels.list({
            auth: auth,
            part: "snippet,contentDetails,statistics",
            id: "UCGiRSHBdWuCgjgmPPz_13xw",
        })
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
    } catch (err) {
        console.log("The API returned an error: " + err)
    }
}

const getPlaylistDetails = async (auth, plid) => {
    try {
        const response = await youtube.playlists.list({
            auth: auth,
            part: "snippet,id",
            id: plid
        })
        return response.data
    } catch (err) {
        console.log("failed to get playlist details: " + err)
    }
}

export { getChannel, getPlaylistDetails }
