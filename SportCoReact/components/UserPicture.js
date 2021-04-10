import { connect } from 'react-redux';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { DEFAULT_PROFILE_PIC, DEFAULT_PROFILE_PIC_PNG } from '../constants/AppConstants'
import { getFileFromS3 } from '../services/aws3Service';

// curl -X GET "https://graph.facebook.com/oauth/access_token?client_id=294917101510368&client_secret=4e5ec50aa24825a7f407220d792d5d8f&grant_type=client_credentials" 

class UserPicture extends React.Component {

    state = {
        image: null
    }

    componentDidMount() {

        let photo_url_fb = this.props.photoUrl + '?type=large&width=500&height=500&access_token=' + this.props.auth.fb_access_token;
        let photo_url_s3 = getFileFromS3(this.props.isTeamPicture ? 'teams' : 'users', this.props.photoUrlS3);
        let photo_url = this.props.type == 'custom' ? photo_url_s3 : photo_url_fb;
        this.checkImageURL(photo_url);
    }

    render() {
        return (
            <View>
                {this.state.image != null ?
                    (
                        this.state.image
                    ) : (
                        <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={
                            {
                                height: this.props.size,
                                width: this.props.size,
                            }} />
                    )
                }
            </View>)
    }

    checkImageURL(url) {
        let image = null;
        fetch(url)
            .then(res => {
                if (res.status != 200) {
                    image = <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={
                        {
                            height: this.props.size,
                            width: this.props.size,
                        }} />
                } else {
                    image = <Image
                        source={{ uri: `${url}` }}
                        style={{
                            height: this.props.size,
                            width: this.props.size,
                            borderRadius: this.props.size / 2,
                            alignSelf: 'center',
                        }}
                        resizeMode='contain'
                    />
                }
                this.setState({ image: image })
            })
            .catch(err => {
                image = <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={
                    {
                        height: this.props.size,
                        width: this.props.size,
                    }} />
                this.setState({ image: image })
            })
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

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(UserPicture));

const styles = StyleSheet.create({




});


