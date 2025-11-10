export async function POST(request: Request) {
    const form = Object.fromEntries(await request.formData()) as { email?: string; password?: string; remember?: "on"|"off" };
    
    const email = form.email;
    const password = form.password;
    const remember = form.remember??"off" 

    if (email == undefined || password == undefined) return Response.json({ error: "Unprocessable Entity" }, { status: 422 });

    return Response.json({ email: email.toLowerCase(), password, remember }, {status: 200});
}