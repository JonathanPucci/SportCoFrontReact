import * as React from 'react';
import { Icon } from 'react-native-elements'

export const Social = ({ name }) => (
    <Icon
      name={name}
      type="font-awesome"
      containerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 15,
      }}
      size={32}
    />
  )