import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },

    scrollContainer: {
        padding: 16,
        paddingBottom: 40,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
    },

    emptyText: {
        fontSize: 18,
        color: "#666",
        fontWeight: "500",
    },

    // ===== HEADER =====

    headerRow: {
        flexDirection: "row",
        marginBottom: 12,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0E7468",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 16,
    },

    attributeHeaderCell: {
        width: 130,
        padding: 14,
        backgroundColor: "#0E7468",
        justifyContent: "center",
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },

    attributeHeaderText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },

    foodHeaderCell: {
        width: 190,
        padding: 14,
        backgroundColor: "#14b8a6",
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 1,
        borderColor: "#ffffff30",
    },

    foodHeaderText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },

    // ===== BODY =====

    compareRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#dfe4ea",
    },

    attributeCell: {
        width: 130,
        padding: 14,
        backgroundColor: "#eef2f5",
        justifyContent: "center",
    },

    attributeText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333",
    },

    valueCell: {
        width: 190,
        padding: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 1,
        borderColor: "#edf1f3",
        minHeight: 90,
    },

    valueText: {
        fontSize: 14,
        color: "#444",
        textAlign: "center",
        lineHeight: 20,
    },

    // ===== IMAGE =====

    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 14,
        resizeMode: "cover",
    },

    // ===== SPECIAL VALUE STYLES =====

    ratingText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ff9800",
    },

    priceText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#0E7468",
    },

    categoryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2563eb",
        textAlign: "center",
    },

    ingredientText: {
        fontSize: 13,
        color: "#555",
        textAlign: "center",
        lineHeight: 18,
    },

    descriptionText: {
        fontSize: 13,
        color: "#666",
        textAlign: "left",
        lineHeight: 20,
    },

    // ===== BUTTONS =====

    actionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 30,
    },

    clearButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        elevation: 2,
    },

    clearButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },

});