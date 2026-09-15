import {
	type NavBarConfig,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

export const navBarConfig: NavBarConfig = {
	links: [
		{
			name: "主页",
			url: "/",
			icon: "material-symbols:home",
		},
		{
			name: "文章",
			url: "#",
			icon: "material-symbols:article",
			children: [
				{
					name: "归档",
					url: "/archive/",
					icon: "material-symbols:archive",
				},
				{
					name: "分类",
					url: "/categories/",
					icon: "material-symbols:folder-open-rounded",
				},
				{
					name: "标签",
					url: "/tags/",
					icon: "material-symbols:tag-rounded",
				},
				{
					name: "系列",
					url: "/series/",
					icon: "material-symbols:layers",
				},
			],
		},
		{
			name: "Hachile 主站",
			url: "https://hachile.org/",
			external: true,
			icon: "material-symbols:home-pin-outline",
		},
		{
			name: "GitHub",
			url: "https://github.com/GPDdev",
			external: true,
			icon: "fa7-brands:github",
		},
	],
};

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};
