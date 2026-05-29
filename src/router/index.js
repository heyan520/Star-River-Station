// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 导入所有页面组件
import Home from '../views/Home.vue';
import HomePage from '../views/HomePage.vue';
import DrivingRoutesPage from '../views/DrivingRoutesPage.vue';
import RouteDetail from '../views/RouteDetail.vue';
import VRPanoramaPage from '../views/VRPanoramaPage.vue';
import VRPanoramaList from '../views/VRPanoramaList.vue';
import TeamPage from '../views/TeamPage.vue';
import TeamCreatePage from '../views/TeamCreatePage.vue';
import TeamApplicationPage from '../views/TeamApplicationPage.vue';
import NearbyPage from '../views/NearbyPage.vue';
import ProfilePage from '../views/ProfilePage.vue';

import VerificationPage from '../views/VerificationPage.vue';
import EmergencyContactsPage from '../views/EmergencyContactsPage.vue';
import CampsiteDetailPage from '../views/CampsiteDetailPage.vue';
import CampsiteListPage from '../views/CampsiteListPage.vue';
import MyActivitiesPage from '../views/MyActivitiesPage.vue';
import MyFavoritesPage from '../views/MyFavoritesPage.vue';
import PostPage from '../views/PostPage.vue';
import CommunityPage from '../views/CommunityPage.vue';
import MyPostsPage from '../views/MyPostsPage.vue';
import MyGuidesPage from '../views/MyGuidesPage.vue';
import MyCommentsPage from '../views/MyCommentsPage.vue';
import MyBookmarksPage from '../views/MyBookmarksPage.vue';

import AIAssistantPage from '../views/AIAssistantPage.vue';
import CreateContentPage from '../views/CreateContentPage.vue';
import NearbyUsersPage from '../views/NearbyUsersPage.vue';
import ChatPage from '../views/ChatPage.vue';
import ExchangePage from '../views/ExchangePage.vue';


const routes = [
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '',
                name: 'home',
                component: HomePage
            },
            {
                path: 'driving-routes',
                name: 'driving-routes',
                component: DrivingRoutesPage
            },


            {
                path: 'route-detail',
                name: 'route-detail',
                component: RouteDetail
            },
            {                path: 'route/vr',                name: 'VRPanorama',                component: VRPanoramaPage            },
            {                path: 'vr-panorama-list',                name: 'VRPanoramaList',                component: VRPanoramaList            },
            {
                path: 'team',
                name: 'team',
                component: TeamPage
            },
            {
                path: 'team-create',
                name: 'team-create',
                component: TeamCreatePage
            },
            {
                path: 'team-application',
                name: 'team-application',
                component: TeamApplicationPage
            },
            {
                path: 'nearby',
                name: 'nearby',
                component: NearbyPage
            },
            {
                path: 'nearby-users',
                name: 'nearby-users',
                component: NearbyUsersPage
            },
            {
                path: 'chat/:userId',
                name: 'chat',
                component: ChatPage
            },
            {
                path: 'exchange/:userId',
                name: 'exchange',
                component: ExchangePage
            },
            {
                path: 'profile',
                name: 'profile',
                component: ProfilePage
            },

            {
                path: 'verification',
                name: 'verification',
                component: VerificationPage
            },
            {
                path: 'emergency-contacts',
                name: 'emergency-contacts',
                component: EmergencyContactsPage
            },
            {
                path: 'campsite-detail',
                name: 'campsite-detail',
                component: CampsiteDetailPage
            },
            {
                path: 'campsite-list',
                name: 'campsite-list',
                component: CampsiteListPage
            },
            {
                path: 'my-activities',
                name: 'my-activities',
                component: MyActivitiesPage
            },
            {
                path: 'my-favorites',
                name: 'my-favorites',
                component: MyFavoritesPage
            },
            {
                path: 'post',
                name: 'post',
                component: PostPage
            },
            {
                path: 'community',
                name: 'community',
                component: CommunityPage
            },
            {
                path: 'ai-assistant',
                name: 'ai-assistant',
                component: AIAssistantPage
            },
            {
                path: 'create-content',
                name: 'create-content',
                component: CreateContentPage
            },
            {
                path: 'my-posts',
                name: 'my-posts',
                component: MyPostsPage
            },
            {
                path: 'my-guides',
                name: 'my-guides',
                component: MyGuidesPage
            },
            {
                path: 'my-comments',
                name: 'my-comments',
                component: MyCommentsPage
            },
            {
                path: 'my-bookmarks',
                name: 'my-bookmarks',
                component: MyBookmarksPage
            }
        ]
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;