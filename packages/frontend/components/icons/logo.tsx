import Image from 'next/image'
import dogo from "@public/images/dogo.png"

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
			src={dogo}
			alt="dogo.png"
			placeholder="blur"
		/>
	);
};

export default Logo;
