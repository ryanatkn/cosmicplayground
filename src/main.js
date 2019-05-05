import App from './components/App.svelte';

const app = new App({
  target: document.getElementById('root'),
  props: {
    name: 'cosmicplayground',
  },
});

window.app = app;

export default app;
