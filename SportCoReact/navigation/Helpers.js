// OUR HELPER FUNCTION CONTAiNING AlL INDIVIDUAL 
// ANIMATION EFFECTS

import { Dimensions } from 'react-native';
const WIDTH_CENTER = Dimensions.get('window').width / 2;
const HEIGHT_CENTER = 100;



export const cardStyleInterpolatorHelper = ({ current, next, }) => {
  return ({
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 1],
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            })
            : 1,
        },
      ],
    },
  });
}


export const headerStyleInterpolatorHelper = ({ current, next, }) => ({
  leftButtonStyle: {
    opacity: current.progress,
    transform: [
      {
        scale: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 1],
        }),
      },
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 0],
        }),
      },
      {
        translateX: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, WIDTH_CENTER - 20],
          })
          : 1,
      },
      {
        translateY: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, HEIGHT_CENTER],
          })
          : 1,
      },
      {
        scale: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          })
          : 1,
      },
    ],
  },
  titleStyle: {
    opacity: current.progress,
    transform: [
      {
        scale: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 1],
        }),
      },
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
      {
        translateY: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, HEIGHT_CENTER],
          })
          : 1,
      },
      {
        scale: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          })
          : 1,
      },
    ],
  },
});