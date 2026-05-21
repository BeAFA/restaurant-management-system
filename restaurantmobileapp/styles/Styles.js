import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: "#FF6347",
        textAlign: "center",
        letterSpacing: 1.2,
        textShadowColor: "rgba(0,0,0,0.1)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    container: {
        flex: 1,
        marginTop: 50
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