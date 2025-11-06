"use client";

import { Card, Button, Input } from "@/components";
import styles from "./card_list.module.css";

import React from "react";

export default function CardList() {
    const [cards, setCards] = React.useState<{src: string, name: string, description: string, time_of_day: string}[]>([
        ...Array(6).fill({ src: "/belgorodNight.png", name: "Белгород", description: "ночной Белогород", time_of_day: "night" })
    ]);
    return (<>
        <div className={styles.cards}>
            {cards.map((card, i) => (
                <Card key={i} src={card.src} name={card.name} description={card.description} time_of_day={card.time_of_day} />
            ))}
        </div>
        <Button text="Показать ещё" type="button" action={() => { setCards(cards.concat(cards.slice(0, 6))) }}/>
    </>)
}