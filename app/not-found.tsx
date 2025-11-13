export default function NotFound() {
    return (
        <div className={`w-full h-screen flex items-center justify-center flex-col font-bold gap-[10px]`}>
            <div className={`text-[30px]/[100%] font-bold flex gap-[6px] items-center justify-center text-center flex-wrap px-[30px]`}>
                {"404 Бро, ты немного заблудился".split(" ").map((word, index) => (
                    <span className="first:text-[40px]/0 first:text-(--foreground-second) first:mr-[10px] " key={index}>{word}</span>
                ))}
            </div>
            <a href="/" className="text-gray-400">вернуться на главную</a>
        </div>
    )
}