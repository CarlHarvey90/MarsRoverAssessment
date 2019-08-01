import React from "react";
import Rover from "./rover";
import Grid from "./Grid";

/** 
* MOVE_VECTOR is used as a const to determine which direction to go from the the current
* co-ords. If 0, 0 is starting then to go down/south you would -1 from the y axis and move
* your position down leaving the x axis the same.
*/
const MOVE_VECTOR = {
    S: [0, -1],
    W: [-1, 0],
    N: [0, 1],
    E: [1, 0]
};
/**
 * The app uses 3 commands to move the rover, L = left, R = right and M = move.
 * LEFT_TURNS_MAP will generate the the direction accordingly when used in a current direction.
 * If you are facing WEST and turn LEFT you can only be facing SOUTH therefore a const is used.
 */
const LEFT_TURNS_MAP = {
    N: "W",
    W: "S",
    S: "E",
    E: "N"
};
 /**
  * The same rule applies for turning right as it does for turning left.
  */
const RIGHT_TURNS_MAP = {
    N: "E",
    E: "S",
    S: "W",
    W: "N"
};

class Mars extends React.Component {

    initialState = {
        start: null,
        end: null,
        randomize: "Yes",
        ops: [],
        position: "0-0",
        facing: "N",
        path: null,
        error: null,
    };

    state = Object.assign({}, this.initialState);

    componentDidMount() {
        this.reset(() => {
            this.process(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.reset(() => {
            this.process(nextProps);
        });
    }

    reset = (cb) => {
        this.setState(this.initialState, cb);
    };

    process = (props) => {
        const {commands, position} = props;
        if (commands === '') {
            this.setState(this.initialState);
        } else {
            const parts = position.split(" ");
            this.setState(
                {
                    start: parts[0] + "-" + parts[1],
                    position: parts[0] + "-" + parts[1],
                    facing: parts[2]
                },
                () => {
                    if (props.execute) {
                        this.execute(commands);
                    }
                }
            );
        }
    };

    execute = (commands) => {
        let ops = (commands || "").split("");
        this.setState({ops}, () => {
            setTimeout(this.run.bind(this), 500);
        });
    };

    run = () => {
        let ops = this.state.ops.slice();
        let {position, path, facing} = this.state;
        path = path || {};
        path[position] = facing;
        let op = ops.shift();
        let newPosition = {};
        if (op === "L") {
            newPosition = this.turnRoverLeft();
        } else if (op === "R") {
            newPosition = this.turnRoverRight();
        } else if (op === "M") {
            newPosition = this.moveRoverForward();
        } else {
            console.log("Invalid command");
        }
        if (newPosition.error) {
            alert('Can not move beyond the boundaries of Mars');
        }
        this.setState(Object.assign(this.state, {
            ops,
            path,
            ...newPosition
        }), () => {
            if (this.state.ops.length > 0 && !this.state.error) {
                setTimeout(this.run.bind(this), 300);
            } else {
                this.setState({
                    end: this.state.position
                })
            }
        })

    };

    moveRoverForward = () => {
        const {size} = this.props;
        const {position, facing} = this.state;
        const moveVector = MOVE_VECTOR[facing];
        const pos = position.split('-').map(Number);
        const x = pos[0] + moveVector[0];
        const y = pos[1] + moveVector[1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return {error: true};
        }
        return {
            position: x + '-' + y
        };
    };

    turnRoverLeft = () => {
        const {facing} = this.state;
        return ({
            facing: LEFT_TURNS_MAP[facing]
        });
    };

    turnRoverRight = () => {
        const {facing} = this.state;
        return ({
            facing: RIGHT_TURNS_MAP[facing]
        });
    };

    // impassableRandomizer = () => {
    //     //let impValue = null;
        
    //     //console.log(impValue + ' imp value');
    // };

    // impassableRandomizer(count) {
    //     if (this.state.count === "Yes"){
    //         let {r} = 0;
    //         r = Math.floor(Math.random() * 4) + 1;
    //         console.log(r);
    //         //r == 1 ? '-r' : '-o';
    //         if (r === 1){
    //             r = '-r';
    //         } else {
    //             r = '-o';
    //         }
    //         //this.state.count++;
    //         //console.log(count);
    //         //count = "No";
    //         this.setState.count = "No";
    //     }
    // }

    render() {
        const {size} = this.props;
        let {position, facing, path} = this.state;
        //let {r} = 0;
        path = path || {};
        let cells = [];
        let ran = [];
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                cells.push(j + "-" + i);
                ran.push('-r');
            }
        }
        
        console.log(cells);
        return (
            <ul className="grid9">
                {cells.map(cell => {
                    let r = 0;
                    // r = Math.floor(Math.random() * 4) + 1;
                    // console.log(r);
                    let roverElm = null;
                    let roverPath = null;
                    let cellStatus = '';
                    //impassableRandomizer(count);
                    //if (this.state.randomize === "Yes"){
                        r = Math.floor(Math.random() * 4) + 1;
                        console.log(r);
                        //r == 1 ? '-r' : '-o';
                        // if (r === 1){
                        //     r = '-r';
                        // } else {
                        //     r = '-o';
                        // }
                        //this.state.count++;
                        //console.log(count);
                        //count = "No";
                        // this.setState.count = "No";
                    //}
                    if (this.state.error && this.state.end === cell) {
                        cellStatus = 'error';
                    }
                    if (this.state.start === cell) {
                        cellStatus += ' start';
                    }
                    if (this.state.end === cell) {
                        cellStatus += ' end';
                    }
                    /* 
                    This section updates the DOM to give the rover its postion or leave a ghost image behind.
                    This adds <span class="rover N  ">ðŸ›¦</span> to the li or <span class="rover E ghost ">ðŸ›¦</span> depending 
                    on where the rovers destination ends. It will always update as it goes. From Facing to ghost with the final
                    spot being Facing only to show final destination.
                    */
                    if (position === cell) {
                        roverElm = <Rover facing={facing}/>;
                    } else {
                        roverPath = (path[cell] ? <Rover facing={path[cell]} ghost={true}/> : null);
                    }
                    /**
                     * className = 
                     */
                    return (
                        // <li className={`cell ${!!path[cell] ? 'path ' : ''}` + `${r}` + `${cellStatus}`} key={cell}>
                        //     <label>{cell}</label>
                        //     {roverElm || roverPath}
                        // </li>
                        <li className={`cell ${!!path[cell] ? 'path ' : ''}` + `${r === 1 ? '-r' : '-o'}` + `${cellStatus}`} key={cell}>
                            <label>{cell}</label>
                            {roverElm || roverPath}
                        </li>
                    );
                })}
            </ul>
            
        );
    }
}

export default Mars;