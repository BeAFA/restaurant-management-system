import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 20,
        paddingTop: 60,
    },

    greeting: {
        fontSize: 16,
        color: "#777",
        marginBottom: 8,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#222",
        lineHeight: 40,
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        color: "#8A8A8A",
        marginBottom: 28,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1.5,
        borderColor: "#E5E5E5",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },

    walkIn: {
        borderColor: "#5B5FFF",
    },

    reservation: {
        borderColor: "#E5E5E5",
    },

    qrCard: {
        borderColor: "#E5E5E5",
    },

    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    purpleIcon: {
        backgroundColor: "#ECE9FF",
    },

    greenIcon: {
        backgroundColor: "#E4F5EC",
    },

    orangeIcon: {
        backgroundColor: "#FFF2DE",
    },

    content: {
        flex: 1,
    },

    cardTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222",
        marginBottom: 6,
    },

    cardDesc: {
        fontSize: 15,
        color: "#7B7B7B",
        lineHeight: 22,
    },

    badge: {
        alignSelf: "flex-start",
        marginTop: 10,
        backgroundColor: "#ECE9FF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },

    badgeText: {
        color: "#5B5FFF",
        fontSize: 12,
        fontWeight: "700",
    },

    arrow: {
        fontSize: 24,
        color: "#B5B5B5",
        marginLeft: 10,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        marginBottom: 20,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E2E2",
    },

    dividerText: {
        marginHorizontal: 12,
        color: "#999",
        fontSize: 14,
    },

    footerText: {
        marginTop: 8,
        textAlign: "center",
        color: "#9A9A9A",
        fontSize: 13,
        lineHeight: 20,
    },
});