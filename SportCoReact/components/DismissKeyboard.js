import * as React from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';

export const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => {console.log('click');Keyboard.dismiss()}}>
    {children}
  </TouchableWithoutFeedback>
);