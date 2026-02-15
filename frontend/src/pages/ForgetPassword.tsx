import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgetPasswordSchema } from '@/validations/zodForgetPasswordSchema';
import type { ForgetPasswordFormValues } from '@/validations/zodForgetPasswordSchema';
import { ClipLoader } from "react-spinners";
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


const ForgetPassword = () => {

    const navigate = useNavigate();
    
    const form = useForm<ForgetPasswordFormValues>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
        email: "",
        },
    })
    
    const onSubmit = async (data: ForgetPasswordFormValues) => {
        try {
            await api.post("/users/reset_password_request", data);
            alert("Password reset request successful. Please check your email.");
            navigate("/login");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Password reset request failed: ${message}`);
            alert(`Password reset request failed: ${message}`);
        }
    }

    const { isSubmitting } = form.formState;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">

            <CardHeader>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
                Enter your email and we’ll send you reset instructions
            </CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                >
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Request Password Reset
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
}

export default ForgetPassword;
