import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 15,
    },

    tableInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",

        backgroundColor: "#E3F2FD",

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderRadius: 14,

        marginBottom: 18,
    },

    emptyTableContainer: {
        flexDirection: "row",
        alignItems: "center",

        marginBottom: 18,
    },

    card: {
        flexDirection: "row",

        backgroundColor: "#fff",

        borderRadius: 20,

        padding: 14,

        marginBottom: 16,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,

        elevation: 3,
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 18,
    },

    infoContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "space-between",
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },

    rating: {
        marginTop: 4,
        color: "#777",
        fontSize: 13,
    },

    price: {
        marginTop: 6,
        fontSize: 15,
        color: "#1976D2",
        fontWeight: "700",
    },

    subtotal: {
        marginTop: 6,
        fontSize: 14,
        color: "#444",
        fontWeight: "600",
    },

    quantityWrapper: {
        marginTop: 12,

        flexDirection: "row",
        alignItems: "center",

        alignSelf: "flex-start",

        backgroundColor: "#F5F7FA",

        borderRadius: 30,

        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    quantityButton: {
        width: 30,
        height: 30,

        borderRadius: 15,

        backgroundColor: "#1976D2",

        justifyContent: "center",
        alignItems: "center",
    },

    quantityText: {
        marginHorizontal: 16,

        fontSize: 17,
        fontWeight: "bold",

        color: "#222",
        minWidth: 20,

        textAlign: "center",
    },

    bottomBar: {
        flexDirection: "row",

        paddingTop: 10,
        paddingBottom: 20,

        backgroundColor: "#f2f4f6",
    },

    clearCartButton: {
        flex: 1,

        backgroundColor: "#EF5350",

        paddingVertical: 15,

        borderRadius: 16,

        alignItems: "center",
    },

    addToCartButton: {
        flex: 1.4,

        backgroundColor: "#1976D2",

        paddingVertical: 15,

        borderRadius: 16,

        alignItems: "center",
    },

    addToCartText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});