const ROW_COUNT = 4;
const ITEM_NAME = 'item';
const ITEM_SPLIT = '-';

const ITEM_SIZE = 96;
const MARGIN = 4;

class Game {

    constructor(tagId, winListener) {
        this.tagId = tagId;
        this.winListener = winListener;
        this.mixState = false;
        this.timer = null;

        // this.start()
    }

    start() {
        const self = this;

        const game = document.getElementById(this.tagId);
        game.innerHTML = '';

        const timerView = document.createElement('div');
        timerView.classList.add('timer');
        timerView.innerText = '00:00';
        game.appendChild(timerView);
        this.timer = {
            view: timerView,
            interval: null,
            seconds: 0,
        };

        this.field = document.createElement('div');
        this.field.id = 'field';
        this.field.classList.add('animate');
        this.field.addEventListener('click', function (e) {
            if (e.target.id !== self.field.id) {
                self.moveItem(e.target)
            }
        });

        game.appendChild(this.field);

        this.createGrid();
        // this.mix();
    }

    clear() {
        this.mixState = false;
        this.dropTime();
        document.getElementById(this.tagId).innerHTML = '';
    }

    createGrid() {
        this.field.innerHTML = '';
        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < ROW_COUNT; j++) {
                const num = i * ROW_COUNT + j + 1;
                this.field.appendChild(this.createItem(i, j, num));
            }
        }
    }

    mix() {
        this.dropTime();

        this.mixState = true;
        let previousItem;
        for (let i = 0; i < 100; i++) {
            const near = this.getNearItems(this.getEmptyItem());
            if (previousItem) {
                for (let j = 0; j < near.length; j++) {
                    if (near[j] === previousItem) near.slice(j, 1)
                }
            }
            previousItem = near[this.rand(0, near.length - 1)];
            this.moveItem(previousItem)
        }
        this.mixState = false;
    }

    solve() {
        this.dropTime();

        this.mixState = true;
        for (let i = 0; i < ROW_COUNT * ROW_COUNT; i++) {
            const row = parseInt(`${i / ROW_COUNT}`);
            const col = parseInt(`${i % ROW_COUNT}`);

            const item = this.getItem(row, col);
            const changedItem = this.field.childNodes[i];

            const tmp = {id: changedItem.id, style: changedItem.style.cssText};
            changedItem.id = item.id;
            changedItem.style.cssText = item.style.cssText;
            item.id = tmp.id;
            item.style.cssText = tmp.style;
        }
        this.mixState = false;
    }

    checkPosition() {
        if (!this.mixState) {
            //check&init timer
            if (!this.timer.interval) {
                const timer = this.timer;
                const self = this;

                this.setTime();
                timer.interval = setInterval(function () {
                    timer.seconds++;
                    self.setTime()
                }, 1000);
            }

            if (this.getItem(ROW_COUNT - 1, ROW_COUNT - 1) !== this.getEmptyItem())
                return;

            for (let i = 0; i < ROW_COUNT; i++) {
                for (let j = 0; j < ROW_COUNT; j++) {
                    const itemNum = parseInt(this.getItem(i, j).innerText);
                    const n = i*ROW_COUNT + (j+1);
                    if (n < ROW_COUNT*ROW_COUNT && itemNum !== n) return;
                }
            }

            //win
            const winSeconds = this.timer.seconds;
            this.dropTime();
            this.winListener(winSeconds);
        }
    }

    moveItem(item) {
        if (!item.classList.contains('item_empty')) {
            const nearEmptyItem = this.getEmptyNearItem(item);
            if (nearEmptyItem) {
                // console.log(`move: ${item.id}; num: ${item.innerText}`);

                const tmp = {id: item.id, style: item.style.cssText};
                item.id = nearEmptyItem.id;
                item.style.cssText = nearEmptyItem.style.cssText;
                nearEmptyItem.id = tmp.id;
                nearEmptyItem.style.cssText = tmp.style;

                this.checkPosition();
            }
        }
    }

    getEmptyNearItem(item) {
        const nearItems = this.getNearItems(item);
        const emptyItem = this.getEmptyItem();

        for (let i = 0; i < nearItems.length; i++) {
            if (nearItems[i] === emptyItem) {
                return emptyItem
            }
        }

        return false
    }

    getNearItems(item) {
        const pos = this.getItemPosition(item);
        const items = [];

        if (pos.row < 3) items.push(this.getItem(pos.row + 1, pos.col));
        if (pos.row > 0) items.push(this.getItem(pos.row - 1, pos.col));
        if (pos.col < 3) items.push(this.getItem(pos.row, pos.col + 1));
        if (pos.col > 0) items.push(this.getItem(pos.row, pos.col - 1));

        return items
    }

    getItemPosition(item) {
        const id = item.id.split(ITEM_SPLIT);
        return {
            row: parseInt(id[1]),
            col: parseInt(id[2])
        }
    }

    getEmptyItem() {
        return document.querySelector('.item_empty')
    }

    getItem(row, col) {
        return document.getElementById(ITEM_NAME+ITEM_SPLIT+row+ITEM_SPLIT+col)
    }

    createItem(row, col, num) {
        const item = document.createElement('div');
        item.id = ITEM_NAME+ITEM_SPLIT+row+ITEM_SPLIT+col;

        item.style.top = (row*ITEM_SIZE + (row+1)*MARGIN) + 'px';
        item.style.left = (col*ITEM_SIZE + (col+1)*MARGIN) +'px';

        if (num < ROW_COUNT * ROW_COUNT) {
            const componentToHex = function(c) {
                const hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };
            const rgbToHex = function (r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            };

            const r = 102;
            const g = 169;
            const b = 171;
            const mul = 7;
            const color = rgbToHex(
                r - (row * ROW_COUNT + col)*mul,
                g - (row * ROW_COUNT + col)*mul,
                b - (row * ROW_COUNT + col)*mul,
            );

            let style = document.getElementsByTagName('style')[0];
            if (!style) style = document.createElement('style');
            style.innerHTML = style.innerHTML + `\n.item_number_color${num} { background-color: ${color}; }`;
            document.getElementsByTagName('head')[0].appendChild(style);

            item.classList.add(`item_number_color${num}`);
            item.classList.add('item_number');
            item.innerText = num.toString()
        } else {
            item.classList.add('item_empty');
        }

        return item;
    }

    rand(from, to){
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    setTime() {
        const pad = function(val) {
            const valString = parseInt(val) + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        };
        const seconds = this.timer.seconds;
        this.timer.view.innerText = `${pad(seconds/60)}:${pad(seconds%60)}`;
    };

    dropTime() {
        clearInterval(this.timer.interval);
        this.timer.interval = null;
        this.timer.seconds = 0;
        this.setTime();
    }
}