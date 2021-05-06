import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import { AuthContext } from '../App';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token') || 'invalid';

    async function fetchMeAPI() {
      const meResponse = await fetch(
        Constants.manifest.extra.API_ENDPOINT + '/users/me', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          }
      })

      const userData = await meResponse.json();

      setUserData(userData.data);
    }

    fetchMeAPI()
  }, []);

  if (!userData) {
    return <div></div>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello { userData.fullName }</Text>
      <Image
        style={styles.logo}
        source={userData.avatarUrl}
      />
      <Text>Email: { userData.email }</Text>

      <Button
        onPress={signOut}
        title="Sign Out"
        color="#841584"
        accessibilityLabel="Sign Out"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
});