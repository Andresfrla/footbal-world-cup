import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

const { width } = Dimensions.get('window');

export interface ToastHandle {
  show: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const Toast = forwardRef<ToastHandle>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'info' | 'error'>('success');

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    show: (msg, t = 'success') => {
      setMessage(msg);
      setType(t);
      setVisible(true);
    },
  }));

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(Spacing.xl + 20, { damping: 15, stiffness: 150 });

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(-100, { duration: 300 }, () => {
          // No podemos llamar a setVisible(false) directamente aquí porque es una callback de worklet
        });
        // Usamos un pequeño delay extra para asegurar que la animación termine antes de desmontar
        setTimeout(() => setVisible(false), 350);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      default: return Colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: getBackgroundColor() }]}>
      <MaterialIcons name={getIcon()} size={20} color="white" />
      <Text style={styles.text} numberOfLines={2}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    flex: 1,
  },
});
