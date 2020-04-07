
import * as React from 'react';
import { View } from 'react-native';

import { Ionicons, MaterialCommunityIcons, Entypo } from 'react-native-vector-icons'
import { Component } from 'react';
import Colors from '../constants/Colors';

export default class Icon extends Component {

  render() {
    let type = this.props.type;
    let size = this.props.size || 50;

    return (
      <View>
        {type == 'Ionicons' && (<Ionicons
          name={this.props.name}
          size={size}
          color={this.props.selected ? Colors.tabIconSelected : Colors.tabIconDefault}
        />)}
        {type == 'Entypo' && (<Entypo
          name={this.props.name}
          size={size}
          color={this.props.selected ? Colors.tabIconSelected : Colors.tabIconDefault}
        />)}
        {type == 'MaterialCommunityIcons' && (<MaterialCommunityIcons
          name={this.props.name}
          size={size}
          color={this.props.selected ? Colors.tabIconSelected : Colors.tabIconDefault}
        />)}
      </View>

    );
  }
}