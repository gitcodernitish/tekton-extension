import json
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)

CORS(app)


@app.route('/stage/jobs/<stage_id>')
def get_jobs(stage_id):
    job_data = {
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
    }
    return json.dumps(job_data.get(stage_id, []))


@app.route('/pipeline/stages/<pipeline_id>')
def get_stages(pipeline_id):
    stages_data = {
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
    }}
    return json.dumps(stages_data.get(pipeline_id, {}))


@app.route('/stage/status/<stage_id>')
def stage_status(stage_id):
    status = {
            "ACCEPTANCE": "SUCCESS",
            "INTEGRATION_TESTS": "RUNNING",
            "UNIT_TESTS": "SUCCESS",
            "P1_TESTS": "RUNNING",
            "P2_TESTS": "FAILED",
            "PERFORMANCE_AND_STRESS_TESTS": "RUNNING"
            }
    return status.get(stage_id, "FAILED")


@app.route('/pipelines/')
def pipelines():
    ps = ["CDM_DLC_PIPELINE", "DAG_PIPELINE1", "DAG_PIPELINE2"]
    return json.dumps(ps)
