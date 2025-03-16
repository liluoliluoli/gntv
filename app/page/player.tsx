import React, {useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ResizeMode, Video} from 'expo-av';
import {useLocalSearchParams} from 'expo-router';

export default function PlayerScreen() {
    const videoRef = useRef<Video>(null);
    const params = useLocalSearchParams();
    const videoId = params.videoId;
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    // 假设这里根据 videoId 获取视频的实际 URL
    const videoUrl = `http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8`;

    // 模拟影片信息
    const movieInfo = {
        poster: 'https://img2.baidu.com/it/u=3724551006,2681017637&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1200', // 替换为实际海报链接
        cast: '主演: 演员1, 演员2',
        description: '这是一部精彩的影片，剧情跌宕起伏，值得一看。',
        releaseDate: '2024-01-01',
        episodes: 10
    };

    return (
        <ScrollView style={styles.container}>
            {/* 视频播放区域 */}
            <Video
                ref={videoRef}
                source={{uri: videoUrl}}
                style={styles.backgroundVideo}
                resizeMode={ResizeMode.COVER}
                usePoster={true}
                shouldPlay={true}
                useNativeControls
                onLoad={() => {
                    // 加载完成后自动全屏播放
                    // if (videoRef.current) {
                    //     videoRef.current.presentFullscreenPlayer();
                    // }
                }}
            />

            {/* 影片简介区域 */}
            <View style={styles.infoContainer}>
                <Image source={{uri: movieInfo.poster}} style={styles.poster}/>
                <Text style={styles.text}>{movieInfo.cast}</Text>
                <Text style={styles.text}>{movieInfo.description}</Text>
                <Text style={styles.text}>发布日期: {movieInfo.releaseDate}</Text>
                <Picker
                    selectedValue={selectedEpisode}
                    onValueChange={(itemValue) => setSelectedEpisode(itemValue)}
                    style={styles.picker}
                >
                    {Array.from({length: movieInfo.episodes}, (_, i) => (
                        <Picker.Item label={`第 ${i + 1} 集`} value={i + 1} key={i}/>
                    ))}
                </Picker>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundVideo: {
        height: 200, // 根据实际情况调整视频高度
        width: '100%',
    },
    infoContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    poster: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    text: {
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});
