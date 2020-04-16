import * as React from 'react';

import { Icon } from 'react-native-elements'

export class OptionIcon extends React.Component {
    render() {
        return (
            <Icon
                raised
                name={this.props.name}
                size={this.props.size || 25}
                type='font-awesome'
                color={this.props.color || 'orange'}
                onPress={this.props.callback} />
        )
    }
}