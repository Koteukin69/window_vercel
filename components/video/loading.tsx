"use client";

import { Oswald } from "next/font/google";
import { useState, useEffect } from 'react'

const oswald = Oswald({
    subsets: ["cyrillic"], 
    weight: "700"
});

export default function Loading({ width, height }: { width?: number, height?: number }) {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDots(dots < 3 ? dots + 1 : 1);
        }, 500);

        return () => clearInterval(timeout);
    }, [dots]);

    return (
        <div className={`w-full flex items-center justify-center text-[30px] bg-[#545050] uppercase ${oswald.className}`} style={{width, height}} id="loading">
            {"загрузка" + ".".repeat(dots)}
        </div>
    )
}