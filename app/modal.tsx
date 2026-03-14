import { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '../constants/theme';

const { height } = Dimensions.get('window');

export default function ModalScreen() {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [translateY, opacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} />
      </Animated.View>
      
      <Animated.View 
        entering={SlideInDown.springify().damping(20).stiffness(200)}
        style={styles.content}
      >
        <Animated.View entering={FadeIn.delay(100).duration(300)}>
          <ThemedText type="title">This is a modal</ThemedText>
        </Animated.View>
        
        <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.buttonContainer}>
          <Link href="/" dismissTo style={styles.link}>
            <ThemedText type="link">Go to home screen</ThemedText>
          </Link>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: height * 0.1,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
