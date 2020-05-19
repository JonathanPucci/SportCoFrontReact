

import * as React from 'react';
import { View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-elements'

import { connect } from 'react-redux'

import { styles } from './styles'


class ProfileInput extends React.Component {

    render = () => {
        let { title, placeholderText, data, callbackOnChange, isAdding } = this.props;
        return (
            <TouchableWithoutFeedback
                style={styles.inputView}
                onPress={() => { this.input.focus() }}>
                <View >
                    {!this.props.notShowingTitle && <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>}
                    <View style={styles.inputView}>
                        <TextInput
                            style={title != 'Friends' && !title.includes('Teams') ? styles.textInput : styles.textInputFriends}
                            ref={(input) => { this.input = input; }}
                            autoFocus={title == 'Friends' || title.includes('Teams') ? isAdding : !this.props.noautofocus}
                            onChangeText={callbackOnChange}
                            defaultValue={data}
                            placeholder={placeholderText}
                            multiline
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(ProfileInput)

