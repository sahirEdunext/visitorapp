import Login from "./containers/Login/Login";
import GuardLogin from "./containers/GuardLogin/GuardLogin";
import Admission from "./containers/Admission/Admission";
import GuardAdmission from "./containers/GuardAdmission/GuardAdmission";
import Vendor from "./containers/Vendor/Vendor";
import General from "./containers/General/General";
import GuardGeneral from "./containers/GuardGeneral/GuardGeneral";
import GuardVendor from "./containers/GuardVendor/GuardVendor";
import Thankyou from "./containers/Thankyou/Thankyou";
import Complete from "./containers/Complete/Complete";
import GuardScreen from "./containers/SecurityGuardScreen/GuardScreen";
import AddVisitor from "./containers/SecurityGuardScreen/addVisitor";
import Visitors from "./containers/Visitors/Visitors";
import Qrvisitors from "./containers/Visitors/Qrvisitor";
import VisitorDeclartion from "./containers/VisitorDeclartion/VisitorDeclartion";
import VisitorDeclartionForQr from "./containers/VisitorDeclartion/VisitorDeclartionForQr";
import GuardProfile from "./containers/GuardProfile/GuardProfile";
import Otp from "./containers/otp/otp";
import PageNotFound from "./containers/PageNotFound/PageNotFound";
import SchoolSelected from "./containers/SchoolSelected/SchoolSelected";
import ParentLogin from "./containers/parentLogin/ParentLogin";
import StudentAttendance from "./containers/studentAttendance/StudentAttendance";
import ParentOtp from "./containers/parentOtp/ParentOtp";
import ParentRegister from './containers/parentRegister/ParentRegister';
import Thankyouforparent from './containers/Thankyou/Thankyouforparent';
import CheckinThankyou from "./containers/CheckinThankyou/CheckinThankyou"

const Routes = [
    {
        AuthenticationRequired : false,
        path:'/parentlogin',
        component:ParentLogin,
        role:'parents'
      },
      {
        AuthenticationRequired : true,
        path:'/parentotp',
        component:ParentOtp,
        role:'parents'
      },
      {
        AuthenticationRequired : true,
        path:'/studentAttendance',
        component:StudentAttendance,
        role:'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/checkinThankyou',
        component:CheckinThankyou,
        role:'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/parentregister',
        component:ParentRegister,
        role:'parents'
      },
      {
        AuthenticationRequired : false,
        path:'/login',
        component:Login,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/otp',
        component:Otp,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/admission',
        component:Admission,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/thankyou',
        component:Thankyou,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/thankyouparent',
        component:Thankyouforparent,
        role:'parents'
      },
      {
        AuthenticationRequired : true,
        path:'/guard',
        component: GuardScreen,
        role:'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/addVisitor',
        component: AddVisitor,
        role:'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/visitors',
        component:Visitors,
        role:'guard'
      },

      {
        AuthenticationRequired : true,
        path:'/Qrvisitors',
        component:Qrvisitors,
        role:'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/vendor',
        component:Vendor,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/general',
        component:General,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/declaration',
        component:VisitorDeclartion,
        role: 'guard'
      },
      {
        AuthenticationRequired : true,
        path:'/declarationqr',
        component:VisitorDeclartionForQr,
        role: 'guard'
      },
      {
        AuthenticationRequired : false,
        path:'/guardlogin',
        component:GuardLogin,
        role:'guard'
      },{
        AuthenticationRequired: true,
        path:'/guardprofile',
        component: GuardProfile,
        role: 'guard'
      },{
        AuthenticationRequired : true,
        path:'/guardadmission',
        component:GuardAdmission,
        role:'guard'
      },{
        AuthenticationRequired : true,
        path:'/guardgeneral',
        component:GuardGeneral,
        role:'guard'
      },{
        AuthenticationRequired : true,
        path:'/guardvendor',
        component:GuardVendor,
        role:'guard'
      },
      {
        AuthenticationRequired : false,
        path:'/:visitorId',
        component: SchoolSelected,
        role:'user'
      },
      {
        AuthenticationRequired : true,
        path:'/complete',
        component:Complete,
        role:'guard'
      },{
        AuthenticationRequired: false,
        path:'*',
        component: PageNotFound,
        role: 'guard'
      },
      {
        AuthenticationRequired: false,
        path: '*',
        component: PageNotFound,
        role: 'user'
      }
]

export default Routes;