'use client';

import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import { Card, CardTitle, CardContent, CardHeader } from './card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth(); // ✅ use signIn from context

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password); // ✅ sets user in context
      toast.success('Successfully signed in!');

      // ✅ Now fetch role from DB and redirect accordingly
      const res = await fetch(`/api/users?email=${email}`);
      const data = await res.json();

      if (data.role === 'tenant') {
        router.push('/tenantLanding');
      } else if (data.role === 'landlord') {
        router.push('/landlordLanding');
      } else {
        toast.error('Unknown role. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Sign-in failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            placeholder="Please enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
