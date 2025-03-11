import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const boxWidth = (width - 32) / 4; // 4 kutu yan yana ve toplam 32px padding

const ActionBox = ({ title, icon, color, onPress }) => {
    // Gelen rengin daha açık tonunu oluştur
    const lightColor = `${color}33`; // 33 hex değeri %20 opaklık verir
    
    return (
        <TouchableOpacity style={styles.box} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: lightColor , shadowColor: color }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        width: boxWidth,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        marginTop: 8,
        color: '#333',
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center'
    }
});

export default ActionBox;