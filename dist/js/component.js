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
/**
 * newDropdowm 插件
 * 基于网站现有的需要的dropdwon来进行总结
 */
(function ($) {
    'use strict';
    var dropdowns = [];
    var Dropdown = function (element, options) {
        var _this = this;
        var $element = this.$element = $(element);
        var option = this.option = $.extend({}, Dropdown.DEFAULT, options);
        if (option.trigger === 'click') {
            $('[data-dropdown-role=trigger]', $element).on('click.component.dropdown', $.proxy(this.toggle, this));
        } else if (option.trigger === 'hover') {
            $element.hover(
                function () {
                    _this.openMenu();
                }, function () {
                    _this.closeMenu();
                }
            );
        }
        if (option.autoClose) {
            $element.on('click.component.dropdown', $.proxy(this.toggle, this));
        }
        $element.on('click.component.dropdown', function (e) {e.stopPropagation()});

        dropdowns.push(this);
    };
    Dropdown.DEFAULT = {
        trigger: 'click',
        autoClose: true
    };
    Dropdown.prototype.toggle = function (e) {
        var $element = this.$element;
        if ($element.hasClass('open')) {
            this.closeMenu();
        } else {
            clearMenus();
            this.openMenu();
        }
        e.stopPropagation();
    };
    Dropdown.prototype.openMenu = function () {
        var $element = this.$element;
        if ($element.hasClass('disabled') || $element.data('disabled') === true) {
            return false;
        } else {
            $element.addClass('open');
        }
    };
    Dropdown.prototype.closeMenu = function () {
        this.$element.removeClass('open');
    };
    var old = $.fn.newDropdown;

    $.fn.newDropdown = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('component.dropdown');
            var options = $.extend({}, option, $this.data());
            if (!data) $this.data('component.dropdown', (data = new Dropdown(this, options)));
        });
    };

    var clearMenus = function () {
        $.each(dropdowns, function (i, dropdown) {
            if (!dropdown.$element.hasClass('open')) return;
            dropdown.$element.removeClass('open');
        });
    };
    $(document).on('click.component.dropdown', function () {
        clearMenus();
    });

    $(function () {
        $('[data-component=dropdown]').newDropdown();
    });
}(window.jQuery));

/**
 * select 插件
 * 尽量模拟select的功能
 */
