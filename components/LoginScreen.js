import React from 'react';
import { View } from 'react-native';
import FacebookLogin from 'react-facebook-login';
import Constants from 'expo-constants';
import { AuthContext } from '../App';

const requestHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export default function LoginScreen({ navigation }) {

  const { signIn } = React.useContext(AuthContext);

  const responseFacebook = async (response) => {
    try {
      const { name, id, picture, email } = response;

      const requestData = {
        uid: id,
        fullName: name,
        avatarUrl: picture.data.url,
        email: email,
        provider: 'facebook'
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
        fields="name,email,picture"
        callback={responseFacebook} />
    </View>
  );
}
