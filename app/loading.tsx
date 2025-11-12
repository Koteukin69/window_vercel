"use client";

import { Spinner } from '@/components'

export default function Loading({ width, height }: { width?: number, height?: number }) {
    return (
        <div className={`w-full h-screen flex items-center justify-center text-[50px] uppercase font-bold gap-5`} style={{width, height}} id="loading">
            <Spinner width={50} height={50} />
            <div className={`text-[30px] font-bold`}>{`Loading`}</div>
        </div>
    )
}