require("dotenv").config()

const getPlaylist = async (token="") => {
    // playlist id PLBf-QcbaigsJysJ-KFZvLGJvvW-3sfk1S
    const plid = "PLBf-QcbaigsJysJ-KFZvLGJvvW-3sfk1S"

    try {
        let res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${plid}&key=${process.env.API_KEY}&maxResults=25${token && "&pageToken=" + token}`, {"Accept": "application/json"})
        if (!res.ok) console.log("RES NOT OKAY\n", res)
        return await res.json()
    } catch (err) {
        console.error(err)
    }
}

const main = async() => {
    let items = []

    let resp = await getPlaylist()
    let token = resp.nextPageToken
    items = resp.items
    while (token) {
        resp = await getPlaylist(token)
        items = items.concat(resp.items)
        token = resp.nextPageToken
    }

    console.log(items, items.length)
}

main()
