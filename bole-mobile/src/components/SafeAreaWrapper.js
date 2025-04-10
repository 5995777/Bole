import React from 'react';
import { View, StyleSheet } from 'react-native';
import SafeAreaHeader from './SafeAreaHeader';

/**
 * 安全区域包装组件
 * 用于包装页面内容，确保顶部有适当的安全区域
 */
const SafeAreaWrapper = ({ 
  children, 
  backgroundColor = '#ffffff', 
  headerHeight = 0,
  contentBackgroundColor = '#f5f5f5'
}) => {
  return (
    <View style={[styles.container, { backgroundColor: contentBackgroundColor }]}>
      <SafeAreaHeader backgroundColor={backgroundColor} height={headerHeight} />
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