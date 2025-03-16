import {Tabs} from 'expo-router';
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text: string) => {
        // 这里可以添加搜索逻辑，例如调用 API 进行搜索
        console.log('Search text:', text);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 搜索框 */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="搜索..."
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        handleSearch(text);
                    }}
                />
            </View>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarBackground: TabBarBackground,
                    tabBarPosition: 'top',
                    tabBarStyle: Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                            top: 60,
                        },
                        default: {
                            position: 'absolute',
                            top: 60,
                        },
                    }),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: '首页',
                        tabBarIcon: ({color}) => (
                            <IconSymbol size={28} name="house.fill" color={color}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="movie"
                    options={{
                        title: '电影',
                        tabBarIcon: ({color}) => (
                            <IconSymbol size={28} name="paperplane.fill" color={color}/>
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 10,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
});
