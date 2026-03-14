import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Sticker } from "../src/types";

interface StickerProps {
  sticker: Sticker;
  onPress?: () => void;
  stickerSize?: number;
}

const STICKER_SIZE = 60;
const BADGE_SIZE = 20;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StickerComponent({
  sticker,
  onPress,
  stickerSize = STICKER_SIZE,
}: StickerProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const getBackgroundColor = () => {
    if (sticker.status === "missing") return "#9ca3af";
    if (sticker.duplicates > 0) return "#3b82f6";
    return "#22c55e";
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            width: stickerSize,
            height: stickerSize,
            borderRadius: stickerSize / 2,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.number, { fontSize: stickerSize * 0.3 }]}>
          {sticker.number}
        </Text>
        {sticker.duplicates > 0 && (
          <Animated.View
            style={[
              styles.badge,
              {
                width: stickerSize * 0.33,
                height: stickerSize * 0.33,
                borderRadius: stickerSize * 0.165,
              },
            ]}
          >
            <Text style={[styles.badgeText, { fontSize: stickerSize * 0.16 }]}>
              +{sticker.duplicates}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
