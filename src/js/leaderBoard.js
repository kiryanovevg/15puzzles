const COOKIE_NAME = 'data';
const LEADER_COUNT = 4;

class LeaderBoard {

    constructor(tagId) {
        this.tagId = tagId;
    }

    show() {
        const data = this.getDataArray();
        let view;

        if (data.length === 0) {
            view = this.getEmptyView()
        } else {
            view = this.getTableView(data)
        }

        document.getElementById(tagId).innerHTML = view;

        const self = this;
        const btn = document.createElement('button');
        document.getElementById(tagId).appendChild(btn);
        btn.innerText = 'Clear';
        btn.addEventListener('click', function (e) {
            self.removeDataArray();
            self.show();
        })
    }

    getTableView(dataArray) {
        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.innerText = 'Leader Board';
        table.appendChild(caption);

        const createRow = function(item, header) {
            const row = document.createElement('tr');
            Object.keys(item).forEach(function (key, index) {
                const col = document.createElement('td');
                if (index !== 0) col.classList.add('align');
                if (header) col.classList.add('header');
                else col.classList.add('item');

                row.appendChild(col);
                col.innerText = item[key];
            });

            return row
        };

        table.appendChild(createRow({
            username: 'Username',
            seconds: 'Seconds'
        }, true));
        dataArray.forEach(function (item) {
            table.appendChild(createRow(item));
        });

        return table.outerHTML;
    }

    getEmptyView() {
        return 'Leader board is empty';
    }

    check(seconds) {
        if (seconds) {
            const dataArray = this.getDataArray();

            if (dataArray.length < LEADER_COUNT) return true;

            for (let i = 0; i < dataArray.length; i++) {
                const item = dataArray[i];
                if (seconds <= item.seconds) return true;
            }
        }
        return false;
    }

    add(username, seconds) {
        const dataArray = this.getDataArray();
        const obj = {
            username: username,
            seconds: seconds
        };

        dataArray.push(obj);
        dataArray.sort(function (a, b) {
            if (a.seconds < b.seconds) return -1;
            if (a.seconds > b.seconds) return 1;
            if (a.seconds === b.seconds) {
                if (a.username < b.username) return -1;
                if (a.username > b.username) return 1;
                if (a.username === b.username) return 0;
            }
        });
        if (dataArray.length > LEADER_COUNT) {
            dataArray.splice(LEADER_COUNT, 1);
        }

        this.saveDataArray(dataArray);
        // this.removeDataArray();
    }

    getDataArray() {
        const cookie = this.getCookie(COOKIE_NAME);
        if (cookie === null) {
            return [];
        } else {
            return JSON.parse(cookie);
        }
    }

    saveDataArray(dataArray) {
        if (dataArray != null)
            this.setCookie(COOKIE_NAME, JSON.stringify(dataArray), 3)
    }

    removeDataArray() {
        this.setCookie(COOKIE_NAME, '[]', 0);
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
        document.cookie = name+"="+value;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}