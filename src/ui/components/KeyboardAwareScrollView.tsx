// src/ui/components/KeyboardAwareScrollView.tsx
// Reusable ScrollView wrapper that avoids keyboard covering inputs
import { forwardRef } from "react";
import { Platform, KeyboardAvoidingView, ScrollView, ScrollViewProps } from "react-native";

/**
 * Wrapper around ScrollView that automatically adjusts position when keyboard appears
 *
 * This component handles the common issue where the keyboard covers input fields
 * on iOS and Android. Uses reduced offset for a sleeker appearance.
 *
 * @example
 * ```tsx
 * <KeyboardAwareScrollView contentContainerStyle={{ padding: 16 }}>
 *   <TextInput placeholder="This won't be covered by keyboard" />
 * </KeyboardAwareScrollView>
 * ```
 */
export const KeyboardAwareScrollView = forwardRef<ScrollView, ScrollViewProps & { children: React.ReactNode }>(
  ({ children, style, contentContainerStyle, ...rest }, ref) => {
    // On iOS, use padding behavior with reduced offset for sleeker look
    // On Android, height behavior works better
    const behavior = Platform.OS === "ios" ? "padding" : "height";

    // Reduce keyboard offset by half for sleeker appearance
    // Default offset on iOS includes tab bar + keyboard height
    // Using a smaller offset reduces the gap between keyboard and content
    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

    return (
      <KeyboardAvoidingView
        style={[{ flex: 1 }, style]}
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
        enabled
      >
        <ScrollView
          ref={ref}
          {...rest}
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

KeyboardAwareScrollView.displayName = "KeyboardAwareScrollView";
