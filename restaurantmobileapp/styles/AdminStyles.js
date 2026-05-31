import { StyleSheet } from 'react-native';
 



export const Colors = {
    primary:        '#D92243', 
    accent:         '#F69D39', 
    secondary:      '#E0C375', 
    background:     '#FFF5E5', 
    surface:        '#FFFFFF', 
    textPrimary:    '#1A1A1A', 
    textSecondary:  '#555555', 
    textMuted:      '#888888', 
    border:         '#E0C375', 
    success:        '#2e7d32', 
    successBg:      '#e8f5e9', 
    danger:         '#D92243', 
    link:           '#D92243', 
};
 



export default StyleSheet.create({
 
    
    
    
    screenBackground: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.background,
    },
    checkinContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    flexOne: {
        flex: 1,
    },
    centeredColumn: {
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
 
    
    
    
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        color: Colors.textPrimary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: Colors.textPrimary,
    },
    checkinTitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.textPrimary,
    },
    noDataText: {
        fontStyle: 'italic',
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 20,
    },
    subtitleText: {
        color: Colors.textSecondary,
    },
    boldText: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
 
    
    
    
    userCard: {
        marginBottom: 10,
        backgroundColor: Colors.surface,
        elevation: 2,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
        backgroundColor: Colors.surface,
    },
    gridCard: {
        flex: 0.48,
        elevation: 2,
        backgroundColor: Colors.surface,
    },
    dishCard: {
        marginBottom: 8,
        backgroundColor: Colors.surface,
    },

    highlightCard: {
        backgroundColor: Colors.successBg,
        marginTop: 15,
    },
    highlightTitle: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    highlightValue: {
        color: Colors.success,
        fontSize: 24,
    },
    highlightLabel: {
        fontWeight: 'bold',
        color: Colors.accent,
    },
    statNumber: {
        fontSize: 22,
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 13,
        color: Colors.textMuted,
    },
 
    
    
    
    actionButtonMargin: {
        marginRight: 10,
    },
    filterBtn: {
        flex: 1,
        marginHorizontal: 2,
    },
    qrButtonMargin: {
        marginTop: 15,
    },
 
    
    
    
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dateBox: {
        flex: 0.48,
        padding: 12,
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.link,
    },
 
    
    
    
    dropdownContainer: {
        marginBottom: 10,
    },
    dropdownLabel: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.textPrimary,
    },
    pickerWrapper: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
 
    
    
    
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
 
    
    
    
    foodTitle: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    foodMetaText: {
        color: Colors.textMuted,
        fontSize: 13,
    },
    ratingText: {
        color: Colors.accent,
        fontSize: 13,
    },
    dishRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    revenueText: {
        fontWeight: 'bold',
        color: Colors.success,
        fontSize: 16,
    },
 
    
    
    
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    switchLabel: {
        fontWeight: 'bold',
        color: Colors.textSecondary,
        fontSize: 15,
    },
    checkinInput: {
        marginBottom: 20,
    },
    emptyBox: {
        padding: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
 
    
    
    
    loadingIndicator: {
        marginTop: 20,
    },
});