import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-2', // ← replace if different
    userPoolId: 'us-east-2_R4GiFenUv', // ← your actual user pool ID
    userPoolWebClientId: '6b5898csks9cd0jmr32e0i60il', // ← your app client ID
  },
});
