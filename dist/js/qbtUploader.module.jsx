/**
 * @require /fis_components/webuploader/webuploader.css
 */

import WebUploader from 'webuploader';

export default class QbtUploader {
    constructor(config) {
        this.$pick = config.pick;
        this.collection = config.collection;
        this.width = config.width || 150;
        this.height = config.height || 150;
        this.fileQueued = config.fileQueued;
        this.private = config.private;
        this.uploadProgress = config.uploadProgress || function() {};
        this.uploadSuccess = config.uploadSuccess || function() {};
        this.uploadError = config.uploadError || function() {};

        this.init();
    }

    init() {
        let _this = this;
        $.ajax({
            type: "GET",
            url:  'http://www.qiaobutang.com/upload/' + _this.collection + '/token',
            data: {
                potentialRelation: relation
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(res) {
                if (res.state) {
                    _this.token = res.result.token;
                    this.render();
                }
            }
        });
    }

    render() {
        var _this = this;
        var uploader = WebUploader.create({
            // swf文件路径
            swf: __uri('/static/lib/webuploader/Uploader.swf'),

            // 文件接收服务端。
            server: 'http://cv.qiaobutang.com/upload',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: _this.$pick,

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            formData: {
                collection: _this.collection,
                token: _this.token
            },
            thumb: {
                width: _this.width,
                height: _this.height,

                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                crop: false
            },
            fileVal: 'file'
        });
        var queueUpload = function () {
            var files = uploader.getFiles('inited');
            if (files.length <= 0) return;
            uploader.upload(files[0]);
        };
        uploader.on('fileQueued', function(file) {
            _this.fileQueued.call(this, file, queueUpload);
        })
            .on('fileDequeued', function(file) {
                $('#' + file.id).remove();
            })
            .on('uploadProgress', function(file, percentage) {
                _this.uploadProgress(file, percentage);
            })

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            .on('uploadSuccess', function(file, response) {
                _this.uploadSuccess(file, response, queueUpload);
            })

            // 文件上传失败，显示上传出错。
            .on('uploadError', function(file, response) {
                _this.uploadError(file, response);
            });
    }
}
