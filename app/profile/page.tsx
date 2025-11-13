import { redirect } from "next/navigation";

export default async function Profile() {
    const user = {name: "Test", email: "test@email.com"};

    if (!user) redirect('/login')

    return (
        <div>
            <h1>Profile</h1>
            <div>{`Name: ${user.name}`}</div>
            <div>{`Email: ${user.email}`}</div>
        </div>
    )
}