import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Data = {
  visited: Record<string, boolean>;
  favorites: string[];
  savedCities: string[];
};

type Store = {
  data: Data;
  ready: boolean;
  toggleVisited: (key: string) => void;
  toggleFavorite: (key: string) => void;
  toggleCity: (id: string) => void;
  reset: () => void;
};

const initial: Data = {
  visited: {},
  favorites: [],
  savedCities: ['dc'],
};

const Context = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('traveltosearch:v1')
      .then((v) => {
        if (v) {
          const parsed = JSON.parse(v);
          setData({ ...initial, ...parsed });
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem('traveltosearch:v1', JSON.stringify(data)).catch(() => {});
    }
  }, [data, ready]);

  const toggleVisited = (key: string) =>
    setData((d) => ({
      ...d,
      visited: { ...d.visited, [key]: !d.visited[key] },
    }));

  const toggleFavorite = (key: string) =>
    setData((d) => ({
      ...d,
      favorites: d.favorites.includes(key)
        ? d.favorites.filter((x) => x !== key)
        : [...d.favorites, key],
    }));

  const toggleCity = (id: string) =>
    setData((d) => ({
      ...d,
      savedCities: d.savedCities.includes(id)
        ? d.savedCities.filter((x) => x !== id)
        : [...d.savedCities, id],
    }));

  return (
    <Context.Provider
      value={{
        data,
        ready,
        toggleVisited,
        toggleFavorite,
        toggleCity,
        reset: () => setData({ visited: {}, favorites: [], savedCities: [] }),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStore() {
  const c = useContext(Context);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

export const attractionKey = (city: string, id: string) => `${city}:${id}`;
