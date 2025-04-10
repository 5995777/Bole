import React from 'react';
import { View, StyleSheet } from 'react-native';
import SafeAreaHeader from './SafeAreaHeader';
import globalStyles from '../styles/globalStyles';

const SafeAreaWrapper = ({ children, backgroundColor, headerHeight = 0 }) => {
    const containerStyle = [
        styles.container,
        { backgroundColor: backgroundColor || globalStyles.backgroundColor },
    ];

    return (
        <View style={containerStyle}>
            <SafeAreaHeader backgroundColor={backgroundColor || globalStyles.backgroundColor} height={headerHeight} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SafeAreaWrapper;
