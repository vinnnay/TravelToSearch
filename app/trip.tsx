import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { destinations } from '../src/data/catalog';
import { useStore, attractionKey } from '../src/store';
import { styles, teal, Check, Photo } from '../src/theme/ui';
import { Tabs } from './index';

export default function Trip() {
  const router = useRouter(), { data, toggleVisited } = useStore(), [cityId, setCityId] = useState('dc'), [filter, setFilter] = useState('All');
  const city = destinations.find((c) => c.id === cityId)!,
    done = city.attractions.filter((a) => data.visited[attractionKey(city.id, a.id)]).length,
    pct = Math.round((done / city.attractions.length) * 100);

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={[styles.pad, { paddingTop: 65 }]}>
        <Text style={styles.title}>My Trip Checklist</Text>
        <Text style={[styles.muted, { marginTop: 5 }]}>Track every stop on your journey</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 17 }}>
          {destinations.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCityId(c.id)}
              style={{ backgroundColor: c.id === cityId ? teal : '#edf2f3', borderRadius: 20, padding: 10, marginRight: 8 }}
            >
              <Text style={{ fontSize: 12, color: c.id === cityId ? 'white' : '#344' }}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.card, { backgroundColor: '#eaf8f5' }]}>
          <Text style={{ fontWeight: '800', color: teal }}>{done} of {city.attractions.length} places visited</Text>
          <Text style={{ textAlign: 'right', fontWeight: '800' }}>{pct}%</Text>
          <View style={{ height: 8, backgroundColor: '#dbe5e7', borderRadius: 8, overflow: 'hidden' }}>
            <View style={{ width: `${pct}%`, height: 8, backgroundColor: teal }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 9, marginVertical: 20 }}>
          {['All', 'To Visit', 'Visited'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{ flex: 1, padding: 11, backgroundColor: filter === f ? teal : '#f0f3f5', borderRadius: 20, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 12, color: filter === f ? 'white' : '#334' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {city.attractions
          .filter((a) =>
            filter === 'All' ||
            (filter === 'Visited' ? !!data.visited[attractionKey(city.id, a.id)] : !data.visited[attractionKey(city.id, a.id)]),
          )
          .map((a) => (
            <View key={a.id} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }]}>
              <Photo uri={a.image} width={65} height={65} />
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push({ pathname: '/attraction/[id]', params: { id: a.id, city: city.id } })}>
                <Text style={{ fontWeight: '700' }}>{a.name}</Text>
                <Text style={styles.muted}>{a.category} · {a.duration}</Text>
              </TouchableOpacity>
              <Check checked={!!data.visited[attractionKey(city.id, a.id)]} onPress={() => toggleVisited(attractionKey(city.id, a.id))} />
            </View>
          ))}
      </ScrollView>
      <Tabs active="trip" />
    </View>
  );
}
