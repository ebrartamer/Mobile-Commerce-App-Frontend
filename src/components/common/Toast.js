import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../../redux/features/error/errorSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { message, type, isVisible } = useSelector((state) => state.error);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        if (isVisible) {
            // Göster
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // 3 saniye sonra otomatik kapat
            const timer = setTimeout(() => {
                handleHide();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleHide = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            dispatch(hideNotification());
        });
    };

    if (!isVisible) return null;

    const getToastStyle = () => {
        switch (type) {
            case 'error':
                return { backgroundColor: '#ff4444' };
            case 'warning':
                return { backgroundColor: '#ffbb33' };
            case 'success':
                return { backgroundColor: '#00C851' };
            case 'info':
                return { backgroundColor: '#33b5e5' };
            default:
                return { backgroundColor: '#333' };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error':
                return 'exclamation-circle';
            case 'warning':
                return 'exclamation-triangle';
            case 'success':
                return 'check-circle';
            case 'info':
                return 'info-circle';
            default:
                return 'info-circle';
        }
    };

    return (
        <Animated.View 
            style={[
                styles.container, 
                getToastStyle(),
                { opacity: fadeAnim }
            ]}
        >
            <View style={styles.content}>
                <Icon name={getIcon()} size={20} color="#fff" style={styles.icon} />
                <Text style={styles.message}>{message}</Text>
            </View>
            <TouchableOpacity onPress={handleHide} style={styles.closeButton}>
                <Icon name="times" size={16} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    message: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    closeButton: {
        marginLeft: 10,
        padding: 5,
    },
});

export default Toast; 