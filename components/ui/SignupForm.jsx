'use client';

import { useState } from 'react';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '@/lib/cognitoConfig';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState('');
  const [role, setRole] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:role', Value: role }),
    ];

    UserPool.signUp(email, password, attributes, null, (err, result) => {
      if (err) {
        toast.error(err.message || "Sign-up failed.");
        return;
      }

      toast.success("Sign-up successful. Please check your email for the code.");
      setAwaitingConfirmation(true);
    });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    const userData = { Username: email, Pool: UserPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, async (err, result) => {
      if (err) {
        toast.error(err.message || "Confirmation failed.");
        return;
      }

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role }),
        });

        if (!response.ok) {
          throw new Error('Failed to save user to DB');
        }

        await signIn(email, password);
        toast.success("Account verified and signed in!");
        router.push(role === 'tenant' ? '/listings' : '/landlordLanding');
      } catch (apiErr) {
        toast.error(apiErr.message || 'API or sign-in error');
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">
          {awaitingConfirmation ? "Confirm Your Account" : "Create Account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!awaitingConfirmation ? (
          <form onSubmit={handleSignup} className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Select onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-2xs">
                <SelectValue placeholder="I am a..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant (looking to rent)</SelectItem>
                <SelectItem value="landlord">Landlord (listing a property)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full"
              disabled={!email || !password || !confirmPassword || !role}
            >
              Sign Up
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter confirmation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={!code}>
              Confirm Email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
