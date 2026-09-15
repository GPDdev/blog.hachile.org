import type { SidebarLayoutConfig } from "../types/sidebarConfig";

const profile = {
	type: "profile" as const,
	enable: true,
	position: "top" as const,
	showOnPostPage: true,
};

const categories = {
	type: "categories" as const,
	enable: true,
	position: "sticky" as const,
	showOnPostPage: true,
	specificConfig: { collapseThreshold: 5 },
};

const tags = {
	type: "tags" as const,
	enable: true,
	position: "sticky" as const,
	showOnPostPage: true,
	specificConfig: { collapseThreshold: 10 },
};

export const sidebarLayoutConfig: SidebarLayoutConfig = {
	enable: true,
	position: "left",
	tabletSidebar: "left",
	hideSidebarOnPostPage: false,
	noSidebarContentWidth: 1,
	leftComponents: [profile, categories, tags],
	rightComponents: [],
	mobileBottomComponents: [],
};
