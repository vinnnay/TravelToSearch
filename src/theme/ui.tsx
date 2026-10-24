import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const teal = '#008E89';

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  pad: { padding: 18 },
  title: { fontSize: 26, fontWeight: '800', color: '#142333' },
  muted: { fontSize: 12, color: '#75808d' },
  card: {
    borderWidth: 1,
    borderColor: '#e9edf0',
    borderRadius: 17,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: teal,
    padding: 14,
    borderRadius: 13,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: {
    backgroundColor: '#dce8e8',
    borderRadius: 12,
  },
});

export function Action({
  label,
  onPress,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, secondary && { backgroundColor: '#e5f5f3' }]}
    >
      <Text style={[styles.buttonText, secondary && { color: teal }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Check({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: checked ? teal : '#aeb8c1',
        backgroundColor: checked ? teal : 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && <Ionicons name="checkmark" color="white" size={19} />}
    </TouchableOpacity>
  );
}

export function Photo({
  uri,
  width = 90,
  height = 90,
}: {
  uri: string;
  width?: number | string;
  height?: number;
}) {
  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width: width as any, height }]}
      resizeMode="cover"
    />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 18, fontWeight: '800', color: '#142333', marginBottom: 12 }}>
      {children}
    </Text>
  );
}
