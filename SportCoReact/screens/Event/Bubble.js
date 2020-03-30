import * as React from 'react';
import {View, Text} from "react-native";
import { styles } from './styles'


export default class Bubble extends React.Component {

    render() {
        const { children, selected, horizontal } = this.props;
        return (
            <View
                style={[
                    horizontal ? styles.itemStyleHorizontal : styles.itemStyleVertical,
                    selected &&
                    (horizontal
                        ? styles.itemSelectedStyleHorizontal
                        : styles.itemSelectedStyleVertical)
                ]}
            >
                <Text
                    style={{
                        textAlign: "center",
                        fontSize: selected ? 20 : 17,
                        color: selected ? "black" : "grey",
                        fontWeight: selected ? "bold" : "normal"
                    }}
                >
                    {children}
                </Text>
            </View>
        );
    };

}