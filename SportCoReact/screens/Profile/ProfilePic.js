

import * as React from 'react';
import { Image, View } from 'react-native';

import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import { getFileFromS3 } from '../../services/aws3Service';
import { connect } from 'react-redux'


class ProfilePic extends React.Component {


    render() {
        let { edition, photoDraft, photo_to_useDraft, user, stylePic, styleDefault, styleContainer } = this.props;
        let photoSource = '';
        let resizeMode = 'contain';
        let imageStyle = stylePic;
        switch (edition ? photo_to_useDraft : user.photo_to_use) {
            case 'default':
                photoSource = DEFAULT_PROFILE_PIC;
                imageStyle = styleDefault;
                break;
            case 'fb':
                photoSource = { uri: user.photo_url + '?type=large&width=500&height=500&access_token=' + this.props.auth.fb_access_token };
                break;
            case 'custom':
                resizeMode = 'cover';
                photoSource = { uri: edition ? photoDraft : getFileFromS3('users', user.photo_url_s3) };
                break;
            default:
                break;
        }
        let IMAGE =  <Image source={photoSource} resizeMode={resizeMode} style={imageStyle} />;
        return (
            <View style={styleContainer}>
                {photoSource != '' &&
                    (
                       IMAGE
                    )}
            </View>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        dispatch: action => {
            dispatch(action);
        }
    };
};

function mapStateToProps(state) {
    return state;
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(ProfilePic));
