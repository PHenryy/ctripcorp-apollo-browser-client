import axios from "axios";

// function isNotEmptyString(str) {
//   return typeof str === "string" && str.length !== 0;
// }

class ApolloClient {
  constructor(userOpts = {}) {
    if (!userOpts.appId) {
      console.error("option [appId] is not provided");
      return;
    }

    const defaultOpts = {
      clusterName: "default",
      namespaceName: "application",
      notifications: new Map([["application", -1]]),
      // namespaceName:
      // notificationId
    };
    const opts = {
      ...defaultOpts,
      ...userOpts,
    };

    this.options = opts;
  }

  async fetchConfig() {
    // &ip={clientIp}
    const { appId, clusterName, namespaceName } = this.options;

    let url = `/apollo/configs/${appId}/${clusterName}/${namespaceName}`;

    // if (isNotEmptyString(releaseKey)) {
    //   url += `?releaseKey=${releaseKey}`;
    // }

    try {
      const res = await axios.get(url);
      console.log(
        "🚀 ~ file: client.js ~ line 41 ~ ApolloClient ~ fetchConfig ~ res",
        res
      );
      const data = res.data;
      const configurations = data.configurations;

      // this.options.releaseKey = data.releaseKey;
      return configurations;
    } catch (error) {
      return Promise.reject(new Error("failed to fetch configurations"));
    }
  }

  polling() {
    // const _this = this;
    this.checkNotifications();
  }

  async checkNotifications() {
    const { appId, clusterName, notifications } = this.options;
    const formatedNotifications = this._formatNotifications(notifications);
    const url = `apollo/notifications/v2?appId=${appId}&cluster=${clusterName}&notifications=${formatedNotifications}`;

    try {
      const res = await axios.get(url);
      console.log(
        "🚀 ~ file: client.js ~ line 67 ~ ApolloClient ~ checkNotifications ~ res",
        res
      );

      if (res.status === 200) {
        // 有更新
        const newNots = res.data;
        newNots.forEach((not) => {
          this.options.notifications.set(not.namespaceName, not.notificationId);
        });
        console.log(this.options);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: client.js ~ line 87 ~ ApolloClient ~ checkNotifications ~ error",
        error
      );
    }
  }

  _formatNotifications(notifications) {
    const ntcs = notifications;

    if (!ntcs) return "[]";

    const arr = [];

    ntcs.forEach((val, key) => {
      arr.push({
        namespaceName: key,
        notificationId: val,
      });
    });
    return encodeURIComponent(JSON.stringify(arr));
  }
}

export default ApolloClient;
