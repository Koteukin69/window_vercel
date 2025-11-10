import { Oswald } from "next/font/google";

const oswald = Oswald({
    subsets: ["cyrillic"], 
    weight: "700"
});

export default function NotFound({ width, height }: { width?: number, height?: number }) {
    return (
        <div className={`w-full flex items-center justify-center text-[30px] bg-[#545050] uppercase ${oswald.className}`} style={{width, height}} id="loading">
            {"нет подходящих видео =("}
        </div>
    )
}