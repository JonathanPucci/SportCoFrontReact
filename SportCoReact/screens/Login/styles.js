import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: 'blue'
  },
  containerMenu: {
    paddingTop: 30,
    backgroundColor: 'blue'
  },
  title: {
    marginTop: 30,
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  titleEnd: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  button: {
    flex: 1,
    backgroundColor: 'red',
    width: '70%',
    marginVertical: 10,
    marginLeft: '15%'
  },
  buttonRegister: {
    backgroundColor: 'white',
    width: '70%',
    marginTop: 0,
    marginLeft: '15%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  buttonTextRegister: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default styles;
