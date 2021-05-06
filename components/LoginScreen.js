import React from 'react';
import { View } from 'react-native';
import FacebookLogin from 'react-facebook-login';
import Constants from 'expo-constants';
import { AuthContext } from '../App';
import { requestHeader } from '../.expo-shared/request-header'

export default function LoginScreen() {
  const { signIn } = React.useContext(AuthContext);

  const responseFacebook = async (response) => {
    try {
      const { accessToken } = response;

      const requestData = {
        token: accessToken
      }

      const apiResponse = await fetch(Constants.manifest.extra.API_ENDPOINT + '/auth/facebook', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify(requestData),
      });

      const apiResponseJson =  await apiResponse.json();

      const { token } = apiResponseJson.data;

      signIn(token);

    } catch (error) {
      console.error('Login Error: ', error)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FacebookLogin
        appId={Constants.manifest.extra.FACEBOOK_APP_ID}
        callback={responseFacebook} />
    </View>
  );
}
