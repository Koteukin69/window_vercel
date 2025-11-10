"use client";

import { useTheme } from 'next-themes';
import styles from './toggle_theme.module.css';

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme();
    return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-[100px] aspect-2/1 fixed top-[60px] right-[60px] rounded-full outline-3 outline-(--background-second) -outline-offset-2 flex flex-row items-center shadow-[0_4px_4px_rgba(0,0,0,.25)]`} >
        <div className={`${styles.knob} rounded-full`}>
            <div className="aspect-square w-[40px] h-[40px] overflow-hidden rounded-full relative"></div>
        </div>
    </button>
}