(function ($) {
    'use strict';
    // Base Class
    var Select = function (element, option) {
        var _this = this;

        var $element = this.$element = $(element);
        $element.newDropdown({autoClose: false});
        this.dropdown = $element.data('component.dropdown');
        this.$indicator = $('.dropdown__indicator', $element);
        this.$inputContainer = $('<div class="dropdown__input-container hidden" />').appendTo($element);
        this.options = $.extend({}, Select.DEFAULT, this._constructor.DEFAULT, option);
        this.name = $element.data('name') || '';
        this.value = (function () {
            var value = $element.data('value');
            if (value instanceof Array) return value;
            if (value instanceof Object) return $.map(value, function (v, key) {return key;});
            if (value !== undefined && value !== '') return [value];
            return [];
        }());
        element.type = 'ImitateSelect'; // name for the valHook

        this._bind();
        setTimeout(function () {
            _this._init();
        }, 0);
    };
    Select.DEFAULT = {
        multiple: false,
        valuelimit: -1,
        placeholder: '',
        multipleIndicatorTemplate: [
            '<span class="dropdown__indicator__option">',
            '<span class="label"></span>',
            '<span class="close">×</span>',
            '</span>'
        ].join('')
    };
    Select.prototype._init = function () {
        this._refresh();
    };
    Select.prototype._bind = function () {
        var _this = this;
        this.$element.on('close', function () {
            _this.dropdown.closeMenu();
        });
        this.$element.on('change', function () {
            _this._refresh();
        });
    };
    // every select must implement the get
    Select.prototype.getNameByValue = function (value) {};
    Select.prototype.getLabel = function () {
        var _this = this;
        var value = this.get();
        if (typeof value === 'string') {
            return this.getNameByValue(value);
        } else if ($.isArray(value)) {
            return $.map(value, function (val) {
                return _this.getNameByValue(val);
            });
        }
    };
    Select.prototype.set = function (value) {
        if (this.options.multiple && this.options.valuelimit > 0 && this.value.length >= this.options.valuelimit) {
            this.$element.trigger('error', 'maxiam value');
            this.$element.trigger('close');
            return;
        }
        value = value instanceof Array ? value : value + '';
        // 是否有与当前值相同或者有重复值
        if (this.has(value)) {
            this.$element.trigger('close');
        } else {
            if (this.options.multiple) {
                this.value.push(value);
            } else {
                this.value[0] = value;
                this.$element.trigger('close');
            }
            if (this.afterSet) this.afterSet();
            this.$element.trigger('change');
        }

    };
    Select.prototype.get = function () {
        if (this.options.multiple)
            return this.value;
        else
            return this.value[0];
    };
    Select.prototype.has = function (value) {
        return !!~$.inArray(value, this.value);
    };
    // remove the value form
    Select.prototype._remove = function (value, eventless) {
        var del = $.proxy(function (value) {
            var index = $.inArray(value, this.value);
            if (index === -1) return;
            this.value.splice(index, 1);
        }, this);
        if (value instanceof Array) {
            $.each(value, function (i, v) {
                del(v);
            });
        } else {
            del(value);
        }
        if (eventless) return;
        this.$element.trigger('change');
    };
    Select.prototype.removeAll = function () {
        this.value = [];
        this.$element.trigger('change');
    };
    Select.prototype._buildMultipleIndicator = function (indicator, value) {
        var _this = this;
        var $indicator = $(this.options.multipleIndicatorTemplate).click(function () {
            // prevent to show the option list
            return false;
        });
        $indicator.find('.label').text(indicator);
        $indicator.find('.close').click(function () {
            _this._remove(value);
            $(this).parents('.dropdown__indicator__option').remove();
            return false;
        });
        return $indicator;
    };
    Select.prototype._refreshIndicator = function () {
        this.$indicator.empty().removeClass('placeholder');
        $.each(this.value, $.proxy(function (i, value) {
            var indicator = this.getNameByValue(value);
            if (indicator === false) return;
            if (this.options.multiple) {
                this.$indicator.append(this._buildMultipleIndicator(indicator, value));
            } else {
                this.$indicator.text(indicator);
            }
        }, this));
        if (this.value.length === 0) {
            this.$indicator.text(this.options.placeholder).addClass('placeholder');
        }
    };
    Select.prototype._refreshInput = function () {
        if (this.name === '') return;
        this.$inputContainer.empty();
        if (typeof this.name === 'string') {
            $.each(this.value, $.proxy(function (index, value) {
                this.$inputContainer.append($('<input type="hidden" name="' + this.name + '" value="' + value + '" />'));
            }, this));
        } else if (this.name instanceof Array) {
            $.each(this.value, $.proxy(function (index, value) {
                var name = this.name[index];
                if (!name) return;
                this.$inputContainer.append($('<input type="hidden" name="' + name + '" value="' + value.value + '" />'));
            }, this))
        }
    };
    // 根据当前值高亮选项的功能，每个都有不同的实现
    Select.prototype._refreshOption = function () {

    };
    Select.prototype._refresh = function () {
        this._refreshIndicator();
        this._refreshInput();
        this._refreshOption();
    };
    // 简历编辑器需要填入值的时候只刷新不触发change事件
    Select.prototype.bugFixRefresh = function (value) {
        if (this.getNameByValue(value) === false) {
            this.value = [];
            this._refresh();
        } else {
            this.value = [value];
            this._refresh();
        }
    };

    var SimpleSelect = function (element, option) {
        var _this = this;
        Select.apply(this, arguments);
        this.cachedOptions = (function () {
            var options = {};
            $('.option', _this.$element).each(function () {
                var $this = $(this);
                options[$this.data('value')] = $this.data('label') || $this.text();
            });
            return options;
        }());
        this.bindOption();
    };
    SimpleSelect.DEFAULT = {
    };
    SimpleSelect.prototype = $.extend({}, Select.prototype, {
        _constructor: SimpleSelect,
        bindOption: function () {
            var _this = this;
            var $element = this.$element;
            var $options = this.$options = $('.option', this.$element);
            $options.click(function () {
                _this.set($(this).data('value'));
            });
        },
        getNameByValue: function (value) {
            return this.cachedOptions[value] || false;
        },
        _refreshOption: function () {
            this.$options.removeClass('active');
            $.each(this.value, $.proxy(function (i, v) {
                this.$options.filter('[data-value="' + v + '"]').addClass('active');
            }, this));
        }
    });

    var SelectByAjax = function (ele, option) {
        Select.apply(this, arguments);
        this.value = (function (_this) {
            if (_this.value.length === 0) return _this.value;
            else return [_this.value];
        }(this));

        this.currentLevel = 0;
        this.$container = $('<div class="ajax-select" />').appendTo($('.dropdown__list', this.$element));
        // cache the selected option
        this.levels = [];
        this.cachedOptions = {};
        this.options.nolimit = (function (_this) {
            var nolimit = _this.options.nolimit;
            var ret = [];
            for (var i = 0; i < _this.options.maxlevel; i++) {
                if (typeof nolimit === 'boolean') {
                    ret[i] = nolimit;
                } else {
                    ret[i] = nolimit[i];
                }
            }
            return ret;
        }(this));

        // 暂时为了career的需求添加的功能，用于将无论几级的值都暴露出来
        this.rvalue = this.$element.data('rvalue') ? JSON.parse(JSON.stringify(this.$element.data('rvalue'))) : [];
        this.render(1);
    };
    SelectByAjax.DEFAULT = {
        label: '请选择',
        nolimit: false,
        activeClass: 'active',
        template: [
            '<div class="ajax-select__container">',
            '<div class="ajax-select__top">',
            '<span class="ajax-select__label"></span>',
            '<span class="ajax-select__prevstep">上一步</span>',
            '<div class="ajax-select__search">',
            '<input type="text" />',
            '<span class="search-btn">搜索</span>',
            '</div>',
            '</div>',
            '<div class="ajax-select__main"></div>',
            '<div>'
        ].join('')
    };
    SelectByAjax.options = {}; // 选项的缓存
    SelectByAjax.AjaxCache = {}; // ajax 结果的缓存
    SelectByAjax.prototype = $.extend({}, Select.prototype, {
        _constructor: SelectByAjax,
        render: function (level) {
            var _this = this;
            var currentLevel = this.currentLevel;
            var api = (function () {
                var api = _this.options.level[level - 1].api;
                if (typeof api === 'function') {
                    return api(_this.levels);
                } else
                    return api;
            }());
            var handler = function (options) {
                if (SelectByAjax.AjaxCache[api] === undefined) SelectByAjax.AjaxCache[api] = JSON.parse(JSON.stringify(options));
                options.forEach(function (option) {
                    SelectByAjax.options[option.value] = option.name;
                });
                _this.$container.removeClass('loading');
                if (options.length === 0) {
                    _this.set(_this._getResult());
                    return;
                }
                _this.currentLevel = level;
                _this.currentOptions = options;
                _this.$container.empty().append(
                    // 构建dom结构
                    _this.buildTemplate(
                        // 处理数据
                        _this._processAjaxData(options)
                    )
                );
                _this._refreshOption();
            };

            if (typeof api !== 'string')
                return;

            this.$container.addClass('loading');
            if (SelectByAjax.AjaxCache[api]) {
                handler(JSON.parse(JSON.stringify(SelectByAjax.AjaxCache[api])));
            } else {
                $.get(SELECT_ORIGIN + api).done(handler);
            }
        },
        _processAjaxData: function (options) {
            // 对选项建立索引
            $.each(options, $.proxy(function (i, option) {
                var _this = this;
                this.cachedOptions[option.value] = (function () {
                    if (_this.options.multiple) return option.name;
                    if (_this.options.joinname) {
                        return $.map(_this.levels.slice(1, _this.currentLevel), function (option) {
                            if (option && option.name) return option.name;
                        }).concat([option.name]).join(_this.options.joinname);
                    }
                    return option.name;
                }());
            }, this));

            // 排序
            options.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            if (this.options.nolimit[this.currentLevel - 1] !== true) {
                options.unshift({
                    name: '不限',
                    value: null
                });
            }

            return options;
        },
        _isSelected: function  (value) {
            return !!(~$.inArray(this._getRealValue(value), this.value));
        },
        buildTemplate: function (options) {
            var _this = this;
            var $template = $(this.options.template);
            var currentLevel = this.currentLevel;
            var levelInfo = this.options.level[currentLevel - 1];
            var $label = $('.ajax-select__label', $template);
            var $prev = $('.ajax-select__prevstep', $template);
            var $search = $('.ajax-select__search', $template);

            // 顶部的标题，默认的或者是上一级选中的
            if (currentLevel === 1) {
                $label.text(this.options.label);
            } else {
                $label.text(this.levels[currentLevel - 1].name);
            }

            // 处理上一层是否隐藏
            if (currentLevel !== 1) {
                $prev.click(function () {
                    _this.render(currentLevel - 1);
                });
            } else {
                $prev.hide();
            }

            // 处理搜索
            if (levelInfo.search) {
                $search.show();
                this.bindSearch($search, options, $('.ajax-select__main', $template));
            }

            $('.ajax-select__main', $template).append(
                // 生成选项，并绑定事件
                this.buildOption(options)
            );
            return $template;
        },
        buildOption: function (options) {
            var _this = this;
            var currentLevel = this.currentLevel;

            return $.map(options, function (option) {
                return $('<span class="ajax-select__option option" />')
                    .text(option.name)
                    .attr('data-value', option.value + '')
                    .click(function () {
                        _this.levels[_this.currentLevel] = option;
                        _this.rvalue[_this.currentLevel - 1] = option;
                        if (_this.currentLevel < _this.options.maxlevel && option.value !== null) {
                            _this.render(_this.currentLevel + 1);
                        } else {
                            if (option.value === null) {
                                _this._processUnlimit();
                            } else {
                                if (_this.has(option.value)) {
                                    _this._remove(option.value);
                                } else {
                                    _this._remove(_this._getRealValue(null), true);
                                    _this.set(_this._getResult());
                                }
                            }
                        }
                    });
            });
        },
        _getRealValue: function (value) {
            if (value === null && this.levels[this.currentLevel - 1] && this.levels[this.currentLevel - 1].value !== undefined) return this.levels[this.currentLevel - 1].value;
            return value;
        },
        // 处理不限的情况
        _processUnlimit: function () {
            var value = this._getRealValue(null);
            if (this.has(value)) {
                this._remove(value);
                return;
            }
            if (value !== null) {
                this._remove($.map(this.currentOptions, function (option) {
                    return option.value;
                }));
                this.set(this._getResult());
            } else {
                this.removeAll();
            }
        },
        bindSearch: function ($search, options, $container) {
            var _this = this;
            var getOptionsFormKeyWord = (function (keyword) {
                var cache = [];
                var filterOption = function (keyword) {
                    var reg = new RegExp(keyword);
                    return $.map(options, function (option) {
                        if (reg.test(option.name)) return option;
                    });
                };
                return function (keyword) {
                    if (keyword === '') {
                        return options;
                    } else if (cache[keyword]) {
                        return cache[keyword];
                    } else {
                        cache[keyword] = filterOption(keyword);
                        return cache[keyword];
                    }
                };
            }());
            if ('oninput' in $search[0]) {
                $search.find('input').on('input', function (e) {
                    var keyword = $(this).val();
                    $container
                        .empty()
                        .append(_this.buildOption(getOptionsFormKeyWord(keyword)));
                }).on('change', function (e) {
                    e.stopPropagation();
                });
            } else {
                $search.find('input').on('propertychange', function (e) {
                    if (e.originalEvent.propertyName !== 'value') return;
                    var keyword = $(this).val();
                    $container
                        .empty()
                        .append(_this.buildOption(getOptionsFormKeyWord(keyword)));
                }).on('change', function (e) {
                    e.stopPropagation();
                });
            }
        },
        getNameByValue: function (value) {
            return SelectByAjax.options[value] || false;
        },
        _refreshOption: function () {
            $('.option.active', this.$element).removeClass('active');
            $.each(this.value, $.proxy(function (i, values) {
                var value = values[this.currentLevel - 1];
                if(value === null) value = 'null';
                $('.option', this.$element).filter('[data-value=' + value + ']').addClass('active');
            }, this));
        },
        _getResult: function () {
            return this.levels.slice(1).map(function (option) {
                return option.value;
            });
        },
        _refreshInput: function () {
            this.$inputContainer.empty();
            if (this.name instanceof Array && this.value[0]) {
                $.each(this.value[0], $.proxy(function (index, value) {
                    var name = this.name[index];
                    value = value || '';
                    if (!name) return;
                    this.$inputContainer.append($('<input type="hidden" name="' + name + '" value="' + value + '" />'));
                }, this))
            }
        },
        _refreshIndicator: function () {
            var _this = this;
            this.$indicator.empty().removeClass('placeholder');
            if (this.value.length === 0 || this.value[0].length === 0) {
                this.$indicator.text(this.options.placeholder).addClass('placeholder');
            } else {

                var names = this.value[0].slice(0).reverse().map(function (value) {
                    return value ? _this.getNameByValue(value) : 'passed';
                });
                for (var i = 0, len = names.length; i < len; i++) {
                    var name = names[i];
                    if (!name) {
                        var value = _this.value[0][len - 1 - i];
                        var api = _this.options.fullfill[len - 1 - i];
                        if (api && api(value)) {
                            $.get(SELECT_ORIGIN + api(value))
                                    .then(function (res) {
                                        Object.keys(res).forEach(function (key) {
                                            SelectByAjax.options[res[key].value] = res[key].name;
                                        });
                                        _this._refreshIndicator();
                                    });
                        }
                        return;
                    }
                }
                this.$indicator.text(_this.options.setLabel(names.reverse().map(function (name) {return name === 'passed' ? '' : name})));
            }
        },
        afterSet: function () {
            this.rvalue.splice(this.currentLevel);
            this.$element.data('rvalue', this.rvalue);
        }
    });

    var PaletteSelect = function (element, option) {
        var _this = this;
        Select.apply(this, arguments);
        this.options.colorMap = JSON.parse(JSON.stringify(_this.options.colorMap));
        this.$container = $('<div class="palette-select" />').appendTo($('.dropdown__list', this.$element));
        this.color2Element = {};
        this._buildPalette();
    };
    PaletteSelect.DEFAULT = {
        colorMap: [
            [
                [0, 68, 102, 153, 204, 238, 243, 255]
            ],
            [
                [
                    [255, 0, 0], [255, 153, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [153, 0, 255], [255, 0, 255]
                ]
            ],
            [
                [
                    [244, 204, 204], [252, 229, 205], [255, 242, 204], [217, 234, 211], [208, 224, 227], [207, 226, 243], [217, 210, 233], [234, 209, 220]
                ],
                [
                    [234, 153, 153], [249, 203, 156], [255, 229, 153], [182, 215, 168], [162, 196, 201], [159, 197, 232], [180, 167, 214], [213, 166, 189]
                ],
                [
                    [224, 102, 102], [246, 178, 107], [255, 217, 102], [147, 196, 125], [118, 165, 175], [111, 168, 220], [142, 124, 195], [194, 123, 160]
                ],
                [
                    [204, 0, 0], [230, 145, 56], [241, 194, 50], [106, 168, 79], [69, 129, 142], [61, 133, 198], [103, 78, 167], [166, 77, 121]
                ],
                [
                    [153, 0, 0], [180, 95, 6], [191, 144, 0], [56, 118, 29], [19, 79, 92], [11, 83, 148], [53, 28, 117], [116, 27, 71]
                ],
                [
                    [102, 0, 0], [120, 63, 4], [127, 96, 0], [39, 78, 19], [12, 52, 61], [7, 55, 99], [32, 18, 77], [76, 17, 48]
                ]
            ]
        ]
    };
    PaletteSelect.prototype = $.extend({}, Select.prototype, {
        _constructor: PaletteSelect,
        _buildPalette: function () {
            var _this = this;
            if (this.options.transparent) _this.options.colorMap.unshift([['transparent']]);
            this.$container.append(
                $.map(_this.options.colorMap, function (colorGroup) {
                    return $('<table/>').append(
                        $.map(colorGroup, function (colorRow) {
                            return $('<tr/>').append(
                                $.map(colorRow, function (color) {
                                    var colorStr = _this._buildColorStr(color);
                                    var $td = $('<div/>')
                                        .attr('title', color === 'transparent' ? '透明': colorStr)
                                        .css('background-color', colorStr)
                                        .addClass(color === 'transparent' ? 'transparent-color' : '')
                                        .click(function () {
                                            _this.set(colorStr);
                                        }).appendTo($('<td/>')).parent();
                                    _this.color2Element[colorStr] = $td;
                                    return $td;
                                })
                            );
                        })
                    );
                })
            );
        },
        _buildColorStr: function (color) {
            var colorStr;
            if (typeof color === 'number') {
                colorStr = 'rgb(' + [color, color, color].join() + ')';
            } else if ($.isArray(color) && color.length === 3) {
                colorStr = 'rgb(' + color.join() + ')';
            } else if (color === 'transparent') {
                colorStr = 'transparent';
            }
            return Helper.getColorValueOfCss(colorStr) === null ? 'transparent' : '#' + Helper.getColorValueOfCss(colorStr);
        },
        getNameByValue: function (color) {
            var colorStr = Helper.getColorValueOfCss(color) === null ? 'transparent' : '#' + Helper.getColorValueOfCss(color);
            if (this.color2Element[colorStr] === undefined) return false;
            return color;
        },
        _refreshOption: function () {
            $('.selected', this.$element).removeClass('selected');
            $('.dropdown__indicator', this.$element).css('background', '');
            $.each(this.value, $.proxy(function (i, color) {
                color = Helper.getColorValueOfCss(color) === null ? 'transparent' : '#' + Helper.getColorValueOfCss(color);
                $('.dropdown__indicator', this.$element).css('background', color);
                this.color2Element[color] && this.color2Element[color].addClass('selected');
            }, this));
        }
    });
    var InitOption = {
        'select': {
            type: SimpleSelect,
            option: {}
        },
        'select-palette': {
            type: PaletteSelect,
            option: {}
        },
        'select-city': {
            type: SelectByAjax,
            option: {
                joinname: '-',
                maxlevel: 2,
                level: [
                    {
                        api: '/api/province.json'
                    },
                    {
                        api: function (levels) {
                            return '/api/province/cities/' + levels[1].value + '.json';
                        }
                    }
                ]
            }
        },
        'select-university': {
            type: SelectByAjax,
            option: {
                maxlevel: 2,
                level: [
                    {
                        api: '/api/province.json'
                    },
                    {
                        api: function (levels) {
                            return '/api/province/universities/' + levels[1].value + '.json';
                        },
                        search: true
                    },
                    {
                        api: function (levels) {
                            return '/api/province/university/colleges/' + levels[2].value + '.json';
                        }
                    }
                ],
                fullfill: [
                    null,
                    function (val) {
                        return '/api/' + val + '/province.json';
                    },
                    function (val) {
                        return '/api/' + val + '/university.json';
                    }
                ],
                setLabel: function (names) {
                    return names.slice(1).filter(function (name) {
                        return name;
                    }).join('-');
                }
            }
        }
    };
    $.fn.imitateSelect = function (type, passOption) {
        return this.each(function () {
            var $this = $(this);
            var type = type || $this.data('component');
            if (InitOption[type] === undefined) return;
            var init = InitOption[type];
            var elementOption = (function () {
                var data = $this.data();
                var option = {};
                $.each(data, function (key, value) {
                    var pkey;
                    if (/^option/.test(key)) {
                        pkey = key.replace(/^option/, '');
                        pkey = pkey.charAt(0).toLowerCase() + pkey.slice(1);
                        option[pkey] = value;
                    }
                });
                return option;
            }());
            var options = $.extend({}, init.option, elementOption, passOption);
            var data = $this.data('component.select');
            if (!data) $this.data('component.select', (data = new init.type(this, options)));
        });
    };

    $.valHooks.ImitateSelect = {
        get: function (ele) {
            return $(ele).data('component.select').get();
        },
        set: function (ele, value) {
            $(ele).data('component.select').set(value);
        }
    };

    $(function () {
        $('[data-component|=select]').imitateSelect();
    });
}(window.jQuery));

/**
 * 选择学校 包含海外院校
 */
(function() {
    var UniversitySelector = function(option) {
        this.$trigger = option.$trigger;
        this.selectorType = option.selectorType;
        this.addAny = option.addAny;
        this.drill = option.drill; //数据钻取层级
        this.addAnyAtLevel = option.addAnyAtLevel; //在指定层级 添加不限
        this.deviceType = this.getDeviceType();
        this.feedbackFrom = option.feedbackFrom;
        this.API = {
            internalProvince: 'http://cv.qiaobutang.com/api/province.json',
            foreignArea: 'http://www.qiaobutang.com/university_choice/foreign.json',
            internalUniv: 'http://cv.qiaobutang.com/api/province/universities/',
            foreignUniv: 'http://www.qiaobutang.com/university_choice/foreign/college.json',
            internalCollege: 'http://cv.qiaobutang.com/api/province/university/colleges/',
            internalCity: 'http://cv.qiaobutang.com/api/province/cities/'
        };
        this.apiInstruction = []; //api 调用的指示器
        this.$container = null;
        this.selected = [];
        this.bindEvent();
    };
    UniversitySelector.prototype.getDeviceType = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.search(/iphone|ipad|itouch/g) !== -1) {
            return 'ios';
        } else if (ua.search(/android/) !== -1) {
            return 'android';
        } else if (ua.search(/windows phone/) !== -1)  {
            return 'windows phone';
        } else {
            return undefined;
        }
    };
    UniversitySelector.prototype.getDiv = function(className) {
        return $('<div class="' + className + '"></div>')
    };
    UniversitySelector.prototype.createUI = function() {
        var that = this;

        this.$container = this.selectorType === 'univ' ? this.getDiv('selector-wrapper') : this.getDiv('selector-wrapper selector-wrapper_area');
        this.$tab = null;
        this.$head = this.getDiv('selector__head');
        this.$body = this.getDiv('selector__body');
        this.$list = this.getDiv('selector__list');
        this.$closeIcon = $('<a href="javascript:;" class="selector__close"></a>');
        this.$tip = this.getDiv('selector__tip');
        this.$search = $('<input type="text" class="selector__search" placeholder="快速检索"/>').hide();
        this.$instruct = this.getDiv('selector__instruct');
        this.$back = $('<a href="javascript:;" class="selector__back"></a>');
        this.$instructText = $('<span>选择省/市</span>');
        this.$loading = $('<div class="selector__loading"></div>').hide();

        this.$instruct.append(this.$back).append(this.$instructText);

        if (this.selectorType === 'univ') {
            this.$tab = this.getDiv('selector__tab');
            this.$tab.append($('<a class="tab__item selected" href="javascript:;" data-type="internal">国内</a>'))
                .append($('<a class="tab__item" href="javascript:;" data-type="foreign">国外</a>'))
                .on('click', function(e) {
                    that.apiInstruction.pop();
                    if (e.target.getAttribute('data-type') === 'internal') {
                        that.getData('internalProvince');
                        that.currentDataType = 'internalProvince';
                        that.apiInstruction.push('internalProvince');
                    } else {
                        that.getData('foreignArea');
                        that.currentDataType = 'foreignArea';
                        that.apiInstruction.push('foreignArea');
                    }
                    $(e.target).addClass('selected').siblings('a').removeClass('selected');
                });
        }
        if (!this.deviceType) {
            this.$instruct.hide();
        }
        this.$container
            .append(
                this.$head.append(this.$tab)
                    .append(this.$instruct)
                    .append(this.$search)
                    .append(this.$closeIcon))
            .append(this.$body.append(this.$list))
            .append(this.$tip.append($('<a target="_blank" href="http://cv.qiaobutang.com/help/feedback?' + this.feedbackFrom + '">没有您的院校?</a>')))
            .append(this.$loading);
        //右上角关闭事件
        this.$closeIcon.on('click', function() {
            that.hiddenUI();
        });
        //检索
        this.$search.on('input', function(e) {
            that.quickSearch($(this).val());
        });
        this.$search.on('click', function(e) {
        });
        //回退
        this.$back.on('click', function(e) {
            e.stopPropagation();
            that.getBack();
        });
        this.setUICss();

        $('.selector-wrapper').remove();

        $('body').append(that.$container);
        //
        this.$container.on('click', function(e) {
            e.stopPropagation();
        });
        $(document).on('click', function () {
            if(that.$container) {
                that.hiddenUI();
            }
        });

    };
    UniversitySelector.prototype.setUICss = function() {
        if (this.deviceType) {
            this.$container.addClass('mobile');
        } else {
            //var offset = this.$trigger.offset();
            this.$container.addClass('desktop');
        }
    };
    UniversitySelector.prototype.hiddenUI = function() {
        this.$container.remove();
        this.$container = null;
        this.selected = [];
        this.apiInstruction = [];
        $(document).off('click');
    };
    UniversitySelector.prototype.getBack = function() {
        this.currentLevel--;
        this.apiInstruction.pop();
        this.currentDataType = this.apiInstruction[this.apiInstruction.length - 1];
        if (this.currentLevel === 0) {
            this.hiddenUI();
        } else if (this.currentLevel === 1) {
            this.getData(this.currentDataType);
            this.selected = [];
        } else {
            this.selected.pop();
            var obj = this.selected.pop();
            this.drillNextLevelData(obj.value, obj.name);
        }
    };
    UniversitySelector.prototype.quickSearch = function(item) {
        this.$list.children('.selector__option').each(function() {
            if ($(this).text().indexOf(item) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    };
    UniversitySelector.prototype.bindEvent = function() {
        var that = this;
        this.$trigger.click(function (e) {
            e.stopPropagation();
            if (that.$container) {
                that.hiddenUI();
            } else {
                that.createUI();
                that.getData('internalProvince');
                that.currentLevel = 1;
                that.currentDataType = 'internalProvince';
                that.apiInstruction.push('internalProvince');
            }
        });
        this.$trigger.focus(function(){
            that.$trigger.trigger('click');
        });
    };
    UniversitySelector.prototype.apiCallback = function(data) {
        if (data.length > 0) {
            this.fillOption(data);
        } else {
            this.setValue();
        }
    };
    UniversitySelector.prototype.fillOption = function(data) {
        var that = this;
        var $options = data.map(function(item) {
            var value = item.value || item.countryId || item.universityId;
            return $('<a class="selector__option" href="javascript:;" data-value="' + value + '">' + item.name + '</a>')
                .on('click', function(e) {
                    $(e.target).off('click');
                    that.drillNextLevelData(e.target.getAttribute('data-value'), e.target.innerHTML);
                });
        });
        if (this.currentLevel > 1) {
            if (this.$tab) {
                this.$tab.hide();
            }
            this.$instruct.show();
            this.$search.show();
            this.$instructText.text(this.specialSelected(0).name.join('/'));
        } else {
            if (this.$tab) {
                this.$tab.show();
            }
            this.$search.hide();
            if (!this.deviceType) {
                this.$instruct.hide();
                this.$instructText.text('选择省/市');
            }
        }
        this.$list.empty().append($options);
    };
    UniversitySelector.prototype.drillNextLevelData = function(value, text) {
        this.selected.push({
            name: text,
            value: value === 'any' ? '' : value});
        if (text === '不限' || (this.drill ===1 && this.currentLevel === 1) || text === '全国') {
            this.setValue();
            return;
        }
        switch (this.currentDataType) {
            case 'internalProvince':
                if (this.selectorType === 'univ') {
                    this.getData('internalUniv', value);
                    this.currentDataType = 'internalUniv';
                    this.apiInstruction.push('internalUniv');
                    this.currentLevel = 2;
                } else {
                    this.getData('internalCity', value);
                    this.currentDataType = 'internalCity';
                    this.apiInstruction.push('internalCity');
                    this.currentLevel = 2;
                }
                break;
            case 'foreignArea':
                this.getData('foreignUniv', value);
                this.currentDataType = 'foreignUniv';
                this.apiInstruction.push('foreignUniv');
                this.currentLevel = 2;
                break;
            case 'internalUniv':
                this.currentDataType = 'internalCollege';
                this.currentLevel = 3;
                this.getData('internalCollege', value);
                break;
            default:
                this.setValue();
                break;
        }
    };
    UniversitySelector.prototype.tryAgain = function(key, id) {
       var $tryAgain =  $('<a class="selector__tryAgain" href="javascript:;">出错咯，请重试</a>');
       var that = this;
       this.$loading.hide();
       this.$container.append($tryAgain);
       $tryAgain.click(function() {
            that.getData(key, id);
            $tryAgain.remove();
       });
    },
    UniversitySelector.prototype.getData = function(key, id) {
        var that = this;
        var url = that.API[key] + (id ? (id + '.json') : '');
        that.$loading.show();
        if (key === 'foreignUniv') {
            $.ajax({
                type: 'GET',
                url: that.API[key],
                data: {
                    countryId: id
                },
                success: function(res) {
                    that.$loading.hide();
                    that.apiCallback(res.info);
                },
                error: function(){
                    that.tryAgain(key, id);
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: url,
                success: function (res) {
                    that.$loading.hide();
                    if ($.isArray(res)) {
                        if (that.addAny && key === 'internalProvince') {        
                            res.unshift({
                                name: '全国',
                                value: '_CHS'
                            })
                        } else {
                            if (that.addAny || (that.currentLevel=== that.addAnyAtLevel)) {
                                res.unshift({
                                    name: '不限',
                                    value: 'any'
                                })
                            }
                        }
                        
                        that.apiCallback(res);
                    } else {
                        that.apiCallback(res.info);
                    }
                },
                error: function(){
                    that.tryAgain(key, id);
                }
            });
        }
    };
    UniversitySelector.prototype.specialSelected = function(start) {
        var obj = {
            name: [],
            value: []
        };
        for(var i = start, len = this.selected.length; i < len; i++) {
            obj.name.push(this.selected[i].name);
            obj.value.push(this.selected[i].value);
        }
        return obj;
    };
    UniversitySelector.prototype.setValue = function() {
        var name;
        if (this.selectorType === 'area') {
            name = this.specialSelected(0).name;
            var len = this.selected.length;
            if (len > 1 && this.selected[len - 1].name === '不限') {
                this.selected.pop();
            }
        } else {
            name = this.specialSelected(1).name;
        }
        this.$trigger.val(name.join(' - ')).attr('data-value', JSON.stringify(this.selected));
        this.$trigger.trigger('change');
        this.selected = [];
        this.hiddenUI();
    };
    $.fn.universitySelector = function(option) {
        new UniversitySelector({
            $trigger : $(this),
            selectorType: 'univ',
            addAny: option ? option.addAny : false, //boolean 是否添加不限
            drill: option ? option.drill : '', //数据钻取层级,
            addAnyAtLevel: option ? option.addAnyAtLevel : '',
            feedbackFrom: option ? option.feedbackFrom : ''
        });
    };
    $.fn.areaSelector = function(option) {
        new UniversitySelector({
            $trigger : $(this),
            selectorType: 'area',
            addAny: option ? option.addAny : false,
            drill: option ? option.drill : ''  //数据钻取层级
        });
    }
}(window.jQuery));
