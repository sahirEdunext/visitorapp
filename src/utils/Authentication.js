const Authentication = {
    checkAuthentication() {
        if (sessionStorage.getItem('authData') == undefined || sessionStorage.getItem('authData') == null ) {
          return false;
        }
        return true;
      },

      checkAParentuthentication() {
        if (sessionStorage.getItem('parentAuthData') == undefined || sessionStorage.getItem('parentAuthData') == null ) {
          return false;
        }
        return true;
      },
      checkGuardAuthentication() {
        if (sessionStorage.getItem('authguard') == undefined || sessionStorage.getItem('authguard') == null ) {
          return false;
        }
        return true;
      }
}
export default Authentication;