window.setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

window.getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

window.eraseCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

window.IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !('MSStream' in window);

window.IS_ANDROID = /(android)/i.test(window.navigator.userAgent);

window.cameraiOSInstructions = `
    You need to allow camera access to use Augmented Reality.
    Please, click on "RESTART" and try again.
`;

window.cameraAndroidInstructions = `
    You need to allow camera access to use Augmented Reality. Please, follow these steps:
    reset your settings for this website using the locker button on your Browser address bar,
    then click on "Permissions" and "Reset permissions".
    Then, click on "RESTART" to try again.
`;
