import React from "react";

class Rover extends React.Component {
    render() {
        const { facing, ghost } = this.props;
        // facing is direction of rover North South East West N S E W
        console.log(facing);
        //ghost is the after image left behind to show the path travelled
        //console.log(ghost);
        return <span className={`rover ${facing} ${ghost ? 'ghost' : ''} `}>🛦</span>
    }
};

export default Rover;