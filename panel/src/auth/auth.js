import axios from "axios";
import api from '../api/'
module.exports = {
    login: function (username, password, callback) {
        this.getToken(
            username,
            password,
            (response) => {
                this.updateLocalStorage(response.data);
                if (callback) callback({ "success": true });
            },
            (errors) => {
                if (callback) callback({ "success": false, "errors": errors.errors });
            })
    },

    changePassword: function (actual, password, repassword, callback) {
        this.updatePassword(
            actual,
            password,
            repassword,
            (response) => {
                this.updateLocalStorage(response.data);
                if (callback) callback({ "success": true });
            },
            (errors) => {
                if (callback) callback({ "success": false, "errors": errors.errors });
            })
    },

    sessionTimeoutLogin: function (token, password, callback) {
        var response = axios.post(api.authCheckWithToken, {
            token: token,
            password: password
        }, this.header(token)).then(response => {
            if (response.status == 200) {
                let data = response.data.data;
                this.updateLocalStorage(data);
                if (callback) callback({ "success": true });
            } else {
                if (callback) callback({ "success": false, "errors": response.errors });
            }
        }).catch(response => {
            if (callback) callback({ "success": false, "errors": response.errors });
        });
    },

    logout: function () {
        axios.get(
            api.authLogout,
            this.header()
        ).then(function (response) {
            delete localStorage.token;
            delete localStorage.permisos;
            window.location.reload();
        }).catch(function (e) {
        })
    },

    isLoggedIn: async function () {
        if (typeof (localStorage.token) != "undefined") {
            var response = await this.checkToken(localStorage.token);
            if (response.exists) {
                this.updatePermission();
                return response;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    clearToken: function (callback) {
        axios.get(api.clearToken, this.header()).then(response => { if (callback) callback(response.data.data) });
        delete localStorage.token;
        delete localStorage.permisos;
    },

    checkToken: async function (token) {
        let reply = (await axios.post(api.authCheck, {
            token: token
        }));
        this.updateLocalStorage(reply.data.data);
        return reply.data.data;
    },



    hasPermission: function (permission) {
        if (localStorage.permisos != "" && localStorage.permisos != undefined) {
            var permisos = JSON.parse(localStorage.permisos);
            if (permisos.filter(x => x == permission).length > 0) {
                return true;
            } else {
                return false;
            }
        }
    },

    updatePermission: function () {
        var self = this;
        axios.get(api.authGetPermissions, self.header()).then(function (response) {
            if (response.status == 200) {
                let data = response.data.data;
                localStorage.permisos = JSON.stringify(data.permisos);
            } else {
                self.logout();
            }
        })
    },

    token: function () {
        return localStorage.token;
    },

    header: function (token) {
        return {
            headers: {
                'Accept': 'application/json',
                "Authorization": "Token " + (token ? token : localStorage.token),
            },
        };
    },

    fileFormHeader: function (token) {
        return {
            headers: {
                "Authorization": "Token " + (token ? token : localStorage.token),
                "Content-Type": "multipart/form-data"
            },
            async: false,
            cache: false,
            contentType: false,
            processData: false,
        };
    },


    updatePassword: function (actual_password, new_password, repeat_new_password, callback, errorCallback) {
        axios.post(api.authChangePassword, {
            actual_password: actual_password,
            new_password: new_password,
            repeat_new_password: repeat_new_password,
        }, this.header()).then(function (response) {
            if (response.status == 200) {
                if (callback) callback(response.data);
            } else {
                if (errorCallback) errorCallback({
                    "success": false
                });
            }
        }).catch(function (e) {
            if (errorCallback) errorCallback({
                "success": false
            })
        })
    },

    getToken: function (username, password, callback, errorCallback) {
        axios.post(api.auth, {
            username: username,
            password: password,
        }).then(function (response) {
            if (response.status == 200) {
                if (callback) callback(response.data);
            } else {
                if (errorCallback) errorCallback({
                    "success": false
                });
            }
        }).catch(function (e) {
            if (errorCallback) errorCallback({
                "success": false
            })
        })
    },

    updateLocalStorage: function (data) {
        if (data.token != undefined) localStorage.token = data.token;
        if (data.permisos != undefined) localStorage.permisos = JSON.stringify(data.permisos);
        if (data.configuraciones != undefined) localStorage.configuraciones = JSON.stringify(data.configuraciones);
        if (data.displayname != undefined) localStorage.displayname = data.displayname;
        if (data.iduser != undefined) localStorage.iduser = data.iduser; 
    }
}