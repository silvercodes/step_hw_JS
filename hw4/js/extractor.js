'use strict';

/**
 * window.onload
 */
window.onload = () => {
    const chkUseUri = document.getElementById('useUri');
    const chkUseText = document.getElementById('useText');
    const url = document.getElementById('url');
    const text = document.getElementById('text');
    const btnGo = document.getElementById('btnGo');

    /**
     * Click radiobutton URL
     */
    chkUseUri.addEventListener('click', (e) => {
        if (e.target.checked) {
            url.disabled = false;
            text.disabled = true;
            url.oninput();
            url.focus();
            url.select();
        }
    });

    /**
     * Click radiobutton Text
     */
    chkUseText.addEventListener('click', (e) => {
        if (e.target.checked) {
            url.disabled = true;
            text.disabled = false;
            text.oninput();
            text.focus();
            text.select();
        }
    });

    /**
     * url change value
     */
    url.oninput = () => {
        if(chkUseUri.checked)
            btnGo.disabled = !(url.value.length > 0);
    };

    /**
     * text change value
     */
    text.oninput = () => {
        if(chkUseText.checked)
            btnGo.disabled = !(text.value.length > 0);
    };

    /**
     * Click key Enter on keyboard
     * @param e{event}
     */
    document.onkeyup = (e) => {
        e.preventDefault();
        if(e.keyCode === 13)
            btnGo.click();
    };

    /**
     * Click button Extract
     */
    document.getElementById('btnGo').addEventListener('click', () => {
        const extractor = chkUseUri.checked ?
            new Extractor(url.value).getContentFromUrl() :
            new Extractor().getContentFromTextArea(text.value);
    });
};

/**
 * Class Extractor
 * @param url{string}
 * @constructor
 */
function Extractor(url = null) {
    this.url = url;
    let content;

    /**
     * Get html content from url using http://www.whateverorigin.org
     */
    this.getContentFromUrl = () => {
        $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(this.url) + '&callback=?', (data) => {
            if (data) {
                content = data.contents;
                parsing();
            }
        });
    };

    /**
     * Get html content from textarea
     * @param text{string}
     */
    this.getContentFromTextArea = (text) => {
        content = text;
        parsing();
    };

    /**
     * Processing the html
     */
    const parsing = () => {
        let table = document.getElementById('results');
        if(table)
            table.parentNode.removeChild(table);

        const arrResults = [];

        let pattern = /<a.*?>.*?<\/a>/ig;
        let arrFound = content.match(pattern);

        for (let key in arrFound) {
            let href,
                name;

            let hrefRes = arrFound[key].match(/href="(http.*?)"/);
            let nameRes = arrFound[key].match(/(<.*?>)+(.*?)(<\/.*?>)+/);

            console.log('HREF=');
            console.log(hrefRes);
            console.log('NAME=');
            console.log(nameRes);

            if (hrefRes) {
                href = hrefRes[1];
                name = nameRes[2];
                if(document.getElementById('chkWithNames').checked) {
                    if(name) {
                        arrResults.push({
                            href: href,
                            name: name
                        });
                    }
                }
                else {
                    arrResults.push({
                        href: href,
                        name: name
                    });
                }
            }
        }
        show(arrResults);
    };

    /**
     * Create and insert a table with results
     * @param arrResults{[{href: {string}, name: {string}}...]}
     */
    const show = (arrResults) => {
        const body = document.getElementsByTagName('body')[0];

        const container = document.createElement('div');
            container.id = 'results';
            container.classList.add('container');
            container.classList.add('mt-4');

        const tableTitle = document.createElement('h5');
            tableTitle.innerText = 'Results (' + arrResults.length + '):';
        container.appendChild(tableTitle);

        const tbl = document.createElement('table');
            tbl.classList.add('table');
            tbl.classList.add('table-striped');
            tbl.style.wordBreak = 'break-all';

        let tblBody = document.createElement('tbody');
        let tblHead = document.createElement('thead');
        let tblHeadRow = document.createElement('tr');

        let thNumber = document.createElement('th');
        let thHref = document.createElement('th');
        let thName = document.createElement('th');
            thNumber.innerText = '#';
                thNumber.style.width = '5%';
            thHref.innerText = 'Link';
            thName.innerText = 'Name';
                thName.style.width = '15%';
        tblHeadRow.appendChild(thNumber);
        tblHeadRow.appendChild(thHref);
        tblHeadRow.appendChild(thName);

        tblHead.appendChild(tblHeadRow);
        tbl.appendChild(tblHead);

        tbl.appendChild(tblBody);

        arrResults.forEach((item, i) => {
            let trow = document.createElement('tr');

            let cell = document.createElement('td');
                cell.innerText = i + 1;
            trow.appendChild(cell);

            cell = document.createElement('td',);
                let link = document.createElement('a');
                link.href = item.href;
                link.innerText = item.href;
                cell.appendChild(link);
            trow.appendChild(cell);

            cell = document.createElement('td');
                cell.innerText = item.name;
            trow.appendChild(cell);

            tblBody.appendChild(trow);
        });

        container.appendChild(tbl);
        body.appendChild(container);
    };
}

