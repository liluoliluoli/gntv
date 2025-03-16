import axios from 'axios';

const API_BASE_URL = 'YOUR_API_BASE_URL';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export interface VideoItem {
    id: string | number;
    title: string;
    thumbnail: string;
    duration: string;
}

const mockVideoItems: VideoItem[] = [
    {
        id: 1,
        title: '测试视频3',
        thumbnail: 'https://img2.baidu.com/it/u=3724551006,2681017637&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1200',
        duration: ''
    },
];

export const getWatchHistory = async (): Promise<VideoItem[]> => {
    // const response = await api.get('/watch-history');
    return mockVideoItems;
};

export const getMovies = async (page: number = 1): Promise<{
    movies: VideoItem[];
    hasMore: boolean;
}> => {
    const response = await api.get(`/movies?page=${page}`);
    return response.data;
};

export const getTVShows = async (page: number = 1): Promise<{
    shows: VideoItem[];
    hasMore: boolean;
}> => {
    const response = await api.get(`/tv-shows?page=${page}`);
    return response.data;
};

export const search = async (query: string): Promise<VideoItem[]> => {
    const response = await api.get(`/search?q=${query}`);
    return response.data;
};
