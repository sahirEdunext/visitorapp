import React, { useState,useEffect, useContext } from 'react'
import { Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import Routes from './routes';
import Authentication from './utils/Authentication';
import axios from 'axios';
import Loader from './components/Loader';
import { getSchoolData } from './service/backendService';

export const SchoolContext = React.createContext();

const PrivateRoute = ({component:Comp,path,role, ...rest}) => (
  <Route
      path={path}
      {...rest}
      render={props =>{
          if(role == 'user'){
            return Authentication.checkAuthentication() ? <Comp {...props}/> : <Redirect to = "/"/>;
          }else if (role == 'parents') {
            return Authentication.checkAParentuthentication() ? <Comp {...props}/>: <Redirect to = "/parentlogin"/>;
          }
          else{
            return Authentication.checkGuardAuthentication() ? <Comp {...props}/> : <Redirect to = "/guardlogin"/>;
          }
        }    
      }
  />
);

const App = () => {
    const [loader, setloader] = useState(false);
    const [schooldata, setSchoolData] = useState([]);

    axios.interceptors.request.use(request => {
      setloader(true);
      return request;
    })
    axios.interceptors.response.use(response => {
      setloader(false);
      return response;
    },error => {
      setloader(false);
      return Promise.reject(error);
    })
    useEffect(() => {
      getSchoolInfo();
    },[])
    const getSchoolInfo= ()=>{
      getSchoolData().then(res=>{
        setSchoolData(res.data.data);
      });
    }
    return (
      <SchoolContext.Provider value = {schooldata}>
      <React.Fragment>
        <BrowserRouter>
        { loader ? <Loader/> : null}
          <Switch>
          {
            Routes.map((route,i) =>(route.AuthenticationRequired ?
              <PrivateRoute key={i} {...route}/> :
              <Route key={i} {...route}/>
              ))
          }
        </Switch>
        </BrowserRouter>
    </React.Fragment>
    </SchoolContext.Provider>
  );
}

export default App;
    