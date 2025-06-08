import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.jsx';
import router from './router';
import "@/assets/css/login.css"

const app = createApp(App);

app.use(ElementPlus);
app.use(router);


app.mount('#app');  