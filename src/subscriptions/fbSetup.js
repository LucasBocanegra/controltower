const fbSetup = config => (send, done) => {
    const { appId } = config;
    const errorHandler = err => (err ? done(err) : null);

    const fbLoginStatusChange = data => {
        // console.log('----fbLoginStatusChange', data);
        if (data.status === 'connected') {
            send('user:fetchInfo', data, errorHandler);
            return send('user:signIn', data, errorHandler);
        }
        return send('user:signOut', data, errorHandler);
    };
    window.fbAsyncInit = () => {
        // console.log('----fbAsyncInit----');
        window.FB.init({
            appId,
            cookie: true,  // enable cookies to allow the server to access the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.7' // use graph api version 2.5
        });
        window.FB.Event.subscribe('auth.statusChange', fbLoginStatusChange);
        window.FB.getLoginStatus();
    };
};
export default fbSetup;