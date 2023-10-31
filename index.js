/**
 * @format
 */

import { AppRegistry, View } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import firebase from '@react-native-firebase/app';
import { StripeProvider } from '@stripe/stripe-react-native';

const stripeConfig = {
    publishableKey: 'pk_test_51NRgP3I4pl9St4X5tRl1qNsjmnxzV82nIapO2iFD9TeD7nvmxnTTs1agR8ERJhsSO5xwV50xy1oPIBFUGdQL98xg00MTxdRLH3',
};
const firebaseConfig = {
    apiKey: "AIzaSyA5sBOIt1fXpYGll4Kb_808VXSwly-M37o",
    authDomain: "augmented-path-394512.firebaseapp.com",
    projectId: "augmented-path-394512",
    storageBucket: "augmented-path-394512.appspot.com",
    messagingSenderId: "74948872445",
    appId: "1:74948872445:web:cb5e9faec29baf0a8c5694",
    measurementId: "G-2L2WT6S6ZY"
};
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig)
    } catch (error) {
        console.log(error)
    }
}
const persistedStore = persistStore(store);
const ReduxApp = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
            <StripeProvider {...stripeConfig}>
                <App />
            </StripeProvider>
        </PersistGate>
    </Provider>
)
AppRegistry.registerComponent(appName, () => ReduxApp);
