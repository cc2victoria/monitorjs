/**
 * @type {import('vitepress').UserConfig}
 */
import { version } from '../../package.json';
const config = {
    // ...
    title: 'monitorjs',
    description: 'A monitor SDk for frontend!',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/guide' },
            { text: 'Configs', link: '/configs' },
            {
                text: version,
                items: [
                    { text: 'Changelog', link: '/configs' },
                    { text: 'Contributing', link: '/configs' },
                ],
            },
        ],
        socialLinks: [
            {
                icon: {
                    svg: `<svg width="24" height="24" class="tanuki-logo" viewBox="0 0 36 36">
                    <path class="tanuki-shape tanuki-left-ear" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"></path>
                    <path class="tanuki-shape tanuki-right-ear" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"></path>
                    <path class="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z"></path>
                    <path class="tanuki-shape tanuki-left-eye" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"></path>
                    <path class="tanuki-shape tanuki-right-eye" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"></path>
                    <path class="tanuki-shape tanuki-left-cheek" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"></path>
                    <path class="tanuki-shape tanuki-right-cheek" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"></path>
                  </svg>`,
                },
                link: 'http://gitlab.zhenai.com/webapp/common/cdn/monitorjs',
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Introduction', link: '/guide/introduction' },
                    { text: 'Getting Started', link: '/guide/getting-started' },
                ],
            },
            {
                text: 'Frontend Monitor',
                items: [
                    { text: 'Request Error', link: '/fe-monitor/api' },
                    { text: 'Javascript Error', link: '/fe-monitor/jsError' },
                ],
            },
        ],

        markdown: {
            lineNumbers: true, // 显示代码行数
        },
    },
};

export default config;
