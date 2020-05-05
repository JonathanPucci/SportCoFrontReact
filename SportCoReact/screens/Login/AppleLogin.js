import * as React from 'react';
import { View } from 'react-native';
import { firebase as RNfbauth } from '@react-native-firebase/auth';
import firebase from 'firebase';
import { logDebugInfo, logDebugError } from '../Event/Helpers';

import appleAuth, {
    AppleButton,
    AppleAuthRequestScope,
    AppleAuthRequestOperation,
    AppleAuthError

} from '@invertase/react-native-apple-authentication';

/**
 * Note the sign in request can error, e.g. if the user cancels the sign-in.
 * Use `AppleAuthError` to determine the type of error, e.g. `error.code === AppleAuthError.CANCELED`
 */
const onAppleButtonPress = async (saveToBackendUser) => {
    // 1). start a apple sign-in request
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        // 2). if the request was successful, extract the token and nonce
        const { identityToken, nonce } = appleAuthRequestResponse;
        // console.log("---appleAuthRequestResponse----");
        // console.log(JSON.stringify(appleAuthRequestResponse.fullName));
        // can be null in some scenarios
        if (identityToken) {
            // 3). create a Firebase `AppleAuthProvider` credential
            const appleCredential = RNfbauth.auth.AppleAuthProvider.credential(identityToken, nonce);
            // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
            //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
            //     to link the account to an existing user
            const userCredential = await RNfbauth.auth().signInWithCredential(appleCredential);
            // const userCredentialfb = await firebase.auth().signInWithCredential(appleCredential);
            // console.log("---Apple User----")
            // console.log(JSON.stringify(userCredential.user));
            if (userCredential.user.displayName == null)
                await updateProfile(userCredential, appleAuthRequestResponse.fullName, saveToBackendUser);
            // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
            // console.log(`Firebase authenticated via Apple user : `);
            // console.log("-----DONE-----")
        } else {
            // console.log('identityToken ' + identityToken);// handle this - retry?
        }
    } catch (error) {
        console.log('ERROR AT APPLE LOGIN');
        console.log(error)
        if (error.code === AppleAuthError.CANCELED) {
            console.log("CANCELED");
        }
        if (error.code === AppleAuthError.FAILED) {
            console.log("FAILED");
        }
        if (error.code === AppleAuthError.INVALID_RESPONSE) {
            console.log("INVALID_RESPONSE");
        }
        if (error.code === AppleAuthError.NOT_HANDLED) {
            console.log("NOT_HANDLED");
        }
        if (error.code === AppleAuthError.UNKNOWN) {
            console.log("UNKNOWN");
        }
    }

}

const updateProfile = async (userCredentials, fullName, saveToBackendUser) => {
    if (userCredentials.user) {
        // console.warn(userCredentials.user);
        let displayName = buildName(fullName);
        await RNfbauth.auth().currentUser.updateProfile({
            displayName: displayName,
            // photoURL: "https://example.com/jane-q-user/profile.jpg"
        });
        await RNfbauth.auth().currentUser.reload();
        logDebugInfo('RIGHTNOW', RNfbauth.auth().currentUser.providerData);
        saveToBackendUser({
            displayName: displayName,
            email: RNfbauth.auth().currentUser.email,
            photoURL: null,
            providerData: [{ email: RNfbauth.auth().currentUser.providerData[0].email }]
        });
    }
}

function buildName(fullName) {
    return fullName.givenName + ' ' + fullName.familyName;
}

export class AppleLogin extends React.Component {

    render() {// your component that renders your social auth providers
        let saveCallback = this.props.saveToBackendUser;
        return (
            <View style={{ alignItems: 'center' }}>
                {/* Render your other social provider buttons here */}
                {appleAuth.isSupported && (
                    <AppleButton
                        cornerRadius={5}
                        style={{ width: 200, height: 60 }}
                        buttonStyle={AppleButton.Style.WHITE}
                        buttonType={AppleButton.Type.SIGN_IN}
                        onPress={() => { onAppleButtonPress(saveCallback); }}
                    />
                )}
            </View>
        );
    }
}