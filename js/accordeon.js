"use strict"

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });

    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);

    }
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];

    });




    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;

        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });


        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }

            });
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });

            initSpollers(spollersArray, matchMedia);
        });
    }
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);

            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        }
        );
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollersBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {

            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;

            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);

            }
            e.preventDefault();

        }

    }
    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}

//________________________________________________________________________________________________________________
let _slideUp = (target, duration = 500) => {
    if (target.classList.contains("_slide")) return;
    target.classList.add("_slide");

    let style = target.style;

    style.transitionProperty = "height, margin, padding";
    style.transitionDuration = `${duration}ms`;
    style.height = `${target.offsetHeight}px`;
    target.offsetHeight;

    style.overflow = "hidden";

    style.height = 0;
    style.paddingTop = 0;
    style.paddingBottom = 0;
    style.marginTop = 0;
    style.marginBottom = 0;

    setTimeout(() => {
        target.hidden = true;
        [
            "height",
            "padding-top",
            "padding-bottom",
            "margin-top",
            "margin-bottom",
            "overflow",
            "transition-duration",
            "transition-property",
        ].forEach(e => style.removeProperty(e));
        target.classList.remove("_slide");
    }, duration);
};

let _slideDown = (target, duration = 500) => {
    if (target.classList.contains("_slide")) return;
    target.classList.add("_slide");

    if (target.hidden) target.hidden = false;

    let style = target.style;

    let height = target.offsetHeight;

    style.overflow = "hidden";

    style.height = 0;
    style.paddingTop = 0;
    style.paddingBottom = 0;
    style.marginTop = 0;
    style.marginBottom = 0;

    target.offsetHeight;

    style.transitionProperty = "height, margin, padding";
    style.transitionDuration = `${duration}ms`;
    style.height = `${height}px`;

    [
        "padding-top",
        "padding-bottom",
        "margin-top",
        "margin-bottom",
    ].forEach(e => style.removeProperty(e));

    setTimeout(() => {
        [
            "height",
            "overflow",
            "transition-duration",
            "transition-property",
        ].forEach(e => style.removeProperty(e));
        target.classList.remove("_slide");
    }, duration);
};

let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration);
    _slideUp(target, duration);
};


