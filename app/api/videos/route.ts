import videos from "./db"

export async function GET() {
    return Response.json(videos, {status: 200});
}

export async function POST(request: Request) {
    const json:{ city:string, time_of_day:"morning"|"day"|"night" } = await request.json();

    if (json.city == undefined || json.time_of_day == undefined) return Response.json({ error: "Unprocessable Entity" }, { status: 422 })
    
    const video = videos.find((video) => video.city == json.city && video.time_of_day == json.time_of_day);

    if (video == undefined) return Response.json({error: "Not Found"}, {status: 404} )
    return Response.json(video, {status: 200});
}