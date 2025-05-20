'use client';

import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import {Card, CardTitle, CardContent, CardHeader } from './card'
import { useRouter } from 'next/navigation';


import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import  UserPool  from '../../lib/cognitoConfig';


export default function SignInForm() { 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = (e) => { 
      e.preventDefault();

      const user = new CognitoUser({ 
        Username: email,
        Pool: UserPool,
      });

      const authDetails = new AuthenticationDetails({ 
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, { 
        onSuccess: (result) => { 
          const accessToken = result.getAccessToken().getJwtToken();
          toast.success("Successfully signed in!");
          console.log('Access Token:', accessToken);
          router.push('/tenantLanding');  // ✅ Corrected here
        },
        onFailure: (err) => { 
          toast.error(err.message || "Sign in failed, please try again later.");
        },
      });
};

    return ( 
        <Card className='w-full max-w-md mx-auto mt-10'> 
           <CardHeader> 
             <CardTitle className='text-2xl'> Sign in </CardTitle>    
           </CardHeader>

           <CardContent > 
                <form onSubmit={handleSignIn} className='space-y-4'> 
                
                <Input 
                type='email'
                placeholder = 'Please enter your UNB email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <Input 
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <Button type='submit' className='w-full'>Sign in</Button>

                </form>
           </CardContent>
        </Card>
    );  
}