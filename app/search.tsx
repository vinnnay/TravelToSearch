import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { destinations } from '../src/data/catalog';
import { styles, teal, Photo } from '../src/theme/ui';

export default function Search() {
  const router = useRouter(), [query, setQuery] = useState('');
  const matches = destinations.filter((c) => (c.name + ' ' + c.country).toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.page}>
      <View style={[styles.pad, { paddingTop: 60 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={[styles.title, { marginVertical: 20 }]}>Discover destinations</Text>

        <View style={{ backgroundColor: '#f1f4f5', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          <Ionicons name="search" size={20} color="#87939e" />
          <TextInput
            autoFocus
            placeholder="Search a city or country"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            style={{ flex: 1, padding: 15 }}
          />
        </View>

        <Text style={[styles.muted, { marginVertical: 14 }]}>Offline city catalog · {matches.length} destinations</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 30 }}>
        {matches.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 12 }]}
            onPress={() => router.push({ pathname: '/city/[id]', params: { id: c.id } })}
          >
            <Photo uri={c.image} width={80} height={80} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', fontSize: 16 }}>{c.name}</Text>
              <Text style={styles.muted}>{c.country} · {c.attractions.length} attractions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={teal} />
          </TouchableOpacity>
        ))}

        {matches.length === 0 && (
          <Text style={styles.muted}>No offline destination found. Try Paris, Tokyo, London, Rome, New York or Washington.</Text>
        )}
      </ScrollView>
    </View>
  );
}
