'use strict';

var intersect = require('intersect');
var uniq = require('uniq');

var range = require('./range');

module.exports = function (o) {
    var page = o.page;
    var pages = o.pages;
    var beginPages = o.beginPages ? range(Math.min(o.beginPages, pages)) : [];
    var endPages = o.endPages ? range(Math.max(pages - o.endPages, 0), pages) : [];
    var center, ret;

    if (beginPages.length + endPages.length >= pages) {
        return [range(pages)];
    }

    if (page === 0) {
        ret = [[0]];

        if (pages > 1) {
            if (!beginPages.length) {
                beginPages = [0, 1];
            }

            ret = [beginPages, difference(endPages, beginPages)].filter(function (a) {
                return a.length;
            });
        }

        return ret;
    }

    if (page === pages - 1) {
        endPages = [pages - 2, pages - 1];

        return [beginPages, difference(endPages, beginPages)].filter(function (a) {
            return a.length;
        });
    }

    center = [page - 1, page, page + 1];

    if (intersect(beginPages, center).length) {
        beginPages = uniq(beginPages.concat(center)).sort(function (a, b) {
            return a > b;
        });
        center = [];
    }

    if (intersect(center, endPages).length) {
        endPages = uniq(center.concat(endPages)).sort(function (a, b) {
            return a > b;
        });
        center = [];
    }

    if (!center.length && beginPages.length === endPages.length && beginPages.every(function (page, i) {
        return page === endPages[i];
    })) {
        return [beginPages];
    }

    if (!center.length && intersect(beginPages, endPages).length || endPages[0] - beginPages.slice(-1)[0] === 1) {
        return [uniq(beginPages.concat(endPages)).sort(function (a, b) {
            return a > b;
        })];
    }

    if (center[0] - beginPages.slice(-1)[0] === 1) {
        return [beginPages.concat(center), endPages];
    }

    if (endPages[0] - center.slice(-1)[0] === 1) {
        return [beginPages, center.concat(endPages)];
    }

    return [beginPages, center, endPages].filter(function (a) {
        return a.length;
    });
};

function difference(a, b) {
    return a.filter(function (v) {
        return b.indexOf(v) < 0;
    });
}