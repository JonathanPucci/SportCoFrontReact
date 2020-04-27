
import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from '../navigation/RootNavigation.js';
import { withInAppNotification } from 'react-native-in-app-notification';

async function requestUserPermission() {
    const settings = await messaging().requestPermission();

    if (settings) {
        console.log('Permission settings:', settings);
    }
}

class PushNotificationManager extends React.Component {
    componentDidMount() {
        requestUserPermission();
        this.registerDevice();
        this.registerFirebaseEvents();
    }

    registerDevice() {
        messaging()
            .getToken()
            .then(token => {
                this.saveTokenToProps(token)
            });
    }

    registerFirebaseEvents() {
        messaging().onMessage(async remoteMessage => {
            console.log(JSON.stringify(remoteMessage))
            this.props.showNotification({
                title: remoteMessage.notification.title,
                message: remoteMessage.notification.body,
                onPress: () => {
                    let event_id = remoteMessage.data.data_value;
                    if (event_id != undefined)
                        RootNavigation.navigateToEvent(event_id)
                },
                additionalProps: { type: 'error' }
            })
        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage,
            );
            RootNavigation.navigateToEvent(remoteMessage.data.data_value);

        });
    }


    saveTokenToProps = (token) => {
        const action = {
            type: "SAVE_DEVICE_TOKEN",
            value: token,
        };
        this.props.dispatch(action);
    }

    render() {
        const { children } = this.props
        return <View style={{ flex: 1 }}>{children}</View>
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

const mapStateToProps = (state) => ({
    ...state,
    eventDataFromStore: state.eventSaved.eventData
})

export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(PushNotificationManager))

