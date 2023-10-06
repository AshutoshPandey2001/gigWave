import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from "react-native";


export const requestUserPermission = async () => {

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS

  try {
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      // console.log('Permission already granted', hasPermission);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);

      }
      return true
    } else {
      const status = await PermissionsAndroid.request(permission);
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);

        }
        console.log('Permission granted', status);
        return true
      } else {
        console.log('Permission denied');
        return false
      }
    }
  } catch (error) {
    console.error('Error checking or requesting permission:', error);
  }

};
export const getFcmToken = async () => {
  try {
    const newFcmToken = await messaging().getToken();
    console.log(newFcmToken);
    return newFcmToken;
  } catch (error) {
    console.error(error, 'error-----------------------');
    return null;
  }
};

export const notificationListener = () => {

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Quiet and Background State -> Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    })
    .catch(error => console.log('failed', error));

  // Foreground State
  messaging().onMessage(async remoteMessage => {
    console.log('foreground', remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

export const sendPushNotification = async (token: string, title: string, body: string) => {
  //console.log("token==>", token);

  const FIREBASE_API_KEY = "AAAAEXNNCP0:APA91bFZFFmtaN96EOKtWj8mDFkHUHEEtvUJ-nRvTYsY4ALW60irxIuuR6JXwTHWwBlWvbhMCmFoKYgFI4yj5hM_8giGGSkr0iCrTs-sL_mV-AG-R_NUc-zc8xMV9iqPvlYo5h-80iIj"

  const message = {
    registration_ids: [token],
    notification: {
      title: title,
      body: body,
      vibrate: 'default',
      sound: 'default',
      show_in_foreground: true,
      priority: "high",
      content_available: true
    }
  };


  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "key=" + FIREBASE_API_KEY
  });

  let response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers,
    body: JSON.stringify(message)
  });
  // console.log("=><*", response);
  response = await response.json();
  console.log("=><*", response);
};