$(document).ready(() => {
    /*new cursor behavior*/
    const cursor = $("#cursor");

    $(document).on("mousemove", e => {
        const cursorX = e.pageX;
        const cursorY = e.pageY;

        cursor.css({
            top: cursorY + "px",
            left: cursorX + "px"
        });
    });
    const arrow = $("#arrow");

    $("a,.dots,.slide-btn-design,.nav-logo").on("mouseover", () => {
        arrow.addClass("rotate");
    });

    $("a,.dots,.slide-btn-design,.nav-logo").on("mouseleave", () => {
        arrow.removeClass("rotate");
    });

    $(".wrapper,.scrollbar-path").on("mouseover", () => {
        arrow.addClass("drag-cursor-right");
        arrow.removeClass("cursor");
        cursor.removeClass("cursor-design");
        cursor.addClass("cursor-drag");
    });

    $(".scrollbar-path").on("mouseover", () => {
        cursor.addClass("rotate");
    })

    $(".scrollbar-path").on("mouseleave", () => {
        cursor.removeClass("rotate");
    })

    $(".wrapper,.scrollbar-path").on("mouseleave", () => {
        cursor.addClass("cursor-design");
        arrow.addClass("cursor");
        cursor.removeClass("cursor-drag");
    });
    /* -----------------------------*/
    //nav scrollbar && scrollbar 
    const scrollbar = $(".scrollbar");
    const navScrollbar = $(".nav-scrollbar");



    const scrollbarParameters = () => {
        const documentHeight = $(document).height();
        const scrollYvalue = window.scrollY;
        const windowHeight = window.innerHeight;
        const percentOfScrolledSite = (scrollYvalue / (documentHeight - windowHeight)) * 100;

        navScrollbar.css("width", percentOfScrolledSite + "%");
        //scrollbar
        scrollbar.css("height", percentOfScrolledSite + "%")
        //----------------
    }

    scrollbarParameters();
    $(window).on("scroll", scrollbarParameters);
    //----------------

    //change scroll value by dragging scrollbar
    const scrollbarPath = $(".scrollbar-path");
    let isDragging = false;
    let barIsAnimated = false;

    $([scrollbarPath, document.body]).on("mousemove", (e) => {
        if (isDragging) {
            const dragValue = e.clientY;
            const windowHeight = window.innerHeight;
            const documentHeight = $(document).height();
            const percentOfDraggedSite = dragValue / windowHeight * 100;
            const scrollTo = (percentOfDraggedSite * documentHeight) / 100;

            if (!barIsAnimated && scrollTo < documentHeight) {
                barIsAnimated = true;
                $([document.body, document.documentElement]).animate({
                    scrollTop: scrollTo
                }, {
                    duration: 0,
                    complete: () => {
                        barIsAnimated = false
                    }
                })
            }
        }
    })

    $(window).on("mouseup", () => {
        isDragging = false;
    })

    scrollbarPath.on("mousedown", () => {
        isDragging = true;
        $(document.body).css("user-select", "none");
    })
    //-----------------------------------
    const imgConteiner = $(".img-conteiner");
    const nextSlide = $(".next-slide");
    const prevSlide = $(".prev-slide");
    const wrapper = $(".wrapper");
    const images = $(".wrapper img");
    const activeDot = $(".active-dot");
    const slideTextConteiner = $(".text-slide");
    const slideTextHeader = $(".text-slide h1");
    const slideText = $(".text-slide p");
    const TimerSlideChange = $(".timer-slide-change");
    let currentSlide = Math.floor($(`.wrapper img`).length / 2);
    const wrapperWidth = wrapper[0].getBoundingClientRect().width;

    /* positioning images && create slide-nav dots*/

    images.each(index => {
        const div = document.createElement("div");
        const activeSlide = $(".slide-nav");

        div.className = "dots";
        div.id = `${index + 1}`;

        $(wrapper[index]).animate({
                left: `${wrapperWidth * index}px`
            },
            500
        );
        activeSlide.append(div);
    });
    /* -----------------------------*/

    /* Which dot is active*/
    const dots = $(".dots");

    const changeDot = targetDot => {
        activeDot.addClass("animate-move");
        activeDot.css("left", `${targetDot}px`);
        activeDot.on("transitionend", () => {
            activeDot.removeClass("animate-move");
        });
    };
    /* -----------------------------*/
    /*change slide function */

    const changeSlide = (moveRange, currentSlide) => {
        images.addClass("side-img");
        images[currentSlide].className = "active-slide";

        slideTextConteiner.removeClass("text-slide-conteiner-active");
        slideText.removeClass("text-slide-active");
        $(slideTextHeader).removeClass("text-slide-header");
        $(TimerSlideChange).removeClass("active-slide-timer");

        $(TimerSlideChange[currentSlide]).addClass("active-slide-timer");
        $(slideTextHeader[currentSlide]).addClass("text-slide-header");
        $(slideTextConteiner[currentSlide]).addClass(
            "text-slide-conteiner-active"
        );
        $(slideText[currentSlide]).addClass("text-slide-active");

        imgConteiner.css("left", `${-moveRange}px`);
        changeDot(dots[currentSlide].offsetLeft);

        if (currentSlide >= images.length - 1) {
            nextSlide.css("transform", "scaleY(0)");
            prevSlide.css("transform", "scaleY(1)");
        } else if (currentSlide === 0) {
            prevSlide.css("transform", "scaleY(0)");
            nextSlide.css("transform", "scaleY(1)");
        } else {
            nextSlide.css("transform", "scaleY(1)");
            prevSlide.css("transform", "scaleY(1)");
        }
    };

    setTimeout(() => {
        changeSlide(
            wrapper[currentSlide].offsetLeft - wrapperWidth / 4,
            currentSlide
        );
    }, 500);
    /* -----------------------------*/

    /* reset slide timer after changed slide */
    const resetChangeSlideTimer = () => {
        clearInterval(intervalChangeSlide);
        changeSlideTimer();
    };
    /* -----------------------------*/
    /* Next slide function*/
    const nextSlideFunc = () => {
        if (images.length - 1 > currentSlide) {
            const nextSlide =
                wrapper[currentSlide].nextElementSibling.offsetLeft -
                wrapperWidth / 4;

            currentSlide++;
            changeSlide(nextSlide, currentSlide);
            resetChangeSlideTimer();
        }
    };

    nextSlide.click(nextSlideFunc);
    /* -----------------------------*/

    /* prev slide function*/
    const prevSlideFunc = () => {
        if (0 < currentSlide) {
            const prevSlide =
                wrapper[currentSlide].previousElementSibling.offsetLeft -
                wrapperWidth / 4;

            currentSlide--;
            changeSlide(prevSlide, currentSlide);
            resetChangeSlideTimer();
        }
    };

    prevSlide.click(prevSlideFunc);
    /* -----------------------------*/
    //change slide by timer
    let intervalChangeSlide;
    const duration = 4000;

    const changeSlideTimer = () => {
        intervalChangeSlide = setInterval(() => {
            if (currentSlide >= images.length - 1) {
                changeSlide(
                    wrapper[0].offsetLeft - wrapperWidth / 4,
                    (currentSlide = 0)
                );
            } else {
                nextSlideFunc();
            }
        }, duration);
    };

    changeSlideTimer();
    /* -----------------------------*/

    /*change slide by clicking dots*/
    dots.on("click", dot => {
        const currentSlideDot = dot.target.id - 1;
        const targetSlide =
            wrapper[currentSlideDot].offsetLeft - wrapperWidth / 4;

        currentSlide = currentSlideDot;
        resetChangeSlideTimer();
        changeSlide(targetSlide, currentSlideDot);
    });

    changeDot(dots[currentSlide].offsetLeft);
    /* -----------------------------*/
    /*change slide by dragging*/

    $(".visible-space").on("dragstart", e => {
        let isChangingSlide = false;
        const xStart = e.pageX;
        $(".visible-space").on("dragend", e => {
            const xEnd = e.pageX;
            if (xStart + 70 < xEnd && !isChangingSlide) {
                isChangingSlide = true;
                nextSlideFunc();
            } else if (!isChangingSlide && xStart > xEnd + 70) {
                isChangingSlide = true;
                prevSlideFunc();
            } else if (!isChangingSlide) isChangingSlide = true;
        });
    });
    /* -----------------------------*/

    /*change slide by touching (For mobile)*/
    const visibleSpace = document.querySelector(".visible-space");
    visibleSpace.addEventListener(
        "touchstart",
        e => {
            let isChangingSlide = false;
            const moveStartX = e.targetTouches[0].pageX;
            $(".visible-space").on("touchend", e => {
                const moveEndX = e.changedTouches[0].pageX;

                if (moveStartX + 30 < moveEndX && !isChangingSlide) {
                    isChangingSlide = true;
                    nextSlideFunc();
                } else if (moveStartX > moveEndX + 30 && !isChangingSlide) {
                    isChangingSlide = true;
                    prevSlideFunc();
                } else if (!isChangingSlide) isChangingSlide = true;
            });
        }, {
            passive: true
        }
    );
    /* -----------------------------*/
    /*change position of active dot when window resize*/
    const resizePosition = () => {
        const offsetLeft =
            wrapper[currentSlide].offsetLeft - wrapperWidth / 4;
        changeDot(dots[currentSlide].offsetLeft);
        changeSlide(offsetLeft, currentSlide);
    };

    $(window).on("resize", resizePosition);
    /* -----------------------------*/

    let isScroll = false;

    /*Onscroll Animation*/
    $(window).on("scroll", (e) => {
        isScroll = true;
        if (isScroll && $(window).width() > 830) {
            $(".nav li:nth-child(even)").animate({
                top: "10px"
            }, 300)

            $(".nav li:nth-child(even)").animate({
                top: "-10px"
            }, 300)

            $(".nav li:nth-child(odd)").animate({
                top: "-10px"
            }, 300)

            $(".nav li:nth-child(odd)").animate({
                top: "10px"
            }, 300)
        }
        onScrollAnimation();
    })

    setInterval(() => {
        if (isScroll && $(window).width() > 830) {
            isScroll = false;
        } else {
            $(".nav li").stop();
        }
    }, 20);

    const onScrollAnimation = () => {
        $(".description").each((i, desc) => {
            const descriptionPos = $(desc).offset().top;
            const descriptionHeight = $(desc).height();
            const windowHeightBottom = window.scrollY + window.innerHeight;
            const heightWhenAnimationReverse = descriptionPos + descriptionHeight + (window.innerHeight / 1.2);

            if (descriptionPos <= windowHeightBottom && heightWhenAnimationReverse >=
                windowHeightBottom) {
                $(desc).addClass("description-show");
                $(desc).next().addClass("description-img-show");
                $(desc).find("p").css("transform", "scaleY(1)")
                $(desc).find("li").each((index, el) => {
                    setTimeout(() => {
                        $(el).addClass("specification-items-show");
                    }, 100 * index);
                })
                $(desc).find(".price").addClass("price-show");
            } else {
                $(desc).removeClass("description-show");
                $(desc).next().removeClass("description-img-show");
                $(desc).find("p").css("transform", "scaleY(0)")
                $(desc).find("li").each((index, el) => {
                    setTimeout(() => {
                        $(el).removeClass("specification-items-show");
                    }, 100 * index);
                });
                $(desc).find(".price").removeClass("price-show");
            }
        })
    }

    onScrollAnimation();
    /*----------------*/
    /*Mobile nav open burger icon animations and nav items*/
    const burgerIcon = $(".mobile-view-nav");
    let isNavHide = true;

    burgerIcon.on("click", () => {
        const nav = $("nav");
        const shortLine = $(".line-short");
        const mediumLine = $(".line-medium");
        const longLine = $(".line-long");

        nav.toggleClass("nav-open");
        nav.toggleClass("nav-close");
        shortLine.toggleClass("nav-active-short-line");
        mediumLine.toggleClass("nav-active-medium-line");
        longLine.toggleClass("nav-active-long-line");
        $(".nav-logo").toggleClass("nav-logo-open");
        itemsAnimation();
        isNavHide = !isNavHide;
    });

    const navItems = $(".nav li");

    const itemsAnimation = hideShow => {
        let duration = 100;

        navItems.each(index => {
            setTimeout(() => {
                if (!isNavHide || hideShow === true) {
                    $(navItems[index]).css({
                        opacity: 1,
                        transform: "translateX(-50%)",
                        top: 0
                    });
                } else {
                    $(navItems[navItems.length - 1 - index]).css({
                        opacity: 0,
                        transform: "translateX(2000px)",
                        transitionDelay: 0,
                        transitionDuration: 0.1
                    });
                }
            }, duration * index);
        });
    };

    $(window).on("resizeend", e => {
        if ($(this).outerWidth() > 830) {
            itemsAnimation(true);
        } else {
            itemsAnimation(false);
        }
    });
    /* -----------------------------*/
    /*Onload animation*/
    const onloadAnimation = () => {
        let duration = 300;

        navItems.each(index => {
            setTimeout(() => {
                $(navItems[index]).css({
                    transform: "scale(1)",
                    borderRadius: "5px"
                })
            }, duration * index);
        })

        $(".nav-logo").addClass("nav-logo-onload-animation");
    }

    onloadAnimation();
    /*-------------------*/
});
