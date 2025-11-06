"use client";

import { Card, Button } from "@/components";
import styles from "./card_list.module.css";

import { useEffect, useState } from "react";

export default function CardList() {
    const [cards, setCards] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showed, setShowed] = useState(3);

    useEffect(() => {
        if (isLoading)
            fetch('/api/videos', {next: {}})
                .then((res) => res.json())
                .then((data) => {
                    setCards(data)
                    setLoading(false)
                })
    });

    if (isLoading) return <></>

    return (<>
        <div className={styles.cards}>
            {cards.slice(0, showed).map((card, i) => (
                <Card key={i} src={card["poster"]} name={card["city"]} description={card["description"]} time_of_day={card["time_of_day"]} />            
            ))}
        </div>
        <Button text="Показать ещё" type="button" id="show" action={() => {
            const toShow = showed + 3
            setShowed(toShow)
            if (toShow < cards.length) return;
            
            const button = document.getElementById("show");
            if (button) button.style.display = "none";

        }}/>
    </>)
}