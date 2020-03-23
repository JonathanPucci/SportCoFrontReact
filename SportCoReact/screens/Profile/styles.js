import { StyleSheet } from 'react-native';
import Layout from '../../constants/Layout'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    basicInfoContainer: {
        flexDirection: 'row',
        alignContent: 'space-around'
    },
    basicInfo: {
        flexDirection: 'column',
        marginTop: 20
    },
    text: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 120,
        width: 120,
        borderWidth: 1,
        borderRadius: 60,

    },
    name: {
        color: '#5E5E5E',
        alignSelf: 'flex-start',
        marginLeft: 30,
    },
    desc: {
        color: '#5E5E5E',
        alignSelf: 'flex-start',
        marginTop: 5,
        marginHorizontal: 30,
        fontSize: 14,
    },
    divider: {
        backgroundColor: '#C0C0C0',
        width: Layout.window.width - 60,
        margin: 20,
    },
    bottom:{
        flex:1,
        justifyContent: 'flex-end',
    },
    socialLinks: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: Layout.window.width,
        marginLeft: 40,
    },
    iconContainer: {
        paddingHorizontal: 8,
        paddingVertical: 15,
    },
    sports: {
        flex:1,
        flexDirection: 'column'
    },
    sport: {
        alignItems:'center'
    },
    sportLine: {
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});
