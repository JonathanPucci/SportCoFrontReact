import ImagePicker from 'react-native-image-picker';
import React, { Component } from "react";
import { View, Image, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { uploadFileToS3 } from '../services/aws3Service';

const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class ImagePickerTimaka extends Component {

    showPicker = async () => {
        /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                // if (this.props.saveToS3OnSelect)
                //     await uploadFileToS3(source.uri, this.props.imageNameForS3, this.props.sendImageSource)
                this.props.sendImageSource(source.uri);
            }
        });
    }


    render() {

        return (
            <View>
                <Button title='Select Pic' onPress={this.showPicker} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(ImagePickerTimaka)

