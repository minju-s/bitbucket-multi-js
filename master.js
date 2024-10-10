// ==UserScript==
// @name         Bitbucket Multi PR
// @match        https://bitbucket.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitbucket.org
// @grant        none
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    setInterval(() => {
        const $table = $('tr[data-qa=pull-request-row]').closest('table');
        if (!$table.hasClass("enhanced")) {
            const $table = $('tr[data-qa=pull-request-row]').closest('table');
            const $tableHead = $table.find('thead tr');
            if (!$tableHead.hasClass("enhanced")) {
                $tableHead.prepend('<th><input id="checkAll" type="checkbox"></th>');
                $tableHead.addClass("enhanced");
            }
            $('tr[data-qa=pull-request-row]').each((i, tr) => {
                const $tr = $(tr);
                if (!$tr.hasClass("enhanced")) {
                    $tr.prepend('<td><input type="checkbox"></td>')
                    $tr.addClass("enhanced");
                }
            })
            $table.addClass("enhanced");
        }
    }, 10);
})();



$('body').on('click', '#checkAll', (event) => {
    $('tr[data-qa=pull-request-row]').each((i, tr) => {
        const $tr = $(tr);
        const checkbox = $tr.find('td input')[0];
        checkbox.checked = event.target.checked
    })
});

$('body').on('click', 'h1[data-qa=page-header]', (event) => {
    const right = event.offsetX / event.target.offsetWidth > 0.5;
    const iframes = [];
    $('tr[data-qa=pull-request-row]').each((i, tr) => {
        const $tr = $(tr);
        const checkbox = $tr.find('td input')[0];
        if (checkbox.checked) {
            let src = $tr.find('a[data-qa=pull-request-row-link]')[0].href;
            if (right) {
                src = src.replace(/pull-requests\/\d*/, `pipelines/results/branch/master/page/1/filters/[pipelineType=branches%3A%20master]`);
            }
            const iframe = `<iframe src="${src}/diff" style="width:90%;height:500px"></iframe>`;
            iframes.push(iframe);
        }
    })
    console.log(iframes.join(''));
    $('body').replaceWith(iframes.join(''))
});
