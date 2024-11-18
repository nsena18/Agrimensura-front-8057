import axios from 'axios';
import auth from '../auth';

function getLastChar(string) {
    let charArray = string.split('');
    if (charArray.length > 0)
        return charArray[charArray.length - 1];
    else
        return '';
}

function getValue(value) {
    if (typeof (value) == 'string') return value;
    else if (typeof (value) == 'number') return value.toString();
    else if (typeof (value) == 'function') return value().toString();
}

function generateUrl(url, id, depth, parameters) {
    let newurl = url;
    let lastChar = getLastChar(newurl);
    if (lastChar != '/') newurl += "/";
    if (id) newurl += getValue(id) + "/";
    if (parameters) {
        newurl += "?";
        if (depth) newurl += "depth=" + getValue(depth) + "&";
        if (parameters.fields) newurl += "fields=" + parameters.fields.join(',') + "&";
        if (parameters.sort) newurl += "sort=" + parameters.sort.join(',') + "&";
        if (parameters.pageSize) newurl += "pageSize="+parameters.pageSize+"&";
        if (parameters.page) newurl += "page="+parameters.page+"&";
        if (parameters.filters) newurl += parameters.filters.join('&') + "&";
    } else {
        newurl += "?";
        if (depth) newurl += "depth=" + getValue(depth) + "&";
    }
    return newurl;
}

module.exports = {
    get: (url, id, depth, parameters, successCallback, errorCallback, failCallback) => {
        return axios.get(generateUrl(url, id, depth, parameters), auth.header())
            .then(response => {
                if (response.status == 200) {
                    if (successCallback) successCallback(response.data)
                } else {
                    if (errorCallback) errorCallback(response.data)
                }
                return response.data;
            }).catch(error => {
                let response = error.response;
                if (response) {
                    if (errorCallback) errorCallback(response.data)
                } else {
                    if (failCallback) failCallback(response)
                }
            })
    },
    post: (url, id, data, successCallback, errorCallback, failCallback) => {
        return axios.post(generateUrl(url, id), data, auth.header())
            .then(response => {
                if (response.status == 201) {
                    if (successCallback) successCallback(response.data);
                } else {
                    if (errorCallback) errorCallback(response.data);
                }
                return response.data;
            }).catch(error => {
                let response = error.response;
                if (response) {
                    if (errorCallback) errorCallback(response.data)
                } else {
                    if (failCallback) failCallback(response)
                }
            })
    },
    put: (url, id, data, successCallback, errorCallback, failCallback) => {
        return axios.put(generateUrl(url, id), data, auth.header())
            .then(response => {
                if (response.status == 200) {
                    if (successCallback) successCallback(response.data)
                } else {
                    if (errorCallback) errorCallback(response.data)
                }
                return response.data;
            }).catch(error => {
                let response = error.response;
                if (response) {
                    if (errorCallback) errorCallback(response.data)
                } else {
                    if (failCallback) failCallback(response)
                }
            })
    },
    patch: (url, id, data, successCallback, errorCallback, failCallback) => {
        return axios.patch(generateUrl(url, id), data, auth.header())
            .then(response => {
                if (response.status == 200) {
                    if (successCallback) successCallback(response.data)
                } else {
                    if (errorCallback) errorCallback(response.data)
                }
                return response.data;
            }).catch(error => {
                let response = error.response;
                if (response) {
                    if (errorCallback) errorCallback(response.data)
                } else {
                    if (failCallback) failCallback(response)
                }
            })
    },
    delete: (url, id, successCallback, errorCallback, failCallback) => {
        return axios.delete(generateUrl(url, id), auth.header())
            .then(response => {
                if (response.status == 200) {
                    if (successCallback) successCallback(response.data)
                } else {
                    if (errorCallback) errorCallback(response.data)
                }
                return response.data;
            }).catch(error => {
                let response = error.response;
                if (response) {
                    if (errorCallback) errorCallback(response.data)
                } else {
                    if (failCallback) failCallback(response)
                }
            });
    }
}