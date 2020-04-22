
import React from 'react'
import { Platform, View } from 'react-native'
import { Notifications } from 'react-native-notifications'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
    const settings = await messaging().requestPermission();

    if (settings) {
        console.log('Permission settings:', settings);
    }
}

class PushNotificationManager extends React.Component {
    componentDidMount() {
        if (Platform.OS == 'ios') {
            requestUserPermission();
            this.registerIosDevice();
            this.registerIosFirebaseEvents();
        } else {
            this.registerAndroidDevice()
            this.registerAndroidNotificationEvents()

        }
    }

    registerIosDevice() {
        messaging()
            .getToken()
            .then(token => {
                this.saveTokenToProps(token)
            });
    }

    registerIosFirebaseEvents() {
        messaging().onMessage(async remoteMessage => {
            alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
    }

    registerAndroidDevice = () => {
        Notifications.events().registerRemoteNotificationsRegistered(event => {
            // TODO: Send the token to my server so it could send back push notifications...
            console.log(Platform.OS + 'Device Token Received', event.deviceToken)
            console.log(new Date())
            this.saveTokenToProps(event.deviceToken)
        })
        Notifications.events().registerRemoteNotificationsRegistrationFailed(event => {
            console.error(event)
        })
        Notifications.registerRemoteNotifications()
    }

    saveTokenToProps = (token) => {
        const action = {
            type: "SAVE_DEVICE_TOKEN",
            value: token,
        };
        this.props.dispatch(action);
    }

    registerAndroidNotificationEvents = () => {
        Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
            console.log(Platform.OS + 'Notification Received - Foreground', notification)
            // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
            completion({ alert: true, sound: false, badge: false })
        })

        Notifications.events().registerNotificationOpened((notification, completion) => {
            console.log(Platform.OS + 'Notification opened by device user', notification)
            console.log(Platform.OS + `Notification opened with an action identifier: ${notification.identifier}`)
            completion()
        })

        Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
            console.log(Platform.OS + 'Notification Received - Background', notification)

            // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
            completion({ alert: true, sound: true, badge: false })
        })

        Notifications.getInitialNotification()
            .then(notification => {
                console.log(Platform.OS + 'Initial notification was:', notification || 'N/A')
            })
            .catch(err => console.error(Platform.OS + 'getInitialNotifiation() failed', err))
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

export default connect(mapStateToProps, mapDispatchToProps)(PushNotificationManager)

