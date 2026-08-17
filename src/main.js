import { createApp } from "vue";
import "mdb-vue-ui-kit/css/mdb.min.css"
import App from "./App.vue";
import * as Sentry from "@sentry/vue";
const app = createApp(App)
Sentry.init({
    app,
    dsn: "https://bf7ce035b5dfabf01d785afb0040e2c9@o4511925058600960.ingest.de.sentry.io/4511925073084496",
    dataCollection: {
        // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
        // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#dataCollection
        userInfo: false,
        httpBodies: []
    },
    integrations: [
        //Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.,
    // Logs
    enableLogs: true
});

app.mount("#app");
