import React, {useRef} from 'react';
import Xarrow from 'react-xarrows';
//import './components.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';


class PipelineData extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div>Branch - {this.props.branch}</div>
                <div>Owner - {this.props.owner}</div>
            </div>);
    }
}


class Job extends React.Component {
    constructor(props) {
        super(props);
    }

    getStatusColor() {
          // Get the status based on the ID
          if (this.props.status == "RUNNING") { return "orange"}
          else if (this.props.status == "PASSED") {return "green"}
          return "red"
    }

    render() {
        return (
            <div className="job">
                <div className="job-name">{this.props.name}</div>
                <div style={{color: this.getStatusColor()}} className="job-status">{this.props.status} - {this.props.build}</div>
                <div className="job-completion-time">{this.props.time_verbose}</div>
                <a href="/job/details/" className="job-detail blue-tag">Details</a>
            </div>);
    }
}


class StageStatus extends React.Component {
    constructor(props) {
        super(props);
        
    }

    getStatusColor() {
        // Get the status based on the ID
        if (this.props.status == "RUNNING") { return "orange"}
        else if (this.props.status == "SUCCESS") {return "green"}
        return "red"
    }

    render() {
        return (<span className="stage-status" style={{background: this.getStatusColor()}}></span>);
    }
}


class Stage extends React.Component {
    constructor(props) {
        super(props);
        this.positionX = 0;
        this.positionY = 0;
        this.state = {
            jobs: [],
            status: "NOT_FOUND"
        };

        this.getJobData = this.getJobData.bind(this);
        this.getStageStatus = this.getStageStatus.bind(this);
        this.getJobData();
        this.getStageStatus();
    }

    componentDidMount() {
        const rect = this.props.reference;
        if (rect.current) {
            console.log(rect.current);
        }
    }

    componentDidUpdate() {
        const rect = this.props.reference;
        if (rect.current) {
            console.log(rect.current);
        }
    }

    getStageStatus() {
        axios.get("http://127.0.0.1:5000/stage/status/"+this.props.id).then((data) => {
            this.setState({
                status: data.data
            });
        })
    }

    getJobData() {
        /*
        return [
            {
                "status": "PASSED",
                "name": "P0 Acceptance Test",
                "build": "6.0-1537",
                "time_verbose": "Completed 10 mins ago"
            },
            {
                 "status": "FAILED",
                "name": "P1 Acceptance Test",
                "build": "6.0-1537",
                "time_verbose": "Completed 5 mins ago"
            }
        ]*/
        axios.get("http://127.0.0.1:5000/stage/jobs/"+this.props.id).then((data) => {
            this.setState({
                jobs: data.data
            });
        })
    }

    renderJobs() {
        let jobs = [];
        //const jobsData = this.getJobData();

        for (const jobData of this.state.jobs) {
            jobs.push(<Job name={jobData["name"]} status={jobData["status"]} build={jobData["build"]} time_verbose={jobData["time_verbose"]}/>)
        }

        return jobs;
    }

    getStageName() {
        // Get name of the stage based on the id
        return this.props.id;
    }

    render() {

        return (
            <span id={this.props.id}ref={this.props.reference} className="stage">
                <span className="stage-data">
                    <StageStatus status={this.state.status}/>
                    <div className="stage-container">
                        <div className="stage-header">
                            <span className="float-left font-size-20 stage-name">{this.getStageName()}</span>
                            
                            <span className="stage-right">
                                <a href="/stage/history/" className="blue-tag">History</a>
                            </span>
                        </div>
                        <div className="stage-body">
                            <div className="jobs-container">
                                { this.renderJobs() }
                            </div>
                        </div>
                        <div className="stage-tail">
                            <span className="float-left blue-tag promotion-criteria"><a href="/stage/promotion-criteria/">Promotion Criteria</a></span>
                        </div>
                    </div>
                </span>
            </span>
        );
    }
}

class PipelineView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
        this.stageMap = {};
        this.state = {
            startNode: null,
            adjList: {}
        }
        this.refIndex = 0;
        this.getStagesStructure();
    }

    getStagesStructure() {
        /*
        return {
            start: "A",
            dependencies: [
                {
                    from: "A",
                    to: "B"
                },
                {
                    from: "B",
                    to: "C"
                },
                {
                    from: "B",
                    to: "D"
                },
                {
                    from: "C",
                    to: "E"
                },
                {
                    from: "D",
                    to: "E"
                },
                {
                    from: "D",
                    to: "F"
                }
            ]
        }*/
    
        axios.get("http://127.0.0.1:5000/pipeline/stages/"+this.props.match.params.id).then(
            (data) => {
                console.log(data);
                this.setState({
                    startNode: data.data.start,
                    adjList: this.formDependenctList(data.data.dependencies),
                    dependencies: data.data.dependencies
                })
            }
        );
    }

    formDependenctList(dependencies) {
        let adjList = {};
        for (const index in dependencies) {
            const edge = dependencies[index];
            const from = edge["from"];
            const to = edge["to"]
            if (adjList[from] === undefined) {
                adjList[from] = [];
            }
            adjList[from].push(to);
        }
        return adjList;
    }

    renderConnectors() {
        let connectors = [];

        for (const index in this.state.dependencies) {
            const edge = this.state.dependencies[index];
            connectors.push(<Xarrow start={edge["from"]} end={edge["to"]}/>)
        }

        return connectors;
    }

    renderStages() {
        let stageLevels = {}
        let stages = [];
        // Do BFS and render the stages
        this.refs = [React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef()];
        let queue = [];
        queue.push([this.state.startNode, 1]);
        let maxLevel = 1;
        while (queue.length != 0) {
            const nodeData = queue.shift();
            const node = nodeData[0];
            const nodeLevel = nodeData[1];
            maxLevel = Math.max(maxLevel, nodeLevel);
            // make Stage
            if (this.stageMap[node] === undefined) {
                const ref = this.refs[this.refIndex];
                this.refIndex += 1;
                this.stageMap[node] = ref;
                const stage = <Stage ref={this.stageMap[node]} reference={this.stageMap[node]} key={node} id={node} />
                
                if (stageLevels[nodeLevel] === undefined) {
                    stageLevels[nodeLevel] = [];
                }
                stageLevels[nodeLevel].push(stage);
                if (this.state.adjList[node] !== undefined) {
                    for (const index in this.state.adjList[node]) {
                        queue.push([this.state.adjList[node][index], nodeLevel+1]);
                    }
                }
            }
            
            
        }
        
        for (let level=1; level<=maxLevel; level++) {
            stages.push(
                <div className="stageLevel">
                    {stageLevels[level]}
                </div>
            );
        }        

        return (
            <div className="stages">{stages}</div>
            );
    }

    render() {
        return (
        <div>
            <PipelineData title={this.props.match.params.id} branch="b6.0" owner="Tony Stark" />
            {this.renderStages()}
            {this.renderConnectors()}
        </div>);
    }
}


export const Pipeline = PipelineView ;