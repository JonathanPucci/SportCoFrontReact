// RootNavigation.js

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function navigateToEvent(event_id) {
  navigate('Event', { eventData: { event: { event_id: event_id } } });

}
