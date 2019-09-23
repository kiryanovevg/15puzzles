const DATA = 'data';

class LeaderBoard {

    constructor(tagId) {
        this.tagId = tagId;
    }

    show() {
        const data = this.getDataArray();
        let view;

        if (data) {
            view = JSON.stringify(data);
        } else {
            view = 'Empty data';
        }

        document.getElementById(tagId).innerText = view;
    }

    add(username, seconds) {
        let data = this.getDataArray();
        if (!data) data = [];

        const obj = {
            username: username,
            seconds: seconds
        };

        data.push(obj);
        data.push(obj);

        console.log(JSON.stringify(data));

        this.saveDataArray(data)
    }

    saveDataArray(data) {
        this.setCookie(DATA, JSON.stringify(data), 3)
    }

    getDataArray() {
        return JSON.parse(this.getCookie(DATA))
    }

    setCookie(name, value, daysToExpire) {
        let expires = "";
        if(daysToExpire) {
            const date = new Date();
            date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        // debugger;
        // const cookie = name+"="+value+expires+"; path=/ ";
        const cookie = name+"="+value;
        document.cookie = cookie;
    }

    removeCookie(name) {
        this.setCookie(name, "", 0);
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}