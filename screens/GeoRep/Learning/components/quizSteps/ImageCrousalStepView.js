import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const ImageCarousel = ({ value }) => {
    const { width } = Dimensions.get('window');
    const height = width * 0.6;

    const scrollViewRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };

    const scrollToIndex = (index) => {
        scrollViewRef.current.scrollTo({ x: index * width, animated: true });
    };

    return (

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        padding: 25,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5,
    },
    prevButton: {
        position: 'absolute',
        left: 3,
        bottom: '50%',
    },
    nextButton: {
        position: 'absolute',
        right: 3,
        bottom: '50%',
    },
    circle: {
        marginRight: 5
    }
});

export default ImageCarousel;
