import React from "react";
import { render } from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';
import history from "./history";
//router is the overall parent component
//switch is the direct child of the router component
//Route allows to match endpoints on the frontend
import App from './components/App';
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import './index.css';

render(
<Router history={history}>
    <switch>
        <Route exact path = '/' component={App}/>
        <Route path='/blocks' component = {Blocks}/>
        <Route path='/conduct-transaction' component = {ConductTransaction}/>
        <Route path='/transaction-pool' component = {TransactionPool}/>
    </switch>
</Router>, 
document.getElementById('root')
);