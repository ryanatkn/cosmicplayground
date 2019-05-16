import App from './components/App.svelte';

export const app = new App({
  target: document.getElementById('root'),
  props: {
    name: 'cosmicplayground',
  },
});

(window as any).app = app;
