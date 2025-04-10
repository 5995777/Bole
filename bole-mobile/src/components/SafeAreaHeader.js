import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 安全区域头部组件
 * 用于处理顶部状态栏、刘海屏和灵动岛的安全区域
 */
const SafeAreaHeader = ({ backgroundColor = '#ffffff', height = 0 }) => {
  // 获取安全区域的内边距
  const insets = useSafeAreaInsets();
  
  // 计算顶部安全区域高度
  // 如果是iOS设备，使用安全区域的顶部内边距
  // 如果是Android设备，使用状态栏高度
  const safeAreaHeight = Platform.OS === 'ios' 
    ? insets.top 
    : StatusBar.currentHeight || 24;
  
  // 计算总高度（安全区域高度 + 额外高度）
  const totalHeight = safeAreaHeight + height;
  
  return (
    <View style={[styles.safeArea, { height: totalHeight, backgroundColor }]} />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
});

export default SafeAreaHeader;