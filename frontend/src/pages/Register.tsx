import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/zodRegisterSchema";
import type { RegisterFormValues}  from '../validations/zodRegisterSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ClipLoader } from "react-spinners";


const Register = () => {

    const navigate = useNavigate();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        user_password: "",
        date_of_birth: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await api.post("/users/register", data);
            alert("Registration confirmed! Check your email to activate the account.");
            navigate("/login");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Registration failed: ${message}`);
            alert(`Registration failed: ${message}`);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle>🍵 Matcha -  Create an account</CardTitle>
            <CardDescription>
                Fill in your details to get started
            </CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                >
                {/* First Name */}
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Last Name */}
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

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
                    name="user_password"
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

                {/* Date of Birth */}
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                        <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Register
                </Button>
                </form>
            </Form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="underline hover:text-foreground">
                    Login
                </Link>
            </p>

            </CardContent>
        </Card>
        </div>
    )

};

export default Register;