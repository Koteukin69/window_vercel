import { Oswald } from "next/font/google";

import Image from "next/image";

const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: ["700"]
});

export default function Card({src, name, description, time_of_day}: {src: string, name: string, description: string, time_of_day: string}) {
    return (
        <a href={`/?city=${name}&time_of_day=${time_of_day}`} className={"grid grid-cols-[1fr_206px] h-[103px] pointer active:bg-(--active-background) hover:underline focus-visible:outline-1 outline-offset-1 outline-(--foreground)"}>
            <div className="h-full">
                <div className={oswald.className + " text-[30px]/[94%] uppercase"}>{name}</div>
                <div className={"text-[18px] font-400"}>{description}</div>
            </div>
            <div className="h-[103px] relative">
                <Image className="" src={src} alt={description} fill={true} objectFit="cover" />
            </div>
        </a>
    )
}