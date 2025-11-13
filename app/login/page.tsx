import { Input, Button, Checkbox, Link } from "@/components";
import { redirect } from "next/navigation";

export default function Login() {
    return (
        <form className="flex flex-col gap-5 w-[225px] max-h-[calc(100vh-200px)] overflow-y-auto" action={async (formData) => {
            'use server'
            redirect('/profile')
        }}>
            <Input label="Почта" placeholder="Email@example.com" id="email" required />
            <Input label="Пароль" placeholder="••••••" id="password" type="password" required />
            <Link href="/" text="Забыли пароль?" />
            <Checkbox id="remember" label="Запомнить меня" />
            <Button type="submit" text="Войти" />
            <Link href="/register" text="Зарегистрироваться" />
        </form>
    )
}