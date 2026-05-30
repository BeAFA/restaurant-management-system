import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    screenBackground: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    userCard: {
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    actionButtonMargin: {
        marginRight: 10,
    },
    emptyBox: {
        padding: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
    },
    emptyText: {
        color: '#555',
        fontStyle: 'italic',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
});