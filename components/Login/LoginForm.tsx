import {signIn} from "@/auth"

export function LoginForm() {
    return (
        <form
            action={async (formData) => {
                "use server"
                await signIn("credentials", formData)
            }}
        >
            <label>
                Email
                <input name="email" type="email"/>
            </label>
            <label>
                Password
                <input name="password" type="password"/>
            </label>
            <button>Login</button>
        </form>
    )
}