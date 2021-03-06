package com.expect.admin.service.vo.component.html.datatable;

import java.util.Collections;
import java.util.List;

import com.expect.admin.data.dataobject.custom.Authority;
import com.expect.admin.data.dataobject.custom.User;
import com.expect.admin.service.vo.component.html.ButtonVo;

/**
 * Datatable操作的button,根据权限来获取
 * 
 * 主要分为几类：删除(red),修改(blue),详情(green)
 * 
 * 其他可以选择的颜色：yellow,greenSharp,purple,blueSharp,greenJungle,purple;注意:必须按顺序使用
 * 
 */
public class DataTableButtonFactory {

	/**
	 * 获取基本的操作按钮,修改/删除/详情
	 * 
	 * @param id
	 *            对象id
	 */
	public static String getDefaultButton(String id) {
		StringBuilder buttonSb = new StringBuilder();
		User user = User.getUser();
		if (user != null) {
			List<Authority> authorities = user.getUserAuthorities();
			if (authorities == null || authorities.size() == 0) {
				return buttonSb.toString();
			}
			Collections.sort(authorities);
			for (Authority authority : authorities) {
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_DETAIL)) {
					buttonSb.append(getDetailButton(authority.getName(), "data-id='" + id + "'"));
				}
				// 修改
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_UPDATE)) {
					buttonSb.append(getUpdateButton(authority.getName(), "data-id='" + id + "'"));
				}
				// 删除
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_DELETE)) {
					buttonSb.append(getDeleteButton(authority.getName(), "data-id='" + id + "'"));
				}
			}
		}
		return buttonSb.toString();
	}

	/**
	 * 获取基本的操作按钮,修改/删除/详情
	 * 
	 * @param id
	 *            对象id
	 */
	public static String getDefaultButton(String id, String updateAttr, String deleteAttr, String detailAttr) {
		StringBuilder buttonSb = new StringBuilder();
		User user = User.getUser();
		if (user != null) {
			List<Authority> authorities = user.getUserAuthorities();
			if (authorities == null || authorities.size() == 0) {
				return buttonSb.toString();
			}
			Collections.sort(authorities);
			for (Authority authority : authorities) {
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_DETAIL)) {
					buttonSb.append(getDetailButton(authority.getName(), "data-id='" + id + "' " + detailAttr));
				}
				// 修改
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_UPDATE)) {
					buttonSb.append(getUpdateButton(authority.getName(), "data-id='" + id + "' " + updateAttr));
				}
				// 删除
				if (authority.getCode().equalsIgnoreCase(Authority.AUTHORITY_DELETE)) {
					buttonSb.append(getDeleteButton(authority.getName(), "data-id='" + id + "' " + deleteAttr));
				}
			}
		}
		return buttonSb.toString();
	}

	private static String getUpdateButton(String name, String otherAttr) {
		return setButton(true, name, "blue update-button", otherAttr);
	}

	private static String getDeleteButton(String name, String otherAttr) {
		return setButton(true, name, "red delete-button", otherAttr);
	}

	private static String getDetailButton(String name, String otherAttr) {
		return setButton(true, name, "green detail-button", otherAttr);
	}

	public static String getYellowButton(String text, String otherAttr) {
		return setButton(true, text, "yellow yellow-button", otherAttr);
	}

	public static String getYellowButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "yellow yellow-button", otherAttr);
	}

	public static String getGreenSharpButton(String text, String otherAttr) {
		return setButton(true, text, "green-sharp green-sharp-button", otherAttr);
	}

	public static String getGreenSharpButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "green-sharp green-sharp-button", otherAttr);
	}

	public static String getPurpleButton(String text, String otherAttr) {
		return setButton(true, text, "purple purple-button", otherAttr);
	}

	public static String getPurpleButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "purple purple-button", otherAttr);
	}

	public static String getBlueSharpButton(String text, String otherAttr) {
		return setButton(true, text, "blue-sharp blue-sharp-button", otherAttr);
	}

	public static String getBlueSharpButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "blue-sharp blue-sharp-button", otherAttr);
	}

	public static String getGreenJungleButton(String text, String otherAttr) {
		return setButton(true, text, "green-jungle green-jungle-button", otherAttr);
	}

	public static String getGreenJungleButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "green-jungle green-jungle-button", otherAttr);
	}

	public static String getPurpleSharpButton(String text, String otherAttr) {
		return setButton(true, text, "purple-sharp purple-sharp-button", otherAttr);
	}

	public static String getPurpleSharpButton(boolean isButton, String text, String otherAttr) {
		return setButton(isButton, text, "purple-sharp purple-sharp-button", otherAttr);
	}

	private static String setButton(boolean isButton, String text, String className, String otherAttr) {
		ButtonVo.Builder builder = new ButtonVo.Builder();
		builder.setClassName(className).setText(text).setOtherAttr(otherAttr).setSize(ButtonVo.Size_ExtraSmall);
		ButtonVo buttonVo = builder.create();
		return buttonVo.getButton(isButton);
	}
}
