import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { manualLocationUpdateSchema } from '@/validations/zodManualLocationUpdateSchema';
import type { ManualLocationUpdateFormValues } from '@/validations/zodManualLocationUpdateSchema';
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
import { getPublicIP } from '../utils/gpsHelper';


const Location = () => {

    const navigate = useNavigate();
    
    const form = useForm<ManualLocationUpdateFormValues>({
        resolver: zodResolver(manualLocationUpdateSchema),
        defaultValues: {
            neighborhood: "",
            ip: "",
        },
    })
    
    const onSubmit = async (data: ManualLocationUpdateFormValues) => {
        try {

            const ip = await getPublicIP();

            if (!ip) {
                form.setError("neighborhood", {
                    type: "manual",
                    message: "Unable to detect your public IP address",
                });
                return;
            }

            await api.post("/location/manual_update", {
                ...data,
                ip: ip,
            });
            
            alert("Location update request successful.");
            navigate("/profile");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Location update request failed: ${message}`);
            alert(`Location update request failed: ${message}`);
        }
    }

    const { isSubmitting } = form.formState;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">

            <CardHeader>
            <CardTitle>Update Location</CardTitle>
            <CardDescription>
                Enter your location
            </CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                >
                {/* Location */}
                <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                        <Input
                            type="text"
                            placeholder="Enter your location"
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
                    Update Location
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
}

export default Location;