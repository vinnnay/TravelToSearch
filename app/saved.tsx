import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { destinations } from '../src/data/catalog';
import { useStore, attractionKey } from '../src/store';
import { styles, teal, Photo, Action } from '../src/theme/ui';
import { Tabs } from './index';

export default function Saved() {
  const router = useRouter(), { data, toggleCity } = useStore();

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={[styles.pad, { paddingTop: 65 }]}>
        <Text style={styles.title}>Saved Cities</Text>
        <Text style={[styles.muted, { marginVertical: 12 }]}>Your favorite destinations</Text>

        {destinations
          .filter((c) => data.savedCities.includes(c.id))
          .map((c) => (
            <View key={c.id} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }]}>
              <Photo uri={c.image} width={80} height={80} />
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push({ pathname: '/city/[id]', params: { id: c.id } })}>
                <Text style={{ fontWeight: '800' }}>{c.name}</Text>
                <Text style={styles.muted}>
                  {c.attractions.length} attractions · {c.attractions.filter((a) => data.visited[attractionKey(c.id, a.id)]).length} visited
                </Text>
                <Text style={{ color: teal, fontSize: 12, marginTop: 8 }}>Open guide →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleCity(c.id)} accessibilityLabel={'Remove ' + c.name}>
                <Ionicons name="close" size={22} color="#7c8792" />
              </TouchableOpacity>
            </View>
          ))}

        {!data.savedCities.length && (
          <Text style={[styles.muted, { marginVertical: 30 }]}>No saved cities yet. Explore a destination and tap the bookmark.</Text>
        )}

        <Action label="+ Discover a city" onPress={() => router.push('/search')} />
      </ScrollView>
      <Tabs active="saved" />
    </View>
  );
}
