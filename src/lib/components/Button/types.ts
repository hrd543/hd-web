type SharedButtonProps = {
	title: string;
	type?: 'filled' | 'outline';
};

export type ButtonProps = SharedButtonProps & { onClick?: () => void };

export type LinkButtonProps = SharedButtonProps & { link: string };
