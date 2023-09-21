// Routing Module

import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue";

const AboutComponent = () => import('../public/pages/about.component.vue');

const TutorialListComponent = () => import('../learning/pages/tutorial-list.component.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',        component: HomeComponent, meta: { title: 'Home'} },
        { path: '/about',       component: AboutComponent, meta: { title: 'About us'} },
        { path: '/tutorials',   component: TutorialListComponent, meta: { title: 'Tutorials Catalogue'} },
        { path: '/',            redirect: '/home' },
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'ACME Learning Center';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})
export default router;