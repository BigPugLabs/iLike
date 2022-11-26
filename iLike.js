import { readFile } from "node:fs/promises"
import { Listr } from "listr2"
import * as dotenv from "dotenv"
dotenv.config()

import { authorize } from "./auth.mjs"
import { getPlaylistDetails, getPlaylistItems, getRating } from "./ytapi.mjs"

const main = async () => {
    let ids
    let playlists = []
    const auth = await authorize()
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
                                        let resp = await getPlaylistDetails(auth, plid)
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
                                            resp = await getPlaylistItems(auth, plid, token)
                                            vids = vids.concat(resp.items)
                                            token = resp.nextPageToken
                                            getVidsTask.title = `Videos found : ${vids.length}`
                                        } while (token)
                                        playlists[i] = vids
                                        getVidsTask.title = `Videos found : ${vids.length}`
                                        //console.log(playlists[i])
                                    },
                                },
                                {
                                    title: "Get ratings",
                                    task: async (_, getRatingTask) => {
                                        // TODO
                                        //
                                        // seems to be a limit of 50 vids per request
                                        // need to split longer playlists into multiple reqs
                                        //
                                        // getRating() is currently slicing the array to limit
                                        const resp = await getRating(
                                            auth,
                                            playlists[i].map((e) => e.contentDetails.videoId)
                                        )
                                        let ratings = resp.reduce((acc, c) => {
                                            acc[c.rating] = (acc[c.rating] || 0) + 1
                                            return acc
                                        }, {})
                                        playlists[i] = playlists[i].map(
                                            (e, i) => (e.contentDetails.rating = resp[i].rating)
                                        )

                                        getRatingTask.title = `Got ratings | Likes - ${ratings.like || 0} | Dislikes - ${ratings.dislike || 0} | none - ${ratings.none || 0}`

                                        console.log(playlists[i].map(e=>e.contentDetails))
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
