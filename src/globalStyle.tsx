import { StyleSheet } from "react-native"

export const GlobalStyle = StyleSheet.create({
    safeAreaCotainer: {
        backgroundColor: '#fff'
    },
    centerContentPage: {
        backgroundColor: '#ffffff',
        height: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    title: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle: {
        color: '#949494',
        fontSize: 16
    },
    fieldwithIcon: {
        width: "100%",
        height: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        borderRadius: 15
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 30,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: '#05E3D5',
    },
    btntext: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    themeColor: {
        color: '#05E3D5'
    },
    blackColor: {
        color: '#1E1E1E'
    },
    errorMsg: {
        fontSize: 12,
        color: 'red'
    },
    container: {
        margin: 25
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        marginVertical: 10,
    },
    shadowProp: {
        shadowColor: '#555',
        shadowOffset: { width: -5, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5
    },
})
