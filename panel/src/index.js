import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect, Match } from 'react-router-dom';


import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import '../scss/style.scss'
import '../scss/core/_dropdown-menu-right.scss'

import Full from './containers/Full/'

import AuthenticatedRoute from './AuthenticatedRoute/'


import Login from './views/Pages/Login/'
import Locked from './views/Pages/Locked/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import auth from './auth/'
import api from './api/'
/* import { Quill }  from 'react-quill';
// Sobrescribir el constructor de Scroll

const ScrollClass = Quill.import('blots/scroll');

class PatchedScroll extends ScrollClass {
  constructor(domNode, config) {
      try {
          // Llama al constructor original
          super(domNode, config);

          if (domNode) {
              // Reemplazar DOMNodeInserted con MutationObserver
              const observer = new MutationObserver((mutationsList) => {
                  for (const mutation of mutationsList) {
                      console.log('Mutation observed:', mutation);
                  }
              });

              observer.observe(domNode, { childList: true, subtree: true });
          } else {
              console.warn('PatchedScroll: domNode is undefined or null.');
          }

          // Llamadas adicionales si es necesario
          this.optimize();
          this.enable();
      } catch (error) {
          console.error('Error in PatchedScroll constructor:', error);
      }
  }
}

// Registrar el parche
Quill.register('blots/scroll', PatchedScroll, true); */

ReactDOM.render((
  <DragDropContextProvider backend={HTML5Backend}>
    <HashRouter>
      <Switch>
        <Route exact path="/login" name="Login Page" component={Login} />
        <Route exact path="/register" name="Register Page" component={Register} />
        <Route exact path="/404" name="Page 404" component={Page404} />
        <Route exact path="/500" name="Page 500" component={Page500} />
        <AuthenticatedRoute exact path="/locked" name="Locked Page" component={Locked} />
        {/* <AuthenticatedRoute path="/" component={Full} /> */}
        <AuthenticatedRoute path="/" 
                    component={Full} 
                    onCheck={res => {
                      if (res) {
                        if (!res.is_staff){
                          return api.BASE_URL;
                        }else if (res.changePasswordOnLog)
                          return "/changepassword";
                      }
                      return false;
                    }}
        />
      </Switch>
    </HashRouter>
  </DragDropContextProvider>

), document.getElementById('root'))