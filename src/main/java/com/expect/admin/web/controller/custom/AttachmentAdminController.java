package com.expect.admin.web.controller.custom;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.expect.custom.service.impl.AttachmentService;
import com.expect.custom.service.vo.AttachmentVo;
import com.expect.custom.service.vo.component.FileResultVo;
import com.expect.custom.service.vo.component.ResultVo;
import com.expect.custom.utils.Base64Util;
import com.expect.custom.utils.IOUtil;
import com.expect.custom.utils.RequestUtil;
import com.expect.custom.web.exception.AjaxRequest;
import com.expect.custom.web.exception.AjaxRequestException;

@Controller
@RequestMapping("/admin/attachment")
public class AttachmentAdminController {

	@Autowired
	private AttachmentService attachmentService;

	/**
	 * 附件上传
	 */
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	@ResponseBody
	@AjaxRequest
	public ResultVo upload(MultipartFile files, String path, HttpServletRequest request) throws AjaxRequestException {
		if (!StringUtils.isBlank(path)) {
			path = Base64Util.decode(path);
		}
		FileResultVo frv = attachmentService.save(files, path);
		return frv;
	}

	/**
	 * 附件下载
	 */
	@RequestMapping(value = "/download", method = RequestMethod.GET)
	public void download(String id, HttpServletResponse response) {
		if (StringUtils.isBlank(id)) {
			return;
		}
		AttachmentVo attachment = attachmentService.getAttachmentById(id);
		if (attachment != null) {
			String path = attachment.getPath() + File.separator + attachment.getName();
			byte[] buffer = IOUtil.inputDataFromFile(path);
			try {
				RequestUtil.downloadFile(buffer, attachment.getOriginalName(), response);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 显示图片/视频
	 */
	@RequestMapping(value = "/show", method = RequestMethod.GET)
	public void show(String id, HttpServletResponse response) {
		if (StringUtils.isBlank(id)) {
			return;
		}
		AttachmentVo attachment = attachmentService.getAttachmentById(id);
		if (attachment != null) {
			String path = attachment.getPath() + File.separator + attachment.getName();
			byte[] buffer = IOUtil.inputDataFromFile(path);
			try {
				response.getOutputStream().write(buffer);
				response.getOutputStream().flush();
				response.getOutputStream().close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
