"use client";

import { useSearchParams } from 'next/navigation'

import { Oswald } from "next/font/google";

const oswald = Oswald({
    subsets: ["cyrillic"], 
    weight: "700"
});

export default function Video({ width=711, height=386 }: { width?: number, height?: number }) {
    const searchParams = useSearchParams();
    const params = ['city', 'time_of_day'].map((param) => (searchParams.get(param) || undefined));

    const content = params.includes(undefined) ? undefined : {
        poster: "https://i.ytimg.com/vi/LLFhKaqnWwk/maxresdefault.jpg",
        src: {
            mp4: "https://ia801509.us.archive.org/10/items/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4"
        }
    }

    return (content) ? (
        <video style={{width, height}} className='object-cover' width={width} height={height} muted loop controls poster={ content.poster } >
            {Object.keys(content.src).map((key) => (
                <source src={ content.src[key as keyof typeof content.src] } type={`video/${key}`} key={key} />
            ))}
            Your browser does not support the video tag.
        </video>
    ) : (
        <div className={`w-full flex items-center justify-center text-[30px] bg-[#545050] uppercase ${oswald.className}`} style={{width, height}}>
            {"нет подходящих видео =("}
        </div>
    )
}