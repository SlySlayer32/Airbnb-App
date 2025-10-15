import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  onPress: () => void;
}

export default function HamburgerMenuButton({ isOpen, onPress }: HamburgerMenuButtonProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const opacity = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 1],
  });

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      accessibilityRole="button"
      accessibilityHint="Opens or closes the navigation menu"
    >
      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name={isOpen ? 'close' : 'menu'}
            size={28}
            color="#1f2937"
            style={{ opacity }}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1000,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

