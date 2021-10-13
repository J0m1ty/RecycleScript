// ==UserScript==
// @name         RecycleScript
// @version      0.1
// @description  Allows you to quote without quotes
// @author       Jomity
// @match        *://artofproblemsolving.com/*
// ==/UserScript==

(function() {
    'use strict';

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null) {
                callback();
                return;
            }
            else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                        return;
                    }
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }

    window.addEventListener('load', function() {
        for (let i = 0; i < 60000; i++) {
            setTimeout(function timer() {
                let posts = document.getElementsByClassName("cmty-post-right");
                for (let j = 0; j < posts.length; j++) {
                    if (posts[j].children[posts[j].children.length-1].innerHTML !== 'r') {
                        let element = document.createElement("span");
                        posts[j].appendChild(element);

                        element.title="Repost this post";
                        element.innerHTML = "r";
                        element.classList.add("cmty-post-repost");
                        element.classList.add("aops-font");
                        element.onclick = function() {
                            var quote = element.parentNode.getElementsByClassName("cmty-post-quote")[0];

                            var lastValue = null;
                            if (document.getElementsByClassName("cmty-post-textarea").length > 0) {
                                if (quote.closest("#feed-left") == null) {
                                    lastValue = document.getElementsByClassName("cmty-post-textarea")[0].value;
                                }
                                else if (quote.closest("#feed-left").querySelector("textarea")) {
                                    lastValue = quote.closest("#feed-left").querySelector("textarea").value;
                                }
                            }

                            quote.click();

                            if (quote.closest("#feed-left") == null) {
                                waitForElementToDisplay(".cmty-post-textarea", function() {
                                    let t = document.getElementsByClassName("cmty-post-textarea")[0].value;
                                    t = t.replace(lastValue,'');
                                    document.getElementsByClassName("cmty-post-textarea")[0].value = t.substring(t.indexOf(']') + 1).slice(0, -10);
                                }, 5, 200);
                            }
                            else {
                                setTimeout(function() {
                                    let t = quote.closest("#feed-left").querySelector("textarea").value;
                                    quote.closest("#feed-left").querySelector("textarea").value = t.substring(t.indexOf(']') + 1).slice(0, -10);
                                }, 20);
                            }
                        };
                    }
                }

            }, i * 200);
        }
    }, false);
})();
