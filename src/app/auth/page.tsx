'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
// Placeholder icons for social login
import { Chrome, Facebook, Twitter, Loader2 } from 'lucide-react'; // Import Loader2


// Schemas for validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});


type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProviderSubmitting, setSocialProviderSubmitting] = useState<string | null>(null); // Track specific social provider

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log('Login attempt:', data);
    // ** TODO: Implement Firebase Email/Password Login Here **
    // Example using hypothetical firebaseAuth.signInWithEmailAndPassword(data.email, data.password);
    try {
       // Simulate async operation
       await new Promise(resolve => setTimeout(resolve, 1500));
       // await firebaseAuth.signInWithEmailAndPassword(data.email, data.password);
       toast({ title: "Login Successful", description: "Welcome back!" });
       // Redirect user appropriately, e.g., router.push('/profile');
    } catch (error: any) {
       console.error("Login error:", error);
       toast({ title: "Login Failed", description: error.message || "Please check your credentials.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit: SubmitHandler<SignupFormValues> = async (data) => {
     setIsSubmitting(true);
    console.log('Signup attempt:', data);
    // ** TODO: Implement Firebase Email/Password Sign Up Here **
    // Example using hypothetical firebaseAuth.createUserWithEmailAndPassword(data.email, data.password);
     try {
       // Simulate async operation
       await new Promise(resolve => setTimeout(resolve, 1500));
       // await firebaseAuth.createUserWithEmailAndPassword(data.email, data.password);
       toast({ title: "Sign Up Successful", description: "Welcome! Please check your email for verification." });
        // Redirect user appropriately, e.g., router.push('/profile'); or show verification message
    } catch (error: any) {
       console.error("Signup error:", error);
       toast({ title: "Sign Up Failed", description: error.message || "Could not create account.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
        setSocialProviderSubmitting(provider);
        console.log(`Attempting login with ${provider}`);
        // ** TODO: Implement Firebase Social Login Here **
        // Example: const authProvider = new firebase.auth.GoogleAuthProvider();
        // try { await firebaseAuth.signInWithPopup(authProvider); ... } catch { ... }
        toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`, description: `Connecting with ${provider}...` });
         try {
            // Simulate success/failure
            await new Promise(resolve => setTimeout(resolve, 1500));
            // await firebaseAuth.signInWithPopup(provider);
            toast({ title: "Login Successful", description: `Welcome via ${provider}!` });
            // Redirect
         } catch (error: any) {
            toast({ title: "Social Login Failed", description: error.message || `Could not log in with ${provider}.`, variant: "destructive" });
         } finally {
            setSocialProviderSubmitting(null);
         }
    };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
       <Tabs defaultValue="login" className="w-full max-w-md" id="auth-tabs">
          <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="login">Login</TabsTrigger>
             <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
             <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                             <FormControl><Input placeholder=" " type="email" {...field} /></FormControl>
                             <FormLabel>Email</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                             <FormControl><Input placeholder=" " type="password" {...field} /></FormControl>
                            <FormLabel>Password</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full btn-animated btn-animated-accent" disabled={isSubmitting || !!socialProviderSubmitting}>
                         {isSubmitting ? (
                           <>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                           </>
                         ) : 'Login'}
                      </Button>
                    </form>
                 </Form>

                 {/* Social Login Separator */}
                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                 </div>

                 {/* Social Login Buttons */}
                 <div className="grid grid-cols-3 gap-3">
                     <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('google')} disabled={isSubmitting || !!socialProviderSubmitting}>
                         {socialProviderSubmitting === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
                         Google
                    </Button>
                    <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('facebook')} disabled={isSubmitting || !!socialProviderSubmitting}>
                         {socialProviderSubmitting === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Facebook className="mr-2 h-4 w-4" />}
                         Facebook
                    </Button>
                     <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('twitter')} disabled={isSubmitting || !!socialProviderSubmitting}>
                         {socialProviderSubmitting === 'twitter' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" />}
                         Twitter
                    </Button>
                 </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" id="signup"> {/* Added id for deep linking */}
             <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Join ChronoThreads today!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                       <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                             <FormControl><Input placeholder=" " type="email" {...field} /></FormControl>
                            <FormLabel>Email</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                             <FormControl><Input placeholder=" " type="password" {...field} /></FormControl>
                            <FormLabel>Password</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                             <FormControl><Input placeholder=" " type="password" {...field} /></FormControl>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full btn-animated btn-animated-accent" disabled={isSubmitting || !!socialProviderSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                            </>
                          ) : 'Sign Up'}
                      </Button>
                    </form>
                 </Form>

                 {/* Social Login (repeated for consistency) */}
                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                     <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('google')} disabled={isSubmitting || !!socialProviderSubmitting}>
                        {socialProviderSubmitting === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />} Google
                    </Button>
                     <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('facebook')} disabled={isSubmitting || !!socialProviderSubmitting}>
                        {socialProviderSubmitting === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Facebook className="mr-2 h-4 w-4" />} Facebook
                    </Button>
                     <Button variant="outline" className="btn-animated w-full" onClick={() => handleSocialLogin('twitter')} disabled={isSubmitting || !!socialProviderSubmitting}>
                         {socialProviderSubmitting === 'twitter' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" />} Twitter
                    </Button>
                 </div>
              </CardContent>
               <CardFooter className="text-xs text-muted-foreground text-center block">
                   By signing up, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
               </CardFooter>
            </Card>
          </TabsContent>
       </Tabs>
    </div>
  );
}

// Add fade-in animation to globals.css if not already present
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}

// Add spin animation (Tailwind typically includes this by default)
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
*/
```