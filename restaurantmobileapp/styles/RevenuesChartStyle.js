import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    yAxisTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 10,
        marginLeft: 10,
    },
    xAxisTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        textAlign: 'center',
        marginTop: 5, 
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        height: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
        fontStyle: 'italic',
    },
    tooltip: {
        position: 'absolute',
        bottom: 25, 
        alignSelf: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        zIndex: 999,
    },
    tooltipLabel: {
        color: '#FFD700', 
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    tooltipValue: {
        color: '#FFF', 
        fontSize: 11,
        fontWeight: 'bold',
    }
});