export default function Link({ href, text }: { href: string, text: string }) {
    return (
        <a href={href} className="text-[18px] text-(--foreground-second)">{text}</a>
    )
}