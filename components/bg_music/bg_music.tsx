"use client";

import { useEffect } from 'react';
import { Button } from "@/components";

let audio:HTMLAudioElement;

function paused(audio:HTMLAudioElement) {
    return audio.paused;
}

function play(audio:HTMLAudioElement) {
    audio.play();
}

function pause(audio:HTMLAudioElement) {
    audio.pause();
}

function toggle(audio:HTMLAudioElement) {
    paused(audio) ? play(audio) : pause(audio);
}

export default function BgMusic({src}: {src?: string}) {
    useEffect(() => {
        audio = document.getElementById("bg_music") as HTMLAudioElement;
    }, []);

    return (<>
        <audio autoPlay loop id="bg_music">
            <source src={src} type="video/mp4" />
        </audio>
        <Button text={"Toggle Music"} type="button" action={() => {
            toggle(audio);
        }}/>
    </>
    )
}
