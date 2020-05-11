// RootNavigation.js

import * as React from 'react';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function navigateToEvent(event_id, onGoBackCallback) {
  navigate('Event', { eventData: { event: { event_id: event_id } }, onGoBackCallback: onGoBackCallback });
}

export function navigateToProfile(email, onGoBackCallback) {
  navigate('Profile', { email: email, onGoBackCallback: onGoBackCallback });
}


export function navigateToTeam(team_id, onGoBackCallback) {
  navigate('Team', { team_id: team_id, onGoBackCallback: onGoBackCallback });
}

