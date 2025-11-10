"use client";

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Oswald } from "next/font/google";
import Loading from './loading';
import NotFound from './notFound';

const oswald = Oswald({
    subsets: ["cyrillic"], 
    weight: "700"
});

export default function Video({ width=711, height=386 }: { width?: number, height?: number }) {
    const searchParams = useSearchParams();
    const data = {
        city: searchParams.get('city'),
        time_of_day: searchParams.get('time_of_day')
    }

    const [content, setContent] = useState(undefined)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (isLoading && data.city && data.time_of_day && ["morning", "day", "night"].includes(data.time_of_day))
            fetch('/api/videos', {method: "POST", body: JSON.stringify(data),headers: {"Content-Type": "application/json" }, })
                .then((res) => res.json())
                .then((data) => {
                    setContent(data)
                    setLoading(false)
                }
            )
    }, [])

    if (isLoading)
        return <Loading width={width} height={height}/>

    if (content == undefined || content["src"] == undefined) 
        return <NotFound width={width} height={height}/>
    
    const src = content["src"];
    const poster = content["poster"];

    return (
        <video style={{width, height}} className='object-cover' width={width} height={height} muted loop controls poster={ poster } >
            {Object.keys(src).map((key) => (
                <source src={ src[key as keyof typeof src] } type={`video/${key}`} key={key} />
            ))}
            Your browser doesn't support HTML video.
        </video>
    )
}