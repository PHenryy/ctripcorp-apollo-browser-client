class Config {
  constructor(cacheKey) {
    this.cacheKey = cacheKey || "sub-apps";
  }

  getCache() {
    const result = localStorage.getItem(this.cacheKey);

    if (!result) return "";
    return result;
  }

  cache(config) {
    localStorage.setItem(this.cacheKey, config);
  }
}

export default Config;
