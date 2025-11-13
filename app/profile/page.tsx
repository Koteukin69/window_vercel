import { auth } from "@/auth"
import { redirect } from "next/navigation";

export default async function Profile() {
    const session = await auth();
    const user = session?.user;

    if (!user) redirect('/login')

    return (
        <div>
            <h1>Profile</h1>
            <div>{user.email}</div>
        </div>
    )
}