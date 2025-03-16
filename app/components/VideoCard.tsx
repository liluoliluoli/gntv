import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { VideoItem } from '../services/api';

interface VideoCardProps {
  item: VideoItem;
  onPress: () => void;
}

export default function VideoCard({ item, onPress }: VideoCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.duration}>
          {item.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
}); 