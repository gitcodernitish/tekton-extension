import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { JobDetails } from './components/job-details';
import { StageHistory } from './components/stage-history';
import { Pipeline } from './components/pipeline';
import { PromotionCriteria } from './components/promotion-criteria';
import axios from 'axios';
import { BrowserRouter,Switch, Link, Route, matchPath } from 'react-router-dom';  


const pipeline1 = "CDM_DLC_PIPELINE";
const pipeline2 = "DAG_PIPELINE1";
const pipeline3 = "DAG_PIPELINE2";


function getPipelines() {
    return axios.get("http://127.0.0.1:5000/pipelines/");
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
            for (const pipeline of data[0].data) {
                links.push(<li> {pipeline} <a href={"/pipeline/"+pipeline}>{pipeline}</a></li>);
            }        
            this.setState({
                links
            })
        })
    }

    render() {
        return (<ul>{this.state.links}</ul>);

    }
}

ReactDOM.render(
    
    <BrowserRouter>
        <Switch>
            <Route path="/pipeline/:id" component={Pipeline}/>
            <Route path="/stage/history/" component={StageHistory} />
            <Route path="/job/details" component={JobDetails}/>
            <Route path="/stage/promotion-criteria/" component={PromotionCriteria} />
            <Route path="/" component={Index} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
