import {useLocation} from "react-router-dom";
import Home from "./Home";

function Schedule() {
 let data = useLocation();
 console.log(data); //state would be in data.state//

    return(
        <Home employee={data.state.employee}/>
    )
}

export default Schedule;