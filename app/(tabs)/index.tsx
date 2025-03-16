import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {useRouter} from "expo-router";
import {useQuery} from '@tanstack/react-query';
import {getWatchHistory} from "@/app/services/api";
import React from "react";
import VideoCard from "@/app/components/VideoCard";


export default function HomeScreen() {
    const router = useRouter();
    const {data: history, isLoading: isLoading} = useQuery({
        queryKey: [],
        queryFn: getWatchHistory
    });
    if (isLoading) {
        return <ActivityIndicator style={styles.loader}/>;
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                renderItem={({item}) => (
                    <VideoCard
                        item={item}
                        onPress={() => router.push({
                            pathname: '/page/player',
                            params: {videoId: item.id}
                        })}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        alignSelf: 'center',
    },
});
