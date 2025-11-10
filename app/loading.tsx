"use client";

import { useState, useEffect } from 'react'
import { Spinner } from '@/components'

export default function Loading({ width, height }: { width?: number, height?: number }) {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDots(dots < 3 ? dots + 1 : 1);
        }, 500);

        return () => clearInterval(timeout);
    }, [dots]);

    return (
        <div className={`w-full h-screen flex items-center justify-center text-[50px] uppercase font-bold gap-[20px]`} style={{width, height}} id="loading">
            <Spinner width={50} height={50} />
            <div className={`text-[30px] font-bold`}>{`Loading${".".repeat(dots)}`}</div>
        </div>
    )
}