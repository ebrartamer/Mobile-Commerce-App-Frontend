import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const ImageSlider = ({ slides, onSlidePress }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);

    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const offset = event.nativeEvent.contentOffset.x;
        const activeIndex = Math.floor(offset / slideSize);
        setActiveIndex(activeIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {slides.map((slide, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.slide}
                        onPress={() => onSlidePress(slide)}
                        activeOpacity={0.9}
                    >
                        <Image source={slide.image} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.description}>{slide.description}</Text>
                            <View style={styles.linkContainer}>
                                <Text style={styles.linkText}>{slide.linkText}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex ? styles.paginationDotActive : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    slide: {
        width: width - 32, // Ekran genişliği - padding
        height: 150,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,

    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4
    },
    description: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    linkText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        border:1,
        borderColor:'white',
        borderRadius:10,
        padding:5,
        backgroundColor:'rgba(0,0,0,0.2)'
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4
    },
    paginationDotActive: {
        backgroundColor: '#ff6b00',
        width: 12,
        height: 12,
        borderRadius: 6
    }
});

export default ImageSlider; 