"use client";

import { useTheme } from 'next-themes';
import styles from './toggle_theme.module.css';

export default function ToggleTheme({ width }: { width: number }) {
    const { theme, setTheme } = useTheme();
    return <button className={`aspect-2/1 fixed top-[60px] right-[60px] bg-(--background-contrast) text-(--foreground) rounded-full outline-3 outline-(--background-second) -outline-offset-3 flex flex-row items-center shadow`} style={{ width }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <div className={`${styles.knob} rounded-full`}>
            <div className="aspect-square w-[25px] h-[25px] overflow-hidden rounded-full relative shadow-[0_0_5px_2px_var(--theme-color)]"></div>
        </div>
    </button>;
}