import { StyleSheet } from "react-native";

export default StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 6,

        elevation: 2,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2
        },

        borderWidth: 1,
        borderColor: '#f1f1f1',
    },

    title: {
        fontWeight: '700',
        fontSize: 18,
        color: '#333'
    },

    description: {
        color: '#666',
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18
    },

    illustration: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: 'cover'
    },
    contentStyle: {
        paddingLeft: 10,
    }
});
