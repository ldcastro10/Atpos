import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { IntlProvider } from 'react-intl';
import localeEsMessages from "./locales/es";
import localeEnMessages from "./locales/en";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./firebase/config"

const root = ReactDOM.createRoot(document.getElementById('root'));
const lang = navigator.language || navigator.userLanguage;

root.render(
                <IntlProvider locale={lang.includes("en") ? "en" : "es-ES"} messages={lang.includes("en") ? localeEnMessages : localeEsMessages}>
                        <App lang={lang} />
                </IntlProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
