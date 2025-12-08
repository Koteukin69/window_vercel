'use client';

import { Oswald } from "next/font/google";
import Image from "next/image";
import FavoriteButton from "../favorite_button/favorite_button";
import styles from "./card.module.css";

const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: ["700"]
});

export default function Card({
  src,
  name,
  description,
  time_of_day
}: {
  src: string;
  name: string;
  description: string;
  time_of_day: string;
}) {
  return (
    <div className={styles.cardWrapper}>
      <a
        href={`/?city=${name}&time_of_day=${time_of_day}`}
        className={styles.card}
      >
        <div className={styles.content}>
          <div className={oswald.className + " text-[30px]/[94%] uppercase"}>
            {name}
          </div>
          <div className="text-[18px] font-400">{description}</div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={src}
            alt={description}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
      </a>
      <div className={styles.favoriteContainer}>
        <FavoriteButton city={name} timeOfDay={time_of_day} size="small" />
      </div>
    </div>
  );
}
