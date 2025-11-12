import { Input, Button, Checkbox } from "@/components";
import Link from "../link/link";

export default function LoginForm() {
    return (
        <form className="flex flex-col gap-5 w-[225px] max-h-[calc(100vh-200px)] overflow-y-auto" action="/api/auth/login" method="POST">
            <Input label="Почта" placeholder="Email@example.com" id="email" required />
            <Input label="Пароль" placeholder="••••••" id="password" type="password" required />
            <Link href="/" text="Забыли пароль?" />
            <Checkbox id="remember" label="Запомнить меня" />
            <Button type="submit" text="Войти" />
        </form>
    )
}