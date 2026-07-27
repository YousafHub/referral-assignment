'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { zSchema } from '@/lib/zodSchema';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import ButtonLoading from '@/components/ButtonLoading';
import { z } from 'zod';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import Link from 'next/link';
import { WEBSITE_DASHBOARD, WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import axios from 'axios';


const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true);
    const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true);

    const formSchema = zSchema.register
        .extend({
            confirmPassword: z.string().min(1, 'Please confirm your password'),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            referralCode: '',
        },
    });


    const handleRegisterSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const { confirmPassword, ...registerData } = values;

            const { data: registerResponse } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, registerData, {
                withCredentials: true
            })
            if (!registerResponse.success) {
                throw new Error(registerResponse.message);
            }

            showToast("success", registerResponse.message)

            router.push(WEBSITE_DASHBOARD)
        } catch (error: any) {
            showToast('error', error.response?.data?.message || error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card className="w-[400px] shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                    {/* Replace with your logo */}
                    <div className="text-3xl font-bold text-primary">Referral</div>
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Create new account by filling out the form below.
                    </p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
                            <div className="space-y-4">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="John Doe" {...field} />
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
                                                <Input type="email" placeholder="example@gmail.com" {...field} />
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
                                        <FormItem className="relative">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={isTypePassword ? 'password' : 'text'}
                                                    placeholder="**********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                className="cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2"
                                                type="button"
                                                onClick={() => setIsTypePassword(!isTypePassword)}
                                            >
                                                {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={isTypeConfirmPassword ? 'password' : 'text'}
                                                    placeholder="**********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                className="cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2"
                                                type="button"
                                                onClick={() => setIsTypeConfirmPassword(!isTypeConfirmPassword)}
                                            >
                                                {isTypeConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Referral Code (Optional) */}
                                <FormField
                                    control={form.control}
                                    name="referralCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Referral Code (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter referral code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <ButtonLoading
                                    loading={loading}
                                    type="submit"
                                    text="Create Account"
                                    className="w-full"
                                />

                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <Link href={WEBSITE_LOGIN} className="text-primary underline hover:no-underline">
                                            Login!
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    );
};

export default RegisterPage;