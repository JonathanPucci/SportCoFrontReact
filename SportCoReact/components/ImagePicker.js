import ImagePicker from 'react-native-image-picker';
import React, { Component } from "react";
import { View, Image, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { uploadFileToS3 } from '../services/aws3Service';
import { translate } from '../App';


class ImagePickerTimaka extends Component {

    constructor(props) {
        super(props);
        this.options = {
            title: translate("Select Profile Pic"),
            customButtons: [
                { name: 'defaultPic', title: translate("DontShowMyPics") },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        if (props.hasFBOption)
            this.options.customButtons.push({ name: 'fb', title: translate("useFBProfilePic") });
        if (props.hasS3Option)
            this.options.customButtons.push({ name: 's3', title: translate("useLastPic") });
    }

    showPicker = async () => {
        /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
        ImagePicker.showImagePicker(this.options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this.props.sendImageSource(response.customButton);
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
                <Button title={translate('Select Pic')} onPress={this.showPicker} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(ImagePickerTimaka)

