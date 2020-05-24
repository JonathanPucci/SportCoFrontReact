import * as React from 'react';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import PushNotificationManager from './services/PushNotificationManager'

import AppNavigator from './navigation/AppNavigator'
import { Platform, KeyboardAvoidingView } from 'react-native';
import { APP_URL } from './constants/AppConstants'
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import DefaultNotificationBody from './NotificationBodyComponent';
import AdMobManager from './services/AdMob/AdMobManager';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationGetters = {
  en: () => require('./src/translations/en.json'),
  fr: () => require('./src/translations/fr.json')
}

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

const setI18nConfig = () => {
  const fallback = { languageTag: 'en' }
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}

export default class App extends React.Component {

  render() {
    return (
      <InAppNotificationProvider notificationBodyComponent={DefaultNotificationBody} iconApp={require('./assets/images/newLogoTim800.png')}>
        <Provider store={Store}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "padding"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS == "ios" ? -1000 : -500}
          >
            <AdMobManager />
            <PushNotificationManager>
              <AppNavigator uriPrefix={APP_URL} />
            </PushNotificationManager>
          </KeyboardAvoidingView>
        </Provider>
      </InAppNotificationProvider>
    )
  }

  constructor() {
    super();
    this.state = {
      expoPushToken: '',
      notification: {},
    };
    setI18nConfig()
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange)
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange)
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch(error => {
        console.error(error)
      })
  }
}