import Image from 'next/image'
import logo from "@public/images/logo.png"

interface Props {
	width: string,
	height: string,
	className?: string,
}

const Logo: React.FC<Props> = ({
	width = "18px",
	height = "18px",
	className,
}) => {
	return (
		<Image
			width={width}
			height={height}
			className={className}
			src={logo}
			alt="logo.png"
			placeholder="blur"
		/>
	);
};

export default Logo;
