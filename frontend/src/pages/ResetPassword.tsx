import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validations/zodResetPasswordSchema";
import type { ResetPasswordFormValues } from "../validations/zodResetPasswordSchema";
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


const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Get the token from the URL (e.g., ?token=xyz)
    const token = searchParams.get('reset_uuid');
    
    useEffect(() => {
        if (token){
            console.log('Reset token found in URL:', token);
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) return

        try {
            const payload = {
                reset_uuid: token,
                password: data.password,
            };

            await api.post("/users/reset_user_password", payload);
            alert("Password reset successful! You can now login.");
            navigate("/login");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Password reset failed: ${message}`);
            alert(`Password reset failed: ${message}`);
        }
    }

    const { isSubmitting } = form.formState;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">

            <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
                Enter a new password for your account
            </CardDescription>
            </CardHeader>

            <CardContent>
            {!token ? (
                <p className="text-sm text-destructive text-center">
                Invalid or missing reset token. Please use the link from your email.
                </p>
            ) : (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* New Password */}
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Confirm Password */}
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    >
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Set New Password
                    </Button>
                </form>
                </Form>
            )}
            </CardContent>
        </Card>
        </div>
    )
};

export default ResetPassword;