import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../src/store';
import { styles, teal } from '../src/theme/ui';
import { Tabs } from './index';

export default function Profile() {
  const router = useRouter(), { reset } = useStore();

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={[styles.pad, { paddingTop: 65 }]}>
        <Text style={styles.title}>Profile</Text>

        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 25, marginBottom: 20 }]}>
          <Ionicons name="person-circle" size={58} color={teal} />
          <View>
            <Text style={{ fontSize: 18, fontWeight: '800' }}>Traveler</Text>
            <Text style={styles.muted}>Your personal travel planner</Text>
          </View>
        </View>

        {[
          ['My Trips', '/trip', 'checkbox'],
          ['Saved Cities', '/saved', 'bookmark'],
          ['Discover Destinations', '/search', 'compass'],
        ].map(([label, path, icon]) => (
          <TouchableOpacity
            key={path}
            onPress={() => router.push(path as any)}
            style={[styles.card, { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }]}
          >
            <Ionicons name={icon as any} size={21} color={teal} />
            <Text style={{ flex: 1, fontWeight: '600' }}>{label}</Text>
            <Ionicons name="chevron-forward" size={19} color="#899" />
          </TouchableOpacity>
        ))}

        <View style={[styles.card, { marginTop: 10 }]}>
          <Text style={{ fontWeight: '800' }}>About TraveltoSearch</Text>
          <Text style={[styles.muted, { marginTop: 8, lineHeight: 20 }]}>
            Discover. Explore. Check it off. Your checklist and saved cities stay on this device. No account required.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Reset travel data?', 'This removes all checkmarks and saved cities.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: reset },
            ])
          }
          style={{ padding: 18 }}
        >
          <Text style={{ color: '#dc2626' }}>Reset all travel data</Text>
        </TouchableOpacity>
      </ScrollView>
      <Tabs active="profile" />
    </View>
  );
}
