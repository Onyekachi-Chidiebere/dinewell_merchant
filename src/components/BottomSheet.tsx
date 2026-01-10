import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import colors from '../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const HANDLE_HEIGHT = 40;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  borderRadius?: number;
  height?: number | 'auto';
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  borderRadius = 40,
  height = MAX_HEIGHT,
}) => {
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const resetSheet = useCallback(() => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 15,
      mass: 1,
      stiffness: 100,
    }).start();
  }, [panY]);

  const closeSheet = useCallback(() => {
    setIsClosing(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
        stiffness: 100,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsClosing(false);
      setShouldRender(false);
      onClose();
    });
  }, [slideAnim, backdropOpacity, onClose]);

  useEffect(() => {
    if (visible) {
      if (!shouldRender) {
        setShouldRender(true);
      }
      
      setTimeout(() => {
        slideAnim.setValue(SCREEN_HEIGHT);
        panY.setValue(0);
        backdropOpacity.setValue(0);
        
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            mass: 1,
            stiffness: 100,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          })
        ]).start();
        resetSheet();
      }, 50);
    }
  }, [visible, resetSheet, slideAnim, backdropOpacity, panY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(0, gestureState.dy);
        panY.setValue(newY);
        const opacity = Math.max(0, 1 - (newY / (SCREEN_HEIGHT * 0.3)));
        backdropOpacity.setValue(opacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          resetSheet();
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity: backdropOpacity }
      ]} 
      pointerEvents="auto"
    >
      <Animated.View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={closeSheet}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          {
            height: height === 'auto' ? 'auto' : Math.min(height, MAX_HEIGHT),
            maxHeight: MAX_HEIGHT,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            transform: [
              { translateY: slideAnim },
              { translateY: panY }
            ]
          }
        ]}
      >
        <View style={styles.handleContainer} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        <View style={styles.contentContainer}>
          {children}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    elevation: 999,
    zIndex: 999999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    elevation: 999,
    zIndex: 999998,
  },
  backdropTouchable: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.background.paper,
    marginHorizontal: 10,
    elevation: 1000,
    zIndex: 1000000,
    position: 'relative',
  },
  handleContainer: {
    height: HANDLE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 6,
    backgroundColor: colors.border.default,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
});

export default BottomSheet; 