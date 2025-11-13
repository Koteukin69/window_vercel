"use client";

import { useTheme } from 'next-themes';

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme();
    return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`fixed top-[60px] right-[100px] rounded-full flex gap-2.5`} >
        Light
        <div className='rounded-full w-[50px] aspect-2/1 bg-[#4169E1]'>
            <div className='rounded-full relative h-full w-1/2 flex items-center justify-center dark:transform-[translateX(100%)] transition-transform duration-200'>
                <div className='w-[19px] aspect-square rounded-full bg-white'></div>
            </div>
        </div>
        Dark
    </button>
}