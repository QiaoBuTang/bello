/**
 * @require '../css/chat.css';
 */
export default class Tp_search {
    constructor(config) {
        this.contact = config.contact || '';  //自动打开好友的id
        this.embedded = config.embedded || true;
        this.message = config.message || '';  //自动发的消息
        this.init();
    }

    init() {
        this.render();
    }
    
    render() {
        $('.chat-iframe__wrapper').remove();
        let query = (this.embedded && 'embedded') + (this.contact && `&contact=${this.contact}`) + (this.message && `&message=${this.message}`);
        let dom = `<div class="chat-iframe__wrapper">
                        <a class="chat-mini" href="javascript:;"></a>
                        <iframe src="http://av.qiaobutang.com/i/chat?${query}" scrolling="no" class="chat-iframe" frameborder="0"></iframe>
                    </div>`;
        $(dom).appendTo('body');

        this._bind();
    }

    _bind() {
        //关闭
        $('.chat-mini').click(function() {
            $('.chat-iframe__wrapper').hide('fast');
        });
    }
}

