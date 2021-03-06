/**
 * @require '../css/chat.css';
 */
export default class Tp_search {
    constructor(config) {
        this.contact = config.contact || '';  //自动打开好友的id
        this.embedded = config.embedded || true;
        this.message = (config.message && config.message.length !== 0) ? config.message : '';  //自动发的消息
        this.init();
    }

    init() {
        this.render();
    }
    
    render() {
        $('.chat-iframe__wrapper').remove();

        let messageQuery = '';
        if (this.message) {
            messageQuery = this.getMessageQuery();
        }

        let query = (this.embedded && 'embedded') + (this.contact && `&contact=${this.contact}`) + (this.message && `${messageQuery}`);
        let dom = `<div class="chat-iframe__wrapper">
                        <a class="chat-mini" href="javascript:;"></a>
                        <iframe src="http://cv.qiaobutang.com/i/chat?${query}" scrolling="no" class="chat-iframe" frameborder="0"></iframe>
                    </div>`;
        $(dom).appendTo('body');

        this._bind();
    }

    getMessageQuery() {
        let query = '';
        for (var i = 0; i < this.message.length; i++) {
            query += `&message=${this.message[i]}`;
        }
        return query;
    }

    _bind() {
        //关闭
        $('.chat-mini').click(function() {
            $('.chat-iframe__wrapper').hide('fast');
        });
    }
}

