import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Athena from '../pages/Athena';
import Graphs from '../pages/Graphs';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Athena}/>
                <Route exact path="/graphs" component={Graphs}/>
                {/* <Route exact path="/cadastrar-investimento" component={CadastrarInvestimento}></Route> */}
            </Switch>
        </BrowserRouter>
    );
} 