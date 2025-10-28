import { PanGestureHandler, State } from 'react-native-gesture-handler';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface SwipeGestureHandlerProps {
  children: React.ReactNode;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isSidebarOpen: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const EDGE_THRESHOLD = 20; // Pixels from edge to trigger swipe
const SWIPE_THRESHOLD = 50; // Minimum swipe distance to trigger action

export default function SwipeGestureHandler({
  children,
  onSwipeRight,
  onSwipeLeft,
  isSidebarOpen,
}: SwipeGestureHandlerProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastGestureX = useRef(0);
  const [isGestureActive, setIsGestureActive] = useState(false);

  const handleGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { translationX: translateX } }], {
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationX, x } = event.nativeEvent;
        // Show visual feedback when swiping from edge
        if (Math.abs(translationX) > 10 && !isGestureActive) {
          setIsGestureActive(true);
          // Light haptic when gesture is recognized from edge
          const isFromLeftEdge = x <= EDGE_THRESHOLD;
          const isFromRightEdge = x >= screenWidth - EDGE_THRESHOLD;
          if (isFromLeftEdge || isFromRightEdge) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      },
    }),
    [isGestureActive, translateX]
  );

  const handleStateChange = useCallback(
    (event: any) => {
      const { state, translationX, x } = event.nativeEvent;

      if (state === State.BEGAN) {
        lastGestureX.current = x;
      }

      if (state === State.END) {
        const gestureX = x;
        const gestureTranslationX = translationX;
        const isFromLeftEdge = lastGestureX.current <= EDGE_THRESHOLD;
        const isFromRightEdge =
          lastGestureX.current >= screenWidth - EDGE_THRESHOLD;

        // Swipe right from left edge (open sidebar)
        if (
          !isSidebarOpen &&
          isFromLeftEdge &&
          gestureTranslationX > SWIPE_THRESHOLD &&
          gestureX > lastGestureX.current
        ) {
          // Success haptic when sidebar opens
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSwipeRight();
        }

        // Swipe left on sidebar (close sidebar)
        if (
          isSidebarOpen &&
          gestureTranslationX < -SWIPE_THRESHOLD &&
          gestureX < lastGestureX.current
        ) {
          // Success haptic when sidebar closes
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSwipeLeft();
        }

        // Error haptic when gesture doesn't meet threshold
        if (
          (isFromLeftEdge || isFromRightEdge) &&
          Math.abs(gestureTranslationX) < SWIPE_THRESHOLD
        ) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Reset translation and gesture state
        translateX.setValue(0);
        setIsGestureActive(false);
      }
    },
    [isSidebarOpen, onSwipeRight, onSwipeLeft, translateX]
  );

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        minDist={10}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
          {children}
        </Animated.View>
      </PanGestureHandler>

      {/* Visual feedback indicator */}
      {isGestureActive && !isSidebarOpen && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: '#007AFF',
            opacity: 0.6,
          }}
        />
      )}
    </View>
  );
}
