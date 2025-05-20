import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-2_R4GiFenUv', 
  ClientId: '6b5898csks9cd0jmr32e0i60il'     
};

const UserPool = new CognitoUserPool(poolData);

export default UserPool;
