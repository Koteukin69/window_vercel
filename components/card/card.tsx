import { Oswald } from "next/font/google";

import Image from "next/image";

const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: ["700"]
});

export default function Card({src, name, description, time_of_day}: {src: string, name: string, description: string, time_of_day: string}) {
    return (
        <a href={`/?city=${name}&time_of_day=${time_of_day}`} className={"grid grid-cols-2 h-[103px]"}>
            <div className="h-full">
                <div className={oswald.className + " text-[30px]/[94%] uppercase"}>{name}</div>
                <div className={"text-[18px] font-400"}>{description}</div>
            </div>
            <Image className={"aspect-2/1 h-full"} width={206} height={103} src={src} alt="image" objectFit="cover" />
        </a>
    )
}