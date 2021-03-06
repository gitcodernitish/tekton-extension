const React = window.React;
//import ReactDOM from 'react-dom';///
import './index.css';
import { JobDetails } from './components/job-details';
import { StageHistory } from './components/stage-history';
import { Pipeline } from './components/pipeline';
import { PromotionCriteria } from './components/promotion-criteria';
import axios from 'axios';
import { Switch, Link, Route, matchPath, MemoryRouter } from 'react-router-dom';  
//import createMemoryHistory from 'history/lib/createMemoryHistory';
//const history = createMemoryHistory();
/*
const reactRouterDom = require('react-router-dom');
const BrowserRouter = reactRouterDom.BrowserRouter;
const Switch = reactRouterDom.Switch;
const Link = reactRouterDom.Link;
const Route = reactRouterDom.Route;
const matchPath = reactRouterDom.matchPath;
*/

//const axios = require("axios");
const pipeline1 = "CDM_DLC_PIPELINE";
const pipeline2 = "DAG_PIPELINE1";
const pipeline3 = "DAG_PIPELINE2";


function getPipelines() {
    return axios.get("v1/extensions/rubrik-pipeline-extension/pipelines");
}

const pipeline = pipeline3;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            links: [],
        }
        this.loadLinks();
    }

    loadLinks() {
        Promise.all([getPipelines()]).then((data) => {
            let links = [];
            for (const index in data[0].data) {
                const pipeline = data[0].data[index];
                links.push(<li> {pipeline} <a href={"/pipeline/"+pipeline}>{pipeline}</a></li>);
		links.push(React.createElement("li",
			null,
			pipeline,
			React.createElement("a", {"href": "/pipeline/"+pipeline}, pipeline)));
            }        
            this.setState({
                links
            })
        })
    }

    render() {
        return (<ul>{this.state.links}</ul>);
        //return React.createElement("ul", null, this.state.links);
    }
}

class RouteExtension extends React.Component {

 render() {
     
    return(
    <MemoryRouter>
        <Switch>
            <Route path="/pipeline/:id" component={Pipeline}/>
            <Route path="/stage/history/" component={StageHistory} />
            <Route path="/job/details" component={JobDetails}/>
            <Route path="/stage/promotion-criteria/" component={PromotionCriteria} />
            <Route path="/" component={Index} />
        </Switch>
    </MemoryRouter>);/*
	return React.createElement(BrowserRouter, null,
		//React.createElement("Route", {"path": "/pipeline/:id", "component": Pipeline}),
		//React.createElement("Route", {"path": "/stage/history", "component": StageHistory}),
		//React.createElement("Route", {"path": "/job/details", "component": JobDetails}),
		//React.createElement("Route", {"path": "/stage/promotion-crieria/", "component": PromotionCriteria}),
		React.createElement("Route", {"path": "/", "component": Index}));
	 return React.createElement("div", null, "Hello World");*/
 }
}


class Extension extends React.Component {
    render() {
        return (<Pipeline id="CDM_DLC_PIPELINE"/>);
    }
}

export default Extension;