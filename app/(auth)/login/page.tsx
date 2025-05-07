"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Cookies from 'js-cookie'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { axiosInstance } from "@/lib/axios"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }).email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters.",
    }),
})

export default function Page() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // useEffect(() => {
    //     try {
    //         // const token = localStorage.getItem('token');
    //         // const token = Cookies.get('token');
    //         // console.log(token, 'token')
    //         // if (token) {
    //         //     router.push('/dashboard');
    //         // }
    //     } catch (error) {
    //         console.error("Error checking token:", error);
    //     }
    // }, [router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     console.log(values)
    // }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Check if the user is already logged in
        // const token = Cookies.get('token')
        // login fron ./lib


        // if (token) {
        //     // If a token exists, redirect to the dashboard
        //     router.push('/dashboard');
        //     return; // Exit the function early
        // }
        // console.log('values')

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await axiosInstance.post(`${baseUrl}/api/v1/login`, values);
            console.log(response, 'response')
            if (response.status == 500) {
                console.log('error')
                return;
            }
            if (response.data.code == 400) {
                console.log(response)
                setErrorMessage(response.data.error);
                return;
            }
            console.log(response.status, 'response.code')

            if (response.status == 200) {
                router.push('/dashboard');
                Cookies.set('name', response.data.data.user.firstname, { expires: 1 });
                localStorage.setItem('name', response.data.data.user.firstname);
                localStorage.setItem('userId', response.data.data.user.id);
                document.cookie = `Authorization=${response.data.data.Authorization}; path=/; max-age=${60 * 60 * 24}; HttpOnly; Secure`;
                document.cookie = `refreshToken=${response.data.data.RefreshToken}; path=/; max-age=${60 * 60 * 24}; HttpOnly; Secure`;
                console.log('success')
                return;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error);
                setErrorMessage(error.response.data.error);
            }
        }
    }

    return (
        <div className="flex items-center lg:flex-row justify-center w-full h-full min-h-screen px-4 lg:px-0">
            <div className="hidden lg:block w-1/2 h-full min-h-screen bg-primary">
                <div className="flex flex-col items-center justify-center h-full min-h-screen">
                    <h1 className="text-4xl font-semibold text-white text-center py-4">Welcome Back!</h1>
                    <p className="text-white text-center">To keep connected with us please login with your personal info</p>
                </div>
            </div>
            <div className="lg:w-1/2 w-full h-full bg-red-50 min-h-screen flex items-center justify-center sm:px-12 lg:px-32">
                <div className="lg:min-w-96 w-full lg:w-fit bg-white drop-shadow-md p-6 rounded-md">
                    <h1 className="text-2xl font-semibold text-center py-4">Login</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email" {...field} autoComplete="off" />
                                        </FormControl>
                                        {/* <FormDescription>
                                        This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                        This is your private password.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />
                            <FormMessage>{errorMessage}</FormMessage>
                            <div className="flex justify-end">
                                <Button type="submit" className="text-white">Sign in</Button>
                            </div>
                        </form >
                    </Form >
                </div>
            </div>
        </div>
    )
}
