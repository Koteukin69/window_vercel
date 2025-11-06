"use client";

import { useSearchParams } from "next/navigation";
import { Button, Radio, Input } from "@/components";

export default function SearchForm({ action="/" }: {action?: string}) {
    const searchParams = useSearchParams();
    const params = ['city', 'time_of_day'].map((param) => (searchParams.get(param) || undefined));

    return (
        <form className="grid grid-cols-3 gap-[40px] items-end" action={ action }>
            <Input label="Город" placeholder="Санкт-Петербург" id="city" value={params[0]} required />
            <Radio label="Время суток" id="time_of_day" radio={[
                {id: "morning", label: "Утро"}, 
                {id: "day", label: "День"}, 
                {id: "night", label: "Ночь"}
            ]} required defaultChecked={["morning", "day", "night"].includes(params[1] ?? "") ? params[1] : "day"} />
            <Button type="submit" text="Найти" />
        </form>
    )
}
