'use client';

import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import { Card, CardTitle, CardContent, CardHeader } from './card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');

      const res = await fetch(`/api/users?email=${email}`);
      const data = await res.json();

      if (data.role === 'tenant') {
        router.push('/listings');
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

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={!email || !password}>
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
