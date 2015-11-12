// 依赖 jQuery, 很老的 popup 类,需要重写

var Base = {
    init: function () {},

    enable: function () {
        this.init();
        return this;
    }
};
var Helper = {
    isNullable: function (value) {
        return value === undefined || value === null;
    }/*,
    notNullable: function (value) {
        return !this.isNullable(value);
    }*/
};

var BaseOverlay = $.extend(
    {}, Base,
    {
        color: '#000',

        opacity: '0.5',

        zIndex: '99999',

        getElement: function () {
            var self = this;
            if (Helper.isNullable(this.element)) {
                this.element = $('<div class="overlay"></div>').css(
                    {
                        backgroundColor: self.color,
                        opacity: self.opacity,
                        zIndex: self.zIndex
                    }
                );
            }
            return this.element;
        },

        show: function () {
            this.getElement().appendTo($('body')).show();
        },

        hide: function () {
            this.getElement().remove();
        },

        init: function () {}
    }
);
var FadeOverlay = $.extend(
    {}, BaseOverlay,
    {
        duration: function () {
            return 100;
        },

        clickHandler: function (event) {},

        show: function () {
            var self = this;
            this.getElement().appendTo($('body')).fadeIn(this.duration()).off('click').click(
                function (event) {
                    self.clickHandler(event);
                }
            );
        },

        hide: function () {
            this.getElement().fadeOut(
                this.duration(),
                function () {
                    $(this).remove();
                }
            );
        }
    }
);

var BasePopup = $.extend(
    {}, Base,
    {
        classNames: ['popup'],

        contentClassName: 'content',

        closeClassName: 'close',

        zIndex: '199999',
        canESC: true,

        getElement: function () {
            var self = this;

            if (Helper.isNullable(this.element)) {
                this.element = $('<div />').addClass(this.classNames.join(' ')).css(
                    {
                        zIndex: self.zIndex
                    }
                ).append(
                    $('<div />').addClass(this.contentClassName)
                ).append(
                    $('<a href="javascript:;" title="关闭"></a>').addClass(this.closeClassName)
                );
                if (this.canESC) {
                    $(document).keydown(
                        function (event) {
                            if(event.keyCode === 27) {
                                // ESC key
                                self.hide();
                            }
                        }
                    );
                }
            }
            return this.element;
        },
        getContentElement: function () {
            return this.getElement().find('.' + this.contentClassName);
        },
        getCloseElement: function () {
            return this.getElement().find('.' + this.closeClassName);
        },

        add: function () {
            var self = this;

            this.getElement().appendTo($('body'));
            this.updatePosition();

            this.getCloseElement().off('click').click(
                function () {
                    self.hide();

                    return false;
                }
            );
        },
        show: function () {
            this.add();
            this.getElement().show();
        },

        remove: function () {
            this.getElement().remove();
        },
        hide: function () {
            this.remove();
        },

        isVisible: function () {
            return this.getElement().is(':visible');
        },

        updatePosition: function () {
            var top = ($(window).height() - this.getElement().height()) / 3;

            if (top < 0) {
                top = 25;
            }

            this.getElement().css(
                {
                    left: ($(window).width() - this.getElement().width()) / 2,
                    top: $(document).scrollTop() + top
                }
            );
        },

        setContent: function (html) {
            this.getContentElement().html(html);

            if (this.isVisible()) {
                this.updatePosition();
            }
        },

        clearContent: function () {
            this.setContent('');
        },

        setLoadingContent: function (text) {
            this.setContent(
                $('<div class="loading" />').append(
                    $('<div class="txt" />').html(text)
                ).append(
                    $('<div class="img" />')
                )
            );
        },

        createButton: function (label) {
            return $('<button class="button" />').html(
                $('<span />').html(label)
            );
        },

        createCancelLink: function (label) {
            var self = this;
            if (Helper.isNullable(label)) {
                label = '取消';
            }

            return $('<a href="#"></a>').html(label).off('click').click(function () {
                self.hide();
                return false;
            });
        },
        init: function () {}
    }
);
var OverlayPopup = $.extend(
    {},Base, BasePopup,
    {
        getOverlay: function () {
            var self = this;

            if (Helper.isNullable(this.overlay)) {
                this.overlay = $.extend(
                    {}, FadeOverlay,
                    {
                        clickHandler: function (event) {
                            self.hide();
                        }
                    },
                    self.overlayOptions()
                );
            }

            return this.overlay;
        },

        overlayOptions: function () { return {}; },

        duration: function () {
            return this.getOverlay().duration();
        },

        show: function () {
            this.beforeShow();

            this.getOverlay().show();
            this.add();
            this.getElement().fadeIn(this.duration());

            this.afterShow();
        },

        hide: function () {
            var self = this;

            this.beforeHide();

            this.getOverlay().hide();
            this.getElement().fadeOut(
                this.duration(),
                function () {
                    self.remove();
                }
            );

            this.afterHide();
        },

        beforeShow: function () {},
        afterShow: function () {},
        beforeHide: function () {},
        afterHide: function () {}
    }
);
var DarkOverlayPopup = $.extend(
    {}, OverlayPopup,
    {
        overlayOptions: function () {
            return $.extend(
                {},
                {
                    clickHandler: function () {},
                    opacity: '0.4'
                },
                this.darkOverlayOptions
            );
        },

        darkOverlayOptions: {}
    }
);
