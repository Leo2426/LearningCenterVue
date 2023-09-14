// Routing Module

import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue";

const AboutComponent = () => import('../public/pages/about.component.vue');

const TutorialListComponent = () => import('../learning/pages/tutorial-list.component.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',    component: HomeComponent },
        { path: '/',        redirect: '/home' },
        { path: '/about',   component: AboutComponent },
        { path: '/tutorials',   component: TutorialListComponent },
    ]
});

export default router;