import * as React from 'react';
import { SocialIcon } from 'react-native-elements'
import { Linking } from 'react-native';

export class Social extends React.Component {
  render() {
    return (<SocialIcon
      type={this.props.name}
      size={32}
      onPress={() => { this.openSocialLink() }}
    />
    )
  }

  openSocialLink() {
    switch (this.props.name) {
      case 'instagram':
        // if (this.props.instagramUserName != null)
        //   Linking.openURL('instagram://user?username=' + this.props.instagramUserName)
        alert('You curious little human, this is not available yet, but will be soon')
        break;
      case 'facebook':
        // if (this.props.facebookUserId != null)
        // Linking.openURL('fb://page/3147119735300212')
        alert('Got you ! Available soon')

        break;

      default:
        break;
    }
  }

}