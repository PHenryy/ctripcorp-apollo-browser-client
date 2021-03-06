import { ApolloClient, Config } from "./apollo-browser/index";

const apps = new Config();

const client = new ApolloClient({
  appId: "lzy-lcsc",
});

const cache = apps.getCache();

if (!cache || cache === "") {
  // 没有缓存
  client.fetchConfig().then((config) => {
    const key = "apps";
    const configParsed = JSON.parse(config[key]);

    apps.cache(config[key]);
    loadConfig(configParsed);
  });
} else {
}
