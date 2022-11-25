import { readFile } from "node:fs/promises"
import { Listr } from "listr2"
import * as dotenv from "dotenv"
dotenv.config()

import { authorize } from "./auth.mjs"
import { getChannel, getPlaylistDetails } from "./ytapi.mjs"

const getPlaylist = async (plid, token = "") => {
    try {
        let res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${plid}&key=${
                process.env.API_KEY
            }&maxResults=50${token && "&pageToken=" + token}`,
            { Accept: "application/json" }
        )
        if (!res.ok) console.error("PLAYLIST CONTENTS NOT OKAY\n", res)
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

const getPlaylistDetailsOLD = async (plid) => {
    try {
        let res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${plid}&key=${process.env.API_KEY}`,
            { Accept: "application/json" }
        )
        if (!res.ok) console.error("PLAYLIST DETAILS NOT OKAY!\n", res)
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

const main = async () => {
    let ids
    let playlists = []
//console.log(authorize.length)
//    authorize(getChannel)
//    return
    try {
        ids = JSON.parse(await readFile("playlists.json"))
        await new Listr(
            ids.map((plid, i) => {
                return {
                    title: `playlist ${plid}`,
                    task: (_, task) =>
                        task.newListr(
                            [
                                {
                                    title: "Get playlist details",
                                    task: async () => {
                                        let resp = await authorize(getPlaylistDetails, [plid])
                                        task.title =
                                            resp.items[0].snippet.title.length > 60
                                                ? resp.items[0].snippet.title.slice(0, 60) + "…"
                                                : resp.items[0].snippet.title.padEnd(61, " ")
                                    },
                                },
                                {
                                    title: "Get all videos in playlist",
                                    task: async (_, getVidsTask) => {
                                        let resp
                                        let vids = []
                                        let token = ""
                                        do {
                                            resp = await getPlaylist(plid, token)
                                            vids = vids.concat(resp.items)
                                            token = resp.nextPageToken
                                            getVidsTask.title = `Videos found : ${vids.length}`
                                        } while (token)
                                        playlists[i] = vids
                                        getVidsTask.title = `Videos found : ${vids.length}`
                                    },
                                },
                            ],
                            { rendererOptions: { collapse: false } }
                        ),
                }
            }),
            { concurrent: true }
        ).run()
    } catch (e) {
        console.error(e)
    }
    // console.log(playlists, playlists.length)

    // now do the likes
}

main()
