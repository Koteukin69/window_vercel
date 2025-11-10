"use client";

import { useEffect } from 'react';
import { Button } from "@/components";

let audio:HTMLAudioElement;

export default function BgMusic({src}: {src?: string}) {
    useEffect(() => {
        if (audio == undefined)
            audio = document.getElementById("bg_music") as HTMLAudioElement;
    }, []);

    return (<>

        <audio autoPlay loop id="bg_music">
            <source src={src} type="video/mp4" />
        </audio>
        <Button text={"Toggle Music"} type="button" action={() => { audio.paused ? audio.play() : audio.pause() }}/>
    </>
    )
}
