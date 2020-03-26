import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';


export default class Fade extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(props.isVisible ? 1 : 0),
        }
    }

    fadeOut = () => {
        Animated.timing(this.state.animation, {
            toValue: 0,
            timing: 400
        }).start()
    }

    fadeIn = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            timing: 400
        }).start()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isVisible !== this.props.isVisible) {
            this.props.isVisible ? this.fadeIn() : this.fadeOut()
        }
    }

    render() {
        const { visible, style, children, ...rest } = this.props;
        const animatedStyle = {
            opacity: this.state.animation
        }
        return (
            <Animated.View style={[style, animatedStyle]} >
                {children}
            </Animated.View>
        )

    }

}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 11

    }
});