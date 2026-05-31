import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerContainer: {
        paddingTop: 20, 
        paddingBottom: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#D92243",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        zIndex: 10, 
    },
    headerTitle: {
        fontSize: 26, 
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 1.2
    },
    footerContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#D92243",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    footerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 1
    },
    footerSubTitle: {
        fontSize: 12,
        color: "#FFD1D8", 
        textAlign: "center",
        marginTop: 4,
    },
    row: {
        flexDirection: "row"
    },
    wrap: {
        flexWrap: "wrap"
    },
    padding: {
        padding: 5
    },
    margin: {
        margin: 5
    },
    subject: {
        fontSize: 24,
        fontWeight: "bold",
        color: "blue",
        textAlign: "center",
        marginTop: 5
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50
    }
});