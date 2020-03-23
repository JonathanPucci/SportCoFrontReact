
import * as React from 'react';
import {  View } from 'react-native';

import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons'
import { Component } from 'react';
import Colors from '../constants/Colors';

export default class Icon extends Component{

    render(){
        let type = this.props.type;
        return(
            <View>
                { type == 'Ionicons' && (<Ionicons
              name={this.props.name}
              size={50}
              color={this.props.selected ? Colors.tabIconSelected : Colors.tabIconDefault}
            />)}
            { type == 'MaterialCommunityIcons' && (<MaterialCommunityIcons
              name={this.props.name}
              size={50}
              color={this.props.selected ? Colors.tabIconSelected : Colors.tabIconDefault}
            />)}
            </View>
            
        );
    }
}