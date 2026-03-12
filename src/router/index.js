// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 导入所有页面组件
import Home from '../views/Home.vue';
import HomePage from '../views/HomePage.vue';
import DrivingRoutesPage from '../views/DrivingRoutesPage.vue';
import EquipmentPage from '../views/EquipmentPage.vue';
import RouteDetail from '../views/RouteDetail.vue';
import VRPanoramaPage from '../views/VRPanoramaPage.vue';
import VRPanoramaList from '../views/VRPanoramaList.vue';
import TeamPage from '../views/TeamPage.vue';
import TeamCreatePage from '../views/TeamCreatePage.vue';
import TeamApplicationPage from '../views/TeamApplicationPage.vue';
import NearbyPage from '../views/NearbyPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import OrderManagementPage from '../views/OrderManagementPage.vue';
import VerificationPage from '../views/VerificationPage.vue';
import EmergencyContactsPage from '../views/EmergencyContactsPage.vue';
import CampsiteDetailPage from '../views/CampsiteDetailPage.vue';
import CampsiteListPage from '../views/CampsiteListPage.vue';
import MyActivitiesPage from '../views/MyActivitiesPage.vue';
import MyFavoritesPage from '../views/MyFavoritesPage.vue';
import PostPage from '../views/PostPage.vue';
import CommunityPage from '../views/CommunityPage.vue';

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
                path: 'equipment',
                name: 'equipment',
                component: EquipmentPage
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
                path: 'profile',
                name: 'profile',
                component: ProfilePage
            },
            {
                path: 'orders',
                name: 'orders',
                component: OrderManagementPage
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
            }
        ]
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;