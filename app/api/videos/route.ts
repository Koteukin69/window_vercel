import { neon } from '@neondatabase/serverless';

let videos: [{ city: string; time_of_day: "morning"|"day"|"night"; poster: string; src: { [key: string]: string; }; description: string; }] | undefined;
let lastFetch = 0;

async function getVideosTable() {
    const sql = neon(`${process.env.DATABASE_URL}`);
    return await sql`SELECT * FROM videos;` as [{ city: string; time_of_day: "morning"|"day"|"night"; poster: string; src: { [key: string]: string; }; description: string; }];
}

async function getVideos() {
    const now = Date.now();

    if (videos == undefined)
        videos = await getVideosTable();
    else if (now - lastFetch > (10 * 60 * 1000)) {
        (async () => {
            videos = await getVideosTable();
        })()

        lastFetch = now;
    }
    
    return videos;
}

export async function GET() {
    return Response.json(await getVideos(), {status: 200});
}

export async function POST(request: Request) {
    const json = await request.json() as { city?:string, time_of_day?:"morning"|"day"|"night" };

    const city = json.city;
    const time_of_day = json.time_of_day;

    if (city == undefined || time_of_day == undefined) return Response.json({ error: "Unprocessable Entity" }, { status: 422 })
    
    const video = (await getVideos()).find((video) => video.city.toLowerCase() == city.toLowerCase() && video.time_of_day == time_of_day);
    if (video == undefined) return Response.json({error: "Not Found"}, {status: 404} )

    return Response.json(video, {status: 200});
}