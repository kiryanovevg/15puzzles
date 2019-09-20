const ROW_COUNT = 4;
const ITEM_NAME = 'item';
const ITEM_SPLIT = '-';

class Game {

    field = document.getElementById('field');

    constructor() {
        const self = this;

        this.field.addEventListener('click', function (e) {
            if (e.target.id !== self.field.id) {
                self.moveItem(e.target)
            }
        });

        const ITEM_SIZE = 96;
        const MARGIN = 4;

        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < ROW_COUNT; j++) {
                const item = document.createElement('div');
                item.id = ITEM_NAME+ITEM_SPLIT+i+ITEM_SPLIT+j;

                item.style.top = (i*ITEM_SIZE + (i+1)*MARGIN) + 'px';
                item.style.left = (j*ITEM_SIZE + (j+1)*MARGIN) +'px';

                const num = i * ROW_COUNT + j + 1;
                if (num < ROW_COUNT * ROW_COUNT) {
                    if (i === 0) item.classList.add('first');
                    if (i === 1) item.classList.add('second');
                    if (i === 2) item.classList.add('third');
                    if (i === 3) item.classList.add('fourth');
                    item.classList.add('item_number');
                    item.innerText = num.toString()
                } else {
                    item.classList.add('item_empty');
                }

                this.field.appendChild(item);
            }
        }
    }

    checkPosition() {
        if (this.getItem(3, 3) !== this.getEmptyItem())
            return;

        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < ROW_COUNT; j++) {
                const itemNum = parseInt(this.getItem(i, j).innerText);
                const n = i*ROW_COUNT + (j+1);
                if (n < 16 && itemNum !== n) return;
            }
        }

        // alert('win')
        // document.getElementById('game').innerHTML += '\nWIN!'
    }

    moveItem(item) {
        if (!item.classList.contains('item_empty')) {
            const nearEmptyItem = this.getEmptyNearItem(item);
            if (nearEmptyItem) {
                // console.log(`move: ${item.id}; num: ${item.innerText}`);

                const tmp = {id: item.id,style: item.style.cssText};
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
}