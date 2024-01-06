export type HeaderItem = {
	link: string;
	title: string;
};

export type HeaderProps = {
	items: HeaderItem[];
	logo: string;
	menuSize?: number;
};
