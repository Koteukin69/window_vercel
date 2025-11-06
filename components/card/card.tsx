import styles from "./card.module.css";

import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: ["700"]
});

export default function Card({src, name, description, time_of_day}: {src: string, name: string, description: string, time_of_day: string}) {
    return (
        <a href={`/?city=${name}&time_of_day=${time_of_day}`} className={styles.card}>
            <div>
                <div className={oswald.className + " text-[30px]/[94%] uppercase"}>{name}</div>
                <div className={"text-[18px] font-400"}>{description}</div>
            </div>
            <img className={styles.image} src={src} alt="image" />
        </a>
    )
}