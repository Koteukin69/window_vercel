import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: ["700"]
});

export default function Title({title}: {title: string}) {
    return (
        <h1 className={oswald.className + " text-[75px]/[94%] uppercase"}>
            {title.split("\n").map((line, index) => (
                <span className="first:text-(--foreground-second)" key={index}>
                    {line}
                    <br />
                </span>
            ))}
        </h1>
    )
}