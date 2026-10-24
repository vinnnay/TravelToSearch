import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { destinations } from '../src/data/catalog';
import { styles, teal, Photo, SectionTitle } from '../src/theme/ui';

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.page}>
      <ScrollView>
        <ImageBackground
          source={{ uri: destinations[0].image }}
          style={{ padding: 22, paddingTop: 64, minHeight: 365 }}
          imageStyle={{ opacity: 0.5 }}
        >
          <View style={{ backgroundColor: 'rgba(8,42,51,.72)', position: 'absolute', inset: 0 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="navigate-circle" size={38} color="#42ddd0" />
            <View>
              <Text style={{ color: 'white', fontSize: 23, fontWeight: '800' }}>
                Travelto<Text style={{ color: '#42ddd0' }}>Search</Text>
              </Text>
              <Text style={{ color: 'white', fontSize: 11 }}>Discover. Explore. Check it off.</Text>
            </View>
          </View>
          <Text style={{ fontSize: 42, color: 'white', fontWeight: '900', marginTop: 50 }}>
            Where to next? ✈️
          </Text>
          <Text style={{ color: 'white', marginTop: 8, marginBottom: 22 }}>
            Find amazing places and experiences.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/search')}
            style={{ backgroundColor: 'white', borderRadius: 18, padding: 17, flexDirection: 'row', gap: 10 }}
          >
            <Ionicons name="search" size={19} color="#667" />
            <Text style={{ color: '#65717d' }}>Search city or destination...</Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.pad}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
            {[
              ['Landmarks', 'business'],
              ['Museums', 'library'],
              ['Nature', 'leaf'],
              ['Food & Culture', 'restaurant'],
            ].map(([name, icon]) => (
              <TouchableOpacity
                key={name}
                onPress={() => router.push({ pathname: '/city/[id]', params: { id: 'dc', category: name } })}
                style={{
                  alignItems: 'center',
                  padding: 9,
                  backgroundColor: '#f3f7f7',
                  borderRadius: 12,
                  width: '24%',
                }}
              >
                <Ionicons name={icon as any} size={24} color={teal} />
                <Text style={{ fontSize: 10, marginTop: 6 }}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionTitle>Popular Destinations</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {destinations.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => router.push({ pathname: '/city/[id]', params: { id: c.id } })}
                style={{ width: '47%', marginBottom: 10 }}
              >
                <Photo uri={c.image} width="100%" height={110} />
                <Text style={{ fontWeight: '700', marginTop: 6 }}>{c.name}</Text>
                <Text style={styles.muted}>{c.attractions.length} attractions</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Tabs active="explore" />
    </View>
  );
}

export function Tabs({ active }: { active: 'explore' | 'trip' | 'saved' | 'profile' }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#edf0f2', paddingVertical: 12, backgroundColor: 'white' }}>
      {([
        ['explore', 'compass', '/'],
        ['trip', 'checkbox', '/trip'],
        ['saved', 'bookmark', '/saved'],
        ['profile', 'person', '/profile'],
      ] as const).map(([id, icon, path]) => (
        <TouchableOpacity
          key={id}
          onPress={() => router.replace(path as any)}
          style={{ flex: 1, alignItems: 'center', gap: 3 }}
        >
          <Ionicons name={icon} size={23} color={active === id ? teal : '#87939e'} />
          <Text style={{ fontSize: 11, color: active === id ? teal : '#87939e', fontWeight: active === id ? '700' : '400' }}>
            {id === 'explore' ? 'Explore' : id === 'trip' ? 'My Trip' : id === 'saved' ? 'Saved' : 'Profile'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
