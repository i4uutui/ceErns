import { createApp } from 'vue';
import App from './App.jsx';
import router from './router';
import 'element-plus/dist/index.css';
import "@/assets/css/login.css"

const app = createApp(App);

app.use(router);


app.mount('#app');  