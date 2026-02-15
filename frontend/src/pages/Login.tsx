import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '../validations/zodLoginSchema';
import type { LoginFormValues } from '../validations/zodLoginSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ClipLoader } from "react-spinners";


const Login = () => {

    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await api.post("/users/login", data);
            const token = response?.data?.token || null;

            if (typeof token !== "string" || token.trim().length === 0) {
                alert("Login failed: Invalid token received");
                return;
            }

            localStorage.setItem("token", token);
            navigate("/home");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Login failed: ${message}`);
            alert(`Login failed: ${message}`);
        }
    }

    const { isSubmitting } = form.formState;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">

            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to sign in
                </CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                >
                {/* Username */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Forgot password */}
                <div className="text-right">
                    <Link
                    to="/forget-password"
                    className="text-sm text-muted-foreground underline hover:text-foreground"
                    >
                    Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Login
                </Button>
                </form>
            </Form>

            {/* Footer */}
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                to="/register"
                className="underline hover:text-foreground"
                >
                Register
                </Link>
            </p>
            </CardContent>
        </Card>
        </div>
    )
};

export default Login;
