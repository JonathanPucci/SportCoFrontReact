import * as React from 'react';

import { Icon } from 'react-native-elements'

export class OptionIcon extends React.Component {
    render() {
        return (
            <Icon
                raised
                name={this.props.name}
                type='font-awesome'
                color={this.props.color || 'orange'}
                onPress={this.props.callback} />
        )
    }
}