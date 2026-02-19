import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { manualLocationUpdateSchema } from "@/validations/zodManualLocationUpdateSchema";
import type { ManualLocationUpdateFormValues } from "@/validations/zodManualLocationUpdateSchema";
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


const Location = () => {

    const navigate = useNavigate();
    
    const form = useForm<ManualLocationUpdateFormValues>({
        resolver: zodResolver(manualLocationUpdateSchema),
        defaultValues: {
            neighborhood: "",
            latitude: 0,
            longitude: 0,
        },
    })
    
    const onSubmit = async (data: ManualLocationUpdateFormValues) => {
        try {

            await api.post("/location/manual_update", {
                ...data
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
            <CardTitle>Manual Update Location</CardTitle>
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

                {/* Latitude */}
                <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 12.9716"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Longitude */}
                <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 77.5946"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
