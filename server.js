const express = require('express');
const path = require('path');
const app = express();

const PIPELINES = ["CDM_DLC_PIPELINE", "DAG_PIPELINE1", "DAG_PIPELINE2"];

app.get('/sample', (req, res) => res.send('Hello New Tekton Dashboard !'));
app.get('/bundle', (req, res) => res.sendFile(path.resolve(__dirname, './dist/bundle.js')));
app.get('/pipelines', (req, res) => res.send(JSON.stringify(PIPELINES)));
app.get('/stage-status/:id', (req, res) => {
    const stage_data = {
        "ACCEPTANCE": "SUCCESS",
        "INTEGRATION_TESTS": "RUNNING",
        "UNIT_TESTS": "SUCCESS",
        "P1_TESTS": "RUNNING",
        "P2_TESTS": "FAILED",
        "PERFORMANCE_AND_STRESS_TESTS": "RUNNING"
        };
    res.send(stage_data[req.params.id]);
});
app.get('/stages/:pipelineId', (req, res) => {
    const stages_data = {
        "CDM_DLC_PIPELINE": {
            "start": "ACCEPTANCE",
        "dependencies": [
            {
                "from": "ACCEPTANCE",
                "to": "P1_TESTS"
            },
            {
                "from": "P1_TESTS",
                "to": "P2_TESTS"
            },
            {
                "from": "P2_TESTS",
                "to": "PERFORMANCE_AND_STRESS_TESTS"
            }
        ]
        },
        "DAG_PIPELINE1": {
            "start": "UNIT_TESTS",
            "dependencies": [
                {
                    "from": "UNIT_TESTS",
                    "to": "ACCEPTANCE"
                },
                {
                    "from": "UNIT_TESTS",
                    "to": "INTEGRATION_TESTS"
                },
                {
                    "from": "ACCEPTANCE",
                    "to": "P1_TESTS"
                },
                {
                    "from": "INTEGRATION_TESTS",
                    "to": "P1_TESTS"
                }
                ]
        },
        "DAG_PIPELINE2": {
            "start": "UNIT_TESTS",
            "dependencies": [
                {
                    "from": "UNIT_TESTS",
                    "to": "ACCEPTANCE"
                },
                {
                    "from": "UNIT_TESTS",
                    "to": "INTEGRATION_TESTS"
                },
                {
                    "from": "ACCEPTANCE",
                    "to": "P1_TESTS"
                },
                {
                    "from": "INTEGRATION_TESTS",
                    "to": "P1_TESTS"
                },
                {
                    "from": "P1_TESTS",
                    "to": "P2_TESTS"
                },
                {
                    "from": "P2_TESTS",
                    "to": "PERFORMANCE_AND_STRESS_TESTS"
                }
                ]
    }};
    res.send(JSON.stringify(stages_data[req.params.pipelineId]))
});
app.get('/jobs/:stageId', (req, res) => {
    const job_data = {
        "ACCEPTANCE": [
             {
                "status": "PASSED",
                "name": "P0 Acceptance Test",
                "build": "6.0-1537",
                "time_verbose": "Completed 30 mins ago"
            },
            {
                 "status": "PASSED",
                "name": "Crystal Acceptance",
                "build": "6.0-1537",
                "time_verbose": "Completed 10 mins ago"
            },

        ],
        "P1_TESTS": [
             {
                "status": "RUNNING",
                "name": "Functional P1",
                "build": "6.0-1537",
                "time_verbose": "Started 20 mins ago"
            },
            {
                 "status": "RUNNING",
                "name": "UI Tests",
                "build": "6.0-1537",
                "time_verbose": "Started 5 mins ago"
            }
        ],
        "P2_TESTS": [
            {
                 "status": "FAILED",
                "name": "Functional P2",
                "build": "6.0-1526",
                "time_verbose": "Completed 6 days ago"
            }
        ],
        "PERFORMANCE_AND_STRESS_TESTS": [
         {
                "status": "RUNNING",
                "name": "Performance",
                "build": "6.0-1524",
                "time_verbose": "Started 4 hrs ago"
            },
            {
                 "status": "FAILED",
                "name": "Stress Tests",
                "build": "6.0-1524",
                "time_verbose": "Completed 15 mins ago"
            }
            ],
	"UNIT_TESTS": [
	    {   
                "status": "PASSED",
                "name": "Unit Tests",       
                "build": "6.0-1524",
                "time_verbose": "Completed 4 hrs ago"    
            }
	],
	"INTEGRATION_TESTS": [
	   {   
                "status": "RUNNING",
                "name": "Integrtion",       
                "build": "6.0-1537",
                "time_verbose": "Started 4 hrs ago"    
            },
	]
    };
    res.send(JSON.stringify(job_data[req.params.stageId]));
});
app.listen(3000, '0.0.0.0');

