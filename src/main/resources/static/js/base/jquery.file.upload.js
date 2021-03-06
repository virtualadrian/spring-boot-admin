;(function () {
    var FileUpload = function (ele, options) {
    	this.$element = ele;
    	
    	var $element;
    	var changeFunc;
    	var submitFunc;
    	var doneFunc;
    	var failFunc;
    	var dropFunc;
    	var ids=new Array(0);
        var defaults = {
        	url : "",
        	dataType : "json",
            formData : function(form){
            	var array=form.serializeArray();
            	var templateSelector =options.templateSelector;
            	var pathName=$(templateSelector).data("pathname");
            	var path=$(templateSelector).data("path");
            	if(path){
            		if(!pathName){
            			pathName="path";
            		}
    				array.push({
    					name:pathName,
    					value:path
    				});
            	}
				return array;
			},
            fileType : null,
            maxFileSizes:104857600,
            templateSelector:".files-template-wrapper",
            isMultiFile : false
        };
        var options = $.extend({}, defaults, options);
        var imageFormat='.+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$';
        var videoFormat='.+(.swf|.flv|.mp4)$';
        var textFormat='.+(.doc|.docx|.txt|.DOC|.DOCX|.TXT)$';
        
        var trHtml='<tr id="${fileId}"><td class="file-name">${fileName}</td>'
        			+'<td class="file-progress"><span class="size">${fileSize}KB</span><div class="progress"><div class="progress-bar progress-bar-success"></div></div><span class="upload-result"></span></td>'
					+'<td class="file-button"><a href="javascript:;" class="btn btn-xs blue fileinput-upload">上传</a><a href="javascript:;" class="btn btn-xs green fileinput-abort">取消</a><a href="javascript:;" class="btn btn-xs red fileinput-remove">移除</a></td></tr>';
        var fileAllHtml='<div class="files-template"><div class="file-select-template"><div class="fileinput input-group"><div class="form-control">'
						+'<i class="glyphicon glyphicon-file"></i> <span class="file-name-all"></span></div>'
						+'<span class="input-group-addon btn btn-default btn-file"><span class="fileinput-new">选择</span><input type="file" name="files"/></span>'
						+'<a href="javascript:;" class="input-group-addon btn btn-default fileinput-exists fileinput-remove-all">移除</a>'
						+'<a href="javascript:;" class="input-group-addon btn btn-default fileinput-exists fileinput-upload-all">上传</a>'
						+'</div><div class="progress"><div class="progress-bar progress-bar-success"></div></div></div>'
						+'<table class="files-exist-template table table-striped table-bordered table-hover"><tbody></tbody></table></div>';
        
        this.init = function () {
        	var templateSelector=options.templateSelector;
        	$(templateSelector).html(fileAllHtml);
        	if(options.isMultiFile){
        		$(templateSelector+" input[type='file']").attr("multiple","multiple");
        	}
        	$(templateSelector+" .fileinput-remove-all").bind("click",function(){
        		$(templateSelector+" .file-name-all").text("");
        		$(templateSelector+" .files-exist-template tbody").html("");
        		$(templateSelector+" .file-select-template .progress-bar").css('width', '0%');
    		});
        	
        	$(templateSelector+" .fileinput-upload-all").bind("click",function(){
        		$(templateSelector+" .files-exist-template .fileinput-upload").click();
        		$(templateSelector+" .file-select-template .progress-bar").css('width', '0%');
    		});
        	
        	//设置默认名称
        	var fileNames=$(templateSelector).data("filenames");
        	if(fileNames){
        		var fileNamesArr=fileNames.split(",");
        		if(fileNamesArr.length>1){
        			$(templateSelector + " .fileinput span").eq(0).text(fileNamesArr.length+"个文件");
        		}else if(fileNamesArr.length==1){
        			$(templateSelector + " .fileinput span").eq(0).text(fileNames);
        		}
        	}
        	
            $element = this.$element;
            $element.fileupload({
    			url : options.url,
    			dataType : options.dataType,
    			autoUpload : false,
    			formData : options.formData
    		}).on('fileuploadchange', function(e, data) {//文件改变，比如增加或者移除
    			if(changeFunc){
    				changeFunc(data);
    			}
    		}).on('fileuploadadd', function(e, data) {//文件增加
    			$(templateSelector+" .file-select-template .progress-bar").css('width', '0%');
    			$.each(data.files, function(index, file) {
    				if (!validateFormat(file.name)) {
    					Toast.show("上传文件提醒", "文件格式有误");
    					return;
    				}
    				var maxFileSizes = options.maxFileSizes;
    				if (file.size > maxFileSizes) {
    					Toast.show("上传文件提醒", "文件大小超过规定");
    					return;
    				}
    				var fileId=Tools.getUUID();
    				data.id=fileId;
    				var html=trHtml.replace("${fileId}",fileId).replace("${fileName}",file.name).replace("${fileSize}",file.size);
    				$element.find(".files-exist-template tbody").append(html);
    				var jqXHR;
    				$element.find(".files-exist-template tbody tr:last").find(".fileinput-upload").click(function(){
    					jqXHR = data.submit();
    					jqXHR.success(function (result, textStatus, jqXHR) {})
    		            .error(function (jqXHR, textStatus, errorThrown) {})
    		            .complete(function (result, textStatus, jqXHR) {});
    				});
    				$element.find(".files-exist-template tbody tr:last").find(".fileinput-remove").click(function(){
    					$(this).parent().parent().remove();
    					setAllFileName();
    				});
    				$element.find(".files-exist-template tbody tr:last").find(".fileinput-abort").hide();
    				$element.find(".files-exist-template tbody tr:last").find(".fileinput-abort").click(function(){
    					jqXHR.abort();
    				});
    				
    				setAllFileName();
    			});
    		}).on("fileuploadsubmit", function(e, data) {//文件提交
    			$.each(data.files, function(index, file) {
    				var id=data.id;
    				$element.find("#"+id+" .fileinput-abort").show();
    				$element.find("#"+id+" .fileinput-remove").hide();
    			});
    			if(submitFunc){
    				return submitFunc(data);
    			}
    			return true;
    		}).on('fileuploadprogress', function(e, data) {//进度
    			$.each(data.files, function(index, file) {
    				var progress = parseInt(data.loaded / data.total * 100, 10);
    				var id=data.id;
    				$element.find("#"+id+" .progress-bar").css('width', progress + '%');
    			});
    		}).on('fileuploadprogressall', function(e, data) {//进度
    			var progress = parseInt(data.loaded / data.total * 100, 10);
    			$(templateSelector+" .file-select-template .progress-bar").css('width', progress + '%');
    		}).on('fileuploaddone', function(e, data) {//完成
    			$.each(data.files, function(index, file) {
    				var id=data.id;
    				$element.find("#"+id+" .upload-result").text("上传完成");
        			$element.find("#"+id+" .fileinput-upload").remove();
        			$element.find("#"+id+" .fileinput-abort").remove();
        			$element.find("#"+id+" .fileinput-remove").show();
        			if(data.result){
        				if(data.result.id){
        					ids.push(data.result.id);
        				}
        			}
    			});
    			if(doneFunc){
    				doneFunc(data);
    			}
    		}).on('fileuploaddrop', function (e, data) {//上传取消
    			$.each(data.files, function(index, file) {
    				var id=data.id;
    				$element.find("#"+id+" .upload-result").text("上传取消");
    				$element.find("#"+id+" .fileinput-abort").hide();
    				$element.find("#"+id+" .fileinput-remove").show();
    			});
    			if(dropFunc){
    				dropFunc(data);
    			}
    		}).on('fileuploadfail', function(e, data) {//失败
    			$.each(data.files, function(index, file) {
    				var id=data.id;
    				$element.find("#"+id+" .upload-result").text("上传失败");
    				$element.find("#"+id+" .fileinput-abort").hide();
    				$element.find("#"+id+" .fileinput-remove").show();
    			});
    			if(failFunc){
    				failFunc(data);
    			}
    		});
        }
        
        /**
    	 * 验证格式
    	 * 
    	 * .+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$
    	 * .+(.swf|.flv|.mp4)$
    	 * .+(.doc|.docx|.txt|.DOC|.DOCX|.TXT)$
    	 */
    	function validateFormat(fileName) {
    		var fileType=options.fileType;
    		if(!fileType){
    			return true;
    		}
    		var regExp;
    		if(fileType=='image'){
    			regExp='.+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$';
    		}else if(fileType=='video'){
    			regExp='.+(.swf|.flv|.mp4)$';
    		}else if(fileType=='text'){
    			regExp='.+(.doc|.docx|.txt|.DOC|.DOCX|.TXT)$';
    		}
    		var reg = new RegExp(regExp);
    		if (!reg.test(fileName)) {
    			return false;
    		}
    		return true;
    	}
    	
    	/**
    	 * 设置所有文件名称
    	 */
    	function setAllFileName(){
    		var templateSelector=options.templateSelector;
    		var length=$(templateSelector+" .files-exist-template tr").length;
			if(length>1){
				$(templateSelector+" .file-name-all").text(length+"个文件");
			}else if(length==1){
				var name=$(templateSelector+" .files-exist-template tr td.file-name").text();
				$(templateSelector+" .file-name-all").text(name);
			}else{
				$(templateSelector+" .file-name-all").text("");
			}
    	}
        
        this.change = function(func){
        	if(func){
        		changeFunc=func;
        	}
        	return this;
        }
        
        this.submit = function(func){
        	if(func){
        		submitFunc=func;
        	}
        	return this;
        }
        
        this.done = function(func){
        	if(func){
        		doneFunc=func;
        	}
        	return this;
        }
        
        this.drop = function(func){
        	if(func){
        		dropFunc=func;
        	}
        	return this;
        }
        
        this.fail = function(func){
        	if(func){
        		failFunc=func;
        	}
        	return this;
        }
        
        this.getIds=function(){
        	var result="";
        	for(var i=0;i<ids.length;i++){
        		if(i==0){
        			result=ids[0];
        		}else{
        			result+=","+ids[i];
        		}
        	}
        	return result;
        }
        
        this.destory=function(){
        	$(options.templateSelector+" .files-exist-template tbody").html("");
        	$(options.templateSelector+" .progress-bar").css("width","0%");
        	$(options.templateSelector+" .file-name-all").text("");
        	ids=new Array(0);
        }
        
    };

    var instances={};
    $.fn.FileUpload = function (options) {
    	var selector=$(this).selector;
    	var fileUpload=instances[selector];
    	if(fileUpload){
    		return fileUpload;
    	}
    	fileUpload  = new FileUpload(this, options);
    	instances[selector]=fileUpload;
    	fileUpload.init();
        return fileUpload;
    };
    
    $.fn.FileUploadDestory = function(){
    	var selector=$(this).selector;
    	delete instances[selector];
    }

})();