const React = window.React;


export class StageHistory extends React.Component {
    render() {
        const data = ["data1", "data2", "data3", "data4", "data5"];
        return (<div>
            <ul>
                {data.map((d) => (<li>{d}</li>))}
            </ul>
        </div>);
    }
}