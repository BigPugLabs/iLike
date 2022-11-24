const { readFile } = require("node:fs/promises")
const { Listr } = require("listr2")
require("dotenv").config()

const getPlaylist = async (plid, token="") => {
    try {
        let res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${plid}&key=${process.env.API_KEY}&maxResults=50${token && "&pageToken=" + token}`, {"Accept": "application/json"})
        if (!res.ok) console.error("PLAYLIST CONTENTS NOT OKAY\n", res)
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

const getPlaylistDetails = async (plid) => {
    try {
        let res = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${plid}&key=${process.env.API_KEY}`, {"Accept": "application/json"})
        if (!res.ok) console.error("PLAYLIST DETAILS NOT OKAY!\n", res)
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

const main = async () => {
    let ids
    let playlists = []

    try {
        ids = JSON.parse(await readFile("playlists.json"))
        await new Listr(ids.map((plid,i) => {return {
            title: `playlist ${plid}`,
            task: (_,task)=>task.newListr(
                [{
                    title: "get playlist details",
                    task: async () => {
                        let resp = await getPlaylistDetails(plid)
                        task.title = resp.items[0].snippet.title.length > 60 ? resp.items[0].snippet.title.slice(0, 60) + "…" : resp.items[0].snippet.title.padEnd(61, " ")
                    }
                },
                {
                    title: "get all videos in playlist",
                    task: async () => {
                        let resp
                        let vids = []
                        let token = ""
                        do {
                            resp = await getPlaylist(plid, token)
                            vids = vids.concat(resp.items)
                            token = resp.nextPageToken
                            task.title = `${task.title.slice(0,61)} found ${vids.length}`
                        } while (token)
                        playlists[i] = vids
                        task.title = `${task.title.slice(0,61)} found ${vids.length}`
                    }
                }],
                { rendererOptions: { collapse: false }}
            )
            }}),
            { concurrent: true }
        ).run()
    } catch (e) {
        console.error(e)
    }
    // console.log(playlists, playlists.length)


    // now do the likes
}

main()
