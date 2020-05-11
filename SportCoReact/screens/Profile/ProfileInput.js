

import * as React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { connect } from 'react-redux'

import { styles } from './styles'


class ProfileInput extends React.Component {

    render = () => {
        let { title, placeholderText, data, callbackOnChange, isAdding } = this.props;
        return (
            <View>
                {!this.props.notShowingTitle && <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>}
                <TouchableWithoutFeedback style={styles.inputView}
                    onPress={() => { this[title].focus() }}>
                    <TextInput
                        style={title != 'Friends' && !title.includes( 'Teams') ? styles.textInput : styles.textInputFriends}
                        ref={(input) => { this[title] = input; }}
                        autoFocus={title == 'Friends' || title.includes('Teams') ? isAdding : true}
                        onChangeText={callbackOnChange}
                        defaultValue={data}
                        placeholder={placeholderText}
                        multiline
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(ProfileInput)

