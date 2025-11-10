export default function NotFound() {
    return (
        <div className={`w-full h-screen flex items-center justify-center flex-col font-bold`}>
            <div className={`text-[30px] font-bold flex gap-[6px] items-center [&>*:first-child]:text-gray-300 [&>*:first-child]:text-[40px] [&>*:first-child]:mr-[10px]`}>
                {"404 Бро, ты немного заблудился".split(" ").map((word, index) => (
                    <span className="" key={index}>{word}</span>
                ))}
            </div>
            <a href="/" className="text-gray-400">вернуться на главную</a>
        </div>
    )
}