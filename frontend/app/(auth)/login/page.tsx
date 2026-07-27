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
import { FaRegEyeSlash } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import Link from 'next/link';
import { WEBSITE_REGISTER, WEBSITE_DASHBOARD } from '@/routes/WebsiteRoute';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import z from 'zod';
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);

  const formSchema = zSchema.login;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { data: loginResponse } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, values, {
        withCredentials: true,
      });

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }

      showToast('success', loginResponse.message || 'Login successful!');
      
      // Redirecting to dashboard
      router.push(WEBSITE_DASHBOARD);
    } catch (error: any) {
      showToast('error', error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <div className="text-3xl font-bold text-primary">Referral</div>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Login to your account to continue.
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
              <div className="space-y-4">
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

                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Login"
                  className="w-full"
                />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href={WEBSITE_REGISTER} className="text-primary underline hover:no-underline">
                      Register!
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

export default LoginPage;