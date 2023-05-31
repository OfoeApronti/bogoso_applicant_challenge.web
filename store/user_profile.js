import Cookie from "js-cookie";

export const state = () => ({
  loadedIsomap: [],
  token: null,
  user: null
});

export const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user) {
    state.user = user;
  },
  setTokenExpiration(state, tokenExpiration) {
    state.tokenExpiration = tokenExpiration;
  },
  clearToken(state) {
    state.token = null;
    state.tokenExpiration = null;
    state.user = null;
  }
};

export const actions = {
  initAuth(vuexContext, req) {
    let token = ""
    let expirationDate = ""
    let user = ""
    if (req) {
      if (!req.headers.cookie) {
        return;
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('jwt='))
      if (!jwtCookie) {
        return;
      }
      token = jwtCookie.split('=')[1]
      expirationDate = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('expirationDate=')).split("=")[1];
      user = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('user=')).split("=")[1];


    } else {
      token = localStorage.getItem("token")
      user = localStorage.getItem("user")
      expirationDate = localStorage.getItem("tokenExpiration")
      if (new Date().getTime() > +expirationDate || !token) {
        vuexContext.dispatch("logout")
        return
      }

    }
    vuexContext.commit("setToken", token)
    vuexContext.commit("setUser", user)
    vuexContext.commit("setTokenExpiration", +expirationDate - new Date().getTime())

    //vuexContext.commit("setLogoutTimer", +expirationDate - new Date().getTime())

  },
  loginUser(vueContext, authData) {
    console.log("login user");
    return this.$axios
      .$post("login", {
        authData
      })
      .then(result => {
        vueContext.commit("setToken", result.token);
      })
      .catch(e => {
        console.log(e);
      });
  },
  authenticateUser(vueContext, authData) {
    //let authUrl = process.env.baseUrl + "/api/login"
    return this.$axios
      .$post("/login", {
        user_id: authData.user_id,
        password: authData.password
      })
      .then(result => {
        vueContext.commit("setToken", result.token);
        vueContext.commit("setUser", result.userName);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", result.userName);
        localStorage.setItem(
          "tokenExpiration",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        vueContext.commit(
          "setTokenExpiration",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        Cookie.set("jwt", result.token);
        Cookie.set("user", result.userName);
        Cookie.set(
          "expirationDate",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        vueContext.dispatch("setLogoutTimer", 12 * 60 * 60 * 1000);
      })
      .catch(e => {
        throw e.response;
      });
  },
  authenticateWithToken(vueContext, authData) {
    //let authUrl = process.env.baseUrl + "/api/login"
    return this.$axios
      .$post("/validate_edit_cv", {
        email: authData.email,
        token: authData.token
      })
      .then(result => {
        vueContext.commit("setToken", result.token);
        vueContext.commit("setUser", result.userName);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", result.userName);
        localStorage.setItem(
          "tokenExpiration",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        vueContext.commit(
          "setTokenExpiration",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        Cookie.set("jwt", result.token);
        Cookie.set("user", result.userName);
        Cookie.set(
          "expirationDate",
          new Date().getTime() + 12 * 60 * 60 * 1000
        );
        vueContext.dispatch("setLogoutTimer", 12 * 60 * 60 * 1000);
      })
      .catch(e => {
        throw e.response;
      });
  },
  setLogoutTimer(vueContext, duration) {
    setTimeout(() => {
      vuexContext.dispatch("logout");
    }, duration);
  },
  logout(vueContext) {
    vueContext.commit("clearToken");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  }
};

export const getters = {
  isAuthenticated(state) {
    //console.log("tokenExpiration:", localStorage.getItem("tokenExpiration"))
    if (typeof state.token !== "undefined" && state.token) {
      return true;
    }
    return false;
  },
  getUserName(state) {
    //console.log("tokenExpiration:", localStorage.getItem("tokenExpiration"))
    return state.user;
  }
};
