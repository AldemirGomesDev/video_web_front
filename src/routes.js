import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';

import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Video from './pages/Video';
import User from './pages/User';


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )
        }
    />
);

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/register" component={Register} />
                <PrivateRoute path="/home" component={HomePage} />
                <PrivateRoute path="/video/:id" component={Video} />
                <PrivateRoute path="/user" component={User} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes; 