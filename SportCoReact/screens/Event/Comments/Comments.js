
import * as React from 'react';
import { TextInput, Text, View, Image } from 'react-native';
import { styles } from './styles'
import { timeSince } from '../Helpers'
import { DescriptionText } from '../DescriptionText/DescriptionText'
import { OptionIcon } from '../OptionIcon'
import { DEFAULT_PROFILE_PIC } from '../../../constants/AppConstants';
import ProfilePic from '../../Profile/ProfilePic';
import { translate } from '../../../App';

export class Comments extends React.Component {


  constructor(props) {
    super(props);
    this.state = {

    };

  }


  /*********************************************************************************
  *************************                   ***************************************
  ********************       RENDER      ************************************
  *************************                   ***************************************
  **********************************************************************************/


  render() {
    let comments = this.props.comments.slice()
      .sort((a, b) => {
        if (a == 'NEW')
          return 1;
        if (b == 'NEW')
          return -1;
        else
          return (new Date(a.date)) - (new Date(b.date));
      });
    // console.log(comments)
    return (
      <View style={{ marginTop: 30 }}>
        <DescriptionText title={'Comments'} data='' centered='auto' isMutable={false} setEditingProperty={this.props.setEditingProperty} />
        {comments.map((comment, index) => {
          let photoUrl = comment.photo_url;
          let fb_access_token = comment.fb_access_token;

          return (
            <View key={"comment-" + index} style={styles.commentBloc}>
              <View style={styles.commentInfo}>
                <View style={{ flexDirection: 'row' }}>
                  {/* <View style={styles.imageContainerComment}>
                    {photoUrl != undefined ?
                      <Image source={{ uri: photoUrl + '?type=large&width=500&height=500&access_token='+fb_access_token }} style={styles.imageComment} />
                      : <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageCommentNoBorder} />}
                  </View> */}
                  <ProfilePic
                    edition={false}
                    user={comment}
                    stylePic={styles.imageComment}
                    styleDefault={styles.imageCommentNoBorder}
                    styleContainer={styles.imageContainerComment}
                  />
                  <Text style={styles.commentUserName}>{comment.user_name.split(' ')[0]} : </Text>
                </View>
                <Text style={styles.commentDate}>{timeSince(comment.isNew ? new Date() : new Date(comment.date))}</Text>
                {comment.isNew && (
                  <View style={{ flexDirection: 'row' }}>
                    <OptionIcon name='check' color='green' callback={this.props.validateComment} />
                    <OptionIcon name='remove' color='red' callback={this.props.cancelComment} />
                  </View>
                )}
              </View>
              <View style={{ width: '75%' }}>
                {comment.isNew ?
                  (<View style={{
                    borderBottomColor: '#000000',
                    borderBottomWidth: 0.5,
                    width: '75%'
                  }}>
                    <TextInput
                      multiline
                      numberOfLines={3}
                      editable
                      maxLength={300}
                      height={50}
                      onChangeText={this.props.onCommentChangeText}
                      value={comments[comments.length - 1].comment_text}
                    />
                  </View>) :
                  <Text numberOfLines={3} style={styles.commentText}>{comment.comment_text}</Text>
                }
              </View>
            </View>
          )
        })}
        {(this.props.canCommentAlready && (
          !comments.length ||
          (comments.length && !comments[comments.length - 1].isNew))) &&
          <View style={{ flex: 1 }}>
            <OptionIcon name='plus' color='blue' callback={this.props.addComment} />
          </View>
        }
        {!this.props.canCommentAlready &&
          <View style={{ flex: 1, alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center' }}>{translate('First submit your event, then comments will be available')}</Text>
          </View>
        }
      </View>
    )
  }

}

