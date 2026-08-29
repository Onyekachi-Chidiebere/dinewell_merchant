import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  SafeAreaView,
  Edge,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  /** Parent already handles SafeArea (e.g. inside LinearGradient). */
  embed?: boolean;
  scroll?: boolean;
  keyboardVerticalOffset?: number;
};

/**
 * Keeps content inside safe areas and scrolls focused inputs above the keyboard
 * on tall/edge Android devices (e.g. Galaxy S25 Edge) and iOS.
 */
const KeyboardAwareScreen = ({
  children,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
  embed = false,
  scroll = true,
  keyboardVerticalOffset,
}: Props) => {
  const insets = useSafeAreaInsets();
  const offset =
    keyboardVerticalOffset ??
    (Platform.OS === 'ios' ? Math.max(insets.top, 8) : 0);

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.grow,
        { paddingBottom: Math.max(insets.bottom, 24) },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      bounces={false}
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  const avoiding = (
    <KeyboardAvoidingView
      style={[styles.flex, embed ? style : undefined]}
      behavior="padding"
      keyboardVerticalOffset={offset}
    >
      {body}
    </KeyboardAvoidingView>
  );

  if (embed) {
    return avoiding;
  }

  return (
    <SafeAreaView style={[styles.flex, style]} edges={edges}>
      {avoiding}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
});

export default KeyboardAwareScreen;
