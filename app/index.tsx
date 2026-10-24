import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories, destinations } from '../src/data/catalog';
import { attractionKey, useStore } from '../src/store';
import { teal } from '../src/theme/ui';

export default function HomeScreen() {
  const { data, toggleCity, toggleFavorite, toggleVisited } = useStore();
  const [selectedCityId, setSelectedCityId] = useState('dc');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');

  const currentCity =
    destinations.find((destination) => destination.id === selectedCityId) ?? destinations[0];

  useEffect(() => {
    if (!searchText.trim()) return;
    const nextCity = destinations.find(
      (destination) =>
        destination.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
        destination.attractions.some((attraction) =>
          attraction.name.toLowerCase().includes(searchText.trim().toLowerCase()),
        ),
    );
    if (nextCity) {
      setSelectedCityId(nextCity.id);
    }
  }, [searchText]);

  const visitedCount = currentCity.attractions.filter((attraction) =>
    data.visited[attractionKey(currentCity.id, attraction.id)],
  ).length;

  const visitPercent = Math.round((visitedCount / currentCity.attractions.length) * 100) || 0;

  const visibleAttractions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return currentCity.attractions.filter((attraction) => {
      const matchesCategory =
        selectedCategory === 'All' || attraction.category === selectedCategory;
      const matchesQuery =
        !q ||
        attraction.name.toLowerCase().includes(q) ||
        attraction.description.toLowerCase().includes(q) ||
        attraction.searchQuery.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [currentCity, searchText, selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="airplane" size={22} color="#fff" />
            </View>
            <Text style={styles.brandText}>ExploreGo</Text>
          </View>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={26} color="#39414a" />
          </Pressable>
        </View>

        <Text style={styles.heroTitle}>Where to next?</Text>
        <Text style={styles.heroSubtitle}>Discover. Explore. Check it off.</Text>

        <View style={styles.searchCard}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={26} color="#1d2a36" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Washington, DC"
              placeholderTextColor="#586872"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cityPickerRow}>
          {destinations.map((destination) => {
            const selected = destination.id === currentCity.id;
            return (
              <Pressable
                key={destination.id}
                style={[styles.cityPill, selected && styles.cityPillSelected]}
                onPress={() => {
                  setSelectedCityId(destination.id);
                  setSearchText('');
                }}
              >
                <Text style={[styles.cityPillText, selected && styles.cityPillTextSelected]}>
                  {destination.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryMeta}>
            <Text style={styles.destinationLabel}>YOUR DESTINATION</Text>
            <Text style={styles.destinationName}>{currentCity.name}</Text>
            <Text style={styles.destinationSubtext}>
              {currentCity.attractions.length} attractions • {visitedCount} visited
            </Text>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${visitPercent}%` }]} />
            </View>
          </View>

          <View style={styles.visitBadgeWrap}>
            <View style={styles.visitBadge}>
              <Text style={styles.visitBadgeText}>{visitPercent}%</Text>
              <Text style={styles.visitBadgeLabel}>Visited</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterBar}>
          {categories.map((category) => {
            const selected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Places to explore</Text>
          <TouchableOpacity style={styles.topPicksButton}>
            <Ionicons name="star" size={18} color="#1d2a36" />
            <Text style={styles.topPicksText}>Top picks</Text>
            <Ionicons name="chevron-down" size={18} color="#1d2a36" />
          </TouchableOpacity>
        </View>

        {visibleAttractions.map((attraction) => {
          const checked = !!data.visited[attractionKey(currentCity.id, attraction.id)];
          const favorite = data.favorites.includes(attractionKey(currentCity.id, attraction.id));

          return (
            <View key={attraction.id} style={styles.attractionRow}>
              <Image source={{ uri: attraction.image }} style={styles.attractionImage} />

              <View style={styles.attractionDetails}>
                <Text style={styles.attractionName}>{attraction.name}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={16} color="#4f5964" />
                  <Text style={styles.metaText}>{attraction.category}</Text>
                </View>

                <Text style={styles.descriptionText}>{attraction.description}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="ticket-outline" size={16} color="#4f5964" />
                  <Text style={styles.metaText}>{attraction.admission}</Text>
                  <Ionicons name="time-outline" size={16} color="#4f5964" style={styles.metaSpacer} />
                  <Text style={styles.metaText}>{attraction.duration}</Text>
                </View>
              </View>

              <View style={styles.rightActions}>
                <TouchableOpacity
                  onPress={() => toggleVisited(attractionKey(currentCity.id, attraction.id))}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  style={[
                    styles.checkButton,
                    checked ? styles.checkButtonChecked : styles.checkButtonUnchecked,
                  ]}
                >
                  {checked ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleFavorite(attractionKey(currentCity.id, attraction.id))}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={favorite ? 'star' : 'star-outline'}
                    size={18}
                    color={favorite ? '#f6c453' : '#6a7683'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItemActive}>
            <Ionicons name="compass" size={22} color={teal} />
            <Text style={styles.navItemTextActive}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="checkbox-outline" size={22} color="#5d6975" />
            <Text style={styles.navItemText}>My Checklist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="bookmark-outline" size={22} color="#5d6975" />
            <Text style={styles.navItemText}>Saved Cities</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    backgroundColor: '#f4f4f4',
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#0db7b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1b2634',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9edf0',
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: '#17212b',
    marginTop: 10,
    paddingHorizontal: 24,
    lineHeight: 58,
  },
  heroSubtitle: {
    fontSize: 24,
    color: '#586872',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dfe7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 24,
    color: '#1d2a36',
    paddingVertical: 0,
  },
  exploreButton: {
    backgroundColor: teal,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 16,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  cityPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 22,
  },
  cityPill: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e7ecf0',
  },
  cityPillSelected: {
    backgroundColor: teal,
  },
  cityPillText: {
    color: '#1d2a36',
    fontSize: 15,
    fontWeight: '600',
  },
  cityPillTextSelected: {
    color: '#fff',
  },
  summaryCard: {
    marginTop: 20,
    marginHorizontal: 24,
    backgroundColor: '#f7f9fa',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#dfe5ea',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryMeta: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: '#697884',
  },
  destinationName: {
    fontSize: 36,
    color: '#1c2632',
    fontWeight: '800',
    marginTop: 8,
  },
  destinationSubtext: {
    fontSize: 18,
    color: '#526170',
    marginTop: 8,
  },
  progressWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
  },
  progressTrack: {
    height: 14,
    backgroundColor: '#dfe8eb',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 14,
    borderRadius: 999,
    backgroundColor: teal,
  },
  visitBadgeWrap: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  visitBadge: {
    backgroundColor: '#dff3f1',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  visitBadgeText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1ba2a6',
  },
  visitBadgeLabel: {
    fontSize: 18,
    color: '#2b4c52',
    marginTop: 6,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 26,
    paddingHorizontal: 24,
  },
  filterChip: {
    backgroundColor: '#e7edf0',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  filterChipSelected: {
    backgroundColor: teal,
  },
  filterChipText: {
    color: '#1d2a36',
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  listHeader: {
    marginTop: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1d2a36',
  },
  topPicksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topPicksText: {
    fontSize: 18,
    color: '#1d2a36',
    fontWeight: '600',
  },
  attractionRow: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 24,
    backgroundColor: '#f8fafb',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8edf0',
  },
  attractionImage: {
    width: 150,
    height: 150,
    borderRadius: 18,
    backgroundColor: '#d8e4e8',
  },
  attractionDetails: {
    flex: 1,
    marginLeft: 14,
  },
  attractionName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#19252f',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 15,
    color: '#4c5d6a',
    marginLeft: 6,
  },
  metaSpacer: {
    marginLeft: 12,
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#4d5e6b',
  },
  rightActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
    paddingVertical: 8,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonChecked: {
    backgroundColor: teal,
  },
  checkButtonUnchecked: {
    backgroundColor: '#e7edf0',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderColor: '#dde5e9',
    marginTop: 28,
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: teal,
    paddingBottom: 8,
  },
  navItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5e6d7c',
  },
  navItemTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: teal,
  },
});
