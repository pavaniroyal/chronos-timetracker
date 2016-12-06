import fetch from 'isomorphic-fetch';
import JiraClient from 'jira-connector';
import storage from 'electron-json-storage';

import { success, fail } from '../helpers/promise';
import * as types from '../constants/jira';

export function jwtConnect(token) {
  return dispatch => new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = 'http://localhost:5000/desktop-tracker/authenticate';
    fetch(url, options)
      .then(
        res => res.status === 200 && res.json()
      )
      .then(
        (json) => {
          const { baseUrl, username, password } = json;
          const host = baseUrl;
          const jiraClient = new JiraClient({
            host,
            basic_auth: {
              username,
              password,
            },
          });
          jiraClient.myself.getMyself({}, (err2, response) => {
            if (err2) {
              dispatch({
                type: types.THROW_ERROR,
                err2,
              });
              reject(fail(err2));
            } else {
              dispatch({
                type: types.GET_SELF,
                self: response,
              });
              dispatch({
                type: types.CONNECT,
                jiraClient,
                credentials: {
                  host,
                  username,
                  memorize: true, // temp
                },
              });
              resolve(success());
            }
          });
        }
      );
  });
}

export function connect(credentials) {
  return dispatch => new Promise((resolve, reject) => {
    const { host, username, password, memorize } = credentials.toJS();
    const jiraClient = new JiraClient({
      host,
      basic_auth: {
        username,
        password,
      },
    });
    jiraClient.myself.getMyself({}, (err, response) => {
      if (err) {
        dispatch({
          type: types.THROW_ERROR,
          err,
        });
        reject(fail(err));
      } else {
        dispatch({
          type: types.GET_SELF,
          self: response,
        });
        const url = 'http://localhost:5000/desktop-tracker/authenticate';
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            baseUrl: host,
            username,
            password,
          }),
        };
        fetch(url, options)
          .then(
            res => res.status === 200 && res.json()
          )
          .then(
            (json) => {
              dispatch({
                type: types.CONNECT,
                jiraClient,
                credentials: {
                  host,
                  username,
                  memorize,
                },
              });
              dispatch({
                type: types.SET_AUTH_SUCCEEDED,
              });
              const token = json.token;
              if (token) {
                dispatch({
                  type: types.SAVE_JWT,
                  token,
                });
              }
              if (memorize) {
                dispatch({
                  type: types.MEMORIZE_FORM,
                  data: {
                    host,
                    username,
                  },
                });
              }
              resolve(success);
            }
          );
      }
    });
  });
}

export function getSavedCredentials() {
  return dispatch => new Promise((resolve, reject) => {
    storage.get('jira_credentials', (error, credentials) => {
      if (error) {
        dispatch({
          type: types.THROW_ERROR,
          error,
        });
        reject(fail(error));
      }
      dispatch({
        type: types.GET_SAVED_CREDENTIALS,
        credentials,
      });
      resolve(success(credentials));
    });
  });
}

export function getJWT() {
  return dispatch => new Promise((resolve, reject) => {
    storage.get('desktop_tracker_jwt', (error, token) => {
      if (error || !token.length) {
        dispatch({
          type: types.THROW_ERROR,
          error,
        });
        reject(fail(error));
      }
      dispatch({
        type: types.GET_JWT,
        token,
      });
      resolve(success({ token }));
    });
  });
}

export function setAuthSucceeded() {
  return {
    type: types.SET_AUTH_SUCCEEDED,
  };
